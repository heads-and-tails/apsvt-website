import { lawFacultyPath, lawFacultyStructure, lawFacultySubpages } from "./law-faculty-structure";
import { digitalDepartmentPath, digitalDepartmentSections, professionalEducationProgrammes, professionalEducationSections } from "./professional-education";
import { marketingStudentSections } from "./marketing-student-sections";
import { marketingMethodicalGroups } from "./marketing-methodical";
import { marketingMobilitySection } from "./marketing-mobility";
import { marketingTeacherAchievementsSection } from "./marketing-teacher-achievements";
import { marketingNonformalEditorialSections } from "./marketing-nonformal";

export const financeProjectSections = [
  { id: "greenfinedu", label: "Jean Monnet GreenFinEDU" },
  { id: "eu-financial-sector", label: "Jean Monnet  The EU Financial Sector" },
  { id: "eu-financial-sector-about", label: "The EU Financial Sector · Про проєкт" },
  { id: "eu-financial-sector-documents", label: "The EU Financial Sector · Програми та презентація" },
] as const;

export function editorialSectionsForPage(path: string): { id: string; label: string }[] {
  if (path === "/programs/marketing") return [
    { id: "department", label: "Про кафедру" },
    { id: "department-team", label: "Науково-педагогічний склад" },
    { id: marketingTeacherAchievementsSection.id, label: marketingTeacherAchievementsSection.label },
    { id: "curriculum", label: "Освітні програми" },
    { id: "marketing-bachelor-programmes", label: "Бакалаврат · Освітні програми" },
    { id: "marketing-bachelor-plans", label: "Бакалаврат · Навчальні плани" },
    { id: "marketing-master-programmes", label: "Магістратура · Освітні програми" },
    { id: "marketing-master-plans", label: "Магістратура · Навчальні плани" },
    { id: "quality", label: "Якість освіти" },
    { id: "marketing-quality-discussion", label: "Якість освіти · Обговорення змін до ОПП" },
    { id: marketingMobilitySection.id, label: marketingMobilitySection.label },
    ...marketingNonformalEditorialSections,
    { id: "science", label: "Наукова діяльність" },
    { id: "science-club", label: "Науковий гурток" },
    { id: "programme-documents", label: "Навчально-методичне забезпечення" },
    ...marketingMethodicalGroups.flatMap((group) => group.sections.flatMap((section) => [{ id: section.id, label: `${group.title} · ${section.title}` }, ...(section.children || []).map((child) => ({ id: child.id, label: `${group.title} · ${section.title} · ${child.title}` }))])),
    { id: "marketing-student-life", label: "Студентське життя та самоврядування" },
    ...marketingStudentSections.map(({ id, title }) => ({ id, label: title })),
    { id: "careers", label: "Кар’єра і працевлаштування" },
    { id: "marketing-partners", label: "Партнери кафедри · Наші партнери" },
    { id: "marketing-partner-agreements", label: "Партнери кафедри · Договори та меморандуми" },
    { id: "department-news", label: "Новини" },
    { id: "marketing-repository", label: "Репозитарій" },
  ];
  if (["/departments/constitutional-law", "/departments/criminal-law", "/departments/private-law", "/departments/public-administration"].includes(path)) return [
    { id: "department-about", label: "Загальна інформація про кафедру" },
    { id: "department-head", label: "Завідувач кафедри" },
    { id: "department-team", label: "Склад кафедри" },
    { id: "department-news", label: "Новини" },
    { id: "department-contacts", label: "Контакти" },
  ];
  if (path === digitalDepartmentPath) return [...digitalDepartmentSections];
  if (professionalEducationProgrammes.some((page) => page.path === path)) return [...professionalEducationSections];
  if (path === lawFacultyPath) return lawFacultyStructure.map(({ id, title }) => ({ id, label: title }));
  const page = lawFacultySubpages.find((item) => item.path === path);
  if (page) return [{ id: "content", label: page.title }];
  if (path === "/programs/finance") return [{ id: "international", label: "Міжнародні проєкти" }, ...financeProjectSections];
  return [];
}
