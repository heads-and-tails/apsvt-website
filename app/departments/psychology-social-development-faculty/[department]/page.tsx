import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AcademicProfileCard } from "@/app/components/AcademicProfileCard";
import { DepartmentEditorialContent } from "@/app/components/DepartmentEditorialContent";
import { SectionHub, type SectionHubItem } from "@/app/components/SectionHub";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { getDepartmentEntries } from "@/lib/department-content";
import { getPsychologyDepartment, psychologyDepartments } from "@/lib/psychology-departments";
import { psychologyFacultyTeam } from "@/lib/psychology-faculty-team";
import { psychologyFacultyPath } from "@/lib/psychology-faculty-structure";
import { psychologyDepartmentDestinations } from "@/lib/psychology-faculty-content";
import { PsychologyDepartmentLinks } from "../PsychologyDepartmentLinks";
import "../../criminal-law/criminal-law.css";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return psychologyDepartments.map((department) => ({ department: department.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ department: string }> }): Promise<Metadata> {
  const department = getPsychologyDepartment((await params).department);
  return department ? { title: department.title, description: department.summary } : {};
}

const sections: readonly SectionHubItem[] = [
  { id: "department-about", index: "01", title: "Про кафедру", description: "Загальна інформація та напрями роботи.", icon: "DEP" },
  { id: "department-head", index: "02", title: "Завідувач кафедри", description: "Окремий профіль керівника кафедри.", icon: "HEAD" },
  { id: "department-team", index: "03", title: "Склад кафедри", description: "Викладачі, науковці та практики.", icon: "TEAM" },
  { id: "department-contacts", index: "04", title: "Контакти", description: "Зв’язок із кафедрою та факультетом.", icon: "@" },
];

export default async function Page({ params }: { params: Promise<{ department: string }> }) {
  const department = getPsychologyDepartment((await params).department);
  if (!department) notFound();

  const pagePath = `/departments/psychology-social-development-faculty/${department.slug}`;
  const entries = await getDepartmentEntries(pagePath);
  const entriesFor = (sectionId: string) => entries.filter((entry) => entry.sectionId === sectionId && !["hero", "teacher", "partner", "quality", "news"].includes(entry.entryType));
  const team = department.teamIds.flatMap((id) => {
    const person = psychologyFacultyTeam.find((member) => member.id === id);
    return person ? [person] : [];
  });
  const head = department.headId ? team.find((person) => person.id === department.headId) : undefined;

  return <main id="top" className="criminal-department psychology-department" data-page-materials-server="true"><SiteHeader /><PsychologyDepartmentLinks facultyPath={psychologyFacultyPath} destinations={psychologyDepartmentDestinations} />
    <section className="criminal-department-hero"><div className="wrap criminal-department-hero-grid">
      <div className="criminal-department-hero-copy"><div className="crumb"><Link href="/">Головна</Link> / <Link href="/departments/psychology-social-development-faculty">Факультет психології та соціального розвитку</Link> / Кафедра</div><span>{department.code} · факультет психології та соціального розвитку</span><h1>{department.title.replace("Кафедра ", "")}</h1><p>{department.summary}</p><div className="criminal-department-hero-actions"><a href="#department-team">Склад кафедри ↓</a><a href={`${psychologyFacultyPath}#faculty-programmes`}>Освітні програми факультету →</a></div></div>
      <figure className="criminal-department-hero-portrait"><div className="criminal-department-hero-photo faculty-portrait-surface">{head ? <img src={head.image} alt={head.name} /> : <img src="/program-psychology.jpg" alt="Навчання на факультеті психології та соціального розвитку" />}</div><figcaption><small>{head ? "Завідувач кафедри" : `Освітній напрям ${department.code}`}</small><strong>{head?.name || department.programmeTitle}</strong><span>{head?.role || "окрема сторінка кафедри"}</span></figcaption></figure>
    </div></section><div className="hero-rule" />

    <SectionHub sections={sections} eyebrow="Структура кафедри" description="Оберіть потрібну картку — відкриється лише відповідний розділ кафедри.">
      <section className="criminal-department-about" id="department-about"><div className="wrap criminal-department-about-grid"><div><div className="idx">01 / Про кафедру</div><h2>{department.title}</h2></div><div><p className="program-lede">{department.summary}</p><div className="criminal-department-pillars">{department.focus.slice(0, 3).map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3><p>Освітня, практична та дослідницька робота кафедри.</p></article>)}</div><DepartmentEditorialContent entries={entriesFor("department-about")} /></div></div></section>

      <section className="criminal-department-team" id="department-head"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Завідувач кафедри</div><h2>Академічне керівництво</h2></div><p>Профіль керівника відокремлено від загального складу кафедри.</p></div>{head ? <div className="academic-profile-grid"><AcademicProfileCard badge="Завідувач кафедри" person={{ name: head.name, role: head.role, summary: head.summary, image: head.image, imageCrop: head.photoHasCaption ? "caption" : undefined, tags: head.interests, links: head.profiles }} /></div> : <div className="faculty-action-note"><p><b>Інформація уточнюється</b> Офіційні відомості про керівництво кафедри будуть оприлюднені після підтвердження факультетом.</p></div>}<DepartmentEditorialContent entries={entriesFor("department-head")} /></div></section>

      <section className="criminal-department-team" id="department-team"><div className="wrap"><div className="sec-head"><div><div className="idx">03 / Склад кафедри</div><h2>Науково-педагогічний склад</h2></div><p>Викладачі, науковці та фахівці-практики кафедри.</p></div><div className="academic-profile-grid">{team.filter((person) => person.id !== department.headId).map((person, index) => <AcademicProfileCard key={person.id} index={index} person={{ name: person.name, role: person.id === "olha-yakovenko" ? "лаборантка кафедри" : person.role, summary: person.summary, image: person.image, imageCrop: person.photoHasCaption ? "caption" : undefined, tags: person.interests, links: person.profiles }} />)}</div><DepartmentEditorialContent entries={[...entries.filter((entry) => entry.entryType === "teacher"), ...entriesFor("department-team")]} /></div></section>

      <section className="criminal-department-about" id="department-contacts"><div className="wrap criminal-department-about-grid"><div><div className="idx">04 / Контакти</div><h2>Зв’язок із кафедрою</h2></div><div><p className="program-lede">Київ, вул. Кільцева дорога, 3-А. Звернення щодо навчання, науки та матеріалів кафедри можна передати через деканат факультету.</p><a className="academic-inline-link" href="mailto:k.psychology22@gmail.com">k.psychology22@gmail.com ↗</a><DepartmentEditorialContent entries={entriesFor("department-contacts")} /></div></div></section>

    </SectionHub>
    <SiteFooter />
  </main>;
}
