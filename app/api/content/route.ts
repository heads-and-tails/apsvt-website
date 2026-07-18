import { NextResponse } from "next/server";
import { createContentItem, getAllContent, isContentKind, type ContentInput } from "@/lib/content";
import { requirePublisher } from "@/lib/auth";

export const dynamic = "force-dynamic";

function valid(value: unknown): value is ContentInput {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  if (!isContentKind(item.kind) || !item.payload || typeof item.payload !== "object") return false;
  const values = Object.values(item.payload as Record<string, unknown>);
  return values.length > 0 && values.every((entry) => typeof entry === "string");
}

export async function GET() {
  try {
    await requirePublisher();
    return NextResponse.json(await getAllContent());
  } catch {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const publisher = await requirePublisher();
    const body: unknown = await request.json();
    if (!valid(body)) return NextResponse.json({ error: "Заповніть усі обов’язкові поля" }, { status: 400 });
    return NextResponse.json(await createContentItem(body, publisher.email), { status: 201 });
  } catch (error) {
    const denied = error instanceof Error && error.message === "UNAUTHORIZED";
    return NextResponse.json({ error: denied ? "Доступ заборонено" : "Не вдалося зберегти запис" }, { status: denied ? 403 : 500 });
  }
}
