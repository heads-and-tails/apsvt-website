import { lawFacultyPath, lawFacultyStructure, lawFacultySubpages } from "./law-faculty-structure";
import { digitalDepartmentPath, digitalDepartmentSections, professionalEducationProgrammes, professionalEducationSections } from "./professional-education";

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
    { id: "curriculum", label: "Освітні програми" },
    { id: "quality", label: "Якість освіти" },
    { id: "science", label: "Наукова діяльність" },
    { id: "science-club", label: "Науковий гурток" },
    { id: "programme-documents", label: "Навчально-методичне забезпечення" },
    { id: "marketing-student-life", label: "Студентське життя: навчання, можливості, досягнення" },
    { id: "marketing-student-science", label: "Студентська наука: конференції, дослідження, досягнення" },
    { id: "marketing-repository", label: "РЕПОЗИТАРІЙ" },
    { id: "careers", label: "Кар’єра і працевлаштування" },
    { id: "department-news", label: "Новини" },
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
