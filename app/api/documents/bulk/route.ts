import { NextResponse } from "next/server";
import { createDocuments, type PageDocumentInput } from "@/lib/documents";
import { requirePagePublisher } from "@/lib/auth";

export const dynamic = "force-dynamic";

function valid(value: unknown): value is PageDocumentInput {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.title === "string" && Boolean(item.title.trim())
    && typeof item.description === "string"
    && typeof item.category === "string" && Boolean(item.category.trim())
    && item.pagePath === "/schedule"
    && typeof item.fileUrl === "string" && Boolean(item.fileUrl.trim())
    && typeof item.fileName === "string" && Boolean(item.fileName.trim())
    && typeof item.mimeType === "string"
    && typeof item.fileSize === "number"
    && (item.status === "draft" || item.status === "published")
    && typeof item.sortOrder === "number";
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { documents?: unknown };
    if (!Array.isArray(body.documents) || body.documents.length < 1 || body.documents.length > 20 || !body.documents.every(valid)) {
      return NextResponse.json({ error: "Оберіть від 1 до 20 файлів і перевірте параметри комплекту" }, { status: 400 });
    }
    const publisher = await requirePagePublisher("/schedule");
    const documents = await createDocuments(body.documents, publisher.email);
    return NextResponse.json({ documents }, { status: 201 });
  } catch (error) {
    const denied = error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_SCOPE");
    return NextResponse.json({ error: denied ? "Доступ заборонено" : "Не вдалося опублікувати комплект розкладів" }, { status: denied ? 403 : 500 });
  }
}
