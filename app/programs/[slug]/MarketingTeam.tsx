import content from "@/lib/marketing-verbatim.json";
import { VerbatimInline, VerbatimProfileText } from "./VerbatimProfileText";
import type { DepartmentEntry } from "@/lib/department-content";

function normalizeName(value: string) {
  return value.toLocaleLowerCase("uk-UA").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function MarketingTeam({ entries = [] }: { entries?: DepartmentEntry[] }) {
  const team = [
    ...content.teachers.map((member) => {
      const override = entries.find((entry) => normalizeName(entry.title) === normalizeName(member.name));
      return override ? {
        ...member,
        image: override.imageUrl || member.image,
      } : member;
    }),
  ];
  return <section className="marketing-team-section" id="department-team"><div className="wrap">
    <div className="sec-head marketing-team-head"><div><div className="idx">02 / Кафедра маркетингу</div><h2>Науково-педагогічний склад кафедри</h2></div></div>
    <aside className="marketing-membership-callout" aria-label="Професійне членство викладачів кафедри">
      <span>Професійна спільнота</span>
      <p>Викладачі кафедри є членами ГО «<a href="https://uam.in.ua/" target="_blank" rel="noreferrer">Українська Асоціація Маркетингу</a>» та користуються доступом до професійного обміну знаннями, експертних матеріалів, галузевих перекладів міжнародних документів і актуальних досліджень, які поширює УАМ.</p>
      <a className="marketing-membership-link" href="https://uam.in.ua/" target="_blank" rel="noreferrer">Відкрити сайт УАМ ↗</a>
    </aside>
    <div className="marketing-verbatim-grid">{team.map((member, index) => <article className="marketing-verbatim-card" key={member.name}>
      <div className="marketing-verbatim-overview">
        <div className="marketing-verbatim-photo"><img src={member.image} alt={member.name} loading="lazy" /><span>{String(index + 1).padStart(2, "0")}</span></div>
        <h3><VerbatimInline block={member.header} /></h3>
      </div>
      <details name="marketing-teacher-profiles"><summary>Резюме та наукові профілі <span aria-hidden="true">+</span></summary><VerbatimProfileText blocks={member.blocks} /></details>
    </article>)}</div>
  </div></section>;
}
