import content from "@/lib/marketing-verbatim.json";
import type { DepartmentEntry } from "@/lib/department-content";
import { marketingStudentSections } from "@/lib/marketing-student-sections";
import { DepartmentEditorialContent } from "@/app/components/DepartmentEditorialContent";
import { VerbatimInline, VerbatimProfileText } from "./VerbatimProfileText";

export function MarketingStudentLife({ entries }: { entries: DepartmentEntry[] }) {
  return <section className="marketing-student-life" id="marketing-student-life">
    <div className="wrap">
      <div className="marketing-student-intro">
        <div><div className="idx">07 / Студентське життя</div><h2>Студентське життя та самоврядування</h2></div>
      </div>
      <nav className="marketing-student-subnav" aria-label="Підрозділи студентського життя">
        {marketingStudentSections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}<span aria-hidden="true">↓</span></a>)}
      </nav>
      {marketingStudentSections.map((section, index) => <section className="marketing-student-subsection" id={section.id} aria-labelledby={`${section.id}-title`} key={section.id}>
        <h3 id={`${section.id}-title`}>{section.title}</h3>
        {index === 0 && <>
          <h4 className="marketing-student-roster-title">{content.studentTitle}</h4>
          <div className="marketing-verbatim-grid">
            {content.students.map((person) => <article className="marketing-verbatim-card" key={person.name}>
              <div className="marketing-verbatim-overview">
                <div className="marketing-verbatim-photo"><img src={person.image} alt={person.name} loading="lazy" /></div>
                <div><h3>{person.name}</h3><p><VerbatimInline block={person.blocks[0]} /></p></div>
              </div>
              <details name="marketing-student-profiles"><summary>Про себе <span aria-hidden="true">+</span></summary><VerbatimProfileText blocks={person.blocks.slice(1)} /></details>
            </article>)}
          </div>
        </>}
        <DepartmentEditorialContent entries={entries.filter((entry) => entry.sectionId === section.id && entry.status === "published" && !entry.hidden && ["section", "article", "news", "photo", "material"].includes(entry.entryType))} inline />
      </section>)}
    </div>
  </section>;
}
