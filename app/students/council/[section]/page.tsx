import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../../components/SiteHeader";
import { SiteFooter } from "../../../components/SiteFooter";
import { getDepartmentEntries } from "@/lib/department-content";
import { officialDocuments } from "@/lib/official-documents";
import { studentCouncilPath, studentCouncilSections, studentCouncilEntries } from "@/lib/student-council";
import { CouncilNavigation } from "../CouncilNavigation";
import { CouncilSectionContent } from "../CouncilSectionContent";
import "../council.css";

type Props = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const page = studentCouncilSections.find(({ id }) => id === section);
  return { title: page ? `${page.label} · Студентська рада` : "Студентська рада" };
}

export default async function Page({ params }: Props) {
  const { section } = await params;
  const page = studentCouncilSections.find(({ id }) => id === section);
  if (!page) notFound();
  const entries = studentCouncilEntries(await getDepartmentEntries(studentCouncilPath), section);
  const archivedRegulation = officialDocuments.find((document) => document.id === "student-government-archive-2020");
  return <main id="top" data-page-materials-server="true"><SiteHeader englishHref="/en/students" />
    <section className="faculty-subpage-hero"><div className="wrap"><Link href={studentCouncilPath}>← Студентська рада</Link><h1>{page.label}</h1></div></section>
    <CouncilNavigation current={section} />
    <section className="council-content" id="content"><div className="wrap">
      {(entries.length > 0 || section !== "regulations") && <CouncilSectionContent entries={entries} representatives={section === "representation"} />}
      {section === "regulations" && archivedRegulation && <article className="council-entry council-archive">
        <h2>{archivedRegulation.title}</h2>
        <p>{archivedRegulation.description}</p>
        <a href={archivedRegulation.href} target="_blank" rel="noopener noreferrer">Відкрити архівний PDF (4 сторінки) ↗</a>
      </article>}
    </div></section>
    <SiteFooter />
  </main>;
}
