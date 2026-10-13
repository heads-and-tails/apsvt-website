import type { DepartmentEntry, DepartmentEntryType } from "@/lib/department-content";
import Link from "next/link";
import { AcademicProfileCard, departmentTeacherProfile } from "./AcademicProfileCard";
import { EditorialRichText } from "./EditorialRichText";
import { DepartmentImages, DepartmentAttachments } from "./DepartmentMedia";
import { departmentImages } from "@/lib/department-media";
import { departmentPublicationDate } from "@/lib/department-news-date";

const groups: Array<{ type: DepartmentEntryType; eyebrow: string; title: string }> = [
  { type: "section", eyebrow: "Про підрозділ", title: "Актуальна інформація" },
  { type: "news", eyebrow: "Життя кафедри", title: "Новини" },
  { type: "article", eyebrow: "Авторські матеріали", title: "Статті та дослідження" },
  { type: "teacher", eyebrow: "Академічна команда", title: "Викладачі" },
  { type: "partner", eyebrow: "Співпраця", title: "Партнери та компанії" },
  { type: "material", eyebrow: "Для навчання й роботи", title: "Матеріали" },
  { type: "photo", eyebrow: "Події та середовище", title: "Фотогалерея" },
];

export function DepartmentEditorialContent({ entries, inline = false }: { entries: DepartmentEntry[]; inline?: boolean }) {
  if (!entries.length) return null;
  return <div className={`department-public-content${inline ? " department-public-content--inline" : ""}`} data-editorial-rendered="true">
    {groups.map((group, groupIndex) => {
      const items = entries.filter((entry) => entry.entryType === group.type && !entry.hidden).sort((a, b) => {
        if (group.type !== "news") return a.sortOrder - b.sortOrder;
        const aDate = a.date || a.publishedAt || a.createdAt;
        const bDate = b.date || b.publishedAt || b.createdAt;
        return bDate.localeCompare(aDate) || b.createdAt.localeCompare(a.createdAt);
      });
      if (!items.length) return null;
      return <section className={`department-public-section department-public-${group.type}`} id={inline ? undefined : `department-${group.type}`} key={group.type}>
        <div className="wrap">
          {!inline && <header className="department-public-head"><div><div className="idx">{String(groupIndex + 6).padStart(2, "0")} / {group.eyebrow}</div><h2>{group.title}</h2></div><span>{String(items.length).padStart(2, "0")}</span></header>}
          {group.type === "section" && <div className="department-section-grid">{items.map((entry, index) => <article key={entry.id}><DepartmentImages entry={entry} /><div><span>{String(index + 1).padStart(2, "0")}</span><h3>{entry.title}</h3>{entry.summary && <p className="lead">{entry.summary}</p>}<EditorialRichText text={entry.body} /><DepartmentAttachments entry={entry} /></div></article>)}</div>}
          {group.type === "news" && <div className="department-news-grid">{items.map((entry) => <article key={entry.id}>{departmentImages(entry).length > 0 && <Link href={`/department-news/${entry.id}`}><DepartmentImages entry={{ images: departmentImages(entry).slice(0, 1) }} /></Link>}<div>{departmentPublicationDate(entry) && <time dateTime={departmentPublicationDate(entry)!.dateTime}>{departmentPublicationDate(entry)!.label}</time>}<h3><Link href={`/department-news/${entry.id}`}>{entry.title}</Link></h3><p>{entry.summary}</p><Link className="department-news-link" href={`/department-news/${entry.id}`}>Читати повністю →</Link></div></article>)}</div>}
          {group.type === "article" && <div className="department-article-list">{items.map((entry, index) => <details key={entry.id}><summary><span>{String(index + 1).padStart(2, "0")}</span><div>{entry.date && <small>{entry.date}</small>}<h3>{entry.title}</h3><p>{entry.summary}</p></div><b>+</b></summary><div className="department-article-body"><DepartmentImages entry={entry} /><EditorialRichText text={entry.body} /><DepartmentAttachments entry={entry} /></div></details>)}</div>}
          {group.type === "teacher" && <div className="academic-profile-grid">{items.map((entry) => <AcademicProfileCard key={entry.id} person={departmentTeacherProfile(entry)} />)}</div>}
          {group.type === "partner" && <div className="department-partner-grid">{items.map((entry) => <article key={entry.id}>{entry.imageUrl ? <div className="department-partner-logo"><img src={entry.imageUrl} alt={entry.imageAlt || `Логотип ${entry.title}`} /></div> : <div className="department-partner-logo department-partner-placeholder">{entry.title.slice(0, 2)}</div>}<div><small>{entry.role || "Партнер Академії"}</small><h3>{entry.title}</h3><p>{entry.summary}</p>{entry.profileUrl && <a href={entry.profileUrl} target="_blank" rel="noreferrer">Відкрити сайт ↗</a>}</div></article>)}</div>}
          {group.type === "material" && <div className="department-material-list">{items.map((entry, index) => <a href={entry.fileUrl} target="_blank" rel="noreferrer" key={entry.id}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{entry.fileName || "Матеріал"}</small><h3>{entry.title}</h3><p>{entry.summary}</p></div><b>↗</b></a>)}</div>}
          {group.type === "photo" && <div className="department-photo-grid">{items.map((entry) => <figure key={entry.id}><DepartmentImages entry={entry} /><figcaption><b>{entry.title}</b>{entry.summary && <span>{entry.summary}</span>}</figcaption></figure>)}</div>}
        </div>
      </section>;
    })}
  </div>;
}
