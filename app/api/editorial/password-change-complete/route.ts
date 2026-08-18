import { NextResponse } from "next/server";
import { completeEditorialPasswordChange, getAuthenticatedUser } from "@/lib/auth";

export async function POST() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Потрібен вхід" }, { status: 401 });

  try {
    await completeEditorialPasswordChange(user.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не вдалося підтвердити зміну пароля" }, { status: 500 });
  }
}
