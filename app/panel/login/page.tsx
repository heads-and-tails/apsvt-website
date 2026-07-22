import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Вхід до редакційної панелі" };
export const dynamic = "force-dynamic";

export default async function EditorialLoginPage() {
  if (isSupabaseConfigured() && await getAuthenticatedUser()) redirect("/panel");

  return <main className="auth-page"><div className="auth-card editorial-auth-card">
    <span className="auth-mark">АП</span><span className="kicker blue">Редакційний доступ</span>
    <h1>Вхід до панелі</h1>
    <p>Використовуйте обліковий запис, який запросив і погодив адміністратор Академії.</p>
    {isSupabaseConfigured() ? <LoginForm /> : <div className="auth-setup"><b>Підключення готується</b><p>Supabase ще не активовано для цього середовища. Публічний сайт продовжує працювати без змін.</p></div>}
    <p className="auth-security">Нові акаунти не отримують доступ автоматично. Після запрошення адміністратор має погодити роль редактора.</p>
    <Link className="back-home" href="/">← Повернутися на сайт</Link>
  </div></main>;
}
