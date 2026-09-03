import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AcademicNews } from "@/app/components/AcademicNews";
import { AcademicProfileCard } from "@/app/components/AcademicProfileCard";
import { DepartmentEditorialContent } from "@/app/components/DepartmentEditorialContent";
import { EducationQualitySection } from "@/app/components/EducationQualitySection";
import { PageDocuments } from "@/app/components/PageDocuments";
import { SectionHub, type SectionHubItem } from "@/app/components/SectionHub";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { getDepartmentEntries } from "@/lib/department-content";
import { getPsychologyDepartment, psychologyDepartments } from "@/lib/psychology-departments";
import { psychologyFacultyTeam } from "@/lib/psychology-faculty-team";
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
  { id: "department-history", index: "02", title: "Історія кафедри", description: "Розвиток, ключові етапи та академічна традиція.", icon: "TIME" },
  { id: "department-head", index: "03", title: "Завідувач кафедри", description: "Окремий профіль керівника кафедри.", icon: "HEAD" },
  { id: "department-team", index: "04", title: "Склад кафедри", description: "Викладачі, науковці та практики.", icon: "TEAM" },
  { id: "department-education", index: "05", title: "Освітня діяльність", description: "Програми, навчальні плани та дисципліни.", icon: "EDU" },
  { id: "department-science", index: "06", title: "Наукова діяльність", description: "Дослідження, публікації, конференції та проєкти.", icon: "SCI" },
  { id: "student-science", index: "07", title: "Студентська наукова діяльність", description: "Конференції, конкурси та дослідницькі проєкти.", icon: "STU" },
  { id: "science-clubs", index: "08", title: "Наукові гуртки", description: "Зустрічі, учасники, плани й результати роботи.", icon: "CLUB" },
  { id: "academic-council", index: "09", title: "Вчена рада", description: "Склад, плани, засідання, рішення та протоколи.", icon: "RAD" },
  { id: "repository", index: "10", title: "Репозитарій", description: "Кваліфікаційні роботи та відкриті наукові матеріали.", icon: "REP" },
  { id: "programme-discussion", index: "11", title: "Обговорення", description: "Проєкти освітніх програм і пропозиції стейкголдерів.", icon: "DIA" },
  { id: "department-news", index: "12", title: "Новини кафедри", description: "Події, оголошення й публікації кафедри.", icon: "NEWS" },
  { id: "department-documents", index: "13", title: "Документи", description: "Положення, плани, звіти та офіційні матеріали.", icon: "PDF" },
  { id: "department-contacts", index: "14", title: "Контакти", description: "Зв’язок із кафедрою та факультетом.", icon: "@" },
  { id: "quality", index: "15", title: "Якість освіти", description: "Моніторинг, обговорення змін і оцінювання НПП.", icon: "✓" },
];

