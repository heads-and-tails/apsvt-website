"use client";

import { useState } from "react";
import type { DepartmentEntry } from "@/lib/department-content";
import { DepartmentEditorialContent } from "@/app/components/DepartmentEditorialContent";

const tabs = [
  { id: "marketing-partners", title: "Наші партнери", type: "partner" },
  { id: "marketing-partner-agreements", title: "Договори та меморандуми", type: "material" },
] as const;

export function MarketingPartners({ entries }: { entries: DepartmentEntry[] }) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>(tabs[0].id);
  return <section className="marketing-partners" id="marketing-partners">
    <div className="wrap">
      <div className="sec-head"><div><div className="idx">09 / Співпраця</div><h2>Партнери кафедри</h2></div></div>
      <div className="marketing-partner-tabs" role="tablist" aria-label="Партнери кафедри">
        {tabs.map((tab) => <button type="button" role="tab" id={`${tab.id}-tab`} aria-selected={active === tab.id} aria-controls={`${tab.id}-panel`} tabIndex={active === tab.id ? 0 : -1} onClick={() => setActive(tab.id)} key={tab.id}>{tab.title}</button>)}
      </div>
      {tabs.map((tab) => {
        const tabEntries = entries.filter((entry) => entry.sectionId === tab.id && entry.entryType === tab.type && !entry.hidden);
        return <div role="tabpanel" id={`${tab.id}-panel`} aria-labelledby={`${tab.id}-tab`} hidden={active !== tab.id} key={tab.id}>
          {tabEntries.length ? <DepartmentEditorialContent entries={tabEntries} inline /> : <p className="marketing-partner-empty">Матеріали цього підрозділу поки не опубліковано.</p>}
        </div>;
      })}
    </div>
  </section>;
}
