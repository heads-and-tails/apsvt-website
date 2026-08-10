import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Аспірантура та докторантура",
  description: "Вступ до аспірантури й докторантури АПСВТ у 2026 році: накази, строки та вартість навчання.",
};

const documents = [
  ["Наказ про набір до аспірантури у 2026 році", "/documents/research/postgraduate-doctoral/2026/phd-enrollment-order-2026.pdf", "PDF · 2 сторінки"],
  ["Строки реєстрації заяв, вступні випробування, конкурсний відбір і спеціальні умови вступу", "/documents/research/postgraduate-doctoral/2026/phd-admission-dates-and-selection-2026.pdf", "PDF · 3 сторінки"],
  ["Вартість навчання в аспірантурі у 2026 році", "/documents/research/postgraduate-doctoral/2026/phd-tuition-2026.pdf", "PDF · 1 сторінка"],
  ["Про відкриття докторантури в Академії у 2026 році", "/documents/research/postgraduate-doctoral/2026/doctoral-programme-opening-2026.pdf", "PDF · 2 сторінки"],
  ["Вартість навчання в докторантурі у 2026 році", "/documents/research/postgraduate-doctoral/2026/doctoral-tuition-2026.pdf", "PDF · 1 сторінка"],
] as const;

export default function Page() {
  return <main id="top"><SiteHeader />
    <section className="phero"><div className="wrap"><div className="crumb">Наука / Аспірантура та докторантура</div><h1>Третій рівень<br />наукової освіти</h1><p className="lead">Офіційні документи вступної кампанії 2026 року для здобувачів ступеня доктора філософії та доктора наук.</p></div></section><div className="phero-rule" />
    <section><div className="wrap research-page-intro"><div><div className="idx">01 / Вступ 2026</div><h2>Аспірантура та докторантура</h2></div><div><p>У цьому розділі зібрано накази, строки реєстрації та вступних випробувань, умови конкурсного відбору й затверджену вартість навчання.</p><Link className="sec-link" href="/programs#doctoral-programmes">Освітньо-наукові програми →</Link></div></div></section>
    <section className="soft"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Документи</div><h2>Вступна кампанія</h2></div><p>Кожен документ відкривається окремо у форматі PDF.</p></div><div className="official-materials research-official-materials">{documents.map(([title, href, meta], index) => <a href={href} target="_blank" rel="noreferrer" key={href}><span>{String(index + 1).padStart(2, "0")} · {meta}</span><b>{title}</b><strong>↗</strong></a>)}</div></div></section>
    <SiteFooter />
  </main>;
}
