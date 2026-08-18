import { NextResponse } from "next/server";
import { createApprovedEditorialUser, issueEditorialTemporaryPassword, requireAdmin, updateEditorialProfile, type EditorialRole, type EditorialStatus } from "@/lib/auth";
import { isEditorialAccessScopes } from "@/lib/editorial-access";
import { generateTemporaryPassword, sendEditorialTemporaryPassword } from "@/lib/editorial-email";

const roles = new Set<EditorialRole>(["editor", "admin"]);
const statuses = new Set<EditorialStatus>(["pending", "approved", "suspended"]);

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json() as { email?: unknown; displayName?: unknown; role?: unknown; accessScopes?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
    if (!/^\S+@\S+\.\S+$/.test(email) || !displayName || !roles.has(body.role as EditorialRole) || !isEditorialAccessScopes(body.accessScopes)) {
      return NextResponse.json({ error: "Вкажіть ім’я, коректну пошту, роль та область доступу" }, { status: 400 });
    }
    const temporaryPassword = generateTemporaryPassword();
    const { profile, temporaryPasswordIssued } = await createApprovedEditorialUser(
      { email, displayName, role: body.role as EditorialRole, accessScopes: body.accessScopes },
      admin.id,
      temporaryPassword,
    );
    if (temporaryPasswordIssued) {
      await sendEditorialTemporaryPassword({
        email,
        displayName,
        temporaryPassword,
        loginUrl: new URL("/panel/login", request.url).toString(),
      });
    }
    return NextResponse.json({ ...profile, temporaryPasswordIssued }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (message.includes("editorial_email_not_configured")) {
      return NextResponse.json({ error: "Акаунт створено, але поштовий сервіс ще не налаштовано. Скористайтеся кнопкою повторного надсилання після налаштування email." }, { status: 503 });
    }
    if (message.includes("email")) {
      return NextResponse.json({ error: "Акаунт створено, але лист не вдалося надіслати. Спробуйте повторне надсилання тимчасового пароля." }, { status: 502 });
    }
    return NextResponse.json({ error: "Не вдалося додати користувача" }, { status: 403 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json() as { id?: unknown };
    if (typeof body.id !== "string" || body.id === admin.id) {
      return NextResponse.json({ error: "Некоректний користувач" }, { status: 400 });
    }
    const temporaryPassword = generateTemporaryPassword();
    const profile = await issueEditorialTemporaryPassword(body.id, admin.id, temporaryPassword);
    await sendEditorialTemporaryPassword({
      email: profile.email,
      displayName: profile.displayName,
      temporaryPassword,
      loginUrl: new URL("/panel/login", request.url).toString(),
    });
    return NextResponse.json(profile);
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (message.includes("editorial_email_not_configured")) {
      return NextResponse.json({ error: "Поштовий сервіс ще не налаштовано" }, { status: 503 });
    }
    return NextResponse.json({ error: "Не вдалося надіслати тимчасовий пароль" }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json() as { id?: unknown; role?: unknown; status?: unknown; accessScopes?: unknown };
    if (typeof body.id !== "string" || !roles.has(body.role as EditorialRole) || !statuses.has(body.status as EditorialStatus) || !isEditorialAccessScopes(body.accessScopes)) {
      return NextResponse.json({ error: "Некоректні параметри доступу" }, { status: 400 });
    }
    if (body.id === admin.id) return NextResponse.json({ error: "Не можна змінити власний адміністративний доступ" }, { status: 400 });
    return NextResponse.json(await updateEditorialProfile(body.id, { role: body.role as EditorialRole, status: body.status as EditorialStatus, accessScopes: body.accessScopes }, admin.id));
  } catch {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }
}
