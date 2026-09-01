import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Вхід до редакційної панелі" };
export const dynamic = "force-dynamic";

type LoginPageProps = { searchParams: Promise<{ next?: string }> };

function safeNext(value?: string) {
  return value?.startsWith("/panel") && !value.startsWith("//") ? value : "/panel";
}

export default async function EditorialLoginPage({ searchParams }: LoginPageProps) {
  const nextPath = safeNext((await searchParams).next);
  if (isSupabaseConfigured() && await getAuthenticatedUser()) redirect(nextPath);

  return <main className="auth-page"><div className="auth-card editorial-auth-card">
    <span className="auth-mark">АП</span><span className="kicker blue">Редакційний доступ</span>
    <h1>Вхід до панелі</h1>
    <p>Введіть погоджену електронну адресу та пароль. Для нового акаунта адміністратор надсилає безпечний лист активації; також можна увійти за одноразовим посиланням.</p>
    {isSupabaseConfigured() ? <LoginForm nextPath={nextPath} /> : <div className="auth-setup"><b>Підключення готується</b><p>Supabase ще не активовано для цього середовища. Публічний сайт продовжує працювати без змін.</p></div>}
    <p className="auth-security">Акаунти створює та погоджує адміністратор. Самостійна реєстрація вимкнена, щоб редакційні матеріали залишалися захищеними.</p>
    <Link className="back-home" href="/">← Повернутися на сайт</Link>
  </div></main>;
}
