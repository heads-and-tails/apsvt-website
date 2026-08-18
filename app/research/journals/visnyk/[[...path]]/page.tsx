import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";

export const metadata: Metadata = {
  title: "Вісник АПСВТ: економіка, психологія та управління",
  description: "Офіційні відомості про електронний науково-практичний журнал АПСВТ станом на 2025 рік.",
};

const specialties = [
  ["C1", "Економіка"],
  ["C4", "Психологія"],
  ["D2", "Фінанси, банківська справа, страхування та фондовий ринок"],
  ["D3", "Менеджмент"],
];

const indexes = ["Національна бібліотека України ім. В. І. Вернадського", "Google Scholar", "Index Copernicus", "Crossref", "OUCI"];

export default function JournalPage() {
  return <main id="top" className="visnyk-page">
    <SiteHeader />
    <section className="visnyk-hero"><div className="wrap visnyk-hero-grid">
      <div className="visnyk-cover-wrap"><img src="/journals/visnyk-cover-2025.jpg" alt="Обкладинка Вісника Академії праці, соціальних відносин і туризму" /><span>ISSN 3041-2390 · Online</span></div>
      <div className="visnyk-hero-copy"><Link href="/research/journals">← Усі наукові видання</Link><span>Фахове видання · категорія «Б» · 2025</span><h1>Вісник Академії праці, соціальних відносин і туризму</h1><p>Серія: економіка, психологія та управління</p><div className="visnyk-actions"><a className="cta" href="https://www.alsrt.com.ua/index.php/economics/main" target="_blank" rel="noreferrer"><span>Офіційний сайт журналу ↗</span></a><a href="https://www.alsrt.com.ua/index.php/economics/issue/archive" target="_blank" rel="noreferrer">Архів випусків ↗</a></div></div>
    </div></section><div className="hero-rule" />

    <section className="visnyk-status"><div className="wrap">
      <div className="sec-head"><div><div className="idx">01 / Статус видання</div><h2>Офіційні відомості на 2025 рік</h2></div><p>Електронний науково-практичний журнал засновано у 2024 році Академією спільно з Науково-освітнім інноваційним центром суспільних трансформацій у Чернігові.</p></div>
      <div className="visnyk-facts"><article><b>Б</b><span>категорія фахового видання</span><small>Наказ МОН України від 24.02.2025 № 349</small></article><article><b>4</b><span>випуски на рік</span><small>українською та англійською мовами</small></article><article><b>10.54929</b><span>префікс DOI</span><small>ідентифікація матеріалів через Crossref</small></article><article><b>2</b><span>галузі знань</span><small>C — соціальні науки; D — бізнес, адміністрування та право</small></article></div>
    </div></section>

    <section className="soft"><div className="wrap">
      <div className="sec-head"><div><div className="idx">02 / Спеціальності</div><h2>Чотири підтверджені напрями</h2></div><p>Перелік відтворено за офіційною сторінкою журналу та наказом, зазначеним редакцією.</p></div>
      <div className="specialty-grid visnyk-specialties">{specialties.map(([code, title], index) => <article key={code}><span>{String(index + 1).padStart(2, "0")}</span><div><b>{code}</b><p>{title}</p></div></article>)}</div>
    </div></section>

    <section><div className="wrap visnyk-scope-grid"><div><div className="idx">03 / Тематика</div><h2>Що публікує журнал</h2><p className="program-lede">Фундаментальні та прикладні дослідження з економіки, психології, фінансів, банківської справи, страхування, фондового ринку й менеджменту.</p><p>Окремі рубрики висвітлюють підприємництво, торгівлю, біржову діяльність, наукове життя, економічну освіту, а також рецензії на нові видання.</p></div><aside className="visnyk-review"><span>Редакційна політика</span><h3>Подвійне сліпе рецензування</h3><p>Автор і рецензенти не бачать даних одне одного. Такий формат зменшує упередження й підтримує академічну доброчесність.</p><a href="mailto:editor_economics@alsrt.com.ua">editor_economics@alsrt.com.ua ↗</a></aside></div></section>

    <section className="visnyk-indexing"><div className="wrap"><div className="sec-head"><div><div className="idx">04 / Індексування</div><h2>Видимість наукових матеріалів</h2></div></div><div>{indexes.map((item, index) => <span key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}</span>)}</div><p className="visnyk-source-note">Відомості актуалізовано за архівною копією офіційної сторінки від 2 березня 2026 року, яка описує статус видання у 2025 році. Обкладинку збережено локально з тієї самої копії.</p></div></section>
    <SiteFooter />
  </main>;
}
