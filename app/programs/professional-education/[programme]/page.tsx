import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { PageDocuments } from "@/app/components/PageDocuments";
import { EditableAcademicSections } from "@/app/components/EditableAcademicSections";
import { getDepartmentEntries } from "@/lib/department-content";
import { digitalDepartmentPath, digitalDepartmentTitle, professionalEducationProgrammes, professionalEducationSections } from "@/lib/professional-education";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ programme: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { programme } = await params;
  const page = professionalEducationProgrammes.find((item) => item.slug === programme);
  return { title: page ? `${page.title} · ${page.degree}` : "Сторінку не знайдено" };
}

export default async function Page({ params }: Props) {
  const { programme } = await params;
  const page = professionalEducationProgrammes.find((item) => item.slug === programme);
  if (!page) notFound();
  const entries = await getDepartmentEntries(page.path);
  const hero = entries.find((entry) => entry.entryType === "hero");
  return <main id="top" data-page-materials-server="true" data-editorial-hero-server="true"><SiteHeader />
    <section className="faculty-subpage-hero professional-programme-hero"><div className="wrap">
      <nav aria-label="Навігаційний ланцюжок"><Link href="/departments">Кафедри</Link><span> / </span><Link href={digitalDepartmentPath}>{digitalDepartmentTitle}</Link><span> / {page.degree}</span></nav>
      <span className="professional-degree">{page.degree}</span><h1>{hero?.title || page.title}</h1><p>{page.level}</p>
      {hero?.summary && <p>{hero.summary}</p>}{hero?.imageUrl && <img className="academic-editorial-cover" src={hero.imageUrl} alt={hero.imageAlt || hero.title} />}
      <Link href={`${digitalDepartmentPath}#programmes`}>← Усі освітні програми кафедри</Link>
    </div></section>
    <details className="wrap faculty-sibling-nav"><summary>Інші програми та рівні освіти</summary><nav className="faculty-subpage-links" aria-label="Інші освітні програми">{professionalEducationProgrammes.map((item) => <Link href={item.path} aria-current={item.slug === page.slug ? "page" : undefined} key={item.slug}>{item.title} · {item.degree}</Link>)}</nav></details>
    <EditableAcademicSections sections={professionalEducationSections} entries={entries} pagePath={page.path} content={{
      overview: <div className="wrap"><p>{page.title}</p><p>{page.level} · {page.degree}</p></div>,
      "programme-documents": <>{page.document && <div className="wrap"><a className="academic-inline-link" href={page.document} target="_blank" rel="noreferrer">Чинна освітня програма · {page.degree} · PDF ↗</a></div>}<PageDocuments pagePath={page.path} includeCategoryPrefixes={["Освітня програма", "ОПП", "ОНП"]} title="Освітні програми за роками" description="Редакції освітньої програми згруповано за роком затвердження або вступу." emptyMessage={page.document ? undefined : "Освітні програми за роками ще не оприлюднено."} /></>,
      curriculum: <PageDocuments pagePath={page.path} includeCategoryPrefixes={["Навчальний план"]} title="Навчальні плани за роками" description="Для кожного року можна опублікувати окремий навчальний план." emptyMessage="Навчальні плани за роками ще не оприлюднено." />,
      admissions: <div className="wrap"><Link className="academic-inline-link" href={page.slug === "phd" ? "/research/postgraduate-doctoral#admission" : "/admissions"}>Загальна інформація щодо вступу →</Link></div>,
      documents: <PageDocuments pagePath={page.path} excludeCategoryPrefixes={["Освітня програма", "ОПП", "ОНП", "Навчальний план"]} emptyMessage="Інші документи ще не оприлюднено." />,
    }} />
    <SiteFooter />
  </main>;
}
