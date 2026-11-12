import { entranceScheduleLevels } from "@/lib/entrance-exam-schedules";

export function EntranceExamSchedule() {
  return <section className="entrance-exams" id="entrance-exams"><div className="wrap">
    <div className="entrance-exams-head">
      <div><div className="idx">05 / Приймальна комісія</div><h2>Розклад вступних<br />випробувань</h2></div>
      <div className="entrance-exams-note"><b>Вступ 2026</b><p>Офіційні графіки Приймальної комісії за рівнями освіти та потоками.</p><span>Дати, час і формат — у PDF</span></div>
    </div>

    <nav className="entrance-level-nav" aria-label="Рівні освіти">
      {entranceScheduleLevels.map((level) => <a href={`#${level.id}`} key={level.id}><span>{level.index}</span><b>{level.title}</b><small>{level.dates}</small></a>)}
    </nav>

    {entranceScheduleLevels.map((level) => <article className="entrance-level" id={level.id} key={level.id}>
      <header><div><span>{level.index} / {level.title}</span><h3>{level.heading}</h3></div></header>
      {level.streams.map((stream) => <details className="entrance-session-folder entrance-level-session" id={stream.id} key={stream.id}>
        <summary>
          <span>{level.title}</span>
          <div><small>{stream.dates}</small><h3>{stream.number} потік</h3></div>
          <i aria-hidden="true">+</i>
        </summary>
        <div className="entrance-session-documents">
          {stream.documents.map((document, index) => <a href={document.href} target="_blank" rel="noopener noreferrer" key={document.href}>
            <span>{String(index + 1).padStart(2, "0")}</span><div><small>{document.dates}</small><h4>{document.title}</h4></div><b>PDF · {document.pages} {document.pages === 1 ? "сторінка" : "сторінки"} ↗</b>
          </a>)}
        </div>
      </details>)}
    </article>)}

    <div className="entrance-format-note"><span>i</span><div><b>Дистанційна участь</b><p>Meeting ID, код доступу та спеціальні умови наведено в офіційних PDF. Перед випробуванням перевірте актуальність реквізитів у Приймальній комісії.</p></div><a href="mailto:pk@socosvita.kiev.ua">pk@socosvita.kiev.ua →</a></div>
  </div></section>;
}
