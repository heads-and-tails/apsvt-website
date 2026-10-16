import type { ProgrammePublication } from "@/lib/public-administration-materials";
import Link from "next/link";
import { publicAdministrationAnnouncements } from "@/lib/public-administration-announcements";
import "./public-administration-materials.css";

function MaterialLinks({ files }: { files: ProgrammePublication["groups"][number]["files"] }) {
  return <ul className="programme-material-list">{files.map(file => <li key={file.href}><a href={file.href} target="_blank" rel="noopener noreferrer"><span>{file.title}</span><small>{file.format} ↗</small></a></li>)}</ul>;
}

export function PublicAdministrationMaterials({ publication }: { publication: ProgrammePublication }) {
  return <section className="public-admin-materials"><div className="wrap">
    <dl className="programme-material-facts">{publication.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
    {publication.groups.map(group => group.collapsed
      ? <details id={group.id} className="programme-material-group" key={group.id}><summary>{group.title}</summary><MaterialLinks files={group.files} /></details>
      : <section id={group.id} className="programme-material-group" key={group.id}><h2>{group.title}</h2><MaterialLinks files={group.files} /></section>)}
    {publication.id === "d4-public-administration-bachelor" && <section id="discussion-announcements" className="programme-material-group">
      <h2>Обговорення ОПП · архів оголошень та підсумків</h2>
      <nav aria-label="Архів обговорень освітньої програми"><ul className="programme-material-list">{[...publicAdministrationAnnouncements].reverse().map(article => <li key={article.slug}>
        <Link href={`/news/archive/${article.slug}`}><span>{article.kind === "announcement" ? "Оголошення про обговорення" : "Підсумки обговорення"} · {article.dateLabel}</span><small>→</small></Link>
      </li>)}</ul></nav>
    </section>}
  </div></section>;
}
