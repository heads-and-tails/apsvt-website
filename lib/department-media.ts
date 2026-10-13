import { editorialLink } from "./editorial-text";

export type DepartmentImage = { url: string; alt: string; fit?: "contain" | "cover"; positionX?: number; positionY?: number };
export type DepartmentAttachment = { url: string; label: string };

function webFile(value: unknown): value is string {
  return typeof value === "string" && Boolean(editorialLink(value)) && /^(?:https?:\/\/|\/(?!\/))/i.test(value);
}
export function isDepartmentImage(value: unknown): value is DepartmentImage {
  if (!value || typeof value !== "object") return false;
  const image = value as Record<string, unknown>;
  return webFile(image.url) && typeof image.alt === "string"
    && (image.fit === undefined || image.fit === "contain" || image.fit === "cover")
    && [image.positionX, image.positionY].every((position) => position === undefined || typeof position === "number" && Number.isFinite(position) && position >= 0 && position <= 100);
}
export function isDepartmentAttachment(value: unknown): value is DepartmentAttachment {
  if (!value || typeof value !== "object") return false;
  const file = value as Record<string, unknown>;
  return webFile(file.url) && typeof file.label === "string" && Boolean(file.label.trim());
}
export function departmentImages(entry: { images?: DepartmentImage[]; imageUrl?: string; imageAlt?: string; title?: string }): DepartmentImage[] {
  return entry.images?.length ? entry.images : entry.imageUrl ? [{ url: entry.imageUrl, alt: entry.imageAlt || entry.title || "", fit: "contain" }] : [];
}
export function departmentAttachments(entry: { attachments?: DepartmentAttachment[]; fileUrl?: string; fileName?: string }): DepartmentAttachment[] {
  const files = [...(entry.attachments || [])];
  if (entry.fileUrl && !files.some((file) => file.url === entry.fileUrl)) files.unshift({ url: entry.fileUrl, label: entry.fileName || "Документ PDF" });
  return files;
}
export function parseDepartmentMedia<T>(value: string | undefined, valid: (item: unknown) => item is T): T[] {
  try { const items: unknown = JSON.parse(value || "[]"); return Array.isArray(items) ? items.filter(valid) : []; } catch { return []; }
}
