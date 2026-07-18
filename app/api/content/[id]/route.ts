import { NextResponse } from "next/server";
import { deleteContentItem, isContentKind, updateContentItem, type ContentInput } from "@/lib/content";
import { requirePublisher } from "@/lib/auth";

export const dynamic = "force-dynamic";

function valid(value: unknown): value is ContentInput {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  if (!isContentKind(item.kind) || !item.payload || typeof item.payload !== "object") return false;
  return Object.values(item.payload as Record<string, unknown>).every((entry) => typeof entry === "string");
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const publisher = await requirePublisher();
    const body: unknown = await request.json();
    if (!valid(body)) return NextResponse.json({ error: "Некоректні дані" }, { status: 400 });
    const { id } = await context.params;
    const item = await updateContentItem(id, body, publisher.email);
    return item ? NextResponse.json(item) : NextResponse.json({ error: "Запис не знайдено" }, { status: 404 });
  } catch (error) {
    const denied = error instanceof Error && error.message === "UNAUTHORIZED";
    return NextResponse.json({ error: denied ? "Доступ заборонено" : "Не вдалося оновити запис" }, { status: denied ? 403 : 500 });
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requirePublisher();
    const { id } = await context.params;
    await deleteContentItem(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const denied = error instanceof Error && error.message === "UNAUTHORIZED";
    return NextResponse.json({ error: denied ? "Доступ заборонено" : "Не вдалося видалити запис" }, { status: denied ? 403 : 500 });
  }
}
