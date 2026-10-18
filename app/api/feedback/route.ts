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
    const response = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
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
    const result = await response.json().catch(() => null) as { success?: boolean | string } | null;
    if (!response.ok || (result?.success !== true && result?.success !== "true")) throw new Error("Feedback delivery failed");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не вдалося надіслати повідомлення. Спробуйте ще раз або напишіть на info@socosvita.kiev.ua." }, { status: 502 });
  }
}
