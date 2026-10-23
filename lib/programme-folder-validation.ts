import { getDepartmentEntryById } from "./department-content";
import type { PageDocumentInput } from "./documents";
import { parseProgrammeDocumentCategory, programmeFolderMatchesDocument } from "./programme-folders";

export async function validProgrammeDocumentFolder(document: PageDocumentInput): Promise<boolean> {
  const parsed = parseProgrammeDocumentCategory(document.category);
  if (parsed.invalidFolder) return false;
  if (!parsed.folderId) return true;
  const folder = await getDepartmentEntryById(parsed.folderId);
  return Boolean(folder && programmeFolderMatchesDocument(document, folder) && !folder.hidden
    && (document.status === "draft" || folder.status === "published"));
}
