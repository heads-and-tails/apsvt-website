import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ExamScheduleBrowser } from "./ExamScheduleBrowser";
import { getPublicContent } from "@/lib/content";

export const metadata: Metadata = { title: "Графік сесії", description: "Таблиця іспитів і заліків АПСВТ за факультетом та курсом." };
export const dynamic = "force-dynamic";
export default async function Page() {
  const exams = (await getPublicContent("exam")).map((item) => item.payload) as import("./ExamScheduleBrowser").Exam[];
  return <main id="top"><SiteHeader /><section className="phero"><div className="wrap"><div className="crumb">Студенту / Розклад / Сесія</div><h1>Графік<br />зимової сесії</h1><p className="lead">Іспити, заліки, викладачі, аудиторії та онлайн-формат в одній таблиці.</p></div></section><div className="phero-rule" /><section><div className="wrap"><div className="schedule-note"><span>Актуальний графік · 2026/27</span><p>Дати, час і місце проведення підтримує редакція Академії. Оновлення в таблиці мають пріоритет.</p></div><ExamScheduleBrowser exams={exams} /></div></section><section className="soft"><div className="wrap split"><div className="copy"><div className="idx">Підготовка</div><h2>До початку контролю</h2><p className="lead">Перевірте допуск, виконайте обов’язкові роботи й уточніть формат консультації у викладача.</p><Link className="cta dark" href="/schedule"><span>Повернутися до розкладу</span></Link></div><div className="panel"><h3>Важливо</h3><ul><li><span className="y">01</span>Приходьте за 15 хвилин</li><li><span className="y">02</span>Майте документ або студентський</li><li><span className="y">03</span>Для онлайн-іспиту перевірте камеру</li></ul></div></div></section><SiteFooter /></main>;
}
