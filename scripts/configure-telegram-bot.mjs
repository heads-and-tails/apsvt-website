const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.socosvita.kiev.ua").replace(/\/$/, "");

if (!token || !secret) {
  throw new Error("TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET are required");
}

async function api(method, body = {}) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.description || `${method} failed`);
  return result.result;
}

const bot = await api("getMe");
const webhookUrl = `${siteUrl}/api/telegram/editorial`;

await api("setMyCommands", {
  commands: [
    { command: "menu", description: "Головне меню редакції" },
    { command: "new", description: "Створити матеріал за допомогою AI" },
    { command: "drafts", description: "Переглянути чернетки" },
    { command: "news", description: "Підготувати новину" },
    { command: "document", description: "Додати документ" },
    { command: "schedule", description: "Додати або замінити розклад" },
    { command: "teacher", description: "Додати профіль викладача" },
    { command: "me", description: "Мій редакційний доступ" },
    { command: "status", description: "Статус останнього розкладу" },
    { command: "cancel", description: "Скасувати поточну дію" },
    { command: "logout", description: "Від’єднати Telegram" },
  ],
});

await api("setWebhook", {
  url: webhookUrl,
  secret_token: secret,
  allowed_updates: ["message", "callback_query"],
  drop_pending_updates: false,
});

const webhook = await api("getWebhookInfo");
if (webhook.url !== webhookUrl) throw new Error("Telegram returned an unexpected webhook URL");

console.log(`Telegram bot @${bot.username} is connected to ${webhookUrl}`);
