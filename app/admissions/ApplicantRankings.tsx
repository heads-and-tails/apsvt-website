import {
  applicantRankingDocumentCount,
  bachelorApplicantRankings,
  bachelorRankingDocumentCount,
  masterApplicantRankings,
  masterRankingDocumentCount,
} from "@/lib/admissions-rankings";

export function ApplicantRankings() {
  return <section className="applicant-rankings" id="applicant-rankings"><div className="wrap">
    <div className="applicant-rankings-head">
      <div><div className="idx">08 / Приймальна комісія</div><h2>Рейтингові списки<br />вступників</h2></div>
      <aside><span>Оприлюднено</span><b>{applicantRankingDocumentCount}</b><p>рейтингових списків<br />для бакалаврату й магістратури</p></aside>
    </div>

    <nav className="applicant-ranking-level-nav" aria-label="Рейтингові списки за рівнями освіти">
      <a href="#rankings-bachelor"><span>01</span><b>Бакалаврат</b><small>{`${bachelorRankingDocumentCount} PDF-документів`}</small></a>
      <a href="#rankings-master"><span>02</span><b>Магістратура</b><small>{`${masterRankingDocumentCount} CSV-таблиць`}</small></a>
    </nav>

    <article className="applicant-ranking-level" id="rankings-bachelor">
      <header><span>01 / Бакалаврат</span><div><h3>Рейтингові списки від 03 серпня 2026 року</h3><p>Документи згруповано за освітньою програмою, формою навчання та курсом вступу.</p></div></header>
      <div className="applicant-ranking-groups">
        {bachelorApplicantRankings.map((group) => <details key={group.code}>
          <summary><span>{group.code}</span><h4>{group.programme}</h4><b>{group.documents.length} {group.documents.length === 1 ? "список" : group.documents.length < 5 ? "списки" : "списків"}</b><i>+</i></summary>
          <div className="applicant-ranking-documents">
            {group.documents.map((document, index) => <a href={document.href} target="_blank" rel="noreferrer" key={document.href}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h5>{document.title}</h5><small>{document.meta}</small></div>
              <b>PDF · відкрити ↗</b>
            </a>)}
          </div>
        </details>)}
      </div>
    </article>

    <article className="applicant-ranking-level" id="rankings-master">
      <header><span>02 / Магістратура</span><div><h3>Рейтингові списки вступників від 24 серпня 2026 року</h3><p>Офіційні таблиці Приймальної комісії зібрано в одному блоці. Натисніть на розділ, щоб переглянути та завантажити потрібний список.</p></div></header>
      <div className="applicant-ranking-groups">
        <details>
          <summary><span>24.08</span><h4>Магістратура · рейтингові списки</h4><b>{masterRankingDocumentCount} списків</b><i>+</i></summary>
          <div className="applicant-ranking-documents">
            {masterApplicantRankings.map((document, index) => <a href={document.href} download key={document.href}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h5>{document.title}</h5><small>{document.meta}</small></div>
              <b>CSV · завантажити ↓</b>
            </a>)}
          </div>
        </details>
      </div>
    </article>
  </div></section>;
}
