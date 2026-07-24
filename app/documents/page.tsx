import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { DocumentsCatalogue } from "./DocumentsCatalogue";
import { DocumentsAssistant } from "./DocumentsAssistant";
import { documentCategories, documentStats } from "@/lib/official-documents";

export const metadata: Metadata = {
  title: "Документи",
  description: "Ключові офіційні документи АПСВТ за розділами з пошуком і RAG-помічником, який посилається на джерела.",
};

export default function Page() {
  return <main id="top">
    <SiteHeader />
    <section className="documents-hero">
      <div className="wrap">
        <div className="crumb">Головна / Документи</div>
        <div className="documents-hero-grid">
          <div><span className="documents-kicker">Офіційний каталог АПСВТ</span><h1>Документи.<br /><em>Зрозуміло.</em></h1><p>Вступ, навчання, права студентів, доброчесність, ліцензії та оплата — у впорядкованому каталозі з пошуком за змістом.</p><div className="documents-hero-actions"><a className="cta" href="#catalogue"><span>Перейти до каталогу</span></a><a className="cta ghost" href="#assistant"><span>Запитати помічника</span></a></div></div>
          <aside>
            <span>У каталозі</span>
            <b>{documentStats.documents}</b>
            <p>ключових офіційних документів</p>
            <div><strong>{documentStats.categories}</strong><small>тематичних розділів</small></div>
            <div><strong>{documentStats.searchableDocuments}</strong><small>повнотекстових джерел</small></div>
          </aside>
        </div>
      </div>
    </section>
    <div className="phero-rule" />

    <section className="documents-map"><div className="wrap">
      <div className="documents-map-head"><div className="idx">01 / Структура</div><h2>Оберіть напрям</h2></div>
      <div className="documents-map-grid">{documentCategories.map((category) => <a href={`#${category.id}`} key={category.id}><span>{category.number}</span><div><b>{category.title}</b><p>{category.description}</p></div><i>↓</i></a>)}</div>
    </div></section>

    <DocumentsCatalogue />
    <DocumentsAssistant />
    <SiteFooter />
  </main>;
}
