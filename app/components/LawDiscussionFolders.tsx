import type { DepartmentEntry } from "@/lib/department-content";
import type { PageDocument } from "@/lib/documents";
import { isProgrammeFolder, programmeFolderMatchesDocument } from "@/lib/programme-folders";
import { ProgrammeDocumentLinks } from "./LawFacultyProgramme";

export function LawDiscussionFolders({ folders, documents }: { folders: DepartmentEntry[]; documents: PageDocument[] }) {
  const visible = folders.filter((folder) => isProgrammeFolder(folder) && folder.sectionId === "discussion" && folder.status === "published" && !folder.hidden);
  if (!visible.length) return null;
  return <div className="wrap law-faculty-programme">{visible.map((folder) => {
    const children = documents.filter((document) => document.status === "published" && programmeFolderMatchesDocument(document, folder));
    return <details className="programme-material-group programme-managed-folder" key={folder.id} id={`folder-${folder.id}`}>
      <summary>{folder.title} <small>({children.length})</small></summary>
      {children.length ? <ProgrammeDocumentLinks documents={children} /> : <p className="academic-empty-state">Матеріали ще не оприлюднено.</p>}
    </details>;
  })}</div>;
}
