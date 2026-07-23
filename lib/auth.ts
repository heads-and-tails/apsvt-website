import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { editorialAdminEmails, isSupabaseConfigured } from "@/lib/supabase/config";
import { canEditPage } from "@/lib/editorial-access";

export type EditorialRole = "editor" | "admin";
export type EditorialStatus = "pending" | "approved" | "suspended";

export type EditorialProfile = {
  id: string;
  email: string;
  displayName: string;
  role: EditorialRole;
  status: EditorialStatus;
  accessScope: string;
  createdAt: string;
  approvedAt: string | null;
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

function profileFromRow(row: ProfileRow): EditorialProfile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name || row.email,
    role: row.role,
    status: row.status,
    accessScope: row.access_scope || "*",
    createdAt: row.created_at,
    approvedAt: row.approved_at,
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
        accessScope: "*",
        createdAt: new Date(0).toISOString(),
        approvedAt: new Date(0).toISOString(),
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
  }

  const { data } = await admin
    .from("editorial_profiles")
    .select("id,email,display_name,role,status,access_scope,created_at,approved_at")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  if (!data || data.status !== "approved") return null;
  return profileFromRow(data);
}

export async function requirePublisher(): Promise<Publisher> {
  const publisher = await getPublisher();
  if (!publisher) throw new Error("UNAUTHORIZED");
  return publisher;
}

export async function requireAdmin(): Promise<Publisher> {
  const publisher = await requirePublisher();
  if (publisher.role !== "admin") throw new Error("UNAUTHORIZED");
  return publisher;
}

export async function getEditorialProfiles(): Promise<EditorialProfile[]> {
  await requireAdmin();
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("editorial_profiles")
    .select("id,email,display_name,role,status,access_scope,created_at,approved_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ProfileRow[]).map(profileFromRow);
}

export async function inviteApprovedEditorialUser(
  input: { email: string; displayName: string; role: EditorialRole; accessScope: string },
  approvedBy: string,
  redirectTo: string,
): Promise<EditorialProfile> {
  const admin = createSupabaseAdmin();
  const email = input.email.trim().toLowerCase();
  const { data: users, error: usersError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (usersError) throw usersError;

  let user = users.users.find((entry) => entry.email?.toLowerCase() === email) || null;
  if (!user) {
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo,
      data: { display_name: input.displayName },
    });
    if (error) throw error;
    user = data.user;
  }

  const { data, error } = await admin
    .from("editorial_profiles")
    .upsert({
      id: user.id,
      email,
      display_name: input.displayName || email,
      role: input.role,
      status: "approved",
      access_scope: input.accessScope,
      approved_at: new Date().toISOString(),
      approved_by: approvedBy,
    }, { onConflict: "id" })
    .select("id,email,display_name,role,status,access_scope,created_at,approved_at")
    .single<ProfileRow>();
  if (error) throw error;
  return profileFromRow(data);
}

export async function updateEditorialProfile(
  id: string,
  update: { role: EditorialRole; status: EditorialStatus; accessScope: string },
  approvedBy: string,
): Promise<EditorialProfile> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("editorial_profiles")
    .update({
      role: update.role,
      status: update.status,
      access_scope: update.accessScope,
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
