export type FacultyProgrammeDocument = {
  title: string;
  href: string;
};

export type PsychologyFacultyProgramme = {
  id: string;
  code: "C4" | "I10";
  title: string;
  level: string;
  href?: string;
  documents: readonly FacultyProgrammeDocument[];
};

const documentBase = "/documents/programmes/psychology-faculty";

export const psychologyFacultyProgrammes: readonly PsychologyFacultyProgramme[] = [
  {
    id: "psychology-bachelor", code: "C4", title: "ОПП C4 «Психологія»", level: "Бакалавр",
    documents: [
      { title: "ОПП · 2025 · PDF", href: `${documentBase}/psychology-bachelor-programme-2025.pdf` },
      { title: "Навчальний план · денна · 2025 · PDF", href: `${documentBase}/psychology-bachelor-plan-full-time-2025.pdf` },
      { title: "Навчальний план · заочна · 2025 · PDF", href: `${documentBase}/psychology-bachelor-plan-part-time-2025.pdf` },
      { title: "ОПП · 2024/25 · PDF", href: `${documentBase}/psychology-bachelor-programme-2024-2025.pdf` },
      { title: "Навчальний план · денна · 2024/25 · PDF", href: `${documentBase}/psychology-bachelor-plan-full-time-2024-2025.pdf` },
      { title: "Навчальний план · заочна · 2024/25 · PDF", href: `${documentBase}/psychology-bachelor-plan-part-time-2024-2025.pdf` },
      { title: "ОПП · 2023 · PDF", href: `${documentBase}/psychology-bachelor-programme-2023.pdf` },
      { title: "Навчальний план · денна · 2023 · PDF", href: `${documentBase}/psychology-bachelor-plan-full-time-2023.pdf` },
      { title: "Навчальний план · заочна · 2023 · PDF", href: `${documentBase}/psychology-bachelor-plan-part-time-2023.pdf` },
    ],
  },
  {
    id: "clinical-psychology", code: "C4", title: "ОПП «Клінічна психологія»", level: "Магістр",
    documents: [
      { title: "ОПП · 2023 · PDF", href: `${documentBase}/clinical-psychology-master-programme-2023.pdf` },
      { title: "Навчальний план · денна · 2023 · PDF", href: `${documentBase}/clinical-psychology-master-plan-full-time-2023.pdf` },
      { title: "Навчальний план · заочна · 2023 · PDF", href: `${documentBase}/clinical-psychology-master-plan-part-time-2023.pdf` },
    ],
  },
  {
    id: "business-psychology", code: "C4", title: "ОПП «Психологія бізнесу та управління»", level: "Магістр",
    documents: [
      { title: "ОПП · 2024/25 · PDF", href: `${documentBase}/business-psychology-master-programme-2024-2025.pdf` },
      { title: "Навчальний план · денна · 2024 · PDF", href: `${documentBase}/business-psychology-master-plan-full-time-2024.pdf` },
      { title: "Навчальний план · заочна · 2024 · PDF", href: `${documentBase}/business-psychology-master-plan-part-time-2024.pdf` },
      { title: "ОПП · 2023/24 · PDF", href: `${documentBase}/business-psychology-master-programme-2023-2024.pdf` },
      { title: "Навчальний план · денна · 2023 · PDF", href: `${documentBase}/business-psychology-master-plan-full-time-2023.pdf` },
      { title: "Навчальний план · заочна · 2023 · PDF", href: `${documentBase}/business-psychology-master-plan-part-time-2023.pdf` },
    ],
  },
  {
    id: "psychology-phd", code: "C4", title: "ОНП C4 «Психологія»", level: "Доктор філософії",
    documents: [{ title: "Освітньо-наукова програма · 2025 · PDF", href: "/documents/programmes/phd/2025/c4-psychology.pdf" }],
  },
  {
    id: "social-work-bachelor", code: "I10", title: "Соціальна робота та консультування", level: "Бакалавр",
    href: "/programs/social-work#overview", documents: [],
  },
  {
    id: "social-work-master", code: "I10", title: "Соціальна робота та консультування", level: "Магістр",
    href: "/programs/social-work#education-levels", documents: [],
  },
];
