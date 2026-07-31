import { getProgramPageEntranceExams } from "@/lib/entrance-exam-programs";

export function ProgramEntranceExams({ slug }: { slug: string }) {
  const documents = getProgramPageEntranceExams(slug);
  if (!documents.length) return null;

  return <section className="program-entrance-exams"><div className="wrap">
    <div className="program-entrance-exams-head">
      <div><div className="idx">Вступ до аспірантури</div><h2>Програми вступних випробувань</h2></div>
      <p>Фахова програма за спеціальністю та спільні мовні випробування для вступників на рівень доктора філософії.</p>
    </div>
    <div className="program-entrance-exam-list">
      {documents.map((document, index) => document.href
        ? <a href={document.href} target="_blank" rel="noreferrer" key={document.title}>
            <span>{String(index + 1).padStart(2, "0")}</span><div><small>{document.meta}</small><b>{document.title}</b></div><strong>PDF ↗</strong>
          </a>
        : <div className="pending" key={document.title}>
            <span>{String(index + 1).padStart(2, "0")}</span><div><small>{document.meta}</small><b>{document.title}</b></div><strong>Очікується</strong>
          </div>)}
    </div>
    <a className="program-entrance-all" href="/admissions#entrance-programs">Усі програми вступних випробувань →</a>
  </div></section>;
}
