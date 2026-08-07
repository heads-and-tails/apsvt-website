import { NextResponse } from "next/server";
import {
  createDepartmentEntry,
  getAllDepartmentEntries,
  isDepartmentEntryInput,
} from "@/lib/department-content";
import { requirePagePublisher, requirePublisher } from "@/lib/auth";
import { canEditPage } from "@/lib/editorial-access";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const publisher = await requirePublisher();
    const entries = await getAllDepartmentEntries();
    return NextResponse.json(entries.filter((entry) => canEditPage(publisher, entry.pagePath)));
  } catch {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!isDepartmentEntryInput(body)) return NextResponse.json({ error: "Заповніть обов’язкові поля" }, { status: 400 });
    const publisher = await requirePagePublisher(body.pagePath);
    return NextResponse.json(await createDepartmentEntry(body, publisher.email), { status: 201 });
  } catch (error) {
    const denied = error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_SCOPE");
    return NextResponse.json({ error: denied ? "Доступ заборонено" : "Не вдалося зберегти запис" }, { status: denied ? 403 : 500 });
  }
}
