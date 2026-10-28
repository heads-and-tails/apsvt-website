import type { DepartmentEntry } from "./department-content";

export const marketingNonformalSection = {
  id: "marketing-nonformal",
  title: "Неформальна та інформальна освіта",
} as const;

export const marketingNonformalLevels = [
  { id: "bachelor", title: "Бакалаврат" },
  { id: "master", title: "Магістратура" },
] as const;

export const marketingNonformalRubrics = [
  { id: "regulations", title: "Нормативне забезпечення" },
  { id: "opportunities", title: "Освітні можливості" },
  { id: "achievements", title: "Досягнення здобувачів" },
  { id: "recognition", title: "Визнання результатів неформальної освіти" },
] as const;

export const marketingNonformalEditorialSections = marketingNonformalLevels.flatMap((level) =>
  marketingNonformalRubrics.map((rubric) => ({
    id: `${marketingNonformalSection.id}-${level.id}-${rubric.id}`,
    label: `Якість освіти · ${marketingNonformalSection.title} · ${level.title} · ${rubric.title}`,
  })),
);

export function isMarketingNonformalSection(sectionId: string): boolean {
  return marketingNonformalEditorialSections.some((section) => section.id === sectionId);
}

export function marketingNonformalEntries(entries: DepartmentEntry[], sectionId: string): DepartmentEntry[] {
  return entries.filter((entry) => entry.pagePath === "/programs/marketing" && entry.sectionId === sectionId
    && entry.status === "published" && !entry.hidden
    && ["section", "article", "news", "photo", "material"].includes(entry.entryType));
}
