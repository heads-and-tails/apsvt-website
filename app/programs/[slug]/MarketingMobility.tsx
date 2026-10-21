import type { DepartmentEntry } from "@/lib/department-content";
import { marketingMobilitySection } from "@/lib/marketing-mobility";
import { DepartmentEditorialContent } from "@/app/components/DepartmentEditorialContent";

export function MarketingMobility({ entries }: { entries: DepartmentEntry[] }) {
  const materials = entries.filter((entry) => entry.sectionId === marketingMobilitySection.id
    && entry.status === "published" && !entry.hidden
    && ["section", "article", "news", "photo", "material"].includes(entry.entryType));

  return <details className="marketing-quality-folder" id={marketingMobilitySection.id} open>
    <summary><span>03</span><strong>{marketingMobilitySection.title}</strong><b aria-hidden="true">+</b></summary>
    <div className="marketing-quality-folder-body">
      <h3>Магістратура</h3>
      <DepartmentEditorialContent entries={materials} inline />
      {materials.length === 0 && <p className="marketing-quality-empty">У цьому підрозділі матеріали ще не розміщено.</p>}
    </div>
  </details>;
}
