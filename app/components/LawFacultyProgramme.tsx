import type { DepartmentEntry } from "@/lib/department-content";
import type { PageDocument } from "@/lib/documents";
import { lawProgrammeDocumentSection, lawProgrammeDocumentSections, type LawFacultyProgramme } from "@/lib/law-faculty-programmes";
import type { ProgrammePublication } from "@/lib/public-administration-materials";
import { DepartmentEditorialContent } from "./DepartmentEditorialContent";
import { PublicAdministrationMaterials, ProgrammeMaterialGroup } from "./PublicAdministrationMaterials";
import "./law-faculty-programmes.css";

export function LawFacultyProgramme({ programme, publication, entries, documents }: {
  programme: LawFacultyProgramme;
  publication?: ProgrammePublication;
  entries: DepartmentEntry[];
  documents: PageDocument[];
}) {
  const facts = [
    { label: "Назва освітньої програми", value: programme.name },
    { label: "Спеціальність", value: `${programme.code} «${programme.code === "D8" ? "Право" : "Публічне управління та адміністрування"}»` },
    { label: "Рівень вищої освіти", value: programme.level },
    ...(publication?.facts || []),
  ];
  const visibleEntries = entries.filter((entry) => !entry.hidden && entry.status === "published");
  const materialEntries = visibleEntries.filter((entry) => entry.entryType === "material");
  const officialDocument = publication?.currentDocument.href || programme.documentHref;
  const remainingGroups = publication?.groups.filter((group) => !lawProgrammeDocumentSections.some((section) => (section.curatedGroups as readonly string[]).includes(group.id)));
  const otherEntries = visibleEntries.filter((entry) => entry.entryType !== "material" || !lawProgrammeDocumentSection(entry.title, entry.sectionId));
  const otherDocuments = documents.filter((document) => !lawProgrammeDocumentSection(document.title, document.category));

  return <div className="law-faculty-programme">
    <nav className="wrap law-programme-section-links" aria-label="Розділи освітньої програми">
      <a href="#programme-information">Інформація про освітню програму</a>
      {lawProgrammeDocumentSections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}
    </nav>
    <section id="programme-information" className="law-programme-section"><div className="wrap">
      <h2>Інформація про освітню програму</h2>
      <dl className="programme-material-facts">{facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
    </div></section>
    {lawProgrammeDocumentSections.map((section) => {
      const materials = materialEntries.filter((entry) => lawProgrammeDocumentSection(entry.title, entry.sectionId) === section.id);
      const files = documents.filter((document) => lawProgrammeDocumentSection(document.title, document.category) === section.id);
      const groups = publication?.groups.filter((group) => (section.curatedGroups as readonly string[]).includes(group.id)) || [];
      const sourceDocument = section.id === "programme-document" ? officialDocument : undefined;
      const hasContent = sourceDocument || materials.length || files.length || groups.some((group) => group.files.length);
      return <section id={section.id} className="law-programme-section" key={section.id}><div className="wrap">
        <h2>{section.title}</h2>
        {materials.length > 0 && <DepartmentEditorialContent inline entries={materials} />}
        {sourceDocument && !materials.some((entry) => entry.fileUrl === sourceDocument) && <ul className="programme-material-list"><li><a href={sourceDocument} target="_blank" rel="noopener noreferrer"><span>{publication?.currentDocument.title || "Освітня програма · редакція 2025"}</span><small>PDF ↗</small></a></li></ul>}
        {groups.map((group) => <ProgrammeMaterialGroup group={group} headingLevel={group.title === section.title ? null : 3} key={group.id} />)}
        <ProgrammeDocumentLinks documents={files} />
        {!hasContent && <p className="academic-empty-state">{section.empty}</p>}
      </div></section>;
    })}
    {publication && <PublicAdministrationMaterials publication={{ ...publication, facts: [], groups: remainingGroups || [] }} />}
    <div className="wrap"><DepartmentEditorialContent inline entries={otherEntries} /><ProgrammeDocumentLinks documents={otherDocuments} /></div>
  </div>;
}

function ProgrammeDocumentLinks({ documents }: { documents: PageDocument[] }) {
  if (!documents.length) return null;
  return <ul className="programme-material-list">{documents.map((document) => <li key={document.id}><a href={document.fileUrl} target="_blank" rel="noopener noreferrer"><span>{document.title}{document.description && <small>{document.description}</small>}</span><small>{document.fileName} ↗</small></a></li>)}</ul>;
}
