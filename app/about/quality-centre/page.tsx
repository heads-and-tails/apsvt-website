import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { qualityCentre } from "@/lib/quality-centre";

export const metadata: Metadata = {
  title: qualityCentre.title,
  description: `${qualityCentre.title}. Керівник — ${qualityCentre.headName}.`,
};

export default function QualityCentrePage() {
  return <main id="top"><SiteHeader englishHref="/en/about" />
    <section className="detail-hero"><div className="wrap">
      <div className="crumb">Головна / Про Академію / Центр якості</div>
      <h1>{qualityCentre.title}</h1>
    </div></section>
    <section className="deep-content"><div className="wrap">
      <div className="deep-intro"><h2>Керівник центру</h2><div><h3>{qualityCentre.headName}</h3></div></div>
      <div className="deep-intro"><h2>Документи центру</h2><div className="programme-document-list">
        <a href={qualityCentre.regulations.href} target="_blank" rel="noopener noreferrer">
          <span>01</span><div><small>PDF · {qualityCentre.regulations.pages} сторінки</small><h3>{qualityCentre.regulations.title}</h3></div><b aria-hidden="true">↗</b>
        </a>
      </div></div>
      <a className="back-link" href="/about#structure">← Структура Академії</a>
    </div></section>
    <SiteFooter />
  </main>;
}
