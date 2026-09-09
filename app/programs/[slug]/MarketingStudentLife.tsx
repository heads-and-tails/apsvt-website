import content from "@/lib/marketing-verbatim.json";
import { VerbatimInline, VerbatimProfileText } from "./VerbatimProfileText";

export function MarketingStudentLife() {
  return <section className="marketing-student-life" id="marketing-student-life">
    <div className="wrap">
      <div className="marketing-student-intro">
        <div><div className="idx">06 / Студентське життя</div><h2>{content.studentTitle}</h2></div>
      </div>
      <div className="marketing-verbatim-grid">
        {content.students.map((person, index) => <article className="marketing-verbatim-card" key={person.name}>
          <div className="marketing-verbatim-overview">
            <div className="marketing-verbatim-photo"><img src={person.image} alt={person.name} loading="lazy" /><span>{String(index + 1).padStart(2, "0")}</span></div>
            <div><h3>{person.name}</h3><p><VerbatimInline block={person.blocks[0]} /></p></div>
          </div>
          <details name="marketing-student-profiles"><summary>Про себе <span aria-hidden="true">+</span></summary><VerbatimProfileText blocks={person.blocks.slice(1)} /></details>
        </article>)}
      </div>
    </div>
  </section>;
}
