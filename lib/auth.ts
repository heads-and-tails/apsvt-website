import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { editorialAdminEmails, isSupabaseConfigured } from "@/lib/supabase/config";
import { canEditPage, normalizeEditorialAccessScopes, serializeEditorialAccessScopes } from "@/lib/editorial-access";

export type EditorialRole = "editor" | "admin";
export type EditorialStatus = "pending" | "approved" | "suspended";

export type EditorialProfile = {
  id: string;
  email: string;
  displayName: string;
  role: EditorialRole;
  status: EditorialStatus;
  accessScopes: string[];
  createdAt: string;
  approvedAt: string | null;
  mustChangePassword: boolean;
};

export type Publisher = EditorialProfile;

type ProfileRow = {
  id: string;
  email: string;
  display_name: string | null;
  role: EditorialRole;
  status: EditorialStatus;
  access_scope: string | null;
  created_at: string;
  approved_at: string | null;
};

const preapprovedDepartmentEditors = new Map<string, { displayName: string; accessScopes: string[] }>([
  ["chornodid@ukr.net", { displayName: "Чорнодід Ігор", accessScopes: ["*"] }],
  ["nadezda_pisarenko@ukr.net", { displayName: "Писаренко Надія", accessScopes: ["/programs/marketing"] }],
  ["tkachenko.ys@socosvita.kiev.ua", { displayName: "Ткаченко Яніна", accessScopes: ["/programs/finance"] }],
  ["natalya.balashova75@gmail.com", { displayName: "Балашова Наталія", accessScopes: ["/programs/social-work"] }],
  ["kim2505@ukr.net", { displayName: "Бондар Світлана", accessScopes: ["/departments/languages-humanities"] }],
  ["markovec28@gmail.com", { displayName: "Неля Василець", accessScopes: ["/programs/management", "/programs/trade"] }],
]);

function profileFromRow(row: ProfileRow, mustChangePassword = false): EditorialProfile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name || row.email,
    role: row.role,
    status: row.status,
    accessScopes: normalizeEditorialAccessScopes(row.access_scope || "*"),
    createdAt: row.created_at,
    approvedAt: row.approved_at,
    mustChangePassword,
  };
}

export async function getAuthenticatedUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
}

export async function getPublisher(): Promise<Publisher | null> {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === "development") {
      return {
        id: "local-editor",
        email: "vportnaia@kse.org.ua",
        displayName: "Victoria · local preview",
        role: "admin",
        status: "approved",
        accessScopes: ["*"],
        createdAt: new Date(0).toISOString(),
        approvedAt: new Date(0).toISOString(),
        mustChangePassword: false,
      };
    }
    return null;
  }

  const user = await getAuthenticatedUser();
  if (!user?.email) return null;

  const admin = createSupabaseAdmin();
  const normalizedEmail = user.email.toLowerCase();
  const isBootstrapAdmin = editorialAdminEmails().has(normalizedEmail);

  if (isBootstrapAdmin) {
    await admin.from("editorial_profiles").upsert({
      id: user.id,
      email: normalizedEmail,
      display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || normalizedEmail,
      role: "admin",
      status: "approved",
      access_scope: "*",
      approved_at: new Date().toISOString(),
      approved_by: user.id,
    }, { onConflict: "id" });
  } else {
    const departmentEditor = preapprovedDepartmentEditors.get(normalizedEmail);
    if (departmentEditor) {
      await admin.from("editorial_profiles").upsert({
        id: user.id,
        email: normalizedEmail,
        display_name: departmentEditor.displayName,
        role: "editor",
        status: "approved",
        access_scope: serializeEditorialAccessScopes(departmentEditor.accessScopes),
        approved_at: new Date().toISOString(),
        approved_by: null,
      }, { onConflict: "id" });
    }
  }

  const { data } = await admin
    .from("editorial_profiles")
    .select("id,email,display_name,role,status,access_scope,created_at,approved_at")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  if (!data || data.status !== "approved") return null;
  return profileFromRow(data, user.app_metadata?.editorial_must_change_password === true);
}

export async function requirePublisher(): Promise<Publisher> {
  const publisher = await getPublisher();
  if (!publisher) throw new Error("UNAUTHORIZED");
  if (publisher.mustChangePassword) throw new Error("PASSWORD_CHANGE_REQUIRED");
  return publisher;
}

export async function requireAdmin(): Promise<Publisher> {
  const publisher = await requirePublisher();
  if (publisher.role !== "admin") throw new Error("UNAUTHORIZED");
  return publisher;
}

