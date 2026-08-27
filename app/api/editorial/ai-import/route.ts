import { NextResponse } from "next/server";
import { requirePublisher } from "@/lib/auth";
import { createEditorialDraft, detectEditorialTarget } from "@/lib/editorial-ai";
import { draftTargetConfigs, type EditorialDraftTarget } from "@/lib/editorial-drafts";
import { canEditPage, isDepartmentPagePath } from "@/lib/editorial-access";

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

function departmentTargetFor(detectedTarget: EditorialDraftTarget): EditorialDraftTarget {
  if (detectedTarget === "news" || detectedTarget === "event") return "department_news";
  if (detectedTarget === "research_resource" || detectedTarget === "student_thesis") return "department_article";
  return "department_material";
}

export async function POST(request: Request) {
  try {
    const publisher = await requirePublisher();
    if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Надішліть файл через форму AI-імпорту" }, { status: 400 });
    }
    const data = await request.formData();
    const file = data.get("file");
    const target = data.get("target");
    const instruction = typeof data.get("instruction") === "string" ? String(data.get("instruction")).trim().slice(0, 1200) : "";
    const pagePath = typeof data.get("pagePath") === "string" ? String(data.get("pagePath")) : "";
    if (!(file instanceof File) || (target !== "auto" && !draftTargetConfigs.some((entry) => entry.id === target))) {
      return NextResponse.json({ error: "Оберіть файл і розділ сайту" }, { status: 400 });
    }
    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ error: "AI-імпорт підтримує PDF, DOCX, TXT, JPG, PNG і WebP" }, { status: 400 });
    }
    if (file.size > 12 * 1024 * 1024) {
      return NextResponse.json({ error: "Файл для AI-імпорту має бути менше 12 МБ" }, { status: 400 });
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    let resolvedTarget = target === "auto"
      ? detectEditorialTarget(file, bytes, instruction)
      : target as EditorialDraftTarget;
    let config = draftTargetConfigs.find((entry) => entry.id === resolvedTarget)!;
    let isDepartmentTarget = Boolean(config.departmentEntryType);
    let destination = (resolvedTarget === "document" || isDepartmentTarget) && pagePath.startsWith("/") ? pagePath : config.pagePath;

    // The selected department is the editor's explicit destination. Keep every
    // automatically detected generic material inside it instead of redirecting
    // departmental news to /news (and denying a department-scoped editor).
    if (
      target === "auto"
      && isDepartmentPagePath(pagePath)
      && !isDepartmentTarget
    ) {
      resolvedTarget = departmentTargetFor(resolvedTarget);
      config = draftTargetConfigs.find((entry) => entry.id === resolvedTarget)!;
      isDepartmentTarget = Boolean(config.departmentEntryType);
      destination = pagePath;
    }

    if (isDepartmentTarget && !isDepartmentPagePath(pagePath)) {
      return NextResponse.json({ error: "Оберіть кафедру або факультет для цього матеріалу" }, { status: 400 });
    }
    if (!canEditPage(publisher, destination)) throw new Error("FORBIDDEN_SCOPE");
    const draft = await createEditorialDraft({
      file,
      bytes,
      target: resolvedTarget,
      instruction,
      editorEmail: publisher.email,
    });
    return NextResponse.json(draft);
  } catch (error) {
    const unauthorized = error instanceof Error && error.message === "UNAUTHORIZED";
    const forbidden = error instanceof Error && error.message === "FORBIDDEN_SCOPE";
    return NextResponse.json(
      {
        error: unauthorized
          ? "Увійдіть до редакційної панелі"
          : forbidden
            ? "У вас немає доступу до вибраної сторінки"
            : "Не вдалося підготувати чернетку. Перевірте файл і спробуйте ще раз.",
      },
      { status: unauthorized ? 401 : forbidden ? 403 : 500 },
    );
  }
}
