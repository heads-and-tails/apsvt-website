import { lawFacultyPath, lawFacultyStructure, lawFacultySubpages } from "./law-faculty-structure";

export const financeProjectSections = [
  { id: "greenfinedu", label: "Jean Monnet GreenFinEDU" },
  { id: "eu-financial-sector", label: "Jean Monnet  The EU Financial Sector" },
  { id: "eu-financial-sector-about", label: "The EU Financial Sector · Про проєкт" },
  { id: "eu-financial-sector-documents", label: "The EU Financial Sector · Програми та презентація" },
] as const;

export function editorialSectionsForPage(path: string): { id: string; label: string }[] {
  if (path === lawFacultyPath) return lawFacultyStructure.map(({ id, title }) => ({ id, label: title }));
  const page = lawFacultySubpages.find((item) => item.path === path);
  if (page) return [{ id: "content", label: page.title }];
  if (path === "/programs/finance") return [{ id: "international", label: "Міжнародні проєкти" }, ...financeProjectSections];
  return [];
}
