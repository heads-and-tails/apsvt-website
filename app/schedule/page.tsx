import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ScheduleBrowser } from "./ScheduleBrowser";

export const metadata: Metadata = { title: "Розклад занять", description: "Зручний перегляд розкладу занять АПСВТ за факультетом, курсом і днем." };

export default function Page() { return <main id="top"><SiteHeader /><section className="phero"><div className="wrap"><div className="crumb">Головна / Студенту / Розклад</div><h1>Розклад<br />занять</h1><p className="lead">Один екран для пар, аудиторій і навчального тижня. Оберіть факультет, курс і день.</p></div></section><div className="phero-rule" /><section><div className="wrap"><div className="schedule-note"><span>Демонстраційна версія</span><p>Структуру підготовлено для оперативного оновлення деканатами. Наведені заняття є прикладом інтерфейсу; перед відвідуванням пари звіряйте інформацію у студентській платформі.</p></div><ScheduleBrowser /></div></section><section className="soft"><div className="wrap split"><div className="copy"><div className="idx">Навчальний рік</div><h2>Плануйте семестр цілісно</h2><p className="lead">Початок модулів, сесії, практика та канікули зібрані в окремому календарі.</p><Link className="cta dark" href="/academic-calendar"><span>Відкрити план року</span></Link></div><div className="panel"><h3>Як читати розклад</h3><ul><li><span className="y">01</span>Оновлення деканату має пріоритет</li><li><span className="y">02</span>Онлайн-пара позначається окремо</li><li><span className="y">03</span>Заміни з’являються у студентській платформі</li></ul></div></div></section><SiteFooter /></main> }
