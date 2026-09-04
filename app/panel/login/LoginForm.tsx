"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type LoginMode = "code" | "password";

export function LoginForm({ nextPath = "/panel" }: { nextPath?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("password");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function requestCode() {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage("Введіть робочу електронну пошту.");
      return;
    }
    setBusy(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });
    if (error) {
      setMessage("Акаунт із такою поштою не знайдено або надсилання тимчасово недоступне.");
    } else {
      setCodeSent(true);
      setMessage("Код входу надіслано на пошту. Він діє один раз і має 8 цифр.");
    }
    setBusy(false);
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault();
    if (!codeSent) {
      await requestCode();
      return;
    }
    if (!/^[0-9]{8}$/.test(code)) {
      setMessage("Введіть 8 цифр із листа.");
      return;
    }
    setBusy(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    if (error) {
      setMessage("Код недійсний або вже використаний. Запросіть новий код.");
      setBusy(false);
      return;
    }
    router.replace(nextPath);
    router.refresh();
  }

  async function signInWithPassword(event: React.FormEvent) {
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
    router.replace(nextPath);
    router.refresh();
  }

  function chooseMode(nextMode: LoginMode) {
    setMode(nextMode);
    setMessage("");
  }

  return <div className="editorial-login-wrap">
    <div className="editorial-login-tabs" role="tablist" aria-label="Спосіб входу">
      <button type="button" role="tab" aria-selected={mode === "password"} className={mode === "password" ? "active" : ""} onClick={() => chooseMode("password")}>Пароль</button>
      <button type="button" role="tab" aria-selected={mode === "code"} className={mode === "code" ? "active" : ""} onClick={() => chooseMode("code")}>Одноразовий код</button>
    </div>
    {mode === "code" ? <form className="editorial-login" onSubmit={verifyCode}>
      <label>Робоча електронна пошта<input type="email" autoComplete="email" required value={email} onChange={(event) => { setEmail(event.target.value); setCodeSent(false); setCode(""); }} placeholder="name@socosvita.kiev.ua" /></label>
      {codeSent && <label>Одноразовий код<input className="editorial-code-input" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{8}" maxLength={8} required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 8))} placeholder="00000000" /></label>}
      {message && <p className="auth-error" role="status">{message}</p>}
      <button disabled={busy} type="submit">{busy ? "Зачекайте…" : codeSent ? "Підтвердити код →" : "Отримати код →"}</button>
      {codeSent && <button className="auth-activate" disabled={busy} type="button" onClick={() => void requestCode()}>Надіслати новий код</button>}
    </form> : <form className="editorial-login" onSubmit={signInWithPassword}>
      <label>Робоча електронна пошта<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@socosvita.kiev.ua" /></label>
      <label>Пароль<input type="password" autoComplete="current-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Ваш пароль" /></label>
      {message && <p className="auth-error" role="alert">{message}</p>}
      <button disabled={busy} type="submit">{busy ? "Перевіряємо…" : "Увійти до панелі →"}</button>
      <a className="forgot-password-link" href="/panel/forgot-password">Забули пароль?</a>
    </form>}
  </div>;
}
