import Link from "next/link";
import type { DepartmentEntry } from "@/lib/department-content";
import { educationQualityRubrics, normalizeEducationQualityRubricId } from "@/lib/education-quality";

function paragraphs(value: string) {
  return value.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

export function EducationQualitySection({
  entries,
  index = "09",
  id = "quality",
  discussionEmail,
}: {
  entries: DepartmentEntry[];
  index?: string;
  id?: string;
  discussionEmail?: string;
}) {
  const qualityEntries = entries.filter((entry) => entry.entryType === "quality");

  return <section className="education-quality" id={id}>
    <div className="wrap">
      <header className="education-quality-head">
        <div><div className="idx">{index} / Якість освіти</div><h2>Відкриті дані кафедри</h2></div>
        <div><p>Матеріали згруповано за трьома постійними рубриками. Відкрийте лише потрібну — решта інформації залишатиметься згорнутою.</p><Link href="/documents#quality">Загальна система якості Академії →</Link></div>
      </header>

      <div className="education-quality-rubrics">
        {educationQualityRubrics.map((rubric) => {
          const items = qualityEntries.filter((entry) => normalizeEducationQualityRubricId(entry.role, `${entry.title} ${entry.summary}`) === rubric.id);
          return <details key={rubric.id} className="education-quality-rubric">
            <summary>
              <span>{rubric.index}</span>
              <div><h3>{rubric.title}</h3><p>{rubric.description}</p></div>
              <b aria-hidden="true">+</b>
            </summary>
            <div className="education-quality-rubric-body">
              {items.length > 0 ? <div className="education-quality-items">{items.map((entry) => <article key={entry.id}>
                <div><small>{entry.date || "Матеріал кафедри"}</small><h4>{entry.title}</h4>{entry.summary && <p>{entry.summary}</p>}</div>
                {entry.body && <div className="education-quality-copy">{paragraphs(entry.body).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>}
                {entry.fileUrl && <a href={entry.fileUrl} target="_blank" rel="noreferrer">{entry.fileName || "Відкрити документ"} ↗</a>}
              </article>)}</div> : <div className="education-quality-empty"><p>Матеріали цієї рубрики готуються до публікації кафедрою.</p>{rubric.id === "programme-discussion" && (discussionEmail ? <a href={`mailto:${discussionEmail}?subject=${encodeURIComponent("Пропозиція до освітньої програми")}`}>Надіслати пропозицію кафедрі →</a> : <Link href="/contacts">Надіслати пропозицію →</Link>)}</div>}
            </div>
          </details>;
        })}
      </div>
    </div>
  </section>;
}
