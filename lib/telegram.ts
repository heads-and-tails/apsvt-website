type TelegramButton = { text: string; callback_data: string };

export function telegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN);
}

export async function sendTelegramMessage(chatId: string, text: string, buttons: TelegramButton[][] = []) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId) return { ok: false, configured: Boolean(token) };
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      reply_markup: buttons.length ? { inline_keyboard: buttons } : undefined,
    }),
  });
  return { ok: response.ok, configured: true };
}

export async function answerTelegramCallback(callbackQueryId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  });
}

export async function notifyScheduleApprovers(runId: string, name: string, scheduled: number, conflicts: number, chatIds: string[]) {
  const text = `<b>Новий розклад очікує рішення</b>\n${name}\nЗаплановано: ${scheduled} · конфліктів: ${conflicts}`;
  await Promise.all(chatIds.filter(Boolean).map((chatId) => sendTelegramMessage(chatId, text, [[
    { text: "✅ Погодити", callback_data: `scheduler:approve:${runId}` },
    { text: "❌ Відхилити", callback_data: `scheduler:reject:${runId}` },
  ]])));
}
