import { NextResponse } from "next/server";
import { requireAdmin, requirePublisher } from "@/lib/auth";
import { deleteWorkspaceItem, getWorkspaceItems, isWorkspacePriority, isWorkspaceStatus, isWorkspaceSystem, updateWorkspaceItem, type WorkspaceInput } from "@/lib/workspace";

export const dynamic = "force-dynamic";

function valid(value: unknown): value is WorkspaceInput {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.title === "string" && item.title.trim().length > 2 && typeof item.description === "string" &&
    typeof item.owner === "string" && isWorkspaceSystem(item.system) && isWorkspaceStatus(item.status) &&
    isWorkspacePriority(item.priority) && typeof item.progress === "number" && item.progress >= 0 && item.progress <= 100 &&
    (item.dueDate === null || typeof item.dueDate === "string") && (item.externalUrl === null || typeof item.externalUrl === "string") &&
    typeof item.notes === "string" && typeof item.sortOrder === "number";
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const publisher = await requirePublisher();
    const body: unknown = await request.json();
    if (!valid(body)) return NextResponse.json({ error: "Некоректні дані" }, { status: 400 });
    const { id } = await context.params;
    const current = (await getWorkspaceItems()).find((item) => item.id === id);
    if (!current) return NextResponse.json({ error: "Напрям не знайдено" }, { status: 404 });
    if (current.status !== body.status && publisher.role !== "admin") {
      return NextResponse.json({ error: "Статус може змінювати лише адміністратор" }, { status: 403 });
    }
    const item = await updateWorkspaceItem(id, body, publisher.email);
    return item ? NextResponse.json(item) : NextResponse.json({ error: "Напрям не знайдено" }, { status: 404 });
  } catch (error) {
    const denied = error instanceof Error && error.message === "UNAUTHORIZED";
    return NextResponse.json({ error: denied ? "Доступ заборонено" : "Не вдалося зберегти зміни" }, { status: denied ? 403 : 500 });
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(); const { id } = await context.params; await deleteWorkspaceItem(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const denied = error instanceof Error && error.message === "UNAUTHORIZED";
    return NextResponse.json({ error: denied ? "Лише адміністратор може видаляти напрями" : "Не вдалося видалити напрям" }, { status: denied ? 403 : 500 });
  }
}
