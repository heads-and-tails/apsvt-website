"use client";

import { useState } from "react";
import type { DepartmentEntry } from "@/lib/department-content";
import { DepartmentEditorialContent } from "@/app/components/DepartmentEditorialContent";

const masterProgrammes = [
  { year: "2026", href: "/documents/marketing/programmes/opp-marketing-master-2026.pdf" },
  { year: "2025", href: "/documents/marketing/programmes/opp-marketing-master-2025.pdf" },
];

const levels = [
  { id: "bachelor", label: "Бакалаврат", detail: "Перший рівень вищої освіти", number: "01" },
  { id: "master", label: "Магістратура", detail: "Другий рівень вищої освіти", number: "02" },
] as const;

export function MarketingEducationPrograms({ entries }: { entries: DepartmentEntry[] }) {
  const [activeTabs, setActiveTabs] = useState<{ bachelor: "programmes" | "plans"; master: "programmes" | "plans" }>({ bachelor: "programmes", master: "programmes" });
  return <section className="marketing-programmes" id="curriculum">
    <div className="wrap">
      <header className="marketing-programmes-head">
        <div><div className="idx">03 / Освітні програми</div><h2>Оберіть рівень освіти</h2></div>
        <p>Для кожного рівня окремо розміщуються освітні програми та навчальні плани.</p>
      </header>
      <div className="marketing-programme-levels">
        {levels.map((level) => <details key={level.id}>
          <summary><span>{level.number}</span><div><small>{level.detail}</small><strong>{level.label}</strong></div><b aria-hidden="true">+</b></summary>
          <div className="marketing-programme-body">
            <div className="marketing-programme-tabs" role="tablist" aria-label={`Матеріали рівня ${level.label}`}>
              {(["programmes", "plans"] as const).map((kind) => <button type="button" role="tab" id={`marketing-${level.id}-${kind}-tab`} aria-selected={activeTabs[level.id] === kind} aria-controls={`marketing-${level.id}-${kind}`} onClick={() => setActiveTabs((current) => ({ ...current, [level.id]: kind }))} key={kind}>{kind === "programmes" ? "Освітні програми" : "Навчальні плани"}</button>)}
            </div>
            {(["programmes", "plans"] as const).map((kind) => {
              const sectionId = `marketing-${level.id}-${kind}`;
              const sectionEntries = entries.filter((entry) => entry.sectionId === sectionId && !entry.hidden);
              return <div className="marketing-programme-subsection" id={sectionId} role="tabpanel" aria-labelledby={`${sectionId}-tab`} hidden={activeTabs[level.id] !== kind} key={sectionId}>
                <h3>{kind === "programmes" ? "Освітні програми" : "Навчальні плани"}</h3>
                {level.id === "master" && kind === "programmes" && <div className="marketing-programme-links">
                  {masterProgrammes.map((programme, index) => <a href={programme.href} target="_blank" rel="noreferrer" key={programme.year}><span>{String(index + 1).padStart(2, "0")}</span><div><small>Магістратура · {programme.year} · PDF</small><strong>{`Освітньо-професійна програма «Маркетинг» ${programme.year} року`}</strong></div><b>↗</b></a>)}
                </div>}
                {sectionEntries.length > 0 ? <DepartmentEditorialContent entries={sectionEntries} inline /> : level.id === "master" && kind === "programmes" ? null : <p className="marketing-programme-empty">Матеріали цього підрозділу поки не опубліковано.</p>}
              </div>;
            })}
          </div>
        </details>)}
      </div>
    </div>
  </section>;
}
