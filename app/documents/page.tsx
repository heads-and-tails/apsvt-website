import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { DocumentsCatalogue } from "./DocumentsCatalogue";
import { DocumentsAssistant } from "./DocumentsAssistant";
import { DocumentsMap } from "./DocumentsMap";
import { documentStats, officialDocuments } from "@/lib/official-documents";
import { getPublishedDocuments } from "@/lib/documents";
import { getPublishedDepartmentEntries } from "@/lib/department-content";
import { buildManagedDocumentCatalogue } from "@/lib/managed-document-catalogue";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Документи",
  description: "Ключові офіційні документи АПСВТ за розділами з пошуком і RAG-помічником, який посилається на джерела.",
};

export default async function Page() {
  const [pageDocuments, departmentEntries] = await Promise.all([
    getPublishedDocuments(),
    getPublishedDepartmentEntries(),
  ]);
  const managedDocuments = buildManagedDocumentCatalogue(pageDocuments, departmentEntries);
  const knownLinks = new Set(officialDocuments.map((document) => document.href.trim().toLocaleLowerCase("uk-UA")));
  const automaticDocuments = managedDocuments.filter((document) => !knownLinks.has(document.href.trim().toLocaleLowerCase("uk-UA")));
  const totalDocuments = officialDocuments.length + automaticDocuments.length;

  return <main id="top">
    <SiteHeader />
    <section className="documents-hero">
      <div className="wrap">
        <div className="crumb">Головна / Документи</div>
        <div className="documents-hero-grid">
          <div><span className="documents-kicker">Офіційний каталог АПСВТ</span><h1>Документи.<br /><em>Зрозуміло.</em></h1><p>Вступ, навчання, інклюзивність, якість освіти, акредитації та запобігання корупції — у єдиному каталозі з пошуком за змістом.</p><div className="documents-hero-actions"><a className="cta" href="#catalogue"><span>Перейти до каталогу</span></a><a className="cta ghost" href="#assistant"><span>Запитати помічника</span></a></div></div>
          <aside>
            <span>У каталозі</span>
            <b>{totalDocuments}</b>
            <p>ключових офіційних документів</p>
            <div><strong>{documentStats.categories}</strong><small>тематичних розділів</small></div>
            <div><strong>{documentStats.searchableDocuments}</strong><small>повнотекстових джерел</small></div>
          </aside>
        </div>
      </div>
    </section>
    <div className="phero-rule" />

    <DocumentsMap />

    <DocumentsCatalogue managedDocuments={automaticDocuments} />
    <DocumentsAssistant managedDocumentsCount={automaticDocuments.length} />
    <SiteFooter />
  </main>;
}
