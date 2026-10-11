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
import { officialProgrammeFileBase } from "@/lib/programme-documents";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ section: string; subsection: string }> };
const findPage = (section: string, subsection: string) => lawFacultySubpages.find((page) => page.sectionId === section && page.id === subsection);
const facultyProgrammePages: Record<string, { code: string; level: string; href: string; documentHref?: string }> = {
  "d8-law-bachelor": { code: "D8 «Право»", level: "Перший (бакалаврський) рівень", href: "/programs/law#education-levels", documentHref: `${officialProgrammeFileBase}/d8-law-bachelor.pdf` },
  "d8-law-master": { code: "D8 «Право»", level: "Другий (магістерський) рівень", href: "/programs/law#education-levels", documentHref: `${officialProgrammeFileBase}/d8-law-master.pdf` },
  "d8-law-phd": { code: "D8 «Право»", level: "Третій (освітньо-науковий) рівень", href: "/research/postgraduate-doctoral#phd" },
  "d4-public-administration-bachelor": { code: "D4 «Публічне управління та адміністрування»", level: "Перший (бакалаврський) рівень", href: "/programs/public-administration#education-levels" },
  "d4-public-administration-master": { code: "D4 «Публічне управління та адміністрування»", level: "Другий (магістерський) рівень", href: "/programs/public-administration#education-levels", documentHref: `${officialProgrammeFileBase}/d4-public-administration-master.pdf` },
  "d4-public-administration-phd": { code: "D4 «Публічне управління та адміністрування»", level: "Третій (освітньо-науковий) рівень", href: "/research/postgraduate-doctoral#phd", documentHref: "/documents/programmes/phd/2025/d4-public-administration.pdf" },
};

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
  const programmePage = facultyProgrammePages[subsection];
  const theses = section === "faculty-repository" ? (await getPublicContent("student_thesis")).filter(({ payload }) => programme === "law" ? /(?:D8|081|право)/i.test(payload.program || "") : /(?:D4|281|публічн)/i.test(payload.program || "")) : [];
  return <main id="top" data-page-materials-server="true"><SiteHeader />
    <section className="faculty-subpage-hero"><div className="wrap">
      <nav aria-label="Навігаційний ланцюжок"><Link href={lawFacultyPath}>Юридичний факультет</Link><span> / </span><Link href={`${lawFacultyPath}#${section}`}>{page.parentTitle}</Link><span> / {page.title}</span></nav>
      <h1>{page.title}</h1><Link href={`${lawFacultyPath}#${section}`}>← {page.parentTitle}</Link>
    </div></section>
    <details className="wrap faculty-sibling-nav"><summary>Інші підрозділи · {page.parentTitle}</summary><nav className="faculty-subpage-links" aria-label={page.parentTitle}>{siblings.map(([id, title]) => <Link href={`${lawFacultyPath}/${section}/${id}`} aria-current={id === subsection ? "page" : undefined} key={id}>{title}</Link>)}</nav></details>
    <section className="faculty-subpage-content" id="content"><div className="wrap"><h2>{page.title}</h2>
      {!visibleEntries.length && !documents.length && !["faculty-programmes", "faculty-repository", "faculty-discussion"].includes(section) && <p>Матеріали ще не оприлюднено.</p>}
      {section === "faculty-programmes" && programmePage && <div className="faculty-link-grid"><Link className="faculty-link-card faculty-link-card-blue" href={programmePage.href}><span>{programmePage.code}</span><h3>{programmePage.level}</h3><p>Опис програми, освітні компоненти, навчальні плани, практична підготовка та матеріали вступу.</p><b>Відкрити сторінку програми →</b></Link>{programmePage.documentHref && <a className="faculty-link-card faculty-link-card-gold" href={programmePage.documentHref} target="_blank" rel="noreferrer"><span>Офіційний документ</span><h3>Освітня програма</h3><p>Затверджений PDF з компетентностями, результатами навчання та структурою програми.</p><b>Відкрити PDF ↗</b></a>}</div>}
      {section === "faculty-discussion" && <Link className="academic-inline-link" href={`/programs/${programme}#quality`}>Громадське обговорення освітніх програм →</Link>}
    </div><DepartmentEditorialContent entries={visibleEntries} /><PageDocuments pagePath={page.path} /></section>
    {section === "faculty-repository" && <ThesesCatalogue items={theses} />}
    <SiteFooter />
  </main>;
}