export default async function Page({ params }: { params: Promise<{ department: string }> }) {
  const department = getPsychologyDepartment((await params).department);
  if (!department) notFound();

  const pagePath = `/departments/psychology-social-development-faculty/${department.slug}`;
  const entries = await getDepartmentEntries(pagePath);
  const entriesFor = (sectionId: string) => entries.filter((entry) => entry.sectionId === sectionId && !["hero", "teacher", "partner", "quality"].includes(entry.entryType));
  const team = department.teamIds.flatMap((id) => {
    const person = psychologyFacultyTeam.find((member) => member.id === id);
    return person ? [person] : [];
  });
  const head = department.headId ? team.find((person) => person.id === department.headId) : undefined;

  return <main id="top" className="criminal-department psychology-department" data-page-materials-server="true"><SiteHeader />
    <section className="criminal-department-hero"><div className="wrap criminal-department-hero-grid">
      <div className="criminal-department-hero-copy"><div className="crumb"><Link href="/">Головна</Link> / <Link href="/departments/psychology-social-development-faculty">Факультет психології та соціального розвитку</Link> / Кафедра</div><span>{department.code} · факультет психології та соціального розвитку</span><h1>{department.title.replace("Кафедра ", "")}</h1><p>{department.summary}</p><div className="criminal-department-hero-actions"><a href="#department-team">Склад кафедри ↓</a><Link href={department.programmeHref}>Освітня програма {department.code} →</Link></div></div>
      <figure className="criminal-department-hero-portrait"><div className="criminal-department-hero-photo faculty-portrait-surface">{head ? <img src={head.image} alt={head.name} /> : <img src="/program-psychology.jpg" alt="Навчання на факультеті психології та соціального розвитку" />}</div><figcaption><small>{head ? "Завідувачка кафедри" : `Освітній напрям ${department.code}`}</small><strong>{head?.name || department.programmeTitle}</strong><span>{head?.role || "окрема сторінка кафедри"}</span></figcaption></figure>
    </div></section><div className="hero-rule" />

    <SectionHub sections={sections} eyebrow="Структура кафедри" description="Оберіть потрібну картку — відкриється лише відповідний розділ кафедри.">
      <section className="criminal-department-about" id="department-about"><div className="wrap criminal-department-about-grid"><div><div className="idx">01 / Про кафедру</div><h2>{department.title}</h2></div><div><p className="program-lede">{department.summary}</p><div className="criminal-department-pillars">{department.focus.slice(0, 3).map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3><p>Освітня, практична та дослідницька робота кафедри.</p></article>)}</div><DepartmentEditorialContent entries={entriesFor("department-about")} /></div></div></section>

      <section className="criminal-department-about" id="department-history"><div className="wrap criminal-department-about-grid"><div><div className="idx">02 / Історія кафедри</div><h2>Історія та розвиток</h2></div><div><p className="program-lede">Офіційні відомості про становлення й розвиток кафедри публікуються після редакційного підтвердження факультету.</p><DepartmentEditorialContent entries={entriesFor("department-history")} /></div></div></section>

      <section className="criminal-department-team" id="department-head"><div className="wrap"><div className="sec-head"><div><div className="idx">03 / Завідувач кафедри</div><h2>Академічне керівництво</h2></div><p>Профіль керівника відокремлено від загального складу кафедри.</p></div>{head ? <div className="academic-profile-grid"><AcademicProfileCard badge="Завідувачка кафедри" person={{ name: head.name, role: head.role, summary: head.summary, image: head.image, imageCrop: head.photoHasCaption ? "caption" : undefined, tags: head.interests, links: head.profiles }} /></div> : <div className="faculty-action-note"><p><b>Інформація уточнюється</b> Офіційні відомості про керівництво кафедри будуть оприлюднені після підтвердження факультетом.</p></div>}<DepartmentEditorialContent entries={entriesFor("department-head")} /></div></section>

      <section className="criminal-department-team" id="department-team"><div className="wrap"><div className="sec-head"><div><div className="idx">04 / Склад кафедри</div><h2>Науково-педагогічний склад</h2></div><p>Викладачі, науковці та фахівці-практики кафедри.</p></div><div className="academic-profile-grid">{team.filter((person) => person.id !== department.headId).map((person, index) => <AcademicProfileCard key={person.id} index={index} person={{ name: person.name, role: person.id === "olha-yakovenko" ? "лаборантка кафедри" : person.role, summary: person.summary, image: person.image, imageCrop: person.photoHasCaption ? "caption" : undefined, tags: person.interests, links: person.profiles }} />)}</div><DepartmentEditorialContent entries={[...entries.filter((entry) => entry.entryType === "teacher"), ...entriesFor("department-team")]} /></div></section>

      <section className="programme-documents" id="department-education"><div className="wrap"><div className="programme-documents-head"><div><div className="idx">05 / Освітня діяльність</div><h2>{department.code} «{department.programmeTitle}»</h2></div><Link href={department.programmeHref}>До освітньої програми →</Link></div><div className="programme-document-list"><Link href={department.programmeHref}><span>01</span><div><small>Освітня траєкторія</small><h3>Огляд програми та рівні освіти</h3></div><b>→</b></Link><Link href={`${department.programmeHref}#curriculum`}><span>02</span><div><small>Навчальний план</small><h3>Обов’язкові та вибіркові компоненти</h3></div><b>→</b></Link></div><DepartmentEditorialContent entries={entriesFor("department-education")} /></div></section>

      <section className="criminal-department-research" id="department-science"><div className="wrap"><div className="sec-head"><div><div className="idx">06 / Наукова діяльність</div><h2>Дослідження кафедри</h2></div><p>Публікації, конференції, проєкти та результати наукової роботи.</p></div><div className="criminal-department-themes">{department.focus.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3><p>Матеріали напряму доповнюються кафедрою.</p></article>)}</div><DepartmentEditorialContent entries={entriesFor("department-science")} /></div></section>

      <section className="criminal-department-about" id="student-science"><div className="wrap criminal-department-about-grid"><div><div className="idx">07 / Студентська наукова діяльність</div><h2>Від першої тези до дослідження</h2></div><div><p className="program-lede">Матеріали конференцій, конкурсів і студентських дослідницьких проєктів публікуються окремо.</p><Link className="academic-inline-link" href="/research/theses">Кваліфікаційні роботи →</Link><DepartmentEditorialContent entries={entriesFor("student-science")} /></div></div></section>

      <section className="criminal-department-about" id="science-clubs"><div className="wrap criminal-department-about-grid"><div><div className="idx">08 / Наукові гуртки</div><h2>Гуртки та студентські ініціативи</h2></div><div><p className="program-lede">Окремий простір для планів роботи, зустрічей, учасників і результатів наукових гуртків.</p><DepartmentEditorialContent entries={entriesFor("science-clubs")} /></div></div></section>

      <section className="criminal-department-about" id="academic-council"><div className="wrap criminal-department-about-grid"><div><div className="idx">09 / Вчена рада</div><h2>Колегіальні рішення</h2></div><div><div className="programme-document-list"><Link href="/documents#governance"><span>01</span><div><small>Вчена рада</small><h3>Склад, плани, рішення та протоколи</h3></div><b>→</b></Link></div><DepartmentEditorialContent entries={entriesFor("academic-council")} /></div></div></section>

      <section className="criminal-department-about" id="repository"><div className="wrap criminal-department-about-grid"><div><div className="idx">10 / Репозитарій</div><h2>Відкриті роботи та матеріали</h2></div><div><div className="programme-document-list"><Link href="/research/theses"><span>01</span><div><small>{department.code}</small><h3>Кваліфікаційні роботи студентів</h3></div><b>→</b></Link><Link href="/research/journals"><span>02</span><div><small>Наука і видання</small><h3>Публікації, збірники та монографії</h3></div><b>→</b></Link></div><DepartmentEditorialContent entries={entriesFor("repository")} /></div></div></section>

      <section className="criminal-department-about" id="programme-discussion"><div className="wrap criminal-department-about-grid"><div><div className="idx">11 / Обговорення</div><h2>Пропозиції до освітніх програм</h2></div><div><p className="program-lede">Проєкти програм, пропозиції стейкголдерів і результати їх розгляду публікуються окремо.</p><a className="academic-inline-link" href="https://docs.google.com/forms/d/e/1FAIpQLSdy9q5cWFUT5B37z0T-BYHesOkzVPwga7s0HW0a1K5PML2feg/viewform?usp=header" target="_blank" rel="noreferrer">Надіслати пропозицію ↗</a><DepartmentEditorialContent entries={entriesFor("programme-discussion")} /></div></div></section>

      <div id="department-news"><AcademicNews slugs={[department.newsSlug]} title="Новини кафедри" /><DepartmentEditorialContent entries={entriesFor("department-news")} /></div>

      <section className="criminal-department-about" id="department-documents"><div className="wrap criminal-department-about-grid"><div><div className="idx">13 / Документи</div><h2>Офіційні матеріали кафедри</h2></div><div><PageDocuments pagePath={pagePath} /><DepartmentEditorialContent entries={entriesFor("department-documents")} /></div></div></section>

      <section className="criminal-department-about" id="department-contacts"><div className="wrap criminal-department-about-grid"><div><div className="idx">14 / Контакти</div><h2>Зв’язок із кафедрою</h2></div><div><p className="program-lede">Київ, вул. Кільцева дорога, 3-А. Звернення щодо навчання, науки та матеріалів кафедри можна передати через деканат факультету.</p><a className="academic-inline-link" href="mailto:k.psychology22@gmail.com">k.psychology22@gmail.com ↗</a><DepartmentEditorialContent entries={entriesFor("department-contacts")} /></div></div></section>

      <EducationQualitySection entries={entries} pagePath={pagePath} index="15" discussionEmail="k.psychology22@gmail.com" />
    </SectionHub>
    <SiteFooter />
  </main>;
}
