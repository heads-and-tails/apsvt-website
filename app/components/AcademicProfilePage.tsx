import Link from "next/link";
import type { DepartmentEntry } from "@/lib/department-content";
import { departmentTeacherProfile } from "./AcademicProfileCard";
import { DepartmentImages } from "./DepartmentMedia";
import { EditorialRichText } from "./EditorialRichText";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { EnglishFooter } from "./EnglishFooter";
import "./academic-profile-page.css";

export function AcademicProfilePage({ entry, language = "uk" }: { entry: DepartmentEntry; language?: "uk" | "en" }) {
  const person = departmentTeacherProfile(entry);
  const english = language === "en";
  return <main id="top">
    <SiteHeader />
    <section className="detail-hero staff-profile-hero"><div className="wrap">
      <Link className="back-link" href={`${entry.pagePath}#${entry.sectionId || "department-team"}`}>← {english ? "Back to source page" : "До сторінки підрозділу"}</Link>
      <h1>{person.name}</h1>
      {person.role && <p className="detail-deck">{person.role}</p>}
    </div></section>
    <section className="article-section"><div className={`wrap staff-profile-layout${person.image ? "" : " staff-profile-layout--text"}`}>
      {person.image && <aside className="staff-profile-portrait"><DepartmentImages entry={entry} /></aside>}
      <article className="detail-copy staff-profile-content">
        {person.summary && <p className="lede">{person.summary}</p>}
        {person.tags && person.tags.length > 0 && <section className="staff-profile-disciplines"><h2>{english ? "Courses and research interests" : "Дисципліни та наукові напрями"}</h2><ul>{person.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></section>}
        <EditorialRichText text={entry.body} headingOffset={1} />
        {person.links && person.links.length > 0 && <nav className="academic-profile-links" aria-label={english ? "Profile links and documents" : "Посилання та документи профілю"}>{person.links.map(link => <a href={link.href} target="_blank" rel="noopener noreferrer" key={link.href}>{link.label} ↗</a>)}</nav>}
      </article>
    </div></section>
    {english ? <EnglishFooter /> : <SiteFooter />}
  </main>;
}
