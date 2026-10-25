import Link from "next/link";
import type { PsychologyFacultyProgramme } from "@/lib/psychology-faculty-programmes";

export function FacultyProgrammeCards({ programmes, id }: { programmes: readonly PsychologyFacultyProgramme[]; id?: string }) {
  return <div className="faculty-programme-grid" id={id}>
    {programmes.map((programme, index) => <article key={programme.id}>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <b>{programme.code} · {programme.level}</b>
      <h3>{programme.title}</h3>
      <div className="faculty-programme-documents">
        {programme.documents.map((document) => <a href={document.href} target="_blank" rel="noreferrer" key={document.href}>{document.title} ↗</a>)}
        {programme.href && <Link href={programme.href}>Інформація про програму →</Link>}
      </div>
    </article>)}
  </div>;
}
