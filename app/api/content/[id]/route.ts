import { NextResponse } from "next/server";
import { deleteContentItem, getAllContent, isContentKind, updateContentItem, type ContentInput } from "@/lib/content";
import { requirePagePublisher } from "@/lib/auth";
import { contentKindPagePath } from "@/lib/editorial-access";

export const dynamic = "force-dynamic";

function valid(value: unknown): value is ContentInput {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  if (!isContentKind(item.kind) || !item.payload || typeof item.payload !== "object") return false;
  return Object.values(item.payload as Record<string, unknown>).every((entry) => typeof entry === "string");
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const body: unknown = await request.json();
    if (!valid(body)) return NextResponse.json({ error: "Некоректні дані" }, { status: 400 });
    const { id } = await context.params;
    const existing = (await getAllContent()).find((entry) => entry.id === id);
    if (!existing) return NextResponse.json({ error: "Запис не знайдено" }, { status: 404 });
    await requirePagePublisher(contentKindPagePath[existing.kind]);
    const publisher = await requirePagePublisher(contentKindPagePath[body.kind]);
    const item = await updateContentItem(id, body, publisher.email);
    return item ? NextResponse.json(item) : NextResponse.json({ error: "Запис не знайдено" }, { status: 404 });
  } catch (error) {
    const denied = error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_SCOPE");
    return NextResponse.json({ error: denied ? "Доступ заборонено" : "Не вдалося оновити запис" }, { status: denied ? 403 : 500 });
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const existing = (await getAllContent()).find((entry) => entry.id === id);
    if (!existing) return NextResponse.json({ error: "Запис не знайдено" }, { status: 404 });
    await requirePagePublisher(contentKindPagePath[existing.kind]);
    await deleteContentItem(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const denied = error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_SCOPE");
    return NextResponse.json({ error: denied ? "Доступ заборонено" : "Не вдалося видалити запис" }, { status: denied ? 403 : 500 });
  }
}
