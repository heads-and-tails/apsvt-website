import {
  bachelorEntranceResults,
  bachelorEntranceResultsJuly31,
  bachelorEntranceResultsSeptember9,
  bachelorEntranceResultsSeptember9Nrk6Nrk7,
  bachelorEntranceResultsSeptember11,
  masterEntranceResultsAugust7,
  masterEntranceResultsAugust18,
  masterEntranceResultsAugust19,
  masterEntranceResultsSeptember16,
  masterEntranceResultsSeptember17,
  masterInterviewVideo,
  type EntranceResultDocument,
} from "@/lib/entrance-results";

const masterInterviewResults = "/documents/admissions/results/2026-08-06/english-interview-master.pdf";

function September11Results() {
  return <details className="entrance-session-folder" id="results-september-11-2026">
    <summary>
      <span>11.09.2026 / Бакалаврат</span>
      <div><small>4 документи · PDF</small><h3>Результати вступних випробувань від 11 вересня 2026 року</h3><p>Натисніть, щоб відкрити надіслані результати вступних випробувань.</p></div>
      <i aria-hidden="true">+</i>
    </summary>
    <div className="entrance-result-documents september-results-documents">
      {bachelorEntranceResultsSeptember11.map((document, index) => <a href={document.href} target="_blank" rel="noreferrer" key={document.href}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <div><small>Бакалаврат · 11 вересня 2026</small><h5>{document.title}</h5></div>
        <div className="entrance-result-action"><small>PDF · 1 сторінка</small><b>Відкрити ↗</b></div>
      </a>)}
    </div>
  </details>;
}

function SeptemberResults() {
  const groups = [
    { title: null, documents: bachelorEntranceResultsSeptember9 },
    { title: "Основа вступу — НРК6 або НРК7", documents: bachelorEntranceResultsSeptember9Nrk6Nrk7 },
  ];
  return <details className="entrance-session-folder" id="results-september-9-2026">
    <summary>
      <span>09.09.2026 / Бакалаврат</span>
      <div><small>9 документів · PDF</small><h3>Результати вступних випробувань від 9 вересня 2026 року</h3><p>Відкрийте запис, оберіть потрібний документ або окрему групу за основою вступу.</p></div>
      <i aria-hidden="true">+</i>
    </summary>
    <div className="september-results-groups">
      {groups.map((group) => <details className="september-results-group" key={group.documents[0].href}>
        <summary>{group.title && <h4>{group.title}</h4>}<span style={group.title ? undefined : { display: "inline", marginTop: 0 }}>{group.documents.length} PDF · Відкрити</span></summary>
        <div className="entrance-result-documents">
          {group.documents.map((document, index) => <a href={document.href} target="_blank" rel="noreferrer" key={document.href}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><small>9 вересня 2026{group.title && ` · ${group.title}`}</small><h5>{document.title}</h5></div>
            <div className="entrance-result-action"><small>PDF · 1 сторінка</small><b>Відкрити ↗</b></div>
          </a>)}
        </div>
      </details>)}
    </div>
  </details>;
}

function ResultBatch({ date, documents, level = "Бакалаврат" }: { date: string; documents: EntranceResultDocument[]; level?: "Бакалаврат" | "Магістратура" }) {
  return <details className="entrance-session-folder entrance-result-batch">
    <summary>
      <span>{date} 2026 / {level}</span>
      <div><small>{documents.length} {documents.length === 1 ? "документ" : "документів"} · PDF</small><h3>{`Результати вступних випробувань від ${date} 2026 року`}</h3><p>Натисніть, щоб відкрити офіційні результати.</p></div>
      <i aria-hidden="true">+</i>
    </summary>
    <div className="entrance-result-documents">
      {documents.map((document, index) => <a href={document.href} target="_blank" rel="noreferrer" key={document.href}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <div><small>{level} · {date} 2026</small><h5>{document.title}</h5></div>
        <div className="entrance-result-action"><small>PDF · {document.pages} {document.pages === 1 ? "сторінка" : "сторінки"}</small><b>Відкрити ↗</b></div>
      </a>)}
    </div>
  </details>;
}

