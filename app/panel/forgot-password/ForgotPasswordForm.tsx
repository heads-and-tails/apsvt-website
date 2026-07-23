"use client";

import { useState } from "react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
    const result = await response.json() as { error?: string };
    if (!response.ok) { setMessage(result.error || "Не вдалося надіслати лист"); setBusy(false); return; }
    setSent(true); setMessage("Перевірте пошту. Посилання для відновлення пароля вже надіслано."); setBusy(false);
  }

  return <form className="editorial-login" onSubmit={submit}>
    <label>Робоча електронна пошта<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@apsvt.edu.ua" /></label>
    {message && <p className={sent ? "auth-success" : "auth-error"} role="status">{message}</p>}
    <button disabled={busy || sent} type="submit">{busy ? "Надсилаємо…" : sent ? "Лист надіслано" : "Надіслати посилання →"}</button>
  </form>;
}
