import type { DepartmentEntry, DepartmentEntryType } from "@/lib/department-content";

const groups: Array<{ type: DepartmentEntryType; eyebrow: string; title: string }> = [
  { type: "section", eyebrow: "Про підрозділ", title: "Актуальна інформація" },
  { type: "news", eyebrow: "Життя кафедри", title: "Новини" },
  { type: "article", eyebrow: "Авторські матеріали", title: "Статті та дослідження" },
  { type: "teacher", eyebrow: "Академічна команда", title: "Викладачі" },
  { type: "partner", eyebrow: "Співпраця", title: "Партнери та компанії" },
  { type: "material", eyebrow: "Для навчання й роботи", title: "Матеріали" },
  { type: "photo", eyebrow: "Події та середовище", title: "Фотогалерея" },
];

function paragraphs(value: string) {
  return value.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

export function DepartmentEditorialContent({ entries }: { entries: DepartmentEntry[] }) {
  if (!entries.length) return null;
  return <div className="department-public-content" data-editorial-rendered="true">
    {groups.map((group, groupIndex) => {
      const items = entries.filter((entry) => entry.entryType === group.type);
      if (!items.length) return null;
      return <section className={`department-public-section department-public-${group.type}`} id={`department-${group.type}`} key={group.type}>
        <div className="wrap">
          <header className="department-public-head"><div><div className="idx">{String(groupIndex + 6).padStart(2, "0")} / {group.eyebrow}</div><h2>{group.title}</h2></div><span>{String(items.length).padStart(2, "0")}</span></header>
          {group.type === "section" && <div className="department-section-grid">{items.map((entry, index) => <article key={entry.id}>{entry.imageUrl && <img src={entry.imageUrl} alt={entry.imageAlt || entry.title} />}<div><span>{String(index + 1).padStart(2, "0")}</span><h3>{entry.title}</h3>{entry.summary && <p className="lead">{entry.summary}</p>}{paragraphs(entry.body).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article>)}</div>}
          {group.type === "news" && <div className="department-news-grid">{items.map((entry) => <article key={entry.id}>{entry.imageUrl && <img src={entry.imageUrl} alt={entry.imageAlt || entry.title} />}<div>{entry.date && <time dateTime={entry.date}>{new Intl.DateTimeFormat("uk-UA", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${entry.date}T12:00:00`))}</time>}<h3>{entry.title}</h3><p>{entry.summary}</p>{entry.body && <details><summary>Читати повністю <span>+</span></summary><div>{paragraphs(entry.body).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></details>}</div></article>)}</div>}
          {group.type === "article" && <div className="department-article-list">{items.map((entry, index) => <details key={entry.id}><summary><span>{String(index + 1).padStart(2, "0")}</span><div>{entry.date && <small>{entry.date}</small>}<h3>{entry.title}</h3><p>{entry.summary}</p></div><b>+</b></summary><div className="department-article-body">{entry.imageUrl && <img src={entry.imageUrl} alt={entry.imageAlt || entry.title} />}{paragraphs(entry.body).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></details>)}</div>}
          {group.type === "teacher" && <div className="department-teacher-grid">{items.map((entry) => <article key={entry.id}>{entry.imageUrl ? <img src={entry.imageUrl} alt={entry.imageAlt || entry.title} /> : <div className="department-teacher-placeholder">{entry.title.split(/\s+/).map((part) => part[0]).slice(0, 2).join("")}</div>}<div><small>{entry.role}</small><h3>{entry.title}</h3><p>{entry.summary}</p><nav>{entry.email && <a href={`mailto:${entry.email}`}>Email ↗</a>}{entry.profileUrl && <a href={entry.profileUrl} target="_blank" rel="noreferrer">Науковий профіль ↗</a>}</nav></div></article>)}</div>}
          {group.type === "partner" && <div className="department-partner-grid">{items.map((entry) => <article key={entry.id}>{entry.imageUrl ? <div className="department-partner-logo"><img src={entry.imageUrl} alt={entry.imageAlt || `Логотип ${entry.title}`} /></div> : <div className="department-partner-logo department-partner-placeholder">{entry.title.slice(0, 2)}</div>}<div><small>{entry.role || "Партнер Академії"}</small><h3>{entry.title}</h3><p>{entry.summary}</p>{entry.profileUrl && <a href={entry.profileUrl} target="_blank" rel="noreferrer">Відкрити сайт ↗</a>}</div></article>)}</div>}
          {group.type === "material" && <div className="department-material-list">{items.map((entry, index) => <a href={entry.fileUrl} target="_blank" rel="noreferrer" key={entry.id}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{entry.fileName || "Матеріал"}</small><h3>{entry.title}</h3><p>{entry.summary}</p></div><b>↗</b></a>)}</div>}
          {group.type === "photo" && <div className="department-photo-grid">{items.map((entry) => <figure key={entry.id}><img src={entry.imageUrl} alt={entry.imageAlt || entry.title} /><figcaption><b>{entry.title}</b>{entry.summary && <span>{entry.summary}</span>}</figcaption></figure>)}</div>}
        </div>
      </section>;
    })}
  </div>;
}
