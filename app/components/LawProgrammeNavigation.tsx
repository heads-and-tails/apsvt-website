import Link from "next/link";
import { lawFacultyProgrammes, lawProgrammePath } from "@/lib/law-faculty-programmes";
import "./law-faculty-programmes.css";

export function LawProgrammeNavigation({ english = false }: { english?: boolean }) {
  return <section className="law-programme-navigation" id="education-levels" aria-labelledby="law-programme-navigation-title"><div className="wrap">
    <div className="sec-head"><h2 id="law-programme-navigation-title">{english ? "Degree programmes by level" : "Освітні програми за рівнями освіти"}</h2></div>
    <nav className="faculty-programme-grid" aria-label={english ? "Law faculty programmes" : "Освітні програми юридичного факультету"}>
      {lawFacultyProgrammes.map((programme, index) => <Link href={lawProgrammePath(programme.id)} key={programme.id}>
        <span>{String(index + 1).padStart(2, "0")}</span><b>{programme.code}</b><h3>{english ? programme.englishLabel : programme.label}</h3><i aria-hidden="true">→</i>
      </Link>)}
    </nav>
  </div></section>;
}
