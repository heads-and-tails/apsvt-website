import { NextResponse } from "next/server";
import {
  deleteDepartmentEntry,
  getDepartmentEntryById,
  isDepartmentEntryInput,
  updateDepartmentEntry,
} from "@/lib/department-content";
import { requirePagePublisher } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  try {
    const body: unknown = await request.json();
    if (!isDepartmentEntryInput(body)) return NextResponse.json({ error: "Некоректні дані" }, { status: 400 });
    const { id } = await context.params;
    const existing = await getDepartmentEntryById(id);
    if (!existing) return NextResponse.json({ error: "Запис не знайдено" }, { status: 404 });
    await requirePagePublisher(existing.pagePath);
    const publisher = await requirePagePublisher(body.pagePath);
    const entry = await updateDepartmentEntry(id, body, publisher.email);
    return entry ? NextResponse.json(entry) : NextResponse.json({ error: "Запис не знайдено" }, { status: 404 });
  } catch (error) {
    const denied = error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_SCOPE");
    return NextResponse.json({ error: denied ? "Доступ заборонено" : "Не вдалося оновити запис" }, { status: denied ? 403 : 500 });
  }
}

export async function DELETE(_: Request, context: Context) {
  try {
    const { id } = await context.params;
    const existing = await getDepartmentEntryById(id);
    if (!existing) return NextResponse.json({ error: "Запис не знайдено" }, { status: 404 });
    await requirePagePublisher(existing.pagePath);
    await deleteDepartmentEntry(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const denied = error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_SCOPE");
    return NextResponse.json({ error: denied ? "Доступ заборонено" : "Не вдалося видалити запис" }, { status: denied ? 403 : 500 });
  }
}
