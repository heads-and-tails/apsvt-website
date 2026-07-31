import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../../components/SiteHeader";
import { SiteFooter } from "../../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Положення про конкурс «Викладач року Академії»",
  description: "Окрема сторінка положення АПСВТ про конкурс професійної майстерності викладачів, редакція 2018 року.",
};

const topics = [
  ["01", "Мета конкурсу", "Підтримка професійного розвитку викладачів, поширення сильних освітніх практик і визнання педагогічної майстерності."],
  ["02", "Організація", "Документ визначає засади підготовки конкурсу, його учасників, етапи та відповідальних за проведення."],
  ["03", "Оцінювання", "Результати професійної діяльності розглядають за встановленими в положенні критеріями й процедурою."],
  ["04", "Підсумки", "Положення описує порядок визначення результатів, оформлення рішення та відзначення учасників."],
];

export default function Page() {
  return <main id="top"><SiteHeader />
    <section className="regulation-detail-hero teacher-regulation-hero"><div className="wrap"><div className="crumb">Документи / Положення / Викладач року</div><span className="resource-kicker">Довідкова редакція · 2018</span><h1>Викладач року<br /><em>Академії</em></h1><p>Окрема сторінка про внутрішній конкурс професійної майстерності та повний офіційний документ у PDF.</p><div className="regulation-hero-actions"><a className="cta" href="/documents/education/best-teacher-competition.pdf" target="_blank" rel="noreferrer"><span>Відкрити PDF ↗</span></a><Link className="back-link" href="/documents/regulations">Усі положення →</Link></div></div></section><div className="phero-rule" />
    <section className="regulation-summary"><div className="wrap resource-detail-layout"><div><div className="idx">01 / Про документ</div><h2>Професійна майстерність і визнання</h2><p className="resource-lede">Конкурс покликаний відзначати викладацьку працю, підтримувати розвиток освітніх практик і робити професійні досягнення видимими для академічної спільноти.</p><p>На цій сторінці подано короткий орієнтир. Умови участі, критерії та повна процедура визначаються оригінальним положенням.</p><Link className="back-link" href="/people">Викладачі Академії →</Link></div><aside><span>Паспорт документа</span><dl><div><dt>Рік</dt><dd>2018</dd></div><div><dt>Обсяг</dt><dd>10 сторінок</dd></div><div><dt>Статус</dt><dd>Довідково</dd></div><div><dt>Формат</dt><dd>PDF</dd></div></dl></aside></div></section>
    <section className="regulation-topics"><div className="wrap"><div className="resource-section-head"><div><div className="idx">02 / Коротко</div><h2>Логіка конкурсу</h2></div><p>Стислий огляд допомагає знайти потрібну частину повного документа.</p></div><div className="regulation-topic-grid">{topics.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>
    <section className="document-download"><div className="wrap"><div><span>Повний текст</span><h2>Положення про конкурс</h2><p>Відкрийте скан документа, щоб ознайомитися з усіма умовами, критеріями та організаційними процедурами.</p></div><a href="/documents/education/best-teacher-competition.pdf" target="_blank" rel="noreferrer"><b>PDF</b><span>10 сторінок</span><strong>Відкрити документ ↗</strong></a></div></section>
    <SiteFooter />
  </main>;
}
