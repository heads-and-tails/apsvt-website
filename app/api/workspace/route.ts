import { NextResponse } from "next/server";
import { requirePublisher } from "@/lib/auth";
import { createWorkspaceItem, getWorkspaceItems, isWorkspacePriority, isWorkspaceStatus, isWorkspaceSystem, type WorkspaceInput } from "@/lib/workspace";

export const dynamic = "force-dynamic";

function valid(value: unknown): value is WorkspaceInput {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.title === "string" && item.title.trim().length > 2 &&
    typeof item.description === "string" && typeof item.owner === "string" &&
    isWorkspaceSystem(item.system) && isWorkspaceStatus(item.status) && isWorkspacePriority(item.priority) &&
    typeof item.progress === "number" && item.progress >= 0 && item.progress <= 100 &&
    (item.dueDate === null || typeof item.dueDate === "string") &&
    (item.externalUrl === null || typeof item.externalUrl === "string") &&
    typeof item.notes === "string" && typeof item.sortOrder === "number";
}

export async function GET() {
  try { await requirePublisher(); return NextResponse.json(await getWorkspaceItems()); }
  catch { return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 }); }
}

export async function POST(request: Request) {
  try {
    const publisher = await requirePublisher();
    const body: unknown = await request.json();
    if (!valid(body)) return NextResponse.json({ error: "Перевірте обов’язкові поля" }, { status: 400 });
    const input = publisher.role === "admin" ? body : { ...body, status: "planned" as const };
    return NextResponse.json(await createWorkspaceItem(input, publisher.email), { status: 201 });
  } catch (error) {
    const denied = error instanceof Error && error.message === "UNAUTHORIZED";
    return NextResponse.json({ error: denied ? "Доступ заборонено" : "Не вдалося створити напрям" }, { status: denied ? 403 : 500 });
  }
}
