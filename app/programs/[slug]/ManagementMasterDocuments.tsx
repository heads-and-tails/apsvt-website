import {
  managementMasterAnnotationGroups,
  managementMasterCourseDocuments,
  managementMasterPracticeDocuments,
  managementMasterProgramme,
  managementMasterStudyPlan,
  type ManagementMasterDocument,
} from "@/lib/management-master-documents";

function DocumentLinks({ documents }: { documents: readonly ManagementMasterDocument[] }) {
  return <div className="finance-plan-course-files">
    {documents.map((document) => <a href={document.href} target="_blank" rel="noreferrer" key={document.href}>
      {document.title}<span>{document.href.endsWith(".docx") ? "DOCX" : "PDF"} ↗</span>
    </a>)}
  </div>;
}

export function ManagementMasterDocuments() {
  const folders = [
    { title: "Робочі програми обов’язкових дисциплін", documents: managementMasterCourseDocuments, format: "PDF" },
    { title: "Практична підготовка та кваліфікаційна робота", documents: managementMasterPracticeDocuments, format: "PDF" },
    ...managementMasterAnnotationGroups.map((group) => ({ ...group, format: "DOCX" })),
  ];

  return <div className="wrap"><section className="finance-plan-documents" id="management-master-documents" aria-labelledby="management-master-documents-title">
    <div className="curriculum-block-heading">
      <div><span>D3 «Менеджмент» · 2026</span><h3 id="management-master-documents-title">Документи магістратури</h3></div>
      <p>Освітня програма, навчальний план та навчально-методичні матеріали.</p>
    </div>
    <DocumentLinks documents={[managementMasterProgramme, managementMasterStudyPlan]} />
    <div className="finance-plan-course-list" style={{ alignItems: "start" }}>
      {folders.map((folder, index) => <details key={folder.title}>
        <summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{folder.title}</strong><small>{folder.documents.length} {folder.format}</small><b aria-hidden="true">+</b></summary>
        <DocumentLinks documents={folder.documents} />
      </details>)}
    </div>
  </section></div>;
}
