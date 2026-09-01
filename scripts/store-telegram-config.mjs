const token = process.env.TASK_TELEGRAM_TOKEN;
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.socosvita.kiev.ua").replace(/\/$/, "");
if (!token) throw new Error("Telegram token is missing");

const response = await fetch(`${siteUrl}/api/telegram/editorial/bootstrap`, {
  method: "POST",
  headers: { authorization: `Bearer ${token}` },
});
const result = await response.json();
if (!response.ok || !result.ok) throw new Error(result.error || "Telegram configuration failed");
console.log(JSON.stringify({ ok: true, username: result.username }));
