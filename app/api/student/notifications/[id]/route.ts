import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { markStudentNotificationRead } from "@/lib/student-finance";

export async function PATCH(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Увійдіть до кабінету" }, { status: 401 });
    const { id } = await context.params;
    if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Некоректне повідомлення" }, { status: 400 });
    await markStudentNotificationRead(id, user.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не вдалося оновити повідомлення" }, { status: 500 });
  }
}
