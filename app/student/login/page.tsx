import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { StudentLoginForm } from "./StudentLoginForm";

export const metadata: Metadata = { title: "Вхід до кабінету студента" };
export const dynamic = "force-dynamic";

export default async function StudentLoginPage() {
  if (isSupabaseConfigured() && await getAuthenticatedUser()) redirect("/student");
  return <main className="auth-page"><div className="auth-card editorial-auth-card">
    <span className="auth-mark">АС</span><span className="kicker blue">Особистий кабінет</span>
    <h1>Вхід студента</h1>
    <p>У кабінеті доступні нарахування, підтверджені оплати, прострочення, повідомлення та особисті договори.</p>
    {isSupabaseConfigured()
      ? <StudentLoginForm />
      : <div className="auth-setup"><b>Кабінет тимчасово недоступний</b><p>Спробуйте пізніше або зверніться до деканату.</p></div>}
    <p className="auth-security">Дані кабінету бачите тільки ви. Для входу використовуйте адресу, яку повідомили Академії.</p>
    <Link className="back-home" href="/students">← Повернутися до студентського простору</Link>
  </div></main>;
}
