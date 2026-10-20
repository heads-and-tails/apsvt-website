import type { DepartmentEntry } from "@/lib/department-content";
import { marketingMethodicalGroups } from "@/lib/marketing-methodical";
import { DepartmentEditorialContent } from "@/app/components/DepartmentEditorialContent";

const retainedMaterials: Record<string, { year: string; href: string; title: string }[]> = {
  "marketing-methodical-master-qualification": [
    { year: "2026", href: "/documents/marketing/methodical/qualification-master-2026.pdf", title: "Графік підготовки та захисту кваліфікаційних робіт за ОПП «Маркетинг» для здобувачів другого (магістерського) рівня вищої освіти набору 2026 року" },
    { year: "2025", href: "/documents/marketing/methodical/qualification-master-2025.pdf", title: "Графік підготовки та захисту кваліфікаційних робіт за ОПП «Маркетинг» для здобувачів другого (магістерського) рівня вищої освіти набору 2025 року" },
  ],
  "marketing-methodical-consultations": [
    { year: "2026/27", href: "/documents/marketing/methodical/teacher-consultations-2026-2027.pdf", title: "Графік індивідуальних консультацій викладачів кафедри маркетингу" },
  ],
  "marketing-methodical-publications": [
    { year: "Видання кафедри", href: "/research/journals#marketing-publications", title: "Монографії та навчальний посібник кафедри" },
  ],
};

function academicYear(entry: DepartmentEntry) {
  const value = `${entry.date} ${entry.fileName} ${entry.title}`;
  const range = value.match(/(20\d{2})\s*[-–/]\s*(20\d{2}|\d{2})/);
  if (range) return `${range[1]}/${range[2].length === 4 ? range[2].slice(2) : range[2]}`;
  return value.match(/20\d{2}/)?.[0] || "Рік не зазначено";
}

export function MarketingMethodicalFolders({ entries }: { entries: DepartmentEntry[] }) {
  return <div className="marketing-methodical-folders">
    {marketingMethodicalGroups.map((group, groupIndex) => <details className="marketing-methodical-folder" key={group.id}>
      <summary><span>{String(groupIndex + 1).padStart(2, "0")}</span><strong>{group.title}</strong><b aria-hidden="true">+</b></summary>
      <div className="marketing-methodical-folder-body">
        {group.sections.map((section) => {
          const sectionEntries = entries.filter((entry) => entry.sectionId === section.id && !entry.hidden);
          const files = sectionEntries.filter((entry) => entry.entryType === "material" && entry.fileUrl);
          const text = sectionEntries.filter((entry) => entry.entryType !== "material");
          const years = [...new Set(files.map(academicYear))].sort((a, b) => b.localeCompare(a, "uk"));
          const retained = retainedMaterials[section.id] || [];
          return <details className="marketing-methodical-subfolder" id={section.id} key={section.id}>
            <summary><span>{group.title}</span><strong>{section.title}</strong><b aria-hidden="true">+</b></summary>
            {text.length > 0 && <DepartmentEditorialContent entries={text} inline />}
            {years.map((year) => <div className="marketing-methodical-year" key={year}>
              <h4>{year === "Рік не зазначено" ? year : `${year} навчальний рік`}</h4>
              <div className="marketing-methodical-file-list">{files.filter((entry) => academicYear(entry) === year).map((entry) => <a href={entry.fileUrl} target="_blank" rel="noreferrer" key={entry.id}><span>{year}</span><strong>{entry.title}</strong><b>{entry.fileUrl.toLowerCase().split("?")[0].endsWith(".pdf") ? "PDF ↗" : "↗"}</b></a>)}</div>
            </div>)}
            {retained.length > 0 && <div className="marketing-methodical-file-list">{retained.map((file) => <a href={file.href} target="_blank" rel="noreferrer" key={file.href}><span>{file.year}</span><strong>{file.title}</strong><b>{file.href.endsWith(".pdf") ? "PDF ↗" : "↗"}</b></a>)}</div>}
            {section.children?.map((child) => {
              const childEntries = entries.filter((entry) => entry.sectionId === child.id && !entry.hidden);
              const childFiles = childEntries.filter((entry) => entry.entryType === "material" && entry.fileUrl);
              const childYears = [...new Set(childFiles.map(academicYear))].sort((a, b) => b.localeCompare(a, "uk"));
              return <details className="marketing-methodical-elective-subfolder" id={child.id} key={child.id}>
                <summary><strong>{child.title}</strong><b aria-hidden="true">+</b></summary>
                <div className="marketing-methodical-elective-body">
                  <DepartmentEditorialContent entries={childEntries.filter((entry) => entry.entryType !== "material")} inline />
                  {childYears.map((year) => <div className="marketing-methodical-year" key={year}><h4>{year === "Рік не зазначено" ? year : `${year} навчальний рік`}</h4><div className="marketing-methodical-file-list">{childFiles.filter((entry) => academicYear(entry) === year).map((entry) => <a href={entry.fileUrl} target="_blank" rel="noreferrer" key={entry.id}><span>{year}</span><strong>{entry.title}</strong><b>{entry.fileUrl.toLowerCase().split("?")[0].endsWith(".pdf") ? "PDF ↗" : "↗"}</b></a>)}</div></div>)}
                  {!childEntries.length && <p className="marketing-methodical-empty">Матеріали цього підрозділу поки не опубліковано.</p>}
                </div>
              </details>;
            })}
            {!sectionEntries.length && !retained.length && !section.children?.length && <p className="marketing-methodical-empty">Матеріали цього підрозділу поки не опубліковано.</p>}
          </details>;
        })}
      </div>
    </details>)}
  </div>;
}
