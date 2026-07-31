import { bachelorEntranceResults } from "@/lib/entrance-results";

export function EntranceExamResults() {
  return <section className="entrance-results" id="entrance-results"><div className="wrap">
    <div className="entrance-results-head">
      <div><div className="idx">06 / Приймальна комісія</div><h2>Результати вступних<br />випробувань</h2></div>
      <div className="entrance-results-note"><b>Офіційні результати</b><p>Оберіть рівень освіти та відкрийте окремий PDF з результатами потрібного вступного випробування.</p><span>Вступ 2026</span></div>
    </div>

    <nav className="entrance-results-level-nav" aria-label="Результати за рівнями освіти">
      <a href="#results-bachelor"><span>01</span><b>Бакалаврат</b><small>Результати опубліковано</small></a>
      <a href="#results-master"><span>02</span><b>Магістратура</b><small>Окремий підрозділ</small></a>
    </nav>

    <article className="entrance-results-level" id="results-bachelor">
      <header><span>01 / Бакалаврат</span><h3>Результати вступних випробувань від 29 липня 2026 року</h3><p>Кожен документ відкривається окремо у форматі PDF.</p></header>
      <div className="entrance-result-documents">
        {bachelorEntranceResults.map((document, index) =>
            <a href={document.href} target="_blank" rel="noreferrer" key={document.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><small>Бакалаврат · 29 липня 2026</small><h4>{document.title}</h4></div>
              <div className="entrance-result-action"><small>PDF · {document.pages} {document.pages === 1 ? "сторінка" : "сторінки"}</small><b>Відкрити ↗</b></div>
            </a>)}
      </div>
    </article>

    <article className="entrance-results-level" id="results-master">
      <header><span>02 / Магістратура</span><h3>Результати вступних випробувань</h3><p>Підрозділ готовий до публікації результатів магістратури.</p></header>
      <div className="entrance-results-empty"><span>—</span><div><b>Записів поки немає</b><p>Нові результати з’являться тут після затвердження Приймальною комісією.</p></div></div>
    </article>
  </div></section>;
}
