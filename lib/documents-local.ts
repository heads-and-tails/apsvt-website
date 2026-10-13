import { createContentItem, deleteContentItem, getAllContent, getContentItems, updateContentItem, type ContentItem } from "./content";
import type { PageDocument, PageDocumentInput } from "./documents";

function isDocument(item: ContentItem) {
  return item.kind === "research_resource" && item.payload.editorialSurface === "document";
}

function fromItem(item: ContentItem): PageDocument {
  const payload = item.payload;
  return {
    id: item.id, title: payload.title, description: payload.description || "",
    category: payload.category, pagePath: payload.pagePath, fileUrl: payload.fileUrl,
    fileName: payload.fileName, mimeType: payload.mimeType, fileSize: Number(payload.fileSize) || 0,
    status: payload.status === "draft" ? "draft" : "published", sortOrder: item.sortOrder,
    createdAt: item.createdAt, updatedAt: item.updatedAt, authorEmail: item.authorEmail,
  };
}

function toInput(input: PageDocumentInput) {
  const { sortOrder, ...fields } = input;
  return { kind: "research_resource" as const, sortOrder, payload: { editorialSurface: "document", ...Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, String(value)])) } };
}

export async function getLocalDocuments(publishedOnly = false): Promise<PageDocument[]> {
  const items = publishedOnly ? await getContentItems("research_resource") : await getAllContent();
  return items.filter(isDocument).map(fromItem).filter((document) => !publishedOnly || document.status === "published")
    .sort((a, b) => a.pagePath.localeCompare(b.pagePath) || a.sortOrder - b.sortOrder || b.createdAt.localeCompare(a.createdAt));
}

export async function createLocalDocument(input: PageDocumentInput, authorEmail: string): Promise<PageDocument> {
  return fromItem(await createContentItem(toInput(input), authorEmail));
}

export async function updateLocalDocument(id: string, input: PageDocumentInput, authorEmail: string): Promise<PageDocument | null> {
  if (!(await getAllContent()).some((item) => item.id === id && isDocument(item))) return null;
  const item = await updateContentItem(id, toInput(input), authorEmail);
  return item ? fromItem(item) : null;
}

export async function deleteLocalDocument(id: string): Promise<void> {
  if ((await getAllContent()).some((item) => item.id === id && isDocument(item))) await deleteContentItem(id);
}
