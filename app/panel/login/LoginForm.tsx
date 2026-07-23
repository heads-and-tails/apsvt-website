"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("Неправильна пошта або пароль. Перевірте дані й спробуйте ще раз.");
      setBusy(false);
      return;
    }
    router.replace("/panel");
    router.refresh();
  }

  return <form className="editorial-login" onSubmit={submit}>
    <label>Робоча електронна пошта<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@apsvt.edu.ua" /></label>
    <label>Пароль<input type="password" autoComplete="current-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Ваш пароль" /></label>
    {message && <p className="auth-error" role="alert">{message}</p>}
    <button disabled={busy} type="submit">{busy ? "Перевіряємо…" : "Увійти до панелі →"}</button>
    <a className="forgot-password-link" href="/panel/forgot-password">Забули пароль?</a>
  </form>;
}
