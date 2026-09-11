import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { PageDocuments } from "@/app/components/PageDocuments";
import { EditableAcademicSections } from "@/app/components/EditableAcademicSections";
import { getDepartmentEntries } from "@/lib/department-content";
import { digitalDepartmentPath, digitalDepartmentTitle, professionalEducationPath, professionalEducationProgrammes, professionalEducationSections } from "@/lib/professional-education";

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
  return <main id="top" data-page-materials-server="true"><SiteHeader />
    <section className="faculty-subpage-hero professional-programme-hero"><div className="wrap">
      <nav aria-label="Навігаційний ланцюжок"><Link href="/programs">Освітні програми</Link><span> / </span><Link href={`${professionalEducationPath}#programme-levels`}>Професійна освіта</Link><span> / {page.degree}</span></nav>
      <span className="professional-degree">{page.degree}</span><h1>{page.title}</h1><p>{page.level}</p>
      <Link href={digitalDepartmentPath}>{digitalDepartmentTitle} →</Link>
    </div></section>
    <details className="wrap faculty-sibling-nav"><summary>Інші програми та рівні освіти</summary><nav className="faculty-subpage-links" aria-label="Інші освітні програми">{professionalEducationProgrammes.map((item) => <Link href={item.path} aria-current={item.slug === page.slug ? "page" : undefined} key={item.slug}>{item.title} · {item.degree}</Link>)}</nav></details>
    <EditableAcademicSections sections={professionalEducationSections} entries={entries} pagePath={page.path} content={{
      overview: <div className="wrap"><p>{page.title}</p><p>{page.level} · {page.degree}</p></div>,
      ...(page.document ? { "programme-documents": <div className="wrap"><a className="academic-inline-link" href={page.document} target="_blank" rel="noreferrer">{page.title} · {page.degree} · PDF ↗</a></div> } : {}),
      admissions: <div className="wrap"><Link className="academic-inline-link" href={page.slug === "phd" ? "/research/postgraduate-doctoral#admission" : "/admissions"}>Загальна інформація щодо вступу →</Link></div>,
      documents: <PageDocuments pagePath={page.path} emptyMessage="Документи ще не оприлюднено." />,
    }} />
    <SiteFooter />
  </main>;
}
