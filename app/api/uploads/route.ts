import { NextResponse } from "next/server";
import { requirePublisher } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxSize = 8 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const publisher = await requirePublisher();
    const data = await request.formData();
    const file = data.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Оберіть файл" }, { status: 400 });
    if (!allowed.has(file.type)) return NextResponse.json({ error: "Підтримуються JPG, PNG і WebP" }, { status: 400 });
    if (file.size > maxSize) return NextResponse.json({ error: "Фото має бути менше 8 МБ" }, { status: 400 });

    const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const key = `articles/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;

    if (isSupabaseConfigured()) {
      const admin = createSupabaseAdmin();
      const { error } = await admin.storage.from("editorial-media").upload(key, await file.arrayBuffer(), {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
        metadata: { uploadedBy: publisher.email },
      });
      if (error) throw error;
      const { data: publicUrl } = admin.storage.from("editorial-media").getPublicUrl(key);
      return NextResponse.json({ url: publicUrl.publicUrl });
    }

    const moduleName = "cloudflare:workers";
    const { env } = await import(/* webpackIgnore: true */ moduleName);
    if (!env.MEDIA) return NextResponse.json({ error: "Сховище фото недоступне" }, { status: 503 });
    await env.MEDIA.put(key, file.stream(), {
      httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" },
      customMetadata: { uploadedBy: publisher.email },
    });
    return NextResponse.json({ url: `/media/${key}` });
  } catch {
    return NextResponse.json({ error: "Доступ заборонено або сховище недоступне" }, { status: 403 });
  }
}
