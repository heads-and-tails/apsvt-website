import { NextResponse } from "next/server";
import { createDocument, getAllDocuments, type PageDocumentInput } from "@/lib/documents";
import { requirePublisher } from "@/lib/auth";

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

export async function GET() {
  try {
    await requirePublisher();
    return NextResponse.json(await getAllDocuments());
  } catch {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const publisher = await requirePublisher();
    const body: unknown = await request.json();
    if (!valid(body)) return NextResponse.json({ error: "Заповніть дані документа та завантажте файл" }, { status: 400 });
    return NextResponse.json(await createDocument(body, publisher.email), { status: 201 });
  } catch (error) {
    const denied = error instanceof Error && error.message === "UNAUTHORIZED";
    return NextResponse.json({ error: denied ? "Доступ заборонено" : "Не вдалося зберегти документ" }, { status: denied ? 403 : 500 });
  }
}