export async function getPublisherByUserId(userId: string): Promise<Publisher | null> {
  if (!isSupabaseConfigured() || !userId) return null;
  const admin = createSupabaseAdmin();
  const [{ data: userData, error: userError }, { data: profile, error: profileError }] = await Promise.all([
    admin.auth.admin.getUserById(userId),
    admin
      .from("editorial_profiles")
      .select("id,email,display_name,role,status,access_scope,created_at,approved_at")
      .eq("id", userId)
      .maybeSingle<ProfileRow>(),
  ]);
  if (userError || profileError || !profile || profile.status !== "approved") return null;
  return profileFromRow(profile, userData.user?.app_metadata?.editorial_must_change_password === true);
}

export async function getEditorialProfiles(): Promise<EditorialProfile[]> {
  await requireAdmin();
  const admin = createSupabaseAdmin();
  const [{ data, error }, { data: users, error: usersError }] = await Promise.all([
    admin
      .from("editorial_profiles")
      .select("id,email,display_name,role,status,access_scope,created_at,approved_at")
      .order("created_at", { ascending: false }),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);
  if (error) throw error;
  if (usersError) throw usersError;
  const passwordChangeIds = new Set(users.users
    .filter((user) => user.app_metadata?.editorial_must_change_password === true)
    .map((user) => user.id));
  return (data as ProfileRow[]).map((row) => profileFromRow(row, passwordChangeIds.has(row.id)));
}

export async function createApprovedEditorialUser(
  input: { email: string; displayName: string; role: EditorialRole; accessScopes: string[] },
  approvedBy: string,
  temporaryPassword: string,
): Promise<{ profile: EditorialProfile; temporaryPasswordIssued: boolean }> {
  const admin = createSupabaseAdmin();
  const email = input.email.trim().toLowerCase();
  const { data: users, error: usersError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (usersError) throw usersError;

  let user = users.users.find((entry) => entry.email?.toLowerCase() === email) || null;
  let temporaryPasswordIssued = false;
  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        display_name: input.displayName,
        temporary_password_issued: true,
      },
      app_metadata: { editorial_must_change_password: true },
    });
    if (error) throw error;
    user = data.user;
    temporaryPasswordIssued = true;
  }

  const { data, error } = await admin
    .from("editorial_profiles")
    .upsert({
      id: user.id,
      email,
      display_name: input.displayName || email,
      role: input.role,
      status: "approved",
      access_scope: serializeEditorialAccessScopes(input.accessScopes),
      approved_at: new Date().toISOString(),
      approved_by: approvedBy,
    }, { onConflict: "id" })
    .select("id,email,display_name,role,status,access_scope,created_at,approved_at")
    .single<ProfileRow>();
  if (error) throw error;
  return {
    profile: profileFromRow(data, temporaryPasswordIssued || user.app_metadata?.editorial_must_change_password === true),
    temporaryPasswordIssued,
  };
}

export async function issueEditorialTemporaryPassword(id: string, approvedBy: string, temporaryPassword: string): Promise<EditorialProfile> {
  const admin = createSupabaseAdmin();
  const { data: userData, error: userError } = await admin.auth.admin.updateUserById(id, {
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: { temporary_password_issued: true },
    app_metadata: { editorial_must_change_password: true },
  });
  if (userError || !userData.user.email) throw userError || new Error("USER_EMAIL_MISSING");

  const { data, error } = await admin
    .from("editorial_profiles")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: approvedBy,
    })
    .eq("id", id)
    .select("id,email,display_name,role,status,access_scope,created_at,approved_at")
    .single<ProfileRow>();
  if (error) throw error;
  return profileFromRow(data, true);
}

export async function completeEditorialPasswordChange(userId: string): Promise<void> {
  const admin = createSupabaseAdmin();
  const { error } = await admin.auth.admin.updateUserById(userId, {
    app_metadata: { editorial_must_change_password: false },
    user_metadata: { temporary_password_issued: false },
  });
  if (error) throw error;
}

export async function updateEditorialProfile(
  id: string,
  update: { role: EditorialRole; status: EditorialStatus; accessScopes: string[] },
  approvedBy: string,
): Promise<EditorialProfile> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("editorial_profiles")
    .update({
      role: update.role,
      status: update.status,
      access_scope: serializeEditorialAccessScopes(update.accessScopes),
      approved_at: update.status === "approved" ? new Date().toISOString() : null,
      approved_by: update.status === "approved" ? approvedBy : null,
    })
    .eq("id", id)
    .select("id,email,display_name,role,status,access_scope,created_at,approved_at")
    .single<ProfileRow>();
  if (error) throw error;
  return profileFromRow(data);
}

export async function requirePagePublisher(pagePath: string): Promise<Publisher> {
  const publisher = await requirePublisher();
  if (!canEditPage(publisher, pagePath)) throw new Error("FORBIDDEN_SCOPE");
  return publisher;
}
