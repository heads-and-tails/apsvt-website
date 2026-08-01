import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { addStudentCharge } from "@/lib/student-finance";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json() as Record<string, unknown>;
    const amount = Number(body.amount);
    if (typeof body.studentId !== "string" || typeof body.title !== "string" || !body.title.trim() || typeof body.dueDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(body.dueDate) || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Вкажіть студента, назву, суму та строк оплати" }, { status: 400 });
    }
    return NextResponse.json(await addStudentCharge({
      studentId: body.studentId,
      contractId: typeof body.contractId === "string" && body.contractId ? body.contractId : null,
      title: body.title.trim(),
      period: typeof body.period === "string" ? body.period.trim() : "",
      amount,
      dueDate: body.dueDate,
      paymentPurpose: typeof body.paymentPurpose === "string" ? body.paymentPurpose.trim() : "",
    }), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Не вдалося додати нарахування" }, { status: 403 });
  }
}
