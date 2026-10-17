import type { DepartmentEntry } from "@/lib/department-content";
import { DepartmentEditorialContent } from "@/app/components/DepartmentEditorialContent";

export function MarketingRepository({ entries }: { entries: DepartmentEntry[] }) {
  const materials = entries.filter((entry) =>
    entry.sectionId === "marketing-repository"
    && entry.status === "published"
    && !entry.hidden
    && ["section", "article", "news", "photo", "material"].includes(entry.entryType),
  );

  return <section className="marketing-repository" id="marketing-repository" aria-labelledby="marketing-repository-title">
    <div className="wrap">
      <h2 id="marketing-repository-title">РЕПОЗИТАРІЙ</h2>
      <DepartmentEditorialContent entries={materials} inline />
    </div>
  </section>;
}
