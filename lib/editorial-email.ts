import { randomInt } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";

const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const lower = "abcdefghijkmnopqrstuvwxyz";
const digits = "23456789";
const symbols = "!@#$%";
const allCharacters = `${upper}${lower}${digits}${symbols}`;

function randomCharacter(source: string): string {
  return source[randomInt(0, source.length)];
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function generateTemporaryPassword(): string {
  const password = [
    randomCharacter(upper),
    randomCharacter(lower),
    randomCharacter(digits),
    randomCharacter(symbols),
    ...Array.from({ length: 12 }, () => randomCharacter(allCharacters)),
  ];

  for (let index = password.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index + 1);
    [password[index], password[swapIndex]] = [password[swapIndex], password[index]];
  }

  return password.join("");
}

export type EditorialEmailDelivery = "temporary-password" | "password-setup-link";

async function sendPasswordSetupLink(email: string, loginUrl: string): Promise<void> {
  const { url, publishableKey } = getSupabaseConfig();
  const supabase = createClient(url, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const callbackUrl = new URL("/auth/callback", loginUrl);
  callbackUrl.searchParams.set("next", "/panel/reset-password");
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackUrl.toString(),
  });
  if (error) {
    console.error("Editorial password setup email failed", error.code, error.message);
    throw new Error("EDITORIAL_EMAIL_SEND_FAILED");
  }
}

export async function sendEditorialTemporaryPassword(input: {
  email: string;
  displayName: string;
  temporaryPassword: string;
  loginUrl: string;
}): Promise<EditorialEmailDelivery> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EDITORIAL_EMAIL_FROM;
  if (apiKey && from) {
    const displayName = escapeHtml(input.displayName || input.email);
    const email = escapeHtml(input.email);
    const temporaryPassword = escapeHtml(input.temporaryPassword);
    const loginUrl = escapeHtml(input.loginUrl);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.email],
        subject: "Доступ до редакційної панелі АПСВТ",
        html: `<!doctype html><html lang="uk"><body style="margin:0;background:#eef1f6;color:#101727;font-family:Arial,sans-serif"><div style="max-width:620px;margin:0 auto;padding:32px 18px"><div style="background:#101b36;padding:26px;color:#fff"><div style="display:inline-block;background:#2855ff;color:#fff;font-size:30px;font-weight:900;padding:13px 17px;border-right:12px solid #ffcd38">АП</div><p style="margin:20px 0 0;color:#ffcd38;font-size:12px;letter-spacing:.12em;text-transform:uppercase">Редакційна панель</p><h1 style="margin:8px 0 0;font-size:28px">Ваш акаунт створено</h1></div><div style="background:#fff;padding:30px"><p>Вітаємо, <strong>${displayName}</strong>!</p><p>Адміністратор надав адресі <strong>${email}</strong> доступ до редакційної панелі Академії.</p><p style="margin:26px 0 8px;font-size:12px;color:#657084;text-transform:uppercase;letter-spacing:.08em">Тимчасовий пароль</p><div style="padding:18px;background:#f2f4f8;border-left:5px solid #ffcd38;font-family:monospace;font-size:23px;font-weight:700;letter-spacing:.08em">${temporaryPassword}</div><p style="margin-top:24px">Під час першого входу система попросить створити власний пароль. Не пересилайте цей лист іншим людям.</p><a href="${loginUrl}" style="display:inline-block;margin-top:16px;padding:15px 22px;background:#2855ff;color:#fff;text-decoration:none;font-weight:700">Увійти до панелі →</a><p style="margin-top:28px;color:#657084;font-size:12px">Якщо ви не очікували цього листа, повідомте адміністратора Академії.</p></div></div></body></html>`,
      }),
    });

    if (response.ok) return "temporary-password";
    const details = await response.text().catch(() => "");
    console.error("Editorial access email failed; using Supabase fallback", response.status, details.slice(0, 300));
  }

  await sendPasswordSetupLink(input.email, input.loginUrl);
  return "password-setup-link";
}
