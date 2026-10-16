import content from "@/lib/marketing-verbatim.json";
import type { DepartmentEntry } from "@/lib/department-content";
import { DepartmentEditorialContent } from "@/app/components/DepartmentEditorialContent";
import { VerbatimInline, VerbatimProfileText } from "./VerbatimProfileText";

export function MarketingStudentLife({ entries }: { entries: DepartmentEntry[] }) {
  return <section className="marketing-student-life" id="marketing-student-life">
    <div className="wrap">
      <div className="marketing-student-intro">
        <div><div className="idx">07 / Студентське життя</div><h2>{content.studentTitle}</h2></div>
      </div>
      <nav className="marketing-student-subnav" aria-label="Підрозділи студентського життя"><a href="#marketing-student-life-content"><span>01</span><b>Студентське життя: навчання, можливості, досягнення</b><i aria-hidden="true">↓</i></a><a href="#marketing-student-science"><span>02</span><b>Студентська наука: конференції, дослідження, досягнення</b><i aria-hidden="true">↓</i></a></nav>
      <div className="marketing-student-subsection" id="marketing-student-life-content"><div className="idx">01 / Студентське життя</div><h3>Студентське життя: навчання, можливості, досягнення</h3></div>
      <div className="marketing-verbatim-grid">
        {content.students.map((person) => <article className="marketing-verbatim-card" key={person.name}>
          <div className="marketing-verbatim-overview">
            <div className="marketing-verbatim-photo"><img src={person.image} alt={person.name} loading="lazy" /></div>
            <div><h3>{person.name}</h3><p><VerbatimInline block={person.blocks[0]} /></p></div>
          </div>
          <details name="marketing-student-profiles"><summary>Про себе <span aria-hidden="true">+</span></summary><VerbatimProfileText blocks={person.blocks.slice(1)} /></details>
        </article>)}
      </div>
      <DepartmentEditorialContent entries={entries.filter((entry) => entry.sectionId === "marketing-student-life" && !["hero", "override", "teacher", "partner"].includes(entry.entryType))} inline />
      <div className="marketing-student-subsection marketing-student-science" id="marketing-student-science"><div className="idx">02 / Студентська наука</div><h3>Студентська наука: конференції, дослідження, досягнення</h3></div>
      <div className="marketing-achievement-list" id="marketing-student-achievements">
        <a href="/documents/marketing/student-achievements/2026.pdf" target="_blank" rel="noreferrer"><span>2026</span><div><small>Календарний рік</small><h4>Наукові здобутки здобувачів</h4></div><b>PDF · 20 сторінок ↗</b></a>
        <a href="/documents/marketing/student-achievements/2025.pdf" target="_blank" rel="noreferrer"><span>2025</span><div><small>Календарний рік</small><h4>Наукові здобутки здобувачів</h4></div><b>PDF · 17 сторінок ↗</b></a>
      </div>
      <DepartmentEditorialContent entries={entries.filter((entry) => entry.sectionId === "marketing-student-science" && !["hero", "override", "teacher", "partner"].includes(entry.entryType))} inline />
    </div>
  </section>;
}
