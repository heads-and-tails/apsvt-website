"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setMessage("");
    if (password.length < 8) { setMessage("Пароль має містити щонайменше 8 символів."); return; }
    if (password !== confirm) { setMessage("Паролі не збігаються."); return; }
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password });
    if (error) { setMessage("Посилання недійсне або вже використане. Запросіть нове."); setBusy(false); return; }
    router.replace("/panel"); router.refresh();
  }

  return <form className="editorial-login" onSubmit={submit}>
    <label>Новий пароль<input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
    <label>Повторіть пароль<input type="password" autoComplete="new-password" required minLength={8} value={confirm} onChange={(event) => setConfirm(event.target.value)} /></label>
    {message && <p className="auth-error" role="alert">{message}</p>}
    <button disabled={busy} type="submit">{busy ? "Зберігаємо…" : "Зберегти новий пароль →"}</button>
  </form>;
}
