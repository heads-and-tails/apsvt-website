import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { addStudentContract, type StudentContract } from "@/lib/student-finance";

const allowedTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const statuses = new Set<StudentContract["status"]>(["draft", "active", "completed", "terminated"]);

export async function POST(request: Request) {
  try {
    await requireAdmin();
    if (!request.headers.get("content-type")?.includes("multipart/form-data")) return NextResponse.json({ error: "Надішліть дані договору через форму" }, { status: 400 });
    const form = await request.formData();
    const file = form.get("file");
    const studentId = String(form.get("studentId") || "");
    const contractNumber = String(form.get("contractNumber") || "").trim();
    const title = String(form.get("title") || "").trim();
    const totalAmount = Number(form.get("totalAmount"));
    const status = String(form.get("status") || "active") as StudentContract["status"];
    if (!studentId || !contractNumber || !title || !Number.isFinite(totalAmount) || totalAmount < 0 || !statuses.has(status)) {
      return NextResponse.json({ error: "Вкажіть студента, номер, назву, суму та статус договору" }, { status: 400 });
    }
    let filePath: string | null = null;
    let fileName: string | null = null;
    let mimeType: string | null = null;
    let fileSize: number | null = null;
    if (file instanceof File && file.size > 0) {
      if (!allowedTypes.has(file.type) || file.size > 20 * 1024 * 1024) return NextResponse.json({ error: "Договір має бути PDF або Word до 20 МБ" }, { status: 400 });
      const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
      filePath = `${studentId}/${crypto.randomUUID()}.${extension}`;
      const { error } = await createSupabaseAdmin().storage.from("student-contracts").upload(filePath, await file.arrayBuffer(), {
        contentType: file.type,
        cacheControl: "private, max-age=3600",
        upsert: false,
      });
      if (error) throw error;
      fileName = file.name;
      mimeType = file.type;
      fileSize = file.size;
    }
    return NextResponse.json(await addStudentContract({
      studentId,
      contractNumber,
      title,
      signedAt: String(form.get("signedAt") || "") || null,
      validFrom: String(form.get("validFrom") || "") || null,
      validTo: String(form.get("validTo") || "") || null,
      totalAmount,
      status,
      filePath,
      fileName,
      mimeType,
      fileSize,
    }), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Не вдалося додати договір" }, { status: 403 });
  }
}
