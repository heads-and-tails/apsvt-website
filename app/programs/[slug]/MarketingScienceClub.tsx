import type { DepartmentEntry } from "@/lib/department-content";
import { DepartmentEditorialContent } from "@/app/components/DepartmentEditorialContent";

export function MarketingScienceClub({ entries }: { entries: DepartmentEntry[] }) {
  const clubEntries = entries.filter((entry) =>
    entry.sectionId === "science-club"
    && entry.status === "published"
    && !entry.hidden
    && ["section", "article", "news", "photo", "material"].includes(entry.entryType),
  );

  return <section className="marketing-science-club" id="science-club" aria-labelledby="marketing-science-club-title">
    <h3 id="marketing-science-club-title">Науковий гурток</h3>
    <DepartmentEditorialContent entries={clubEntries} inline />
  </section>;
}
