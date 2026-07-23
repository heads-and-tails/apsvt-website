import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Відновлення пароля ще не підключено" }, { status: 503 });
  try {
    const body = await request.json() as { email?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Введіть коректну електронну адресу" }, { status: 400 });
    const supabase = await createServerSupabaseClient();
    const callback = new URL("/auth/callback", request.url);
    callback.searchParams.set("next", "/panel/reset-password");
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: callback.toString() });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не вдалося надіслати лист. Спробуйте трохи пізніше." }, { status: 500 });
  }
}
