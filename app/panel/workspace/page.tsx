import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser, getPublisher } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getWorkspaceItems } from "@/lib/workspace";
import { WorkspaceDashboard } from "./WorkspaceDashboard";
import "./workspace.css";

export const metadata: Metadata = { title: "BytesLab × Академія" };
export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  if (!isSupabaseConfigured() && process.env.NODE_ENV !== "development") {
    return <main className="auth-page"><div className="auth-card"><span className="auth-mark">BL</span><h1>Простір готується</h1><p>Захищене підключення ще не активоване.</p><Link className="back-home" href="/">← На сайт</Link></div></main>;
  }
  const user = await getAuthenticatedUser();
  if (isSupabaseConfigured() && !user) redirect("/panel/login");
  const publisher = await getPublisher();
  if (!publisher) redirect("/panel");
  return <WorkspaceDashboard initialItems={await getWorkspaceItems()} publisher={publisher} />;
}
