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
  const [entries, documents] = await Promise.all([getDepartmentEntries(page.path), getPublicDocuments(page.path)]);
  const visibleEntries = entries.filter((entry) => !["hero", "override"].includes(entry.entryType));
  const siblings = lawFacultyStructure.find((item) => item.id === section)!.children;
  const programme = subsection === "law" ? "law" : "public-administration";
  const theses = section === "faculty-repository" ? (await getPublicContent("student_thesis")).filter(({ payload }) => programme === "law" ? /(?:D8|081|право)/i.test(payload.program || "") : /(?:D4|281|публічн)/i.test(payload.program || "")) : [];
  return <main id="top" data-page-materials-server="true"><SiteHeader />
    <section className="faculty-subpage-hero"><div className="wrap">
      <nav aria-label="Навігаційний ланцюжок"><Link href={lawFacultyPath}>Юридичний факультет</Link><span> / </span><Link href={`${lawFacultyPath}#${section}`}>{page.parentTitle}</Link><span> / {page.title}</span></nav>
      <h1>{page.title}</h1><Link href={`${lawFacultyPath}#${section}`}>← {page.parentTitle}</Link>
    </div></section>
    <details className="wrap faculty-sibling-nav"><summary>Інші підрозділи · {page.parentTitle}</summary><nav className="faculty-subpage-links" aria-label={page.parentTitle}>{siblings.map(([id, title]) => <Link href={`${lawFacultyPath}/${section}/${id}`} aria-current={id === subsection ? "page" : undefined} key={id}>{title}</Link>)}</nav></details>
    <section className="faculty-subpage-content" id="content"><div className="wrap"><h2>{page.title}</h2>
      {!visibleEntries.length && !documents.length && !["faculty-programmes", "faculty-repository", "faculty-discussion"].includes(section) && <p>Матеріали ще не оприлюднено.</p>}
      {section === "faculty-programmes" && <div className="faculty-link-grid">{subsection === "phd" ? <Link className="faculty-link-card" href="/research/postgraduate-doctoral#phd"><h3>Третій (освітньо-науковий) рівень</h3><b>Освітні програми →</b></Link> : ["law", "public-administration"].map((slug) => <Link className="faculty-link-card" href={`/programs/${slug}#education-levels`} key={slug}><h3>{slug === "law" ? "D8 «Право»" : "D4 «Публічне управління та адміністрування»"}</h3><b>Освітня програма →</b></Link>)}</div>}
      {section === "faculty-discussion" && <Link className="academic-inline-link" href={`/programs/${programme}#quality`}>Громадське обговорення освітніх програм →</Link>}
    </div><DepartmentEditorialContent entries={visibleEntries} /><PageDocuments pagePath={page.path} /></section>
    {section === "faculty-repository" && <ThesesCatalogue items={theses} />}
    <SiteFooter />
  </main>;
}
