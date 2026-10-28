import type { DepartmentEntry } from "@/lib/department-content";
import { DepartmentEditorialContent } from "@/app/components/DepartmentEditorialContent";
import { marketingNonformalEntries, marketingNonformalLevels, marketingNonformalRubrics, marketingNonformalSection } from "@/lib/marketing-nonformal";
import "./marketing-nonformal.css";
import { MarketingNonformalNavigation } from "./MarketingNonformalNavigation";

export function MarketingNonformal({ entries }: { entries: DepartmentEntry[] }) {
  return <details className="marketing-quality-folder marketing-nonformal" id={marketingNonformalSection.id}>
    <MarketingNonformalNavigation />
    <summary><span>04</span><strong>{marketingNonformalSection.title}</strong><b aria-hidden="true">+</b></summary>
    <div className="marketing-quality-folder-body">
      {marketingNonformalLevels.map((level, levelIndex) => <details className="marketing-quality-level" id={`${marketingNonformalSection.id}-${level.id}`} key={level.id}>
        <summary><span>{String(levelIndex + 1).padStart(2, "0")}</span><strong>{level.title}</strong><b aria-hidden="true">+</b></summary>
        <div className="marketing-quality-level-body">
          {marketingNonformalRubrics.map((rubric) => {
            const sectionId = `${marketingNonformalSection.id}-${level.id}-${rubric.id}`;
            const materials = marketingNonformalEntries(entries, sectionId);
            return <details className="marketing-quality-level marketing-nonformal-rubric" id={sectionId} key={rubric.id}>
              <summary><strong>{rubric.title}</strong><b aria-hidden="true">+</b></summary>
              <div className="marketing-nonformal-content">
                <DepartmentEditorialContent entries={rubric.id === "recognition" ? materials.map((entry) => entry.entryType === "news" ? { ...entry, entryType: "section" as const } : entry) : materials} inline />
                {materials.length === 0 && <p className="marketing-quality-empty">У цьому підрозділі матеріали ще не розміщено.</p>}
              </div>
            </details>;
          })}
        </div>
      </details>)}
    </div>
  </details>;
}
