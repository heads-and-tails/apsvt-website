import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { getPublicDocuments } from "@/lib/documents";
import { ScheduleDocumentDirectory } from "./ScheduleDocumentDirectory";

export const metadata: Metadata = { title: "Розклад занять", description: "Зручний перегляд розкладу занять АПСВТ за факультетом, курсом і днем." };
export const dynamic = "force-dynamic";

export default async function Page() {
  const scheduleDocuments = await getPublicDocuments("/schedule");
  return <main id="top"><SiteHeader /><section className="phero"><div className="wrap"><div className="crumb">Головна / Студенту / Розклад</div><h1>Розклад<br />занять</h1><p className="lead">Графік навчального процесу, розклад занять, заліків та іспитів для 2026/27 навчального року — за формою, семестром і курсом.</p><Link className="cta" href="#documents-by-course"><span>Обрати свій курс</span></Link></div></section><div className="phero-rule" /><ScheduleDocumentDirectory documents={scheduleDocuments} /><section><div className="wrap split"><div className="copy"><div className="idx">Навчальний рік</div><h2>Офіційні навчальні ресурси</h2><p className="lead">Початок модулів, сесії, практика та канікули зібрані в календарі, а навчальні курси й завдання — у Moodle.</p><div className="schedule-resource-actions"><Link className="cta dark" href="/academic-calendar"><span>Відкрити план року</span></Link><a className="cta" href="https://moodle.socosvita.kiev.ua/" target="_blank" rel="noreferrer"><span>Moodle АПСВТ ↗</span></a></div></div><div className="panel"><h3>Як користуватися файлами</h3><ul><li><span className="y">01</span>Оберіть тип графіка</li><li><span className="y">02</span>Вкажіть форму навчання й семестр</li><li><span className="y">03</span>Відкрийте свій курс або рівень</li></ul></div></div></section><SiteFooter /></main>;
}
