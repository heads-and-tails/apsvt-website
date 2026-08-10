import { bachelorEntranceResults, bachelorEntranceResultsJuly31, type EntranceResultDocument } from "@/lib/entrance-results";

const masterInterviewVideo = "https://apsvt-academy.ikucha.chatgpt.site/media/admissions/results/2026-08-06/english-interview.mp4";
const masterInterviewResults = "/documents/admissions/results/2026-08-06/english-interview-master.pdf";

function ResultBatch({ date, documents }: { date: string; documents: EntranceResultDocument[] }) {
  return <div className="entrance-result-batch">
    <h4>{`Результати вступних випробувань від ${date} 2026 року`}</h4>
    <p>Кожен документ відкривається окремо у форматі PDF.</p>
    <div className="entrance-result-documents">
      {documents.map((document, index) => <a href={document.href} target="_blank" rel="noreferrer" key={document.href}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <div><small>Бакалаврат · {date} 2026</small><h5>{document.title}</h5></div>
        <div className="entrance-result-action"><small>PDF · {document.pages} {document.pages === 1 ? "сторінка" : "сторінки"}</small><b>Відкрити ↗</b></div>
      </a>)}
    </div>
  </div>;
}

function MasterResultBatch() {
  return <div className="entrance-result-batch">
    <h4>Результати вступних випробувань від 6 серпня 2026 року</h4>
    <p>Матеріали співбесіди з англійської мови для вступників на магістерські програми.</p>
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
  </div>;
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
      <ResultBatch date="31 липня" documents={bachelorEntranceResultsJuly31} />
      <ResultBatch date="29 липня" documents={bachelorEntranceResults} />
    </article>

    <article className="entrance-results-level" id="results-master">
      <header><span>02 / Магістратура</span><h3>Результати вступних випробувань</h3><p>Офіційні матеріали згруповано за датами проведення вступних випробувань.</p></header>
      <MasterResultBatch />
    </article>
  </div></section>;
}
