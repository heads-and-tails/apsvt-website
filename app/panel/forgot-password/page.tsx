import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = { title: "Відновлення пароля" };

export default function ForgotPasswordPage() {
  return <main className="auth-page"><div className="auth-card editorial-auth-card">
    <span className="auth-mark">АП</span><span className="kicker blue">Відновлення доступу</span>
    <h1>Забули пароль?</h1>
    <p>Вкажіть робочу електронну адресу. Ми надішлемо безпечне посилання для створення нового пароля.</p>
    <ForgotPasswordForm />
    <Link className="back-home" href="/panel/login">← Повернутися до входу</Link>
  </div></main>;
}
