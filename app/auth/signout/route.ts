import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function POST(request: Request) {
  const data = await request.formData().catch(() => null);
  const requestedReturnTo = data?.get("returnTo");
  const returnTo = typeof requestedReturnTo === "string" && requestedReturnTo.startsWith("/") && !requestedReturnTo.startsWith("//")
    ? requestedReturnTo
    : "/";
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(new URL(returnTo, request.url), { status: 303 });
}
