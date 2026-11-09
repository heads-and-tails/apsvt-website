import Link from "next/link";
import type { DepartmentEntry } from "@/lib/department-content";
import { departmentPublicationDate } from "@/lib/department-news-date";
import { DepartmentImages } from "@/app/components/DepartmentMedia";
import { marketingMasterStakeholderQuestionnaire, marketingQuestionnaires } from "@/lib/marketing-questionnaires";
import { marketingRegulations, marketingRegulationsSectionId } from "@/lib/marketing-regulations";
import { MarketingMobility } from "./MarketingMobility";
import { MarketingNonformal } from "./MarketingNonformal";
import { MarketingMonitoring } from "./MarketingMonitoring";

const discussionNews = [
  { date: "12 березня 2026", href: "/news/obhovorennia-opp-marketynh-12-bereznia-2026" },
  { date: "17 травня 2026", href: "/news/obhovorennia-opp-marketynh-17-travnia-2026" },
] as const;

function QuestionnaireLinks({ master }: { master: boolean }) {
  const questionnaires = master ? [...marketingQuestionnaires, marketingMasterStakeholderQuestionnaire] : marketingQuestionnaires;
  return <div className="marketing-programme-links">
    {questionnaires.map((questionnaire, index) => <a href={questionnaire.href} {...(questionnaire.format === "DOCX" ? { download: true } : { target: "_blank", rel: "noopener noreferrer" })} key={questionnaire.href}>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <div><small>{questionnaire.label} · {questionnaire.format}</small><strong>{questionnaire.title}</strong></div>
      <b aria-hidden="true">{questionnaire.format === "DOCX" ? "↓" : "↗"}</b>
    </a>)}
  </div>;
}

export function MarketingQuality({ entries }: { entries: DepartmentEntry[] }) {
  const discussionEntries = entries.filter((entry) => entry.entryType === "news" && !entry.hidden && ["quality", "marketing-quality-discussion"].includes(entry.sectionId))
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  return <section className="marketing-quality" id="quality"><div className="wrap">
    <header className="marketing-quality-head"><div className="idx">04 / Якість освіти</div><h2>Якість освіти</h2></header>
    <div className="marketing-quality-folders">
      <MarketingMonitoring entries={entries} />
      <details className="marketing-quality-folder" id="marketing-quality-discussion">
        <summary><span>02</span><strong>Обговорення змін до ОПП</strong><b aria-hidden="true">+</b></summary>
        <div className="marketing-quality-folder-body">
          <details className="marketing-quality-level"><summary><span>01</span><strong>Бакалаврат</strong><b aria-hidden="true">+</b></summary><div className="marketing-quality-level-body"><QuestionnaireLinks master={false} /></div></details>
          <details className="marketing-quality-level"><summary><span>02</span><strong>Магістратура</strong><b aria-hidden="true">+</b></summary><div className="marketing-quality-level-body"><QuestionnaireLinks master /><div className="marketing-programme-links">{discussionNews.map((item, index) => <Link href={item.href} key={item.href}><span>{String(index + 1).padStart(2, "0")}</span><div><small>Оголошення</small><strong>Обговорення ОПП «Маркетинг» · {item.date}</strong></div><b>→</b></Link>)}</div></div></details>
          {discussionEntries.length > 0 && <div className="marketing-quality-announcements"><h3>Повідомлення та результати обговорень</h3><div className="marketing-quality-announcement-grid">{discussionEntries.map((entry) => <article key={entry.id}><Link href={`/department-news/${entry.id}`}><DepartmentImages entry={entry} /><div>{departmentPublicationDate(entry) && <time dateTime={departmentPublicationDate(entry)!.dateTime}>{departmentPublicationDate(entry)!.label}</time>}<h4>{entry.title}</h4><span>Читати повністю →</span></div></Link></article>)}</div></div>}
        </div>
      </details>
      <MarketingMobility entries={entries} />
      <MarketingNonformal entries={entries} />
      <details className="marketing-quality-folder" id={marketingRegulationsSectionId}>
        <summary><span>05</span><strong>Нормативне забезпечення освітнього процесу та якості освіти</strong><b aria-hidden="true">+</b></summary>
        <div className="marketing-quality-folder-body">
          <div className="marketing-programme-links">
            {marketingRegulations.map((document, index) => <a href={document.href} target="_blank" rel="noopener noreferrer" key={document.href}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><small>{document.label}</small><strong>{document.title}</strong></div>
              <b aria-hidden="true">↗</b>
            </a>)}
          </div>
        </div>
      </details>
    </div>
  </div></section>;
}
