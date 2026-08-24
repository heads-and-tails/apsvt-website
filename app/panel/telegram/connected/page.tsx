import type { Metadata } from "next";

export const metadata: Metadata = { title: "Telegram підключено" };

type ConnectedPageProps = { searchParams: Promise<{ status?: string }> };

export default async function TelegramConnectedPage({ searchParams }: ConnectedPageProps) {
  const success = (await searchParams).status === "success";
  return <main className="auth-page"><div className="auth-card editorial-auth-card telegram-connect-card"><span className="auth-mark">TG</span><span className="kicker blue">Telegram</span><h1>{success ? "Telegram підключено" : "Не вдалося підключити"}</h1><p>{success ? "Поверніться до Telegram — бот уже надіслав підтвердження та головне меню редакційних дій." : "Посилання застаріло або вже було використане. Запросіть нове командою /login у боті."}</p><a className="back-home" href="/panel">← До редакційної панелі</a></div></main>;
}
