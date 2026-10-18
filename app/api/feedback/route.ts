import { NextResponse } from "next/server";
import { parseFeedback } from "@/lib/feedback-form";

const target = "https://formsubmit.co/ajax/info@socosvita.kiev.ua";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Некоректний запит." }, { status: 400 }); }
  const input = parseFeedback(body);
  if (!input) return NextResponse.json({ error: "Перевірте обов’язкові поля, адресу пошти та згоду на обробку даних." }, { status: 400 });
  if (input.website) return NextResponse.json({ ok: true });
  try {
    const resendKey = process.env.RESEND_API_KEY;
    const from = process.env.EDITORIAL_EMAIL_FROM;
    if (resendKey && from) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from, to: ["info@socosvita.kiev.ua"], reply_to: input.email,
            subject: `Зворотний зв’язок АПСВТ: ${input.subject}`,
            text: `Ім’я: ${input.name}\nEmail: ${input.email}\nТема: ${input.subject}\n\n${input.message}`,
          }),
          signal: AbortSignal.timeout(12000),
        });
        if (response.ok) return NextResponse.json({ ok: true });
      } catch {
        // If the configured provider is unavailable, try the alternate route below.
      }
    }
    const response = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Origin: "https://www.socosvita.kiev.ua", Referer: "https://www.socosvita.kiev.ua/contact/feedback" },
      body: JSON.stringify({
        _subject: `Зворотний зв’язок АПСВТ: ${input.subject}`,
        _replyto: input.email,
        _template: "table",
        "Ім’я": input.name,
        Email: input.email,
        Тема: input.subject,
        Повідомлення: input.message,
      }),
      signal: AbortSignal.timeout(12000),
    });
    const result = await response.json().catch(() => null) as { success?: boolean | string; message?: string } | null;
    if (!response.ok || (result?.success !== true && result?.success !== "true")) {
      if (result?.message?.includes("Activation")) return NextResponse.json({ error: "Онлайн-надсилання очікує підтвердження поштової адреси Академії. Скористайтеся кнопкою «Відкрити лист у пошті» нижче." }, { status: 503 });
      throw new Error("Feedback delivery failed");
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не вдалося надіслати повідомлення. Спробуйте ще раз або напишіть на info@socosvita.kiev.ua." }, { status: 502 });
  }
}
