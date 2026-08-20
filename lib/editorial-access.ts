export type EditorialAccessOption = {
  value: string;
  label: string;
  group: "all" | "page" | "department";
};

export const editorialAccessOptions: EditorialAccessOption[] = [
  { value: "*", label: "Увесь сайт", group: "all" },
  { value: "/news", label: "Новини та публікації", group: "page" },
  { value: "/about", label: "Про Академію", group: "page" },
  { value: "/admissions", label: "Вступ", group: "page" },
  { value: "/students", label: "Студентам", group: "page" },
  { value: "/research", label: "Наука", group: "page" },
  { value: "/research/theses", label: "Кваліфікаційні роботи", group: "page" },
  { value: "/international", label: "Міжнародне", group: "page" },
  { value: "/events", label: "Події", group: "page" },
  { value: "/schedule", label: "Розклад занять", group: "page" },
  { value: "/exam-schedule", label: "Графік сесії", group: "page" },
  { value: "/facilities/library", label: "Бібліотека", group: "page" },
  { value: "/materials", label: "Матеріали Академії", group: "page" },
  { value: "/people", label: "Люди Академії", group: "page" },
  { value: "/programs", label: "Освітні програми", group: "page" },
  { value: "/facilities", label: "Кампус і сервіси", group: "page" },
  { value: "/academic-calendar", label: "Навчальний календар", group: "page" },
  { value: "/contacts", label: "Контакти", group: "page" },
  { value: "/faq", label: "FAQ", group: "page" },
  { value: "/vacancies", label: "Вакансії та конкурси", group: "page" },
  { value: "/departments/economics-social-tourism-faculty", label: "Факультет економіки, соціальних технологій і туризму", group: "department" },
  { value: "/departments/law-faculty", label: "Юридичний факультет", group: "department" },
  { value: "/programs/psychology", label: "Кафедра психології", group: "department" },
  { value: "/programs/finance", label: "Кафедра фінансів", group: "department" },
  { value: "/programs/management", label: "Кафедра економіки та менеджменту", group: "department" },
  { value: "/programs/public-administration", label: "Кафедра публічного управління", group: "department" },
  { value: "/programs/marketing", label: "Кафедра маркетингу", group: "department" },
  { value: "/programs/trade", label: "Кафедра економіки та менеджменту · Торгівля", group: "department" },
  { value: "/programs/law", label: "Юридичний факультет", group: "department" },
  { value: "/programs/social-work", label: "Кафедра соціальної роботи", group: "department" },
  { value: "/programs/professional-education", label: "Професійна освіта · Цифрові технології", group: "department" },
  { value: "/departments/languages-humanities", label: "Кафедра іноземних мов та гуманітарних дисциплін", group: "department" },
];

const validScopes = new Set(editorialAccessOptions.map((option) => option.value));

export const contentKindPagePath: Record<string, string> = {
  lesson: "/schedule",
  exam: "/exam-schedule",
  library_book: "/facilities/library",
  event: "/events",
  research_resource: "/research",
  student_thesis: "/research/theses",
  admission_timeline: "/admissions",
  vacancy: "/vacancies",
};

export function isEditorialAccessScope(value: unknown): value is string {
  return typeof value === "string" && validScopes.has(value);
}

export function normalizeEditorialAccessScopes(value: unknown): string[] {
  const values = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
  const normalized = [...new Set(values.filter(isEditorialAccessScope))];
  return normalized.includes("*") ? ["*"] : normalized;
}

export function isEditorialAccessScopes(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && normalizeEditorialAccessScopes(value).length === value.length;
}

export function serializeEditorialAccessScopes(value: string[]): string {
  return normalizeEditorialAccessScopes(value).join(",");
}

export function canEditPage(profile: { role: string; accessScopes: string[] }, pagePath: string): boolean {
  return profile.role === "admin" || profile.accessScopes.includes("*") || profile.accessScopes.includes(pagePath);
}

export function isDepartmentPagePath(value: unknown): value is string {
  return typeof value === "string" && editorialAccessOptions.some((option) => option.group === "department" && option.value === value);
}

export function accessScopeLabel(values: string[]): string {
  const normalized = normalizeEditorialAccessScopes(values);
  if (normalized.includes("*")) return "Увесь сайт";
  const labels = normalized.map((value) => editorialAccessOptions.find((option) => option.value === value)?.label || value);
  if (labels.length <= 2) return labels.join(" · ");
  return `${labels.slice(0, 2).join(" · ")} +${labels.length - 2}`;
}
