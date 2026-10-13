import Link from "next/link";
import { departmentImages } from "@/lib/department-media";
import { getDepartmentEntries, type DepartmentEntry } from "@/lib/department-content";
import { AcademicNews } from "./AcademicNews";
import { AcademicProfileCard, departmentTeacherProfile, type AcademicProfileCardData } from "./AcademicProfileCard";
import { DepartmentEditorialContent } from "./DepartmentEditorialContent";
import { PageDocuments } from "./PageDocuments";
import { SectionHub, type SectionHubItem } from "./SectionHub";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export type LawDepartmentTeacher = AcademicProfileCardData;

export const lawDepartmentSections: readonly SectionHubItem[] = [
  { id: "department-about", index: "01", title: "Загальна інформація про кафедру", description: "Відомості та документи кафедри.", icon: "DEP" },
  { id: "department-head", index: "02", title: "Завідувач кафедри", description: "Профіль керівника або керівниці.", icon: "HEAD" },
  { id: "department-team", index: "03", title: "Склад кафедри", description: "Науково-педагогічний склад.", icon: "TEAM" },
  { id: "department-news", index: "04", title: "Новини", description: "Опубліковані матеріали кафедри.", icon: "NEWS" },
  { id: "department-contacts", index: "05", title: "Контакти", description: "Як звернутися до кафедри.", icon: "@" },
];


export function teachersForSection(source: LawDepartmentTeacher[], entries: DepartmentEntry[]) {
  const managed = entries.filter((entry) => entry.entryType === "teacher");
  const records = source.map((person, index) => {
    const override = managed.find((entry) => (entry.teacherSourceName || entry.title).trim().toLocaleLowerCase("uk-UA") === person.name.toLocaleLowerCase("uk-UA"));
    const legacyPhoto = entries.find((entry) => entry.entryType === "override" && entry.role === "image" && entry.imageUrl && entry.title.trim().toLocaleLowerCase("uk-UA") === person.name.toLocaleLowerCase("uk-UA"));
    const image = legacyPhoto ? departmentImages(legacyPhoto)[0] : undefined;
    return { person: override ? departmentTeacherProfile(override, person) : { ...person, sourceName: person.name, ...(image ? { image: image.url, imageSettings: image } : {}) }, hidden: Boolean(override?.hidden), order: override?.sortOrder ?? (index + 1) * 10 };
  });
  for (const entry of managed) {
    if (source.some((person) => person.name.toLocaleLowerCase("uk-UA") === (entry.teacherSourceName || entry.title).trim().toLocaleLowerCase("uk-UA"))) continue;
    records.push({ person: departmentTeacherProfile(entry), hidden: Boolean(entry.hidden), order: entry.sortOrder });
  }
  return records.filter((record) => !record.hidden).sort((a, b) => a.order - b.order).map((record) => ({ ...record.person, sortOrder: record.order }));
}

export async function LawDepartmentFiveSections({ pagePath, title, summary, head, teachers = [], newsSlugs, archiveDocument }: {
  pagePath: string;
  title: string;
  summary: string;
  head?: LawDepartmentTeacher;
  teachers?: LawDepartmentTeacher[];
  newsSlugs: string[];
  archiveDocument?: { title: string; href: string };
}) {
  const entries = await getDepartmentEntries(pagePath);
  const content = (sectionId: string) => <DepartmentEditorialContent inline entries={entries.filter((entry) => entry.sectionId === sectionId && !["teacher", "hero", "quality"].includes(entry.entryType) && !entry.hidden)} />;
  const leaders = teachersForSection(head ? [head] : [], entries.filter((entry) => entry.sectionId === "department-head"));
  const team = teachersForSection(teachers, entries.filter((entry) => entry.sectionId !== "department-head"));

  return <main id="top" className="criminal-department" data-page-materials-server="true"><SiteHeader />
    <section className="criminal-department-hero"><div className="wrap criminal-department-hero-grid law-department-simple-hero"><div className="criminal-department-hero-copy">
      <div className="crumb"><Link href="/">Головна</Link> / <Link href="/departments/law-faculty">Юридичний факультет</Link> / Кафедра</div>
      <span>Юридичний факультет</span><h1>{title}</h1><p>{summary}</p>
    </div></div></section><div className="hero-rule" />
    <SectionHub sections={lawDepartmentSections} eyebrow="Структура кафедри" description="Оберіть один із п’яти розділів.">
      <section className="criminal-department-about" id="department-about"><div className="wrap law-department-content"><div>{!entries.some((entry) => entry.sectionId === "department-about" && entry.entryType === "section") && <p className="program-lede">{summary}</p>}{archiveDocument && <a className="academic-inline-link" href={archiveDocument.href} target="_blank" rel="noreferrer">{archiveDocument.title} ↗</a>}{content("department-about")}<PageDocuments pagePath={pagePath} /></div></div></section>
      <section className="criminal-department-team" id="department-head"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Завідувач кафедри</div><h2>Завідувач кафедри</h2></div></div>{leaders.length > 0 && <div className="academic-profile-grid">{leaders.map((person) => <AcademicProfileCard key={person.name} person={person} />)}</div>}{content("department-head")}</div></section>
      <section className="criminal-department-team" id="department-team"><div className="wrap"><div className="sec-head"><div><div className="idx">03 / Склад кафедри</div><h2>Науково-педагогічний склад</h2></div></div>{team.length > 0 && <div className="academic-profile-grid">{team.map((person) => <AcademicProfileCard key={person.name} person={person} />)}</div>}{content("department-team")}</div></section>
      <section id="department-news"><AcademicNews slugs={newsSlugs} title="Новини кафедри" />{content("department-news")}</section>
      <section className="criminal-department-about" id="department-contacts"><div className="wrap law-department-content"><div>{content("department-contacts")}<Link className="academic-inline-link" href="/contacts">Контакти Академії →</Link></div></div></section>
    </SectionHub><SiteFooter />
  </main>;
}
