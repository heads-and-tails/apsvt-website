import { NextResponse } from "next/server";
import { createContentItem, getAllContent, isContentKind, type ContentInput } from "@/lib/content";
import { requirePagePublisher, requirePublisher } from "@/lib/auth";
import { canEditPage, contentKindPagePath } from "@/lib/editorial-access";

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
    const publisher = await requirePublisher();
    const content = await getAllContent();
    return NextResponse.json(content.filter((item) => canEditPage(publisher, contentKindPagePath[item.kind])));
  } catch {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!valid(body)) return NextResponse.json({ error: "Заповніть усі обов’язкові поля" }, { status: 400 });
    const publisher = await requirePagePublisher(contentKindPagePath[body.kind]);
    return NextResponse.json(await createContentItem(body, publisher.email), { status: 201 });
  } catch (error) {
    const denied = error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_SCOPE");
    return NextResponse.json({ error: denied ? "Доступ заборонено" : "Не вдалося зберегти запис" }, { status: denied ? 403 : 500 });
  }
}
