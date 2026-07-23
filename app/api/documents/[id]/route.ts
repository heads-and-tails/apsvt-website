import { NextResponse } from "next/server";
import { deleteDocument, getDocumentById, updateDocument, type PageDocumentInput } from "@/lib/documents";
import { requirePagePublisher } from "@/lib/auth";

export const dynamic = "force-dynamic";

function valid(value: unknown): value is PageDocumentInput {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.title === "string" && Boolean(item.title.trim())
    && typeof item.description === "string"
    && typeof item.category === "string" && Boolean(item.category.trim())
    && typeof item.pagePath === "string" && (item.pagePath === "*" || item.pagePath.startsWith("/"))
    && typeof item.fileUrl === "string" && Boolean(item.fileUrl.trim())
    && typeof item.fileName === "string" && Boolean(item.fileName.trim())
    && typeof item.mimeType === "string"
    && typeof item.fileSize === "number"
    && (item.status === "draft" || item.status === "published")
    && typeof item.sortOrder === "number";
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const body: unknown = await request.json();
    if (!valid(body)) return NextResponse.json({ error: "Некоректні дані документа" }, { status: 400 });
    const { id } = await context.params;
    const existing = await getDocumentById(id);
    if (!existing) return NextResponse.json({ error: "Документ не знайдено" }, { status: 404 });
    await requirePagePublisher(existing.pagePath);
    const publisher = await requirePagePublisher(body.pagePath);
    const document = await updateDocument(id, body, publisher.email);
    return document ? NextResponse.json(document) : NextResponse.json({ error: "Документ не знайдено" }, { status: 404 });
  } catch (error) {
    const denied = error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_SCOPE");
    return NextResponse.json({ error: denied ? "Доступ заборонено" : "Не вдалося оновити документ" }, { status: denied ? 403 : 500 });
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const existing = await getDocumentById(id);
    if (!existing) return NextResponse.json({ error: "Документ не знайдено" }, { status: 404 });
    await requirePagePublisher(existing.pagePath);
    await deleteDocument(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const denied = error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_SCOPE");
    return NextResponse.json({ error: denied ? "Доступ заборонено" : "Не вдалося видалити документ" }, { status: denied ? 403 : 500 });
  }
}
