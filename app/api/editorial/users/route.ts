import { NextResponse } from "next/server";
import { requireAdmin, updateEditorialProfile, type EditorialRole, type EditorialStatus } from "@/lib/auth";

const roles = new Set<EditorialRole>(["editor", "admin"]);
const statuses = new Set<EditorialStatus>(["pending", "approved", "suspended"]);

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json() as { id?: unknown; role?: unknown; status?: unknown };
    if (typeof body.id !== "string" || !roles.has(body.role as EditorialRole) || !statuses.has(body.status as EditorialStatus)) {
      return NextResponse.json({ error: "Некоректні параметри доступу" }, { status: 400 });
    }
    if (body.id === admin.id) return NextResponse.json({ error: "Не можна змінити власний адміністративний доступ" }, { status: 400 });
    return NextResponse.json(await updateEditorialProfile(body.id, { role: body.role as EditorialRole, status: body.status as EditorialStatus }, admin.id));
  } catch {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }
}
