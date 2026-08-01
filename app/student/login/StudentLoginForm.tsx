"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function StudentLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("Не вдалося увійти. Перевірте пошту й пароль або скористайтеся безпечним посиланням.");
      setBusy(false);
      return;
    }
    router.replace("/student");
    router.refresh();
  }

  async function sendMagicLink() {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage("Спочатку введіть електронну пошту, яку Академія прив’язала до вашого кабінету.");
      return;
    }
    setBusy(true);
    setMessage("");
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/student`,
      },
    });
    setMessage(error
      ? "Посилання не надіслано. Перевірте, чи Академія вже активувала ваш кабінет, або зверніться до деканату."
      : "Перевірте пошту: ми надіслали безпечне посилання для входу.");
    setBusy(false);
  }

  return <form className="editorial-login" onSubmit={signIn}>
    <label>Електронна пошта студента<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="student@example.com" /></label>
    <label>Пароль<input type="password" autoComplete="current-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Ваш пароль" /></label>
    {message && <p className="auth-error" role="status">{message}</p>}
    <button disabled={busy} type="submit">{busy ? "Перевіряємо…" : "Увійти до кабінету →"}</button>
    <button className="auth-activate" disabled={busy || !email} type="button" onClick={() => void sendMagicLink()}>Отримати безпечне посилання на пошту</button>
  </form>;
}
