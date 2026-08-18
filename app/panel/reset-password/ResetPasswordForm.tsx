"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setHasSession(Boolean(data.session));
      setSessionReady(true);
      if (!data.session) setMessage("Спочатку відкрийте нове посилання з листа відновлення.");
    });
    return () => { active = false; };
  }, [supabase]);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setMessage("");
    if (!hasSession) { setMessage("Це посилання вже неактивне. Запросіть новий лист відновлення."); return; }
    if (password.length < 8) { setMessage("Пароль має містити щонайменше 8 символів."); return; }
    if (password !== confirm) { setMessage("Паролі не збігаються."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password, data: { temporary_password_issued: false } });
    if (error) {
      if (error.code === "weak_password") setMessage("Пароль надто простий. Додайте великі й малі літери, цифру та спеціальний символ.");
      else if (error.code === "same_password") setMessage("Новий пароль має відрізнятися від попереднього.");
      else setMessage("Не вдалося змінити пароль. Запросіть новий лист відновлення.");
      setBusy(false);
      return;
    }
    const confirmation = await fetch("/api/editorial/password-change-complete", { method: "POST" });
    if (!confirmation.ok) {
      setMessage("Пароль змінено, але не вдалося завершити активацію. Увійдіть ще раз або зверніться до адміністратора.");
      setBusy(false);
      return;
    }
    router.replace("/panel"); router.refresh();
  }

  return <form className="editorial-login" onSubmit={submit}>
    <label>Новий пароль<input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
    <label>Повторіть пароль<input type="password" autoComplete="new-password" required minLength={8} value={confirm} onChange={(event) => setConfirm(event.target.value)} /></label>
    {message && <p className="auth-error" role="alert">{message}</p>}
    <button disabled={busy || !sessionReady || !hasSession} type="submit">{!sessionReady ? "Перевіряємо посилання…" : busy ? "Зберігаємо…" : "Зберегти новий пароль →"}</button>
  </form>;
}
