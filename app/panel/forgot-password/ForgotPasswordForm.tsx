"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm({ initialMessage = "" }: { initialMessage?: string }) {
  const [supabase] = useState(() => createClient());
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(initialMessage);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    const callback = new URL("/auth/callback", window.location.origin);
    callback.searchParams.set("next", "/panel/reset-password");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: callback.toString(),
    });
    if (error) {
      setMessage(error.code === "over_email_send_rate_limit"
        ? "Забагато запитів. Зачекайте кілька хвилин і спробуйте ще раз."
        : "Не вдалося надіслати лист. Спробуйте трохи пізніше.");
      setBusy(false);
      return;
    }
    setSent(true); setMessage("Перевірте пошту. Посилання для відновлення пароля вже надіслано."); setBusy(false);
  }

  return <form className="editorial-login" onSubmit={submit}>
    <label>Робоча електронна пошта<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@apsvt.edu.ua" /></label>
    {message && <p className={sent ? "auth-success" : "auth-error"} role="status">{message}</p>}
    <button disabled={busy || sent} type="submit">{busy ? "Надсилаємо…" : sent ? "Лист надіслано" : "Надіслати посилання →"}</button>
  </form>;
}
