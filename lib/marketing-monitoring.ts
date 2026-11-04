import type { DepartmentEntry } from "./department-content";

export const marketingMonitoringSections = [
  { id: "marketing-quality-monitoring", label: "Якість освіти · Результати моніторингу" },
  { id: "marketing-monitoring-bachelor", label: "Результати моніторингу · Бакалаврат" },
  { id: "marketing-monitoring-master", label: "Результати моніторингу · Магістратура" },
] as const;

export const marketingMonitoringCallId = "marketing-monitoring-master-stakeholder-call";

export function isMarketingMonitoringSection(sectionId: string) {
  return marketingMonitoringSections.some((section) => section.id === sectionId);
}

export function marketingMonitoringEntries(entries: DepartmentEntry[], sectionId: string) {
  if (!isMarketingMonitoringSection(sectionId)) return [];
  return entries.filter((entry) => entry.pagePath === "/programs/marketing" && entry.status === "published" && !entry.hidden
    && ["section", "article", "news", "photo", "material", "quality"].includes(entry.entryType)
    && (entry.sectionId === sectionId || sectionId === "marketing-quality-monitoring" && entry.sectionId === "quality" && entry.entryType === "quality" && entry.role === "monitoring"))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
