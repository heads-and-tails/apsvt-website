import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { addStudentPayment } from "@/lib/student-finance";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json() as Record<string, unknown>;
    const amount = Number(body.amount);
    if (typeof body.studentId !== "string" || typeof body.paidAt !== "string" || !body.paidAt || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Вкажіть студента, суму та дату платежу" }, { status: 400 });
    }
    return NextResponse.json(await addStudentPayment({
      studentId: body.studentId,
      chargeId: typeof body.chargeId === "string" && body.chargeId ? body.chargeId : null,
      amount,
      paidAt: body.paidAt,
      provider: typeof body.provider === "string" ? body.provider.trim() : "manual",
      providerReference: typeof body.providerReference === "string" ? body.providerReference.trim() : "",
      receiptUrl: typeof body.receiptUrl === "string" ? body.receiptUrl.trim() : "",
    }), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Не вдалося підтвердити платіж" }, { status: 403 });
  }
}
