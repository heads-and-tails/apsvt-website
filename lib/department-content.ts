import {
  createContentItem,
  deleteContentItem,
  getAllContent,
  getContentItems,
  updateContentItem,
  type ContentItem,
} from "@/lib/content";
import { departmentPublishedAt } from "./department-news-date";
import { isDepartmentImage, isDepartmentAttachment, parseDepartmentMedia, type DepartmentImage, type DepartmentAttachment } from "./department-media";
import { editorialTextIsValid, editorialLink } from "./editorial-text";
import { isEditorialPagePath } from "@/lib/editorial-access";
import { educationQualityRubrics } from "@/lib/education-quality";
import { customSectionRootRole, isCustomSectionId, isCustomSectionRoot } from "./editorial-custom-sections";
import { marketingMobilitySectionId } from "./marketing-mobility";

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
  imageFit?: "cover" | "contain";
  fileUrl: string;
  fileName: string;
  date: string;
  hideDate?: boolean;
  publishedAt?: string;
  images?: DepartmentImage[];
  attachments?: DepartmentAttachment[];
  role: string;
  email: string;
  profileUrl: string;
  hidden?: boolean;
  teacherSourceName?: string;
  teacherDegree?: string;
  teacherAcademicTitle?: string;
  teacherTags?: string[];
  profileLinks?: { label: string; href: string }[];
  status: DepartmentEntryStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  authorEmail: string;
};

export type DepartmentEntryInput = Omit<DepartmentEntry, "id" | "createdAt" | "updatedAt" | "authorEmail" | "publishedAt">;

const markers = new Set(["department", "page"]);

export function isDepartmentEntryType(value: unknown): value is DepartmentEntryType {
  return typeof value === "string" && departmentEntryTypes.includes(value as DepartmentEntryType);
}

export function isDepartmentEntryInput(value: unknown): value is DepartmentEntryInput {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  const validBase = isEditorialPagePath(entry.pagePath)
    && typeof entry.sectionId === "string" && entry.sectionId.length <= 100
    && isDepartmentEntryType(entry.entryType)
    && typeof entry.title === "string" && Boolean(entry.title.trim())
    && typeof entry.summary === "string"
    && typeof entry.body === "string" && editorialTextIsValid(entry.body)
    && typeof entry.imageUrl === "string"
    && typeof entry.imageAlt === "string"
    && (entry.imageFit === undefined || entry.imageFit === "cover" || entry.imageFit === "contain")
    && typeof entry.fileUrl === "string"
    && typeof entry.fileName === "string"
    && typeof entry.date === "string"
    && (entry.hideDate === undefined || typeof entry.hideDate === "boolean")
    && (entry.images === undefined || Array.isArray(entry.images) && entry.images.every(isDepartmentImage))
    && (entry.attachments === undefined || Array.isArray(entry.attachments) && entry.attachments.every(isDepartmentAttachment))
    && typeof entry.role === "string"
    && typeof entry.email === "string"
    && typeof entry.profileUrl === "string"
    && (entry.hidden === undefined || typeof entry.hidden === "boolean")
    && (entry.teacherSourceName === undefined || typeof entry.teacherSourceName === "string")
    && (entry.teacherDegree === undefined || typeof entry.teacherDegree === "string")
    && (entry.teacherAcademicTitle === undefined || typeof entry.teacherAcademicTitle === "string")
    && (entry.teacherTags === undefined || Array.isArray(entry.teacherTags) && entry.teacherTags.every((tag) => typeof tag === "string"))
    && (entry.profileLinks === undefined || Array.isArray(entry.profileLinks) && entry.profileLinks.every((link) => link && typeof link.label === "string" && Boolean(link.label.trim()) && typeof link.href === "string" && Boolean(editorialLink(link.href))))
    && (entry.status === "draft" || entry.status === "published")
    && typeof entry.sortOrder === "number" && Number.isFinite(entry.sortOrder);
  if (!validBase) return false;
  if (entry.role === customSectionRootRole && !isCustomSectionRoot(entry as { entryType: string; sectionId: string; role: string })) return false;
  const sectionId = entry.sectionId as string;
  if (sectionId.startsWith("editorial-section-") && !isCustomSectionId(sectionId)) return false;
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
    sectionId: marketingMobilitySectionId(item.id, payload.pagePath || "", payload.sectionId || ""),
    entryType: isDepartmentEntryType(payload.entryType) ? payload.entryType : "section",
    title: payload.title || "",
    summary: payload.summary || "",
    body: payload.body || "",
    imageUrl: payload.imageUrl || "",
    imageAlt: payload.imageAlt || "",
    imageFit: payload.imageFit === "contain" || payload.imageFit === "cover" ? payload.imageFit : undefined,
    fileUrl: payload.fileUrl || "",
    fileName: payload.fileName || "",
    date: payload.date || "",
    hideDate: payload.hideDate === "true",
    publishedAt: payload.publishedAt || undefined,
    images: parseDepartmentMedia(payload.images, isDepartmentImage),
    attachments: parseDepartmentMedia(payload.attachments, isDepartmentAttachment),
    role: payload.role || "",
    email: payload.email || "",
    profileUrl: payload.profileUrl || "",
    hidden: payload.hidden === "true",
    teacherSourceName: payload.teacherSourceName || undefined,
    teacherDegree: payload.teacherDegree || undefined,
    teacherAcademicTitle: payload.teacherAcademicTitle || undefined,
    teacherTags: payload.teacherTags ? parseDepartmentMedia(payload.teacherTags, (value): value is string => typeof value === "string") : undefined,
    profileLinks: payload.profileLinks ? parseDepartmentMedia(payload.profileLinks, (value): value is {label: string; href: string} => Boolean(value && typeof value === "object" && "label" in value && "href" in value && typeof value.label === "string" && typeof value.href === "string" && editorialLink(value.href))) : undefined,
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
    imageFit: input.images?.[0]?.fit || input.imageFit || "",
    fileUrl: input.fileUrl.trim(),
    fileName: input.fileName.trim(),
    date: input.date,
    hideDate: input.hideDate ? "true" : "false",
    images: JSON.stringify(input.images || []),
    attachments: JSON.stringify(input.attachments || []),
    role: input.role.trim(),
    email: input.email.trim(),
    profileUrl: input.profileUrl.trim(),
    hidden: input.hidden ? "true" : "false",
    teacherSourceName: input.teacherSourceName?.trim() || "",
    teacherDegree: input.teacherDegree?.trim() || "",
    teacherAcademicTitle: input.teacherAcademicTitle?.trim() || "",
    teacherTags: JSON.stringify((input.teacherTags || []).map((tag) => tag.trim()).filter(Boolean)),
    profileLinks: JSON.stringify(input.profileLinks || []),
    status: input.status,
  };
}

