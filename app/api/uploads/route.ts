import { NextResponse } from "next/server";
import { requirePublisher } from "@/lib/auth";
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

export async function POST(request: Request) {
  try {
    const publisher = await requirePublisher();
    const data = await request.formData();
    const file = data.get("file");
    const purpose = data.get("purpose") === "document" ? "document" : "image";
    if (!(file instanceof File)) return NextResponse.json({ error: "Оберіть файл" }, { status: 400 });
    const allowed = purpose === "document" ? documentTypes : imageTypes;
    const maxSize = purpose === "document" ? 20 * 1024 * 1024 : 8 * 1024 * 1024;
    if (!allowed.has(file.type)) return NextResponse.json({ error: purpose === "document" ? "Підтримуються PDF, Word, Excel і PowerPoint" : "Підтримуються JPG, PNG і WebP" }, { status: 400 });
    if (file.size > maxSize) return NextResponse.json({ error: purpose === "document" ? "Документ має бути менше 20 МБ" : "Фото має бути менше 8 МБ" }, { status: 400 });

    const extension = purpose === "document"
      ? file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin"
      : file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const key = `${purpose === "document" ? "documents" : "articles"}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
    const bucket = purpose === "document" ? "editorial-documents" : "editorial-media";

    if (isSupabaseConfigured()) {
      const admin = createSupabaseAdmin();
      const { error } = await admin.storage.from(bucket).upload(key, await file.arrayBuffer(), {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
        metadata: { uploadedBy: publisher.email },
      });
      if (error) throw error;
      const { data: publicUrl } = admin.storage.from(bucket).getPublicUrl(key);
      return NextResponse.json({ url: publicUrl.publicUrl, fileName: file.name, mimeType: file.type, fileSize: file.size });
    }

    const moduleName = "cloudflare:workers";
    const { env } = await import(/* webpackIgnore: true */ moduleName);
    if (!env.MEDIA) return NextResponse.json({ error: "Сховище фото недоступне" }, { status: 503 });
    await env.MEDIA.put(key, file.stream(), {
      httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" },
      customMetadata: { uploadedBy: publisher.email },
    });
    return NextResponse.json({ url: `/media/${key}`, fileName: file.name, mimeType: file.type, fileSize: file.size });
  } catch {
    return NextResponse.json({ error: "Доступ заборонено або сховище недоступне" }, { status: 403 });
  }
}
