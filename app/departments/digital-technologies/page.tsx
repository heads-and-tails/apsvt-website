import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { EditableAcademicSections } from "@/app/components/EditableAcademicSections";
import { ProfessionalEducationLinks } from "@/app/components/ProfessionalEducationLinks";
import { PageDocuments } from "@/app/components/PageDocuments";
import { getDepartmentEntries } from "@/lib/department-content";
import { digitalDepartmentPath, digitalDepartmentTitle, digitalDepartmentSections } from "@/lib/professional-education";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: digitalDepartmentTitle };

export default async function Page() {
  const entries = await getDepartmentEntries(digitalDepartmentPath);
  const hero = entries.find((entry) => entry.entryType === "hero");
  const hasAbout = entries.some((entry) => entry.entryType === "section" && entry.sectionId === "about");
  return <main id="top" data-page-materials-server="true" data-editorial-hero-server="true"><SiteHeader />
    <section className="faculty-subpage-hero professional-programme-hero"><div className="wrap"><nav aria-label="Навігаційний ланцюжок"><Link href="/departments">Кафедри</Link><span> / Цифрові технології</span></nav><h1>{hero?.title || digitalDepartmentTitle}</h1>{hero?.summary && <p>{hero.summary}</p>}{hero?.imageUrl && <img className="academic-editorial-cover" src={hero.imageUrl} alt={hero.imageAlt || hero.title} />}<Link href="#programmes">Освітні програми кафедри →</Link></div></section>
    <EditableAcademicSections sections={digitalDepartmentSections} entries={entries} pagePath={digitalDepartmentPath} content={{
      ...(!hasAbout && hero && (hero.summary || hero.body) ? { about: <div className="wrap academic-editorial-intro">{hero.summary && <p>{hero.summary}</p>}{hero.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div> } : {}),
      programmes: <ProfessionalEducationLinks />, documents: <PageDocuments pagePath={digitalDepartmentPath} emptyMessage="Документи ще не оприлюднено." /> }} />
    <SiteFooter />
  </main>;
}
