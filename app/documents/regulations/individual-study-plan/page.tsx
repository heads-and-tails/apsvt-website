import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../../components/SiteHeader";
import { SiteFooter } from "../../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Положення про індивідуальний навчальний план",
  description: "Окрема сторінка положення АПСВТ про індивідуальний навчальний план студента, редакція 2019 року.",
};

const topics = [
  ["01", "Призначення плану", "Індивідуальний навчальний план фіксує освітню траєкторію студента та послідовність опанування компонентів програми."],
  ["02", "Формування", "План складають на основі освітньої програми, навчального плану та результатів вибору дисциплін студентом."],
  ["03", "Виконання", "У документі відображають навчальні дисципліни, практику, контрольні заходи та результати навчання."],
  ["04", "Відповідальність", "Студент і відповідальні працівники Академії контролюють виконання плану в межах своїх повноважень."],
];

export default function Page() {
  return <main id="top"><SiteHeader />
    <section className="regulation-detail-hero"><div className="wrap"><div className="crumb">Документи / Положення / Індивідуальний план</div><span className="resource-kicker">Архівна редакція · 2019</span><h1>Індивідуальний<br />навчальний план<br /><em>студента</em></h1><p>Сторінка допомагає швидко зрозуміти призначення документа. Повний офіційний текст доступний у PDF.</p><div className="regulation-hero-actions"><a className="cta" href="/documents/education/individual-study-plan-2019.pdf" target="_blank" rel="noreferrer"><span>Відкрити PDF ↗</span></a><Link className="back-link" href="/documents/regulations">Усі положення →</Link></div></div></section><div className="phero-rule" />
    <section className="regulation-summary"><div className="wrap resource-detail-layout"><div><div className="idx">01 / Про документ</div><h2>Для чого потрібен індивідуальний план</h2><p className="resource-lede">Це персональний робочий документ студента, який пов’язує вимоги освітньої програми з конкретним переліком дисциплін і результатами їх опанування.</p><p>Через індивідуальний план студент бачить обов’язкові й вибіркові компоненти своєї траєкторії. В актуальній цифровій практиці Академії інформація про план доступна в персональному електронному кабінеті.</p><Link className="back-link" href="/students/guide">Як користуватися електронним кабінетом →</Link></div><aside><span>Паспорт документа</span><dl><div><dt>Рік</dt><dd>2019</dd></div><div><dt>Обсяг</dt><dd>9 сторінок</dd></div><div><dt>Статус</dt><dd>Архів / довідково</dd></div><div><dt>Формат</dt><dd>PDF</dd></div></dl></aside></div></section>
    <section className="regulation-topics"><div className="wrap"><div className="resource-section-head"><div><div className="idx">02 / Коротко</div><h2>Що охоплює положення</h2></div><p>Стислий орієнтир не замінює повного тексту документа.</p></div><div className="regulation-topic-grid">{topics.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>
    <section className="document-download"><div className="wrap"><div><span>Повний текст</span><h2>Положення у редакції 2019 року</h2><p>Для офіційного посилання, цитування або детального ознайомлення відкрийте скан оригінального документа.</p></div><a href="/documents/education/individual-study-plan-2019.pdf" target="_blank" rel="noreferrer"><b>PDF</b><span>9 сторінок</span><strong>Відкрити документ ↗</strong></a></div></section>
    <SiteFooter />
  </main>;
}
