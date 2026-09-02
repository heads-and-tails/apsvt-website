import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ScheduleBrowser } from "./ScheduleBrowser";
import { ExamScheduleBrowser } from "../exam-schedule/ExamScheduleBrowser";
import { getPublicContent } from "@/lib/content";
import { getPublicDocuments } from "@/lib/documents";
import { ScheduleDocumentDirectory } from "./ScheduleDocumentDirectory";

export const metadata: Metadata = { title: "Розклад занять", description: "Зручний перегляд розкладу занять АПСВТ за факультетом, курсом і днем." };
export const dynamic = "force-dynamic";

export default async function Page() {
  const [lessonItems, examItems, scheduleDocuments] = await Promise.all([getPublicContent("lesson"), getPublicContent("exam"), getPublicDocuments("/schedule")]);
  const lessons = lessonItems.map((item) => item.payload) as import("./ScheduleBrowser").Lesson[];
  const exams = examItems.map((item) => item.payload) as import("../exam-schedule/ExamScheduleBrowser").Exam[];
  return <main id="top"><SiteHeader /><section className="phero"><div className="wrap"><div className="crumb">Головна / Студенту / Розклад</div><h1>Розклад<br />занять</h1><p className="lead">Графік навчального процесу, заняття, заліки й іспити для 2026/27 навчального року — за формою, семестром і курсом.</p><Link className="cta" href="#documents-by-course"><span>Обрати свій курс</span></Link></div></section><div className="phero-rule" /><ScheduleDocumentDirectory documents={scheduleDocuments} /><section id="live-schedule"><div className="wrap"><div className="schedule-note"><span>Інтерактивний розклад</span><p>Розклад оновлюється редакцією Академії. Перед відвідуванням пари перевіряйте дату, аудиторію та можливі зміни.</p></div><ScheduleBrowser lessons={lessons} /></div></section><section className="soft" id="session"><div className="wrap"><div className="sec-head"><div><div className="idx">03 / Зимова сесія 2026/27</div><h2>Графік іспитів і заліків</h2></div><p>Оберіть факультет і курс. Дати й аудиторії оновлюються через редакційну панель.</p></div><ExamScheduleBrowser exams={exams} /></div></section><section><div className="wrap split"><div className="copy"><div className="idx">Навчальний рік</div><h2>Плануйте семестр цілісно</h2><p className="lead">Початок модулів, сесії, практика та канікули зібрані в окремому календарі.</p><Link className="cta dark" href="/academic-calendar"><span>Відкрити план року</span></Link></div><div className="panel"><h3>Як читати розклад</h3><ul><li><span className="y">01</span>Оновлення деканату має пріоритет</li><li><span className="y">02</span>Онлайн-пара позначається окремо</li><li><span className="y">03</span>Заміни з’являються у студентській платформі</li></ul></div></div></section><SiteFooter /></main>;
}
