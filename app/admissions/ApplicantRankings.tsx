import {
  applicantRankingDocumentCount,
  bachelorApplicantRankings,
  bachelorRankingDocumentCount,
  masterApplicantRankings,
  masterRankingDocumentCount,
} from "@/lib/admissions-rankings";
import type { ApplicantRankingGroup } from "@/lib/admissions-rankings";

function RankingGroups({ groups }: { groups: ApplicantRankingGroup[] }) {
  return <div className="applicant-ranking-groups">
    {groups.map((group) => <details key={group.code}>
      <summary><span>{group.code}</span><h4>{group.programme}</h4><b>{group.documents.length} {group.documents.length === 1 ? "список" : group.documents.length < 5 ? "списки" : "списків"}</b><i>+</i></summary>
      <div className="applicant-ranking-documents">
        {group.documents.map((document, index) => <a href={document.href} target="_blank" rel="noreferrer" key={document.href}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div><h5>{document.title}</h5><small>{document.meta}</small></div>
          <b>PDF · відкрити ↗</b>
        </a>)}
      </div>
    </details>)}
  </div>;
}

export function ApplicantRankings() {
  return <section className="applicant-rankings" id="applicant-rankings"><div className="wrap">
    <div className="applicant-rankings-head">
      <div><div className="idx">08 / Приймальна комісія</div><h2>Рейтингові списки<br />вступників</h2></div>
      <aside><span>Оприлюднено</span><b>{applicantRankingDocumentCount}</b><p>рейтингових списків<br />для бакалаврату й магістратури</p></aside>
    </div>

    <nav className="applicant-ranking-level-nav" aria-label="Рейтингові списки за рівнями освіти">
      <a href="#rankings-bachelor"><span>01</span><b>Бакалаврат</b><small>{`${bachelorRankingDocumentCount} PDF-документів`}</small></a>
      <a href="#rankings-master"><span>02</span><b>Магістратура</b><small>{`${masterRankingDocumentCount} PDF-документи`}</small></a>
    </nav>

    <article className="applicant-ranking-level" id="rankings-bachelor">
      <header><span>01 / Бакалаврат</span><div><h3>Рейтингові списки від 03 серпня 2026 року</h3><p>Документи згруповано за освітньою програмою, формою навчання та курсом вступу.</p></div></header>
      <RankingGroups groups={bachelorApplicantRankings} />
    </article>

    <article className="applicant-ranking-level" id="rankings-master">
      <header><span>02 / Магістратура</span><div><h3>Рейтингові списки вступників від 24.08.2026</h3><p>Оновлений комплект офіційних PDF згруповано за спеціальністю, формою навчання та типом рейтингового списку.</p></div></header>
      <RankingGroups groups={masterApplicantRankings} />
    </article>
  </div></section>;
}
