import type { DepartmentEntry, DepartmentEntryInput } from "./department-content";
import type { PageDocument, PageDocumentInput } from "./documents";
import { lawFacultyProgrammes, lawProgrammePath } from "./law-faculty-programmes";

export const programmeFolderRole = "programme-document-folder";
export const programmeFolderSections = [
  { id: "working-programmes", kind: "Робоча програма", title: "Робочі програми" },
  { id: "course-annotations", kind: "Анотація", title: "Анотації" },
] as const;
export type ProgrammeFolderSection = (typeof programmeFolderSections)[number]["id"];

export function programmeFolderSection(kind: string): ProgrammeFolderSection | undefined {
  return programmeFolderSections.find((section) => section.kind === kind)?.id;
}

export function isProgrammeFolder(entry: Pick<DepartmentEntry, "pagePath" | "sectionId" | "entryType" | "role">): boolean {
  return entry.role === programmeFolderRole && entry.entryType === "section"
    && programmeFolderSections.some((section) => section.id === entry.sectionId)
    && lawFacultyProgrammes.some((programme) => lawProgrammePath(programme.id) === entry.pagePath);
}

export function programmeDocumentCategory(kind: string, year: string, folderId = ""): string {
  return [kind.trim(), year.trim(), folderId ? `папка:${folderId}` : ""].filter(Boolean).join(" · ");
}

export function parseProgrammeDocumentCategory(category: string) {
  const [kind = "", ...parts] = category.split("·").map((part) => part.trim());
  const tags = parts.filter((part) => /^папка:/i.test(part));
  const folderId = tags[0]?.match(/^папка:([a-z0-9_-]{1,120})$/i)?.[1] || "";
  return {
    kind,
    year: parts.filter((part) => !/^папка:/i.test(part)).join(" · "),
    folderId,
    invalidFolder: tags.length > 1 || tags.length === 1 && !folderId,
  };
}

export function programmeFolderInput(pagePath: string, sectionId: ProgrammeFolderSection, title: string, sortOrder = 10): DepartmentEntryInput {
  return {
    pagePath, sectionId, entryType: "section", title: title.trim(), summary: "", body: "",
    imageUrl: "", imageAlt: "", fileUrl: "", fileName: "", date: "", hideDate: true,
    role: programmeFolderRole, email: "", profileUrl: "", hidden: false,
    status: "published", sortOrder,
  };
}

export function programmeFolderMatchesDocument(document: PageDocumentInput, folder: DepartmentEntry): boolean {
  const parsed = parseProgrammeDocumentCategory(document.category);
  return !parsed.invalidFolder && parsed.folderId === folder.id && isProgrammeFolder(folder)
    && folder.pagePath === document.pagePath && folder.sectionId === programmeFolderSection(parsed.kind);
}

export function programmeDocumentIsVisible(document: PageDocumentInput, folders: DepartmentEntry[]): boolean {
  const parsed = parseProgrammeDocumentCategory(document.category);
  if (parsed.invalidFolder) return false;
  if (!parsed.folderId) return true;
  return folders.some((folder) => programmeFolderMatchesDocument(document, folder) && folder.status === "published" && !folder.hidden);
}

export function programmeFolderHasDocuments(folder: DepartmentEntry, documents: PageDocument[]): boolean {
  return documents.some((document) => document.pagePath === folder.pagePath && parseProgrammeDocumentCategory(document.category).folderId === folder.id);
}

export function programmeDocumentCategoryLabel(category: string, folders: DepartmentEntry[]): string {
  const parsed = parseProgrammeDocumentCategory(category);
  const name = folders.find((folder) => folder.id === parsed.folderId)?.title;
  return [parsed.kind, parsed.year, name].filter(Boolean).join(" · ");
}
