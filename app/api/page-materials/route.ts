import { NextResponse } from "next/server";
import { getDepartmentEntries } from "@/lib/department-content";
import { isEditorialPagePath } from "@/lib/editorial-access";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const pagePath = new URL(request.url).searchParams.get("path");
  if (!isEditorialPagePath(pagePath)) {
    return NextResponse.json({ error: "Сторінку не знайдено" }, { status: 400 });
  }

  const entries = await getDepartmentEntries(pagePath);
  return NextResponse.json(entries.map((entry) => ({
    id: entry.id,
    pagePath: entry.pagePath,
    entryType: entry.entryType,
    title: entry.title,
    summary: entry.summary,
    body: entry.body,
    imageUrl: entry.imageUrl,
    imageAlt: entry.imageAlt,
    fileUrl: entry.fileUrl,
    fileName: entry.fileName,
    date: entry.date,
    role: entry.role,
    email: entry.email,
    profileUrl: entry.profileUrl,
    status: entry.status,
    sortOrder: entry.sortOrder,
  })), { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}
