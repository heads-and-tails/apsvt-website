import Link from "next/link";
import { digitalDepartmentPath, digitalDepartmentTitle, professionalEducationProgrammes } from "@/lib/professional-education";

export function ProfessionalEducationLinks({ showDepartment = false }: { showDepartment?: boolean }) {
  return <section className="professional-education-links" id="programme-levels"><div className="wrap">
    <header><h2>Освітні програми за рівнями</h2>{showDepartment && <Link href={digitalDepartmentPath}>{digitalDepartmentTitle} →</Link>}</header>
    <nav aria-label="Освітні програми за рівнями" className="professional-programme-grid">
      {professionalEducationProgrammes.map((programme) => <Link href={programme.path} key={programme.slug}>
        <span>{programme.degree}</span><h3>{programme.title}</h3><p>{programme.level}</p><b>Відкрити програму →</b>
      </Link>)}
    </nav>
  </div></section>;
}
