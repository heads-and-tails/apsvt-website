import { lawFacultyPath, lawFacultyStructure, lawFacultySubpages } from "./law-faculty-structure";
import { digitalDepartmentPath, digitalDepartmentSections, professionalEducationProgrammes, professionalEducationSections } from "./professional-education";

export const financeProjectSections = [
  { id: "greenfinedu", label: "Jean Monnet GreenFinEDU" },
  { id: "eu-financial-sector", label: "Jean Monnet  The EU Financial Sector" },
  { id: "eu-financial-sector-about", label: "The EU Financial Sector · Про проєкт" },
  { id: "eu-financial-sector-documents", label: "The EU Financial Sector · Програми та презентація" },
] as const;

export function editorialSectionsForPage(path: string): { id: string; label: string }[] {
  if (path === digitalDepartmentPath) return [...digitalDepartmentSections];
  if (professionalEducationProgrammes.some((page) => page.path === path)) return [...professionalEducationSections];
  if (path === lawFacultyPath) return lawFacultyStructure.map(({ id, title }) => ({ id, label: title }));
  const page = lawFacultySubpages.find((item) => item.path === path);
  if (page) return [{ id: "content", label: page.title }];
  if (path === "/programs/finance") return [{ id: "international", label: "Міжнародні проєкти" }, ...financeProjectSections];
  return [];
}
