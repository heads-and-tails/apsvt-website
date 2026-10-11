import type { ReactNode } from "react";
import type { DepartmentEntry } from "@/lib/department-content";
import { DepartmentEditorialContent } from "./DepartmentEditorialContent";
import { EducationQualitySection } from "./EducationQualitySection";
import { SectionHub } from "./SectionHub";

// The same section IDs drive the public page and the editorial section picker.
export function EditableAcademicSections({ sections, entries, pagePath, content = {} }: {
  sections: readonly { id: string; label: string }[];
  entries: DepartmentEntry[];
  pagePath: string;
  content?: Record<string, ReactNode>;
}) {
  const visible = entries.filter((entry) => !["hero", "override", "quality"].includes(entry.entryType));
  const sectionFor = (entry: DepartmentEntry) => {
    if (sections.some((section) => section.id === entry.sectionId)) return entry.sectionId;
    const defaults: Record<string, string> = { teacher: "department-team", partner: "partners", news: "news", article: "science", material: "documents", photo: "about" };
    return sections.some((section) => section.id === defaults[entry.entryType]) ? defaults[entry.entryType] : sections[0].id;
  };
  return <SectionHub sections={sections.map((section, index) => ({ id: section.id, title: section.label, index: String(index + 1).padStart(2, "0"), icon: String(index + 1).padStart(2, "0"), description: "" }))}>
    {sections.map((section) => {
      const items = visible.filter((entry) => sectionFor(entry) === section.id);
      return <section id={section.id} key={section.id} className="editable-academic-section">
        {section.id === "quality" && <EducationQualitySection entries={entries} pagePath={pagePath} id="quality-rubrics" title="Якість освіти" />}
        {content[section.id]}
        {!items.length && !content[section.id] && section.id !== "quality" && <div className="wrap"><p className="academic-empty-state">Матеріали ще не оприлюднено.</p></div>}
        <DepartmentEditorialContent entries={items} />
      </section>;
    })}
  </SectionHub>;
}
