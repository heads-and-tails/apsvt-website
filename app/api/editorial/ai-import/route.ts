import { NextResponse } from "next/server";
import { requirePagePublisher } from "@/lib/auth";
import { createEditorialDraft } from "@/lib/editorial-ai";
import { draftTargetConfigs, type EditorialDraftTarget } from "@/lib/editorial-drafts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const allowedTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get("file");
    const target = data.get("target");
    const instruction = typeof data.get("instruction") === "string" ? String(data.get("instruction")).trim().slice(0, 1200) : "";
    const pagePath = typeof data.get("pagePath") === "string" ? String(data.get("pagePath")) : "";
    const config = draftTargetConfigs.find((entry) => entry.id === target);
    if (!(file instanceof File) || !config) {
      return NextResponse.json({ error: "Оберіть файл і розділ сайту" }, { status: 400 });
    }
    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ error: "AI-імпорт підтримує PDF, DOCX, TXT, JPG, PNG і WebP" }, { status: 400 });
    }
    if (file.size > 12 * 1024 * 1024) {
      return NextResponse.json({ error: "Файл для AI-імпорту має бути менше 12 МБ" }, { status: 400 });
    }
    const destination = target === "document" && pagePath.startsWith("/") ? pagePath : config.pagePath;
    const publisher = await requirePagePublisher(destination);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const draft = await createEditorialDraft({
      file,
      bytes,
      target: target as EditorialDraftTarget,
      instruction,
      editorEmail: publisher.email,
    });
    return NextResponse.json(draft);
  } catch (error) {
    const denied = error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_SCOPE");
    return NextResponse.json(
      { error: denied ? "У вас немає доступу до вибраної сторінки" : "Не вдалося підготувати чернетку. Перевірте файл і спробуйте ще раз." },
      { status: denied ? 403 : 500 },
    );
  }
}

