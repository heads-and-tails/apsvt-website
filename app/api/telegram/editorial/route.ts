import { NextResponse } from "next/server";
import {
  handleEditorialTelegramUpdate,
  type TelegramEditorialUpdate,
} from "@/lib/telegram-editorial";
import { getTelegramWebhookSecret } from "@/lib/telegram-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function siteUrl(request: Request) {
  return (process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
}

export async function POST(request: Request) {
  const expectedSecret = await getTelegramWebhookSecret();
  if (!expectedSecret || request.headers.get("x-telegram-bot-api-secret-token") !== expectedSecret) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  try {
    const update = await request.json() as TelegramEditorialUpdate;
    if (!Number.isInteger(update.update_id)) return NextResponse.json({ ok: false }, { status: 400 });
    await handleEditorialTelegramUpdate(update, siteUrl(request));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "APSVT editorial Telegram webhook" });
}
