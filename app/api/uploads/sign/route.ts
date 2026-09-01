import { NextResponse } from "next/server";
import { requirePagePublisher, requirePublisher } from "@/lib/auth";
import { isDepartmentPagePath } from "@/lib/editorial-access";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const documentTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

type UploadTicketRequest = {
  fileName?: unknown;
  contentType?: unknown;
  fileSize?: unknown;
  purpose?: unknown;
  pagePath?: unknown;
};

function denied(error: unknown): boolean {
  return error instanceof Error && ["UNAUTHORIZED", "FORBIDDEN_SCOPE", "PASSWORD_CHANGE_REQUIRED"].includes(error.message);
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as UploadTicketRequest;
    const purpose = body.purpose === "document" ? "document" : body.purpose === "image" ? "image" : null;
    const fileName = typeof body.fileName === "string" ? body.fileName.trim() : "";
    const contentType = typeof body.contentType === "string" ? body.contentType : "";
    const fileSize = typeof body.fileSize === "number" && Number.isFinite(body.fileSize) ? body.fileSize : 0;
    const pagePath = isDepartmentPagePath(body.pagePath) ? body.pagePath : null;

    if (!purpose || !fileName || fileSize <= 0) {
      return NextResponse.json({ error: "Оберіть файл для завантаження" }, { status: 400 });
    }

    const publisher = pagePath
      ? await requirePagePublisher(pagePath)
      : purpose === "document"
        ? await requirePublisher()
        : await requirePagePublisher("/news");

    const allowed = purpose === "document" ? documentTypes : imageTypes;
    const maxSize = purpose === "document" ? 20 * 1024 * 1024 : 8 * 1024 * 1024;
    if (!allowed.has(contentType)) {
      return NextResponse.json({
        error: purpose === "document"
          ? "Підтримуються PDF, Word, Excel і PowerPoint"
          : "Підтримуються JPG, PNG і WebP",
      }, { status: 400 });
    }
    if (fileSize > maxSize) {
      return NextResponse.json({
        error: purpose === "document" ? "Документ має бути менше 20 МБ" : "Фото має бути менше 8 МБ",
      }, { status: 400 });
    }
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Сховище файлів ще не підключене" }, { status: 503 });
    }

    const extension = purpose === "document"
      ? fileName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin"
      : contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
    const key = `${purpose === "document" ? "documents" : "articles"}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
    const bucket = purpose === "document" ? "editorial-documents" : "editorial-media";
    const admin = createSupabaseAdmin();
    const { data: ticket, error } = await admin.storage.from(bucket).createSignedUploadUrl(key);
    if (error || !ticket?.token) throw error || new Error("UPLOAD_TICKET_MISSING");
    const { data: publicUrl } = admin.storage.from(bucket).getPublicUrl(key);

    console.info("[editorial-upload] ticket issued", {
      email: publisher.email,
      purpose,
      pagePath,
      fileSize,
      bucket,
    });
    return NextResponse.json({
      bucket,
      path: key,
      token: ticket.token,
      url: publicUrl.publicUrl,
      fileName,
      mimeType: contentType,
      fileSize,
    });
  } catch (error) {
    console.error("[editorial-upload] ticket failed", error);
    return NextResponse.json({
      error: denied(error)
        ? "Ваш акаунт не має доступу до вибраної сторінки. Увійдіть знову або зверніться до адміністратора."
        : "Не вдалося підготувати завантаження. Спробуйте ще раз через хвилину.",
    }, { status: denied(error) ? 403 : 500 });
  }
}
