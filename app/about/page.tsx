import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = { title: "Про Академію", description: "Історія, принципи та команда АПСВТ." };

const milestones = [
  ["1993", "Академія починає роботу як простір нової соціальної й трудової освіти."],
  ["2002", "З’являються міждисциплінарні програми права, економіки та соціальної роботи."],
  ["2016", "Міжнародні модулі та партнерства стають частиною навчальних траєкторій."],
  ["2026", "Академія переходить до персоналізованої цифрової моделі освіти."],
];

export default function AboutPage() {
  return <main id="top"><SiteHeader />
    <section className="page-hero about-hero"><div><span className="kicker blue">Про Академію</span><h1>Людяність —<br /><i>це стратегія.</i></h1><p>Ми навчаємо бачити за системами людей, за даними — рішення, а за професією — відповідальність.</p></div><div className="page-hero-image"><img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1800&q=92&auto=format&fit=crop" alt="Викладач працює зі студентами" /><span className="image-label">АПСВТ / 1993—2026</span></div></section>
    <section className="quote-band"><span>Наша місія</span><blockquote>«Освіта має не просто давати відповідь — вона має вчити ставити запитання, від яких змінюється суспільство».</blockquote></section>
    <section className="values section-pad"><div className="section-heading"><div><span className="kicker blue">Наші принципи</span><h2>Чотири опори<br /><i>Академії.</i></h2></div></div><div className="value-grid"><article><span>01</span><h3>Людяність</h3><p>Поважаємо гідність, досвід і унікальну траєкторію кожної людини.</p></article><article><span>02</span><h3>Дія</h3><p>Перетворюємо навчання на проєкти, практику й відчутний суспільний результат.</p></article><article><span>03</span><h3>Відкритість</h3><p>Будуємо партнерства між дисциплінами, країнами, бізнесом і громадами.</p></article><article><span>04</span><h3>Відповідальність</h3><p>Навчаємо приймати рішення та розуміти їхній вплив на інших.</p></article></div></section>
    <section className="timeline section-pad"><div className="timeline-title"><span className="kicker yellow">Історія у русі</span><h2>33 роки<br />вперед.</h2></div><div className="timeline-list">{milestones.map(([year, text]) => <div className="timeline-item" key={year}><b>{year}</b><p>{text}</p></div>)}</div></section>
    <section className="people section-pad"><div className="section-heading"><div><span className="kicker blue">Спільнота</span><h2>Люди, які<br /><i>створюють середовище.</i></h2></div></div><div className="people-grid"><article><img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&q=88&auto=format&fit=crop" alt="Викладачка" /><h3>Викладачі-практики</h3><p>Дослідники, юристи, економісти, психологи й управлінці, які працюють із реальними змінами.</p></article><article><img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1000&q=88&auto=format&fit=crop" alt="Студентська команда" /><h3>Студентські команди</h3><p>Спільноти, що запускають проєкти, допомагають громадам і формують голос Академії.</p></article><article><img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1000&q=88&auto=format&fit=crop" alt="Партнери Академії" /><h3>Партнери</h3><p>Університети, інституції та організації, з якими ми відкриваємо нові можливості.</p></article></div></section>
    <section className="inline-cta"><h2>Побачити Академію<br /><i>на власні очі.</i></h2><Link href="/admissions#consultation">Запланувати візит ↗</Link></section><SiteFooter /></main>;
}
