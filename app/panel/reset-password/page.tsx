import type { Metadata } from "next";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = { title: "Новий пароль" };
export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return <main className="auth-page"><div className="auth-card editorial-auth-card">
    <span className="auth-mark">АП</span><span className="kicker blue">Відновлення доступу</span>
    <h1>Новий пароль</h1>
    <p>Створіть новий пароль щонайменше з восьми символів.</p>
    <ResetPasswordForm />
  </div></main>;
}
