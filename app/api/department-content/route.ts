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
  const startedAt = Date.now();
  const requestId = request.headers.get("x-vercel-id");
  try {
    const body: unknown = await request.json();
    if (!isDepartmentEntryInput(body)) return NextResponse.json({ error: "Заповніть обов’язкові поля" }, { status: 400 });
    const publisher = await requirePagePublisher(body.pagePath);
    const entry = await createDepartmentEntry(body, publisher.email);
    console.log(JSON.stringify({
      level: "info",
      message: "Department entry created",
      route: "/api/department-content",
      requestId,
      pagePath: body.pagePath,
      entryType: body.entryType,
      durationMs: Date.now() - startedAt,
    }));
    return NextResponse.json(entry, { status: 201, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const denied = error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_SCOPE");
    const storageCode = error && typeof error === "object" && "code" in error ? String(error.code) : undefined;
    console.error(JSON.stringify({
      level: "error",
      message: "Department entry creation failed",
      route: "/api/department-content",
      requestId,
      error: error instanceof Error ? error.message : String(error),
      storageCode,
      durationMs: Date.now() - startedAt,
    }));
    return NextResponse.json(
      { error: denied ? "Доступ заборонено" : "Не вдалося зберегти запис. Оновіть сторінку та повторіть спробу." },
      { status: denied ? 403 : 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
