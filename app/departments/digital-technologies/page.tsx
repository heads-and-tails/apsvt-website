import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { EditableAcademicSections } from "@/app/components/EditableAcademicSections";
import { ProfessionalEducationLinks } from "@/app/components/ProfessionalEducationLinks";
import { PageDocuments } from "@/app/components/PageDocuments";
import { getDepartmentEntries } from "@/lib/department-content";
import { digitalDepartmentPath, digitalDepartmentTitle, digitalDepartmentSections, professionalEducationPath } from "@/lib/professional-education";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: digitalDepartmentTitle };

export default async function Page() {
  const entries = await getDepartmentEntries(digitalDepartmentPath);
  return <main id="top" data-page-materials-server="true"><SiteHeader />
    <section className="faculty-subpage-hero professional-programme-hero"><div className="wrap"><nav aria-label="Навігаційний ланцюжок"><Link href="/departments">Кафедри</Link><span> / Цифрові технології</span></nav><h1>{digitalDepartmentTitle}</h1><Link href={professionalEducationPath}>Професійна освіта · наявні матеріали напряму →</Link></div></section>
    <EditableAcademicSections sections={digitalDepartmentSections} entries={entries} pagePath={digitalDepartmentPath} content={{ programmes: <ProfessionalEducationLinks />, documents: <PageDocuments pagePath={digitalDepartmentPath} emptyMessage="Документи ще не оприлюднено." /> }} />
    <SiteFooter />
  </main>;
}
