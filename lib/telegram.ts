import { getTelegramBotToken } from "@/lib/telegram-config";

export type TelegramButton =
  | { text: string; callback_data: string; url?: never }
  | { text: string; url: string; callback_data?: never };

type TelegramApiResponse<T> = {
  ok: boolean;
  result?: T;
  description?: string;
};

export async function telegramConfigured(): Promise<boolean> {
  return Boolean(await getTelegramBotToken());
}

export function escapeTelegramHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function telegramRequest<T>(method: string, body: Record<string, unknown>): Promise<TelegramApiResponse<T>> {
  const token = await getTelegramBotToken();
  if (!token) return { ok: false, description: "Telegram bot is not configured" };
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json() as TelegramApiResponse<T>;
  return response.ok ? result : { ...result, ok: false };
}

export async function sendTelegramMessage(chatId: string, text: string, buttons: TelegramButton[][] = []) {
  if (!chatId) return { ok: false, configured: await telegramConfigured() };
  const result = await telegramRequest("sendMessage", {
    chat_id: chatId,
    text: text.slice(0, 4096),
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: buttons.length ? { inline_keyboard: buttons } : undefined,
  });
  return { ok: result.ok, configured: await telegramConfigured(), description: result.description };
}

export async function answerTelegramCallback(callbackQueryId: string, text: string) {
  await telegramRequest("answerCallbackQuery", { callback_query_id: callbackQueryId, text: text.slice(0, 200) });
}

export async function sendTelegramChatAction(chatId: string, action: "typing" | "upload_document" | "upload_photo" = "typing") {
  await telegramRequest("sendChatAction", { chat_id: chatId, action });
}

export async function deleteTelegramMessage(chatId: string, messageId: number) {
  return telegramRequest("deleteMessage", { chat_id: chatId, message_id: messageId });
}

export async function getTelegramFile(fileId: string): Promise<{ bytes: Uint8Array; filePath: string } | null> {
  const token = await getTelegramBotToken();
  if (!token) return null;
  const result = await telegramRequest<{ file_path?: string }>("getFile", { file_id: fileId });
  const filePath = result.result?.file_path;
  if (!result.ok || !filePath) return null;
  const response = await fetch(`https://api.telegram.org/file/bot${token}/${filePath}`);
  if (!response.ok) return null;
  return { bytes: new Uint8Array(await response.arrayBuffer()), filePath };
}

export async function notifyScheduleApprovers(runId: string, name: string, scheduled: number, conflicts: number, chatIds: string[]) {
  const text = `<b>Новий розклад очікує рішення</b>\n${escapeTelegramHtml(name)}\nЗаплановано: ${scheduled} · конфліктів: ${conflicts}`;
  await Promise.all(chatIds.filter(Boolean).map((chatId) => sendTelegramMessage(chatId, text, [[
    { text: "✅ Погодити", callback_data: `scheduler:approve:${runId}` },
    { text: "❌ Відхилити", callback_data: `scheduler:reject:${runId}` },
  ]])));
}
