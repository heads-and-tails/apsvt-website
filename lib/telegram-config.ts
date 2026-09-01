import { createSupabaseAdmin } from "@/lib/supabase/admin";

const CONFIG_CATEGORY = "__telegram_config__";
const CONFIG_SLUG = "telegram-secure-config";
const KEY_CONTEXT = ":apsvt-telegram:v1";

type EncryptedTelegramConfig = {
  version: 1;
  iv: string;
  ciphertext: string;
};

export type TelegramSecureConfig = {
  botToken: string;
  webhookSecret: string;
};

let cachedConfig: { value: TelegramSecureConfig | null; expiresAt: number } | null = null;

async function encryptionKey() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  const raw = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${serviceKey}${KEY_CONTEXT}`),
  );
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function loadStoredConfig(): Promise<TelegramSecureConfig | null> {
  try {
    const key = await encryptionKey();
    if (!key) return null;
    const { data, error } = await createSupabaseAdmin()
      .from("editorial_posts")
      .select("body")
      .eq("category", CONFIG_CATEGORY)
      .eq("slug", CONFIG_SLUG)
      .maybeSingle<{ body: string }>();
    if (error || !data?.body) return null;
    const encrypted = JSON.parse(data.body) as EncryptedTelegramConfig;
    if (encrypted.version !== 1 || !encrypted.iv || !encrypted.ciphertext) return null;
    const clear = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: Buffer.from(encrypted.iv, "base64url") },
      key,
      Buffer.from(encrypted.ciphertext, "base64url"),
    );
    const config = JSON.parse(new TextDecoder().decode(clear)) as TelegramSecureConfig;
    return config.botToken && config.webhookSecret ? config : null;
  } catch {
    return null;
  }
}

export async function getTelegramSecureConfig(): Promise<TelegramSecureConfig | null> {
  const envToken = process.env.TELEGRAM_BOT_TOKEN;
  const envSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (envToken && envSecret) return { botToken: envToken, webhookSecret: envSecret };
  if (cachedConfig && cachedConfig.expiresAt > Date.now()) return cachedConfig.value;
  const stored = await loadStoredConfig();
  cachedConfig = { value: stored, expiresAt: Date.now() + 5 * 60 * 1000 };
  return stored;
}

export async function getTelegramBotToken() {
  return process.env.TELEGRAM_BOT_TOKEN || (await getTelegramSecureConfig())?.botToken || "";
}

export async function getTelegramWebhookSecret() {
  return process.env.TELEGRAM_WEBHOOK_SECRET || (await getTelegramSecureConfig())?.webhookSecret || "";
}

export async function storeTelegramSecureConfig(config: TelegramSecureConfig): Promise<void> {
  const key = await encryptionKey();
  if (!key) throw new Error("Supabase server configuration is missing");
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(config)),
  );
  const admin = createSupabaseAdmin();
  const { data: existing, error: lookupError } = await admin.from("editorial_posts")
    .select("id,created_at")
    .eq("slug", CONFIG_SLUG)
    .maybeSingle<{ id: string; created_at: string }>();
  if (lookupError) throw lookupError;
  const now = new Date().toISOString();
  const { error } = await admin.from("editorial_posts").upsert({
    id: existing?.id || crypto.randomUUID(),
    slug: CONFIG_SLUG,
    title: "telegram_secure_config",
    excerpt: "active",
    body: JSON.stringify({
      version: 1,
      iv: Buffer.from(iv).toString("base64url"),
      ciphertext: Buffer.from(ciphertext).toString("base64url"),
    } satisfies EncryptedTelegramConfig),
    category: CONFIG_CATEGORY,
    image_url: "",
    image_alt: "",
    status: "draft",
    featured: false,
    published_at: null,
    created_at: existing?.created_at || now,
    updated_at: now,
    author_email: "telegram-bot@socosvita.kiev.ua",
  }, { onConflict: "slug" });
  if (error) throw error;
  cachedConfig = { value: config, expiresAt: Date.now() + 5 * 60 * 1000 };
}
