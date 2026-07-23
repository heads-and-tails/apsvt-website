import { NextResponse } from "next/server";
import { inviteApprovedEditorialUser, requireAdmin, updateEditorialProfile, type EditorialRole, type EditorialStatus } from "@/lib/auth";
import { isEditorialAccessScope } from "@/lib/editorial-access";

const roles = new Set<EditorialRole>(["editor", "admin"]);
const statuses = new Set<EditorialStatus>(["pending", "approved", "suspended"]);

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json() as { email?: unknown; displayName?: unknown; role?: unknown; accessScope?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
    if (!/^\S+@\S+\.\S+$/.test(email) || !displayName || !roles.has(body.role as EditorialRole) || !isEditorialAccessScope(body.accessScope)) {
      return NextResponse.json({ error: "Вкажіть ім’я, коректну пошту, роль та область доступу" }, { status: 400 });
    }
    const callback = new URL("/auth/callback", request.url);
    callback.searchParams.set("next", "/panel");
    const profile = await inviteApprovedEditorialUser(
      { email, displayName, role: body.role as EditorialRole, accessScope: body.accessScope },
      admin.id,
      callback.toString(),
    );
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (message.includes("rate") || message.includes("email")) {
      return NextResponse.json({ error: "Користувача погоджено не було: поштовий сервіс тимчасово обмежив запрошення" }, { status: 429 });
    }
    return NextResponse.json({ error: "Не вдалося додати користувача" }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json() as { id?: unknown; role?: unknown; status?: unknown; accessScope?: unknown };
    if (typeof body.id !== "string" || !roles.has(body.role as EditorialRole) || !statuses.has(body.status as EditorialStatus) || !isEditorialAccessScope(body.accessScope)) {
      return NextResponse.json({ error: "Некоректні параметри доступу" }, { status: 400 });
    }
    if (body.id === admin.id) return NextResponse.json({ error: "Не можна змінити власний адміністративний доступ" }, { status: 400 });
    return NextResponse.json(await updateEditorialProfile(body.id, { role: body.role as EditorialRole, status: body.status as EditorialStatus, accessScope: body.accessScope }, admin.id));
  } catch {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }
}
