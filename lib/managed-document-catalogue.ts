import type { DepartmentEntry } from "@/lib/department-content";
import type { PageDocument } from "@/lib/documents";
import { editorialAccessOptions, isDepartmentPagePath } from "@/lib/editorial-access";
import type { OfficialDocument } from "@/lib/official-documents";

function sourceLabel(pagePath: string): string {
  return editorialAccessOptions.find((option) => option.value === pagePath)?.label || "підрозділ Академії";
}

function formatFor(fileName: string, mimeType = ""): OfficialDocument["format"] {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (extension === "doc" || extension === "docx" || mimeType.includes("word")) return "DOCX";
  if (extension === "xls" || extension === "xlsx" || mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "XLSX";
  if (extension === "ppt" || extension === "pptx" || mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "PPTX";
  return "PDF";
}

function yearFor(value: string): string | undefined {
  const year = value.match(/\b(20\d{2})\b/)?.[1];
  return year;
}

function descriptionFor(description: string, pagePath: string): string {
  const source = sourceLabel(pagePath);
  return description.trim()
    ? `${description.trim()} · Джерело: ${source}.`
    : `Документ, опублікований підрозділом «${source}».`;
}

export function buildManagedDocumentCatalogue(
  pageDocuments: PageDocument[],
  departmentEntries: DepartmentEntry[],
): OfficialDocument[] {
  const documents: OfficialDocument[] = [];

  for (const document of pageDocuments) {
    if (!isDepartmentPagePath(document.pagePath) || document.status !== "published") continue;
    documents.push({
      id: `editorial-document-${document.id}`,
      category: "departments",
      title: document.title,
      description: descriptionFor(document.description, document.pagePath),
      href: document.fileUrl,
      format: formatFor(document.fileName, document.mimeType),
      updated: yearFor(document.updatedAt),
      status: "current",
    });
  }

  for (const entry of departmentEntries) {
    if (!isDepartmentPagePath(entry.pagePath) || entry.status !== "published" || !entry.fileUrl) continue;
    if (entry.entryType !== "material" && entry.entryType !== "quality") continue;
    documents.push({
      id: `department-material-${entry.id}`,
      category: "departments",
      title: entry.title,
      description: descriptionFor(entry.summary || entry.body, entry.pagePath),
      href: entry.fileUrl,
      format: formatFor(entry.fileName || entry.fileUrl),
      updated: yearFor(entry.date || entry.updatedAt),
      status: "current",
    });
  }

  const unique = new Map<string, OfficialDocument>();
  for (const document of documents) {
    const key = document.href.trim().toLocaleLowerCase("uk-UA");
    if (key && !unique.has(key)) unique.set(key, document);
  }
  return [...unique.values()];
}
