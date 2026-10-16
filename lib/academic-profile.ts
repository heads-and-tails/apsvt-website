import type { DepartmentEntry } from "./department-content";

export function academicProfilePath(id: string, language: "uk" | "en" = "uk") {
  return `${language === "en" ? "/en" : ""}/people/${encodeURIComponent(id)}`;
}

export function academicProfileSummary(text: string, limit = 240) {
  const summary = text.replace(/\s+/g, " ").trim();
  if (summary.length <= limit) return summary;
  const shortened = summary.slice(0, limit - 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${lastSpace > 0 ? shortened.slice(0, lastSpace) : shortened}…`;
}

export function isPublicTeacher(entry: DepartmentEntry | null): entry is DepartmentEntry {
  return Boolean(entry && entry.entryType === "teacher" && entry.status === "published" && !entry.hidden);
}
