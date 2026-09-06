import {
  createContentItem,
  deleteContentItem,
  getAllContent,
  getContentItems,
  updateContentItem,
  type ContentItem,
} from "@/lib/content";
import { isEditorialPagePath } from "@/lib/editorial-access";
import { educationQualityRubrics } from "@/lib/education-quality";

export const departmentEntryTypes = ["override", "hero", "section", "news", "article", "material", "photo", "teacher", "partner", "quality"] as const;
export type DepartmentEntryType = (typeof departmentEntryTypes)[number];
export type DepartmentEntryStatus = "draft" | "published";

export type DepartmentEntry = {
  id: string;
  pagePath: string;
  sectionId: string;
  entryType: DepartmentEntryType;
  title: string;
  summary: string;
  body: string;
  imageUrl: string;
  imageAlt: string;
  fileUrl: string;
  fileName: string;
  date: string;
  role: string;
  email: string;
  profileUrl: string;
  status: DepartmentEntryStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  authorEmail: string;
};

export type DepartmentEntryInput = Omit<DepartmentEntry, "id" | "createdAt" | "updatedAt" | "authorEmail">;

const markers = new Set(["department", "page"]);

export function isDepartmentEntryType(value: unknown): value is DepartmentEntryType {
  return typeof value === "string" && departmentEntryTypes.includes(value as DepartmentEntryType);
}

export function isDepartmentEntryInput(value: unknown): value is DepartmentEntryInput {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  const validBase = isEditorialPagePath(entry.pagePath)
    && typeof entry.sectionId === "string"
    && isDepartmentEntryType(entry.entryType)
    && typeof entry.title === "string" && Boolean(entry.title.trim())
    && typeof entry.summary === "string"
    && typeof entry.body === "string"
    && typeof entry.imageUrl === "string"
    && typeof entry.imageAlt === "string"
    && typeof entry.fileUrl === "string"
    && typeof entry.fileName === "string"
    && typeof entry.date === "string"
    && typeof entry.role === "string"
    && typeof entry.email === "string"
    && typeof entry.profileUrl === "string"
    && (entry.status === "draft" || entry.status === "published")
    && typeof entry.sortOrder === "number" && Number.isFinite(entry.sortOrder);
  if (!validBase) return false;
  if (entry.entryType === "override") {
    return typeof entry.body === "string"
      && entry.body.startsWith("main > ")
      && entry.body.length <= 1000
      && typeof entry.role === "string"
      && ["text", "image", "link"].includes(entry.role);
  }
  if (entry.entryType === "photo" && !entry.imageUrl) return false;
  if (entry.entryType === "material" && !entry.fileUrl) return false;
  if (entry.entryType === "teacher" && !entry.role) return false;
  if (entry.entryType === "quality" && !educationQualityRubrics.some((rubric) => rubric.id === entry.role)) return false;
  return true;
}

function isDepartmentContentItem(item: ContentItem): boolean {
  return item.kind === "research_resource" && markers.has(item.payload.editorialSurface) && isEditorialPagePath(item.payload.pagePath);
}

function fromContentItem(item: ContentItem): DepartmentEntry {
  const payload = item.payload;
  return {
    id: item.id,
    pagePath: payload.pagePath || "",
    sectionId: payload.sectionId || "",
    entryType: isDepartmentEntryType(payload.entryType) ? payload.entryType : "section",
    title: payload.title || "",
    summary: payload.summary || "",
    body: payload.body || "",
    imageUrl: payload.imageUrl || "",
    imageAlt: payload.imageAlt || "",
    fileUrl: payload.fileUrl || "",
    fileName: payload.fileName || "",
    date: payload.date || "",
    role: payload.role || "",
    email: payload.email || "",
    profileUrl: payload.profileUrl || "",
    status: payload.status === "draft" ? "draft" : "published",
    sortOrder: item.sortOrder,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    authorEmail: item.authorEmail,
  };
}

function toContentPayload(input: DepartmentEntryInput): Record<string, string> {
  return {
    editorialSurface: "page",
    pagePath: input.pagePath,
    sectionId: input.sectionId.trim(),
    entryType: input.entryType,
    title: input.title.trim(),
    summary: input.summary.trim(),
    body: input.body.trim(),
    imageUrl: input.imageUrl.trim(),
    imageAlt: input.imageAlt.trim(),
    fileUrl: input.fileUrl.trim(),
    fileName: input.fileName.trim(),
    date: input.date,
    role: input.role.trim(),
    email: input.email.trim(),
    profileUrl: input.profileUrl.trim(),
    status: input.status,
  };
}

export async function getAllDepartmentEntries(): Promise<DepartmentEntry[]> {
  return (await getAllContent()).filter(isDepartmentContentItem).map(fromContentItem);
}

export async function getDepartmentEntries(pagePath: string): Promise<DepartmentEntry[]> {
  const entries = (await getContentItems("research_resource"))
    .filter(isDepartmentContentItem)
    .map(fromContentItem)
    .filter((entry) => entry.pagePath === pagePath && entry.status === "published");
  return entries.sort((a, b) => a.sortOrder - b.sortOrder || a.createdAt.localeCompare(b.createdAt));
}

export async function getPublishedDepartmentEntries(): Promise<DepartmentEntry[]> {
  const entries = (await getContentItems("research_resource"))
    .filter(isDepartmentContentItem)
    .map(fromContentItem)
    .filter((entry) => entry.status === "published");
  return entries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getDepartmentEntryById(id: string): Promise<DepartmentEntry | null> {
  const item = (await getAllContent()).find((entry) => entry.id === id && isDepartmentContentItem(entry));
  return item ? fromContentItem(item) : null;
}

export async function createDepartmentEntry(input: DepartmentEntryInput, authorEmail: string): Promise<DepartmentEntry> {
  return fromContentItem(await createContentItem({ kind: "research_resource", payload: toContentPayload(input), sortOrder: input.sortOrder }, authorEmail));
}

export async function updateDepartmentEntry(id: string, input: DepartmentEntryInput, authorEmail: string): Promise<DepartmentEntry | null> {
  const item = await updateContentItem(id, { kind: "research_resource", payload: toContentPayload(input), sortOrder: input.sortOrder }, authorEmail);
  return item ? fromContentItem(item) : null;
}

export async function deleteDepartmentEntry(id: string): Promise<void> {
  await deleteContentItem(id);
}
