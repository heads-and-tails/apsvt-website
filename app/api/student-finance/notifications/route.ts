import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { addStudentNotification, type StudentNotification } from "@/lib/student-finance";

const categories = new Set<StudentNotification["category"]>(["payment", "overdue", "contract", "general"]);

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json() as Record<string, unknown>;
    if (typeof body.studentId !== "string" || typeof body.title !== "string" || !body.title.trim() || typeof body.message !== "string" || !body.message.trim() || !categories.has(body.category as StudentNotification["category"])) {
      return NextResponse.json({ error: "Вкажіть студента, категорію, заголовок і текст" }, { status: 400 });
    }
    return NextResponse.json(await addStudentNotification({
      studentId: body.studentId,
      category: body.category as StudentNotification["category"],
      title: body.title.trim(),
      message: body.message.trim(),
      actionUrl: typeof body.actionUrl === "string" && body.actionUrl.startsWith("/") ? body.actionUrl : "",
    }), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Не вдалося надіслати повідомлення" }, { status: 403 });
  }
}
