import type { DepartmentEntry } from "./department-content";

export const studentCouncilPath = "/students/council";
export const studentCouncilSections = [
  { id: "about", label: "ПРО СТУДЕНТСЬКЕ САМОВРЯДУВАННЯ" },
  { id: "representation", label: "ПРЕДСТАВНИЦТВО ТА СТРУКТУРА" },
  { id: "regulations", label: "НОРМАТИВНА БАЗА" },
  { id: "news", label: "НОВИНИ ТА ПОДІЇ" },
  { id: "initiatives", label: "ДІЯЛЬНІСТЬ ТА ІНІЦІАТИВИ" },
  { id: "feedback", label: "ЗВОРОТНИЙ ЗВ'ЯЗОК" },
] as const;

export function studentCouncilEntries(entries: DepartmentEntry[], sectionId: string) {
  return entries.filter((entry) => entry.pagePath === studentCouncilPath && entry.sectionId === sectionId && entry.status === "published" && !entry.hidden && !["hero", "override"].includes(entry.entryType));
}