export async function getAllDepartmentEntries(): Promise<DepartmentEntry[]> {
  return (await getAllContent()).filter(isDepartmentContentItem).map(fromContentItem);
}

export async function customSectionInputError(input: DepartmentEntryInput, existingId?: string): Promise<string | null> {
  if (!isCustomSectionId(input.sectionId)) return null;
  const entries = await getAllDepartmentEntries();
  const root = entries.find((entry) => entry.pagePath === input.pagePath && entry.sectionId === input.sectionId && isCustomSectionRoot(entry));
  if (isCustomSectionRoot(input)) {
    if (root && root.id !== existingId) return "Розділ із таким ідентифікатором уже існує";
    const publishedChildren = entries.some((entry) => entry.id !== existingId && entry.pagePath === input.pagePath && entry.sectionId === input.sectionId && entry.status === "published" && !entry.hidden);
    if (publishedChildren && (input.status !== "published" || input.hidden)) return "Спочатку зніміть з публікації матеріали цього розділу";
    return null;
  }
  if (!root || root.id === existingId) return "Спочатку створіть розділ на цій сторінці";
  if (input.status === "published" && (root.status !== "published" || root.hidden)) return "Спочатку опублікуйте розділ";
  return null;
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
    .filter((entry) => entry.status === "published" && !entry.hidden);
  return entries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getPublishedDepartmentEntryById(id: string): Promise<DepartmentEntry | null> {
  const item = (await getContentItems("research_resource"))
    .find((entry) => entry.id === id && isDepartmentContentItem(entry));
  if (!item) return null;
  const entry = fromContentItem(item);
  return entry.status === "published" && !entry.hidden ? entry : null;
}

export async function getDepartmentEntryById(id: string): Promise<DepartmentEntry | null> {
  const item = (await getAllContent()).find((entry) => entry.id === id && isDepartmentContentItem(entry));
  return item ? fromContentItem(item) : null;
}

export async function createDepartmentEntry(input: DepartmentEntryInput, authorEmail: string): Promise<DepartmentEntry> {
  return fromContentItem(await createContentItem({ kind: "research_resource", payload: { ...toContentPayload(input), publishedAt: departmentPublishedAt(input.status) }, sortOrder: input.sortOrder }, authorEmail));
}

export async function updateDepartmentEntry(id: string, input: DepartmentEntryInput, authorEmail: string): Promise<DepartmentEntry | null> {
  const existing = await getDepartmentEntryById(id);
  if (!existing) return null;
  const item = await updateContentItem(id, { kind: "research_resource", payload: { ...toContentPayload(input), publishedAt: departmentPublishedAt(input.status, existing) }, sortOrder: input.sortOrder }, authorEmail);
  return item ? fromContentItem(item) : null;
}

export async function deleteDepartmentEntry(id: string, authorEmail?: string): Promise<void> {
  const entry = await getDepartmentEntryById(id);
  if (entry && (entry.entryType === "teacher" && entry.teacherSourceName || id.startsWith("marketing-discussion-2026-") || id.startsWith("marketing-nonformal-"))) {
    await updateDepartmentEntry(id, { ...entry, hidden: true }, authorEmail || entry.authorEmail);
    return;
  }
  await deleteContentItem(id);
}
