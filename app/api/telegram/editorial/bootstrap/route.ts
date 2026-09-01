import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getTelegramSecureConfig, storeTelegramSecureConfig } from "@/lib/telegram-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const EXPECTED_BOT_ID = 8674994619;

async function telegramRequest<T>(token: string, method: string, body: Record<string, unknown>) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json() as { ok: boolean; result?: T; description?: string };
  if (!response.ok || !result.ok) throw new Error(result.description || "Telegram request failed");
  return result.result as T;
}

export async function POST(request: Request) {
  if (await getTelegramSecureConfig()) {
    return NextResponse.json({ ok: false, error: "ALREADY_CONFIGURED" }, { status: 409 });
  }
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  if (!token || token.length > 200) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const identity = await telegramRequest<{ id: number; username?: string }>(token, "getMe", {});
    if (identity.id !== EXPECTED_BOT_ID) return NextResponse.json({ ok: false }, { status: 403 });
    const webhookSecret = randomBytes(32).toString("base64url");
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
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
    await storeTelegramSecureConfig({ botToken: token, webhookSecret });
    return NextResponse.json({ ok: true, username: identity.username || "" });
  } catch {
    return NextResponse.json({ ok: false, error: "CONFIGURATION_FAILED" }, { status: 500 });
  }
}