function MasterResultBatch() {
  return <details className="entrance-session-folder entrance-result-batch">
    <summary><span>6 серпня 2026 / Магістратура</span><div><small>2 матеріали · PDF та відео</small><h3>Результати вступних випробувань від 6 серпня 2026 року</h3><p>Матеріали співбесіди з англійської мови для вступників на магістерські програми.</p></div><i aria-hidden="true">+</i></summary>
    <div className="entrance-result-documents">
      <a href={masterInterviewResults} target="_blank" rel="noreferrer">
        <span>01</span>
        <div><small>Магістратура · 6 серпня 2026</small><h5>Співбесіда з англійської мови</h5></div>
        <div className="entrance-result-action"><small>PDF · 2 сторінки</small><b>Відкрити ↗</b></div>
      </a>
      <a href={masterInterviewVideo} target="_blank" rel="noreferrer">
        <span>02</span>
        <div><small>Магістратура · 6 серпня 2026</small><h5>Відеозапис співбесіди</h5></div>
        <div className="entrance-result-action"><small>MP4 · відео</small><b>Відкрити ↗</b></div>
      </a>
    </div>
    <div className="entrance-result-video">
      <video controls preload="metadata" playsInline>
        <source src={masterInterviewVideo} type="video/mp4" />
        Ваш браузер не підтримує відтворення відео.
      </video>
      <p>Відеозапис можна переглянути безпосередньо на сторінці або відкрити в окремій вкладці.</p>
    </div>
  </details>;
}

export function EntranceExamResults() {
  return <section className="entrance-results" id="entrance-results"><div className="wrap">
    <div className="entrance-results-head">
      <div><div className="idx">07 / Приймальна комісія</div><h2>Результати вступних<br />випробувань</h2></div>
      <div className="entrance-results-note"><b>Офіційні результати</b><p>Оберіть рівень освіти та відкрийте окремий PDF з результатами потрібного вступного випробування.</p><span>Вступ 2026</span></div>
    </div>

    <nav className="entrance-results-level-nav" aria-label="Результати за рівнями освіти">
      <a href="#results-bachelor"><span>01</span><b>Бакалаврат</b><small>Результати опубліковано</small></a>
      <a href="#results-master"><span>02</span><b>Магістратура</b><small>Окремий підрозділ</small></a>
    </nav>

    <article className="entrance-results-level" id="results-bachelor">
      <header><span>01 / Бакалаврат</span><h3>Офіційні відомості за датами проведення</h3><p>Нові записи розміщено першими; попередні результати залишаються доступними в архіві сторінки.</p></header>
      <September11Results />
      <SeptemberResults />
      <ResultBatch date="31 липня" documents={bachelorEntranceResultsJuly31} />
      <ResultBatch date="29 липня" documents={bachelorEntranceResults} />
    </article>

    <article className="entrance-results-level" id="results-master">
      <header><span>02 / Магістратура</span><h3>Результати вступних випробувань</h3><p>Офіційні матеріали згруповано за датами проведення вступних випробувань.</p></header>
      <ResultBatch date="17 вересня" documents={masterEntranceResultsSeptember17} level="Магістратура" />
      <ResultBatch date="16 вересня" documents={masterEntranceResultsSeptember16} level="Магістратура" />
      <ResultBatch date="19 серпня" documents={masterEntranceResultsAugust19} level="Магістратура" />
      <ResultBatch date="18 серпня" documents={masterEntranceResultsAugust18} level="Магістратура" />
      <ResultBatch date="7 серпня" documents={masterEntranceResultsAugust7} level="Магістратура" />
      <MasterResultBatch />
    </article>
  </div></section>;
}
