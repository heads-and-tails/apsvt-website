import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthenticatedUser, getPublisher } from "@/lib/auth";
import { getTelegramLinkRequest } from "@/lib/telegram-editorial-store";

export const metadata: Metadata = { title: "Підключення Telegram" };
export const dynamic = "force-dynamic";

type ConnectPageProps = { searchParams: Promise<{ token?: string }> };

export default async function TelegramConnectPage({ searchParams }: ConnectPageProps) {
  const token = (await searchParams).token || "";
  const returnTo = `/panel/telegram/connect?token=${encodeURIComponent(token)}`;
  if (!await getAuthenticatedUser()) redirect(`/panel/login?next=${encodeURIComponent(returnTo)}`);
  const publisher = await getPublisher();
  if (!publisher) {
    return <main className="auth-page"><div className="auth-card editorial-auth-card"><span className="auth-mark">АП</span><span className="kicker blue">Telegram</span><h1>Доступ ще не погоджено</h1><p>Ваш акаунт існує, але адміністратор ще не надав йому доступ до редакційної панелі.</p><a className="back-home" href="/panel">← До панелі</a></div></main>;
  }
  if (publisher.mustChangePassword) redirect("/panel/reset-password?initial=1");
  const request = await getTelegramLinkRequest(token);
  if (!request) {
    return <main className="auth-page"><div className="auth-card editorial-auth-card"><span className="auth-mark">АП</span><span className="kicker blue">Telegram</span><h1>Посилання вже не діє</h1><p>Запросіть нове посилання командою <b>/login</b> або <b>/start</b> у Telegram-боті.</p><a className="back-home" href="/panel">← До редакційної панелі</a></div></main>;
  }
  const telegramName = request.username ? `@${request.username}` : request.firstName || `ID ${request.telegramUserId}`;
  return <main className="auth-page"><div className="auth-card editorial-auth-card telegram-connect-card">
    <span className="auth-mark">TG</span><span className="kicker blue">Захищене підключення</span>
    <h1>Підключити Telegram</h1>
    <p>Редакційний акаунт <b>{publisher.email}</b> буде прив’язано до Telegram <b>{telegramName}</b>. Бот успадкує лише дозволені для цього акаунта сторінки та роль.</p>
    <div className="telegram-connect-safety"><b>Пароль не передається боту</b><span>Вхід уже перевірено на сайті. Прив’язку можна будь-коли скасувати командою /logout.</span></div>
    <form action="/api/editorial/telegram/connect" method="post"><input type="hidden" name="token" value={token} /><button type="submit">Підтвердити підключення →</button></form>
    <a className="back-home" href="/panel">Скасувати</a>
  </div></main>;
}
