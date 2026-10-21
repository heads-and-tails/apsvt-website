import type { DepartmentEntry } from "@/lib/department-content";
import { marketingTeacherAchievementsSection } from "@/lib/marketing-teacher-achievements";
import { DepartmentEditorialContent } from "@/app/components/DepartmentEditorialContent";

export function MarketingTeacherAchievements({ entries }: { entries: DepartmentEntry[] }) {
  const materials = entries.filter((entry) => entry.sectionId === marketingTeacherAchievementsSection.id
    && entry.status === "published" && !entry.hidden
    && ["section", "article", "news", "photo", "material"].includes(entry.entryType));

  return <details className="marketing-quality-folder" id={marketingTeacherAchievementsSection.id} open>
    <summary><span>01</span><strong>{marketingTeacherAchievementsSection.title}</strong><b aria-hidden="true">+</b></summary>
    <div className="marketing-quality-folder-body">
      <DepartmentEditorialContent entries={materials} inline />
      {materials.length === 0 && <p className="marketing-quality-empty">У цьому підрозділі матеріали ще не розміщено.</p>}
    </div>
  </details>;
}
