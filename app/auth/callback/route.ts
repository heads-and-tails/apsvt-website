import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const supabase = await createServerSupabaseClient();

  if (code) await supabase.auth.exchangeCodeForSession(code);
  else if (tokenHash && type) await supabase.auth.verifyOtp({ token_hash: tokenHash, type });

  return NextResponse.redirect(new URL("/panel", request.url));
}
