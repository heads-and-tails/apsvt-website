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
    <p>Використовуйте погоджений обліковий запис. Завідувачі кафедр можуть ввести свою адресу й активувати доступ через безпечне посилання в пошті.</p>
    {isSupabaseConfigured() ? <LoginForm /> : <div className="auth-setup"><b>Підключення готується</b><p>Supabase ще не активовано для цього середовища. Публічний сайт продовжує працювати без змін.</p></div>}
    <p className="auth-security">Автоматично погоджуються лише заздалегідь визначені адреси завідувачів. Інші нові акаунти й надалі очікують рішення адміністратора.</p>
    <Link className="back-home" href="/">← Повернутися на сайт</Link>
  </div></main>;
}
