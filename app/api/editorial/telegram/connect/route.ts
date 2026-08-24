import { NextResponse } from "next/server";
import { requirePublisher } from "@/lib/auth";
import { escapeTelegramHtml, sendTelegramMessage } from "@/lib/telegram";
import { consumeTelegramLinkRequest } from "@/lib/telegram-editorial-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const resultUrl = new URL("/panel/telegram/connected", request.url);
  try {
    const publisher = await requirePublisher();
    const data = await request.formData();
    const token = typeof data.get("token") === "string" ? String(data.get("token")) : "";
    if (!token || token.length > 200) throw new Error("INVALID_TOKEN");
    const link = await consumeTelegramLinkRequest(token, {
      userId: publisher.id,
      email: publisher.email,
      displayName: publisher.displayName,
    });
    if (!link) throw new Error("INVALID_TOKEN");
    await sendTelegramMessage(link.chatId,
      `<b>Telegram успішно підключено.</b>\n${escapeTelegramHtml(publisher.displayName)} · ${publisher.role === "admin" ? "адміністратор" : "редактор"}\n\nНадішліть текст, фото, PDF або Word — AI підготує матеріал у стилі сайту.`,
      [[{ text: "Відкрити головне меню", callback_data: "ed:menu" }]],
    );
    resultUrl.searchParams.set("status", "success");
  } catch {
    resultUrl.searchParams.set("status", "error");
  }
  return NextResponse.redirect(resultUrl, 303);
}
