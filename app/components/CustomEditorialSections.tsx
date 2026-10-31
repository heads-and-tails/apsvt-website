import type { DepartmentEntry } from "@/lib/department-content";
import { isCustomSectionRoot } from "@/lib/editorial-custom-sections";
import { DepartmentAttachments, DepartmentImages } from "./DepartmentMedia";
import { EditorialRichText } from "./EditorialRichText";
import { DepartmentEditorialContent } from "./DepartmentEditorialContent";

export function CustomEditorialSections({ entries }: { entries: DepartmentEntry[] }) {
  const sections = entries.filter((entry) => isCustomSectionRoot(entry) && entry.status === "published" && !entry.hidden).sort((a, b) => a.sortOrder - b.sortOrder);
  if (!sections.length) return null;

  return <div className="custom-editorial-sections" data-editorial-rendered="true">
    {sections.map((section) => <section className="custom-editorial-section" id={section.sectionId} aria-labelledby={`${section.sectionId}-title`} key={section.id}>
      <div className="wrap">
        <header className="custom-editorial-section-head"><div className="idx">Додано редакцією</div><h2 id={`${section.sectionId}-title`}>{section.title}</h2>{section.summary && <p>{section.summary}</p>}</header>
        <DepartmentImages entry={section} />
        <EditorialRichText text={section.body} />
        <DepartmentAttachments entry={section} />
      </div>
      <DepartmentEditorialContent entries={entries.filter((entry) => entry.status === "published" && !entry.hidden)} inline customSectionId={section.sectionId} />
    </section>)}
  </div>;
}
