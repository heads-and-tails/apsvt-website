import type { ProgrammePublication } from "@/lib/public-administration-materials";
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
  </div></section>;
}
