import type { PageDocument } from "./documents";
import { lawFacultyPath } from "./law-faculty-structure";

export const lawFacultyAccreditationPath = `${lawFacultyPath}/faculty-documents/accreditation`;
export const lawMasterProgrammePath = `${lawFacultyPath}/faculty-programmes/d8-law-master`;
export const lawMasterSelfAssessmentDocumentId = "e661e946-3482-42b4-9f26-4e537f148de6";

export function lawFacultyAccreditationDocuments(pageDocuments: PageDocument[], programmeDocuments: PageDocument[]): PageDocument[] {
  const candidates = [
    ...pageDocuments.filter((document) => [lawFacultyAccreditationPath, "*"].includes(document.pagePath)),
    ...programmeDocuments.filter((document) => document.pagePath === lawMasterProgrammePath && document.id === lawMasterSelfAssessmentDocumentId),
  ];
  const published = new Map<string, PageDocument>();
  for (const document of candidates) {
    if (document.status === "published" && !published.has(document.id)) published.set(document.id, document);
  }
  return [...published.values()].sort((a, b) => a.sortOrder - b.sortOrder || b.createdAt.localeCompare(a.createdAt));
}
