import { lawFacultyPath } from "./law-faculty-structure";
import { officialProgrammeFileBase } from "./programme-documents";

export type LawFacultyProgramme = {
  id: string;
  code: string;
  name: string;
  level: string;
  label: string;
  englishLabel: string;
  documentHref?: string;
};

export const lawFacultyProgrammes: readonly LawFacultyProgramme[] = [
  { id: "d8-law-bachelor", code: "D8", name: "Право", level: "Перший (бакалаврський) рівень", label: "Право · бакалавр", englishLabel: "Law · Bachelor", documentHref: `${officialProgrammeFileBase}/d8-law-bachelor.pdf` },
  { id: "d8-law-master", code: "D8", name: "Право", level: "Другий (магістерський) рівень", label: "Право · магістр", englishLabel: "Law · Master", documentHref: `${officialProgrammeFileBase}/d8-law-master.pdf` },
  { id: "d8-law-phd", code: "D8", name: "Муніципальне право", level: "Третій (освітньо-науковий) рівень", label: "Право · доктор філософії", englishLabel: "Law · PhD" },
  { id: "d4-public-administration-bachelor", code: "D4", name: "Публічне управління та адміністрування", level: "Перший (бакалаврський) рівень", label: "Публічне управління · бакалавр", englishLabel: "Public administration · Bachelor" },
  { id: "d4-public-administration-master", code: "D4", name: "Публічне управління та адміністрування", level: "Другий (магістерський) рівень", label: "Публічне управління · магістр", englishLabel: "Public administration · Master" },
  { id: "d4-public-administration-phd", code: "D4", name: "Публічне управління та адміністрування", level: "Третій (освітньо-науковий) рівень", label: "Публічне управління · доктор філософії", englishLabel: "Public administration · PhD" },
];

export function lawProgrammePath(id: string): string {
  return `${lawFacultyPath}/faculty-programmes/${id}`;
}

export const lawProgrammeDocumentSections = [
  { id: "programme-document", title: "Освітня програма", empty: "Освітню програму ще не оприлюднено.", curatedGroups: [] },
  { id: "study-plans", title: "Навчальні плани", empty: "Навчальні плани ще не оприлюднено.", curatedGroups: ["curricula"] },
  { id: "working-programmes", title: "Робочі програми навчальних дисциплін", empty: "Робочі програми ще не оприлюднено.", curatedGroups: ["mandatory-programmes"] },
  { id: "course-annotations", title: "Анотації навчальних дисциплін", empty: "Анотації ще не оприлюднено.", curatedGroups: ["mandatory-annotations", "elective-annotations"] },
] as const;

export type LawProgrammeDocumentSection = (typeof lawProgrammeDocumentSections)[number]["id"];

export function lawProgrammeDocumentSection(title: string, category = ""): LawProgrammeDocumentSection | null {
  const configured = lawProgrammeDocumentSections.find((section) => section.id === category);
  if (configured) return configured.id;
  const normalizedCategory = category.toLocaleLowerCase("uk-UA");
  if (normalizedCategory.startsWith("робоча програма")) return "working-programmes";
  if (normalizedCategory.startsWith("анотація")) return "course-annotations";
  if (normalizedCategory.startsWith("навчальний план")) return "study-plans";
  if (normalizedCategory.startsWith("освітня програма")) return "programme-document";
  const text = `${category} ${title}`.toLocaleLowerCase("uk-UA");
  if (/анотаці/.test(text)) return "course-annotations";
  if (/робоч\S*\s+програм/.test(text)) return "working-programmes";
  if (/навчальн\S*\s+план/.test(text)) return "study-plans";
  if (/освітн\S*(?:\s+|[-–—])(?:професійн\S*\s+|науков\S*\s+)?програм/.test(text)) return "programme-document";
  return null;
}
