import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser, getEditorialProfiles, getPublisher } from "@/lib/auth";
import { getPosts } from "@/lib/data";
import { getAllContent } from "@/lib/content";
import { getAllDocuments } from "@/lib/documents";
import { canEditPage, contentKindPagePath } from "@/lib/editorial-access";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PanelEditor } from "./PanelEditor";

export const metadata: Metadata = { title: "Редакційна панель" };
export const dynamic = "force-dynamic";

function SignOutButton() {
  return <form action="/auth/signout" method="post"><button className="auth-signout" type="submit">Вийти з акаунта</button></form>;
}

export default async function PanelPage() {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV !== "development") {
      return <main className="auth-page"><div className="auth-card"><span className="auth-mark">АП</span><span className="kicker blue">Редакційний доступ</span><h1>Панель готується</h1><p>Безпечне підключення Supabase ще не активовано у Vercel. Публічний сайт працює без змін.</p><Link className="back-home" href="/">← Повернутися на сайт</Link></div></main>;
    }
  }

  const user = await getAuthenticatedUser();
  if (isSupabaseConfigured() && !user) redirect("/panel/login");

  const publisher = await getPublisher();
  if (!publisher) {
    return <main className="auth-page"><div className="auth-card"><span className="auth-mark">АП</span><span className="kicker blue">Очікує погодження</span><h1>Запит отримано</h1><p>Акаунт <b>{user?.email}</b> успішно створено, але ще не має доступу до редакційної панелі. Адміністратор має погодити його та призначити роль.</p><SignOutButton/><Link className="back-home" href="/">← Повернутися на сайт</Link></div></main>;
  }

  const [allPosts, allContent, allDocuments, profiles] = await Promise.all([
    getPosts({ includeDrafts: true, limit: 100 }),
    getAllContent(),
    getAllDocuments(),
    publisher.role === "admin" ? getEditorialProfiles() : Promise.resolve([]),
  ]);
  const posts = canEditPage(publisher, "/news") ? allPosts : [];
  const content = allContent.filter((item) => canEditPage(publisher, contentKindPagePath[item.kind]));
  const documents = allDocuments.filter((document) => canEditPage(publisher, document.pagePath));

  return <PanelEditor initialPosts={posts} initialContent={content} initialDocuments={documents} publisher={publisher} initialProfiles={profiles} />;
}
