import { NextResponse } from "next/server";
import {
  deleteDepartmentEntry,
  getDepartmentEntryById,
  isDepartmentEntryInput,
  updateDepartmentEntry,
} from "@/lib/department-content";
import { requirePagePublisher } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getAllDocuments } from "@/lib/documents";
import { isProgrammeFolder, programmeFolderHasDocuments, programmeFolderRole } from "@/lib/programme-folders";

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
    if (body.role === programmeFolderRole && !isProgrammeFolder(body)) return NextResponse.json({ error: "Оберіть розділ робочих програм або анотацій відповідної освітньої програми" }, { status: 400 });
    if (isProgrammeFolder(existing) && (!isProgrammeFolder(body) || existing.pagePath !== body.pagePath || existing.sectionId !== body.sectionId)
      && programmeFolderHasDocuments(existing, await getAllDocuments())) return NextResponse.json({ error: "Спочатку перенесіть або видаліть документи з папки" }, { status: 409 });
    const entry = await updateDepartmentEntry(id, body, publisher.email);
    revalidatePath(existing.pagePath);
    if (existing.pagePath !== body.pagePath) revalidatePath(body.pagePath);
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
    const publisher = await requirePagePublisher(existing.pagePath);
    if (isProgrammeFolder(existing) && programmeFolderHasDocuments(existing, await getAllDocuments())) return NextResponse.json({ error: "Спочатку перенесіть або видаліть документи з папки" }, { status: 409 });
    await deleteDepartmentEntry(id, publisher.email);
    revalidatePath(existing.pagePath);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const denied = error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_SCOPE");
    return NextResponse.json({ error: denied ? "Доступ заборонено" : "Не вдалося видалити запис" }, { status: denied ? 403 : 500 });
  }
}
