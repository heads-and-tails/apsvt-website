import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lawFacultyPath, lawFacultySubpages, lawFacultyStructure } from "@/lib/law-faculty-structure";
import { getDepartmentEntries } from "@/lib/department-content";
import { getPublicContent } from "@/lib/content";
import { getPublicDocuments } from "@/lib/documents";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { DepartmentEditorialContent } from "@/app/components/DepartmentEditorialContent";
import { PageDocuments } from "@/app/components/PageDocuments";
import { ThesesCatalogue } from "@/app/research/theses/ThesesCatalogue";
import { getPublicAdministrationPublication } from "@/lib/public-administration-materials";
import { lawFacultyProgrammes } from "@/lib/law-faculty-programmes";
import { LawFacultyProgramme } from "@/app/components/LawFacultyProgramme";
import { lawFacultyAccreditationDocuments, lawFacultyAccreditationPath, lawMasterProgrammePath } from "@/lib/law-faculty-accreditation";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ section: string; subsection: string }> };
const findPage = (section: string, subsection: string) => lawFacultySubpages.find((page) => page.sectionId === section && page.id === subsection);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section, subsection } = await params;
  const page = findPage(section, subsection);
  return { title: page ? `${page.title} · ${page.parentTitle} · Юридичний факультет` : "Сторінку не знайдено" };
}

export default async function Page({ params }: Props) {
  const { section, subsection } = await params;
  const page = findPage(section, subsection);
  if (!page) notFound();
  const isAccreditationPage = page.path === lawFacultyAccreditationPath;
  const [entries, documents, programmeDocuments] = await Promise.all([
    getDepartmentEntries(page.path), getPublicDocuments(page.path),
    isAccreditationPage ? getPublicDocuments(lawMasterProgrammePath) : Promise.resolve([]),
  ]);
  const accreditationDocuments = isAccreditationPage ? lawFacultyAccreditationDocuments(documents, programmeDocuments) : [];
  const visibleEntries = entries.filter((entry) => !["hero", "override"].includes(entry.entryType));
  const siblings = lawFacultyStructure.find((item) => item.id === section)!.children;
  const programme = subsection === "law" ? "law" : "public-administration";
  const programmePage = lawFacultyProgrammes.find((programme) => programme.id === subsection);
  const publication = section === "faculty-programmes" ? getPublicAdministrationPublication(subsection) : undefined;
  const theses = section === "faculty-repository" ? (await getPublicContent("student_thesis")).filter(({ payload }) => programme === "law" ? /(?:D8|081|право)/i.test(payload.program || "") : /(?:D4|281|публічн)/i.test(payload.program || "")) : [];
  return <main id="top" data-page-materials-server="true"><SiteHeader englishHref={isAccreditationPage ? "/en/programs/law" : section === "faculty-programmes" ? "/en/programs/law#education-levels" : undefined} />
    <section className="faculty-subpage-hero"><div className="wrap">
      <nav aria-label="Навігаційний ланцюжок"><Link href={lawFacultyPath}>Юридичний факультет</Link><span> / </span><Link href={`${lawFacultyPath}#${section}`}>{page.parentTitle}</Link><span> / {page.title}</span></nav>
      <h1>{page.title}</h1><Link href={`${lawFacultyPath}#${section}`}>← {page.parentTitle}</Link>
    </div></section>
    <details className="wrap faculty-sibling-nav"><summary>Інші підрозділи · {page.parentTitle}</summary><nav className="faculty-subpage-links" aria-label={page.parentTitle}>{siblings.map(([id, title]) => <Link href={`${lawFacultyPath}/${section}/${id}`} aria-current={id === subsection ? "page" : undefined} key={id}>{title}</Link>)}</nav></details>
    <section className="faculty-subpage-content" id="content">
      {section === "faculty-programmes" && programmePage ? <LawFacultyProgramme programme={programmePage} publication={publication} entries={visibleEntries} documents={documents} /> : <>
      <div className="wrap"><h2>{page.title}</h2>
      {isAccreditationPage && <p>Матеріали акредитації освітніх програм юридичного факультету. <Link href={lawMasterProgrammePath}>Право · магістр →</Link></p>}
      {!visibleEntries.length && !documents.length && !accreditationDocuments.length && !["faculty-programmes", "faculty-repository"].includes(section) && <p>Матеріали ще не оприлюднено.</p>}
    </div>{section === "faculty-council"
      ? <div className="wrap"><DepartmentEditorialContent inline entries={visibleEntries} /></div>
      : <DepartmentEditorialContent entries={visibleEntries} />}
      <PageDocuments pagePath={page.path} documents={isAccreditationPage ? accreditationDocuments : undefined} title={isAccreditationPage ? "Документи з акредитації" : undefined} description={isAccreditationPage ? "Оприлюднені матеріали освітніх програм." : undefined} />
      </>}
    </section>
    {section === "faculty-repository" && <ThesesCatalogue items={theses} />}
    <SiteFooter />
  </main>;
}
