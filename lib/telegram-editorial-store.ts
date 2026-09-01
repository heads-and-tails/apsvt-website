import { createSupabaseAdmin } from "@/lib/supabase/admin";

const INTERNAL_CATEGORY = "__telegram_editorial__";
const INTERNAL_AUTHOR = "telegram-bot@socosvita.kiev.ua";

type InternalRecord<T> = {
  id: string;
  slug: string;
  kind: string;
  status: string;
  data: T;
  createdAt: string;
  updatedAt: string;
};

type InternalRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  created_at: string;
  updated_at: string;
};

export type TelegramLinkRequest = {
  chatId: string;
  telegramUserId: string;
  username: string;
  firstName: string;
  expiresAt: string;
};

export type TelegramAccountLink = {
  chatId: string;
  telegramUserId: string;
  username: string;
  firstName: string;
  userId: string;
  email: string;
  displayName: string;
  linkedAt: string;
};

export type TelegramEditorialState<T = unknown> = {
  stage: string;
  expiresAt: string;
  data: T;
};

function rowToRecord<T>(row: InternalRow): InternalRecord<T> | null {
  try {
    return {
      id: row.id,
      slug: row.slug,
      kind: row.title,
      status: row.excerpt,
      data: JSON.parse(row.body) as T,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  } catch {
    return null;
  }
}

async function getRecord<T>(slug: string): Promise<InternalRecord<T> | null> {
  const { data, error } = await createSupabaseAdmin()
    .from("editorial_posts")
    .select("id,slug,title,excerpt,body,created_at,updated_at")
    .eq("category", INTERNAL_CATEGORY)
    .eq("slug", slug)
    .maybeSingle<InternalRow>();
  if (error) throw error;
  return data ? rowToRecord<T>(data) : null;
}

async function putRecord<T>(slug: string, kind: string, data: T, status = "active"): Promise<void> {
  const admin = createSupabaseAdmin();
  const existing = await getRecord<unknown>(slug);
  const now = new Date().toISOString();
  const { error } = await admin.from("editorial_posts").upsert({
    id: existing?.id || crypto.randomUUID(),
    slug,
    title: kind,
    excerpt: status,
    body: JSON.stringify(data),
    category: INTERNAL_CATEGORY,
    image_url: "",
    image_alt: "",
    status: "draft",
    featured: false,
    published_at: null,
    created_at: existing?.createdAt || now,
    updated_at: now,
    author_email: INTERNAL_AUTHOR,
  }, { onConflict: "slug" });
  if (error) throw error;
}

async function deleteRecord(slug: string): Promise<void> {
  const { error } = await createSupabaseAdmin()
    .from("editorial_posts")
    .delete()
    .eq("category", INTERNAL_CATEGORY)
    .eq("slug", slug);
  if (error) throw error;
}

async function tokenHash(token: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Buffer.from(hash).toString("hex");
}

function linkRequestSlug(hash: string) {
  return `telegram-request-${hash}`;
}

function accountLinkSlug(chatId: string) {
  return `telegram-account-${chatId.replace(/[^0-9-]/g, "")}`;
}

function stateSlug(chatId: string) {
  return `telegram-state-${chatId.replace(/[^0-9-]/g, "")}`;
}

export async function createTelegramLinkRequest(input: Omit<TelegramLinkRequest, "expiresAt">) {
  const random = crypto.getRandomValues(new Uint8Array(32));
  const token = Buffer.from(random).toString("base64url");
  const request: TelegramLinkRequest = {
    ...input,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  };
  await putRecord(linkRequestSlug(await tokenHash(token)), "link_request", request, "pending");
  return { token, request };
}

export async function getTelegramLinkRequest(token: string): Promise<TelegramLinkRequest | null> {
  if (!token || token.length > 200) return null;
  const record = await getRecord<TelegramLinkRequest>(linkRequestSlug(await tokenHash(token)));
  if (!record || record.kind !== "link_request" || record.status !== "pending") return null;
  if (new Date(record.data.expiresAt).getTime() <= Date.now()) {
    await deleteRecord(record.slug);
    return null;
  }
  return record.data;
}

export async function consumeTelegramLinkRequest(
  token: string,
  account: Omit<TelegramAccountLink, "chatId" | "telegramUserId" | "username" | "firstName" | "linkedAt">,
): Promise<TelegramAccountLink | null> {
  const hash = await tokenHash(token);
  const requestRecord = await getRecord<TelegramLinkRequest>(linkRequestSlug(hash));
  if (!requestRecord || requestRecord.kind !== "link_request" || requestRecord.status !== "pending") return null;
  const request = requestRecord.data;
  if (new Date(request.expiresAt).getTime() <= Date.now()) {
    await deleteRecord(requestRecord.slug);
    return null;
  }
  const link: TelegramAccountLink = {
    ...request,
    ...account,
    linkedAt: new Date().toISOString(),
  };
  const admin = createSupabaseAdmin();
  const { data: accountRows, error: accountRowsError } = await admin
    .from("editorial_posts")
    .select("id,body")
    .eq("category", INTERNAL_CATEGORY)
    .eq("title", "account_link");
  if (accountRowsError) throw accountRowsError;
  const duplicateIds = (accountRows || []).filter((row) => {
    try { return (JSON.parse(String(row.body)) as TelegramAccountLink).userId === account.userId; }
    catch { return false; }
  }).map((row) => String(row.id));
  if (duplicateIds.length) {
    const removed = await admin.from("editorial_posts").delete().in("id", duplicateIds);
    if (removed.error) throw removed.error;
  }
  await putRecord(accountLinkSlug(request.chatId), "account_link", link, "active");
  await deleteRecord(requestRecord.slug);
  return link;
}

export async function getTelegramAccountLink(chatId: string): Promise<TelegramAccountLink | null> {
  const record = await getRecord<TelegramAccountLink>(accountLinkSlug(chatId));
  return record?.kind === "account_link" && record.status === "active" ? record.data : null;
}

export async function deleteTelegramAccountLink(chatId: string): Promise<void> {
  await Promise.all([deleteRecord(accountLinkSlug(chatId)), deleteRecord(stateSlug(chatId))]);
}

export async function setTelegramEditorialState<T>(chatId: string, stage: string, data: T, ttlMinutes = 60): Promise<void> {
  await putRecord<TelegramEditorialState<T>>(stateSlug(chatId), "conversation_state", {
    stage,
    data,
    expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString(),
  });
}

export async function getTelegramEditorialState<T>(chatId: string): Promise<TelegramEditorialState<T> | null> {
  const record = await getRecord<TelegramEditorialState<T>>(stateSlug(chatId));
  if (!record || record.kind !== "conversation_state") return null;
  if (new Date(record.data.expiresAt).getTime() <= Date.now()) {
    await deleteRecord(record.slug);
    return null;
  }
  return record.data;
}

export async function clearTelegramEditorialState(chatId: string): Promise<void> {
  await deleteRecord(stateSlug(chatId));
}

export async function reserveTelegramUpdate(updateId: number): Promise<boolean> {
  const slug = `telegram-update-${updateId}`;
  const admin = createSupabaseAdmin();
  const now = new Date().toISOString();
  const { error } = await admin.from("editorial_posts").insert({
    id: crypto.randomUUID(),
    slug,
    title: "webhook_update",
    excerpt: "processing",
    body: JSON.stringify({ updateId }),
    category: INTERNAL_CATEGORY,
    image_url: "",
    image_alt: "",
    status: "draft",
    featured: false,
    published_at: null,
    created_at: now,
    updated_at: now,
    author_email: INTERNAL_AUTHOR,
  });
  if (!error) return true;
  if (error.code === "23505") return false;
  throw error;
}

export async function finishTelegramUpdate(updateId: number): Promise<void> {
  await createSupabaseAdmin().from("editorial_posts")
    .update({ excerpt: "done", updated_at: new Date().toISOString() })
    .eq("category", INTERNAL_CATEGORY)
    .eq("slug", `telegram-update-${updateId}`);
}

export function isTelegramInternalCategory(category: string): boolean {
  return category.startsWith("__");
}
