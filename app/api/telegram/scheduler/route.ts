import { NextResponse } from "next/server";
import {
  createSchedulerItem,
  decideScheduleRun,
  getSchedulerItems,
  type RunPayload,
  type StaffPayload,
} from "@/lib/scheduler";
import { answerTelegramCallback, sendTelegramMessage } from "@/lib/telegram";

export const dynamic = "force-dynamic";

type TelegramUpdate = {
  callback_query?: {
    id: string;
    data?: string;
    from: { username?: string };
    message?: { chat: { id: number } };
  };
  message?: {
    text?: string;
    from?: { username?: string };
    chat: { id: number };
  };
};

function siteUrl(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
}

export async function POST(request: Request) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (expectedSecret && request.headers.get("x-telegram-bot-api-secret-token") !== expectedSecret) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  const update = await request.json() as TelegramUpdate;
  const items = await getSchedulerItems();

  if (update.callback_query?.data && update.callback_query.message) {
    const callback = update.callback_query;
    const callbackData = callback.data!;
    const callbackMessage = callback.message!;
    const [scope, decision, runId] = callbackData.split(":");
    const chatId = String(callbackMessage.chat.id);
    const approver = items.find((item) => item.kind === "staff" && (() => {
      const person = item.payload as StaffPayload;
      return person.telegramChatId === chatId && person.canApprove;
    })());
    if (scope !== "scheduler" || !["approve", "reject"].includes(decision) || !approver) {
      await answerTelegramCallback(callback.id, "У вас немає права погоджувати розклад");
      return NextResponse.json({ ok: true });
    }
    const run = items.find((item) => item.kind === "run" && item.id === runId);
    if (!run || (run.payload as RunPayload).status !== "pending_approval") {
      await answerTelegramCallback(callback.id, "Ця чернетка вже опрацьована");
      return NextResponse.json({ ok: true });
    }
    const person = approver.payload as StaffPayload;
    const updated = await decideScheduleRun(run, decision as "approve" | "reject", "Рішення через Telegram", person.email);
    const payload = updated.payload as RunPayload;
    await answerTelegramCallback(callback.id, payload.status === "approved" ? "Розклад погоджено" : "Розклад відхилено");
    await sendTelegramMessage(chatId, `<b>${payload.status === "approved" ? "Погоджено" : "Відхилено"}</b>\n${payload.name}`);
    return NextResponse.json({ ok: true });
  }

  if (update.message) {
    const chatId = String(update.message.chat.id);
    const text = (update.message.text || "").trim();
    if (text === "/start") {
      await sendTelegramMessage(chatId, `<b>Планувальник АПСВТ</b>\nНадішліть питання або скористайтеся командами:\n/availability — вказати доступність\n/status — стан останнього розкладу`);
    } else if (text === "/availability") {
      await sendTelegramMessage(chatId, `Вкажіть зручний час у кабінеті:\n${siteUrl(request)}/panel/scheduler`);
    } else if (text === "/status") {
      const latest = items.filter((item) => item.kind === "run").at(-1);
      const payload = latest?.payload as RunPayload | undefined;
      await sendTelegramMessage(chatId, payload
        ? `<b>${payload.name}</b>\nСтатус: ${payload.status}\nЗанять: ${payload.scheduledCount} · конфліктів: ${payload.conflictCount}`
        : "Чернеток розкладу поки немає.");
    } else if (text) {
      await createSchedulerItem("question", {
        chatId,
        username: update.message.from?.username || "",
        text,
        answer: "",
        answeredAt: "",
      }, `telegram:${chatId}`, "pending");
      await sendTelegramMessage(chatId, "Питання отримано. Координатор відповість через планувальник.");
    }
  }
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "APSVT scheduler Telegram webhook" });
}
