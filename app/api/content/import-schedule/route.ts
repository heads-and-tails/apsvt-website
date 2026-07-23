import { NextResponse } from "next/server";
import { replaceImportedSchedule, type ScheduleImportInput } from "@/lib/content";
import { requirePagePublisher } from "@/lib/auth";
import { contentKindPagePath } from "@/lib/editorial-access";

export const dynamic = "force-dynamic";

function validEntry(value: unknown): value is ScheduleImportInput {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  if (entry.kind !== "lesson" && entry.kind !== "exam") return false;
  if (!entry.payload || typeof entry.payload !== "object" || Array.isArray(entry.payload)) return false;
  const payload = entry.payload as Record<string, unknown>;
  const required = ["sourceId", "sourceFile", "date", "time", "course", "group", "faculty", "teacher", "room"];
  return required.every((key) => typeof payload[key] === "string" && payload[key]) &&
    Object.values(payload).every((item) => typeof item === "string");
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { entries?: unknown[] };
    if (!Array.isArray(body.entries) || !body.entries.length || body.entries.length > 600 || !body.entries.every(validEntry)) {
      return NextResponse.json({ error: "Перевірте розпізнані рядки. За один раз можна опублікувати до 600 записів." }, { status: 400 });
    }
    const entries = body.entries as ScheduleImportInput[];
    const kinds = [...new Set(entries.map((entry) => entry.kind))];
    let publisher = await requirePagePublisher(contentKindPagePath[kinds[0]]);
    for (const kind of kinds.slice(1)) publisher = await requirePagePublisher(contentKindPagePath[kind]);
    return NextResponse.json(await replaceImportedSchedule(entries, publisher.email), { status: 201 });
  } catch (error) {
    const denied = error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_SCOPE");
    return NextResponse.json(
      { error: denied ? "Доступ до розкладу заборонено" : "Не вдалося імпортувати Word-файли" },
      { status: denied ? 403 : 500 },
    );
  }
}
