import fs from "node:fs";
import { createHash, randomBytes, webcrypto } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

function loadLocalEnv() {
  if (!fs.existsSync(".env.local")) return;
  for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

async function telegramRequest(token, method, body) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.description || `Telegram ${method} failed`);
  return result.result;
}

loadLocalEnv();

const token = process.env.TASK_TELEGRAM_TOKEN;
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.socosvita.kiev.ua").replace(/\/$/, "");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!token || !supabaseUrl || !serviceKey) throw new Error("Telegram token or Supabase server configuration is missing");

const identity = await telegramRequest(token, "getMe", {});
const webhookSecret = randomBytes(32).toString("base64url");
const keyBytes = createHash("sha256").update(`${serviceKey}:apsvt-telegram:v1`).digest();
const key = await webcrypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["encrypt"]);
const iv = randomBytes(12);
const ciphertext = await webcrypto.subtle.encrypt(
  { name: "AES-GCM", iv },
  key,
  Buffer.from(JSON.stringify({ botToken: token, webhookSecret }), "utf8"),
);

const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const now = new Date().toISOString();
const { data: existing, error: lookupError } = await supabase.from("editorial_posts")
  .select("id,created_at")
  .eq("slug", "telegram-secure-config")
  .maybeSingle();
if (lookupError) throw lookupError;
const { error: saveError } = await supabase.from("editorial_posts").upsert({
  id: existing?.id || webcrypto.randomUUID(),
  slug: "telegram-secure-config",
  title: "telegram_secure_config",
  excerpt: "active",
  body: JSON.stringify({
    version: 1,
    iv: Buffer.from(iv).toString("base64url"),
    ciphertext: Buffer.from(ciphertext).toString("base64url"),
  }),
  category: "__telegram_config__",
  image_url: "",
  image_alt: "",
  status: "draft",
  featured: false,
  published_at: null,
  created_at: existing?.created_at || now,
  updated_at: now,
  author_email: "telegram-bot@socosvita.kiev.ua",
}, { onConflict: "slug" });
if (saveError) throw saveError;

await telegramRequest(token, "setMyCommands", { commands: [
  { command: "menu", description: "Головне меню" },
  { command: "new", description: "Створити матеріал за допомогою AI" },
  { command: "drafts", description: "Мої доступні чернетки" },
  { command: "status", description: "Статус розкладу" },
  { command: "me", description: "Мої права доступу" },
  { command: "help", description: "Інструкція" },
  { command: "cancel", description: "Скасувати поточну дію" },
  { command: "logout", description: "Від’єднати акаунт" },
] });
await telegramRequest(token, "setWebhook", {
  url: `${siteUrl}/api/telegram/editorial`,
  secret_token: webhookSecret,
  allowed_updates: ["message", "callback_query"],
  drop_pending_updates: true,
});
const webhook = await telegramRequest(token, "getWebhookInfo", {});
console.log(JSON.stringify({
  ok: true,
  username: identity.username,
  webhookUrl: webhook.url,
  pendingUpdates: webhook.pending_update_count,
}));
