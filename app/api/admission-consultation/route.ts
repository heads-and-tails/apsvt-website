import { NextResponse } from "next/server";

const target = "https://formsubmit.co/ajax/vportnaia@kse.org.ua";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const level = String(body.level || "").trim();
    if (!name || !email.includes("@") || !phone || !level) return NextResponse.json({ error: "Перевірте обов’язкові поля" }, { status: 400 });
    const payload = {
      _subject: `Нова консультація вступника АПСВТ: ${name}`,
      "Ім’я": name,
      Email: email,
      "Телефон": phone,
      "Освітній рівень": level,
      "Програма": String(body.program || "Допомогти обрати"),
      "Зручний канал": String(body.contactMethod || ""),
      "Зручний час": String(body.contactTime || ""),
      "Запитання": String(body.question || ""),
    };
    const response = await fetch(target, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) return NextResponse.json({ error: "Сервіс консультацій тимчасово недоступний" }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }
}
