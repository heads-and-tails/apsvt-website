import { officialProgrammeFileBase } from "./programme-documents";

export const professionalEducationPath = "/programs/professional-education";
export const digitalDepartmentPath = "/departments/digital-technologies";
export const digitalDepartmentTitle = "Кафедра інтелектуальних систем та цифрових технологій";

export const professionalEducationProgrammes = [
  { slug: "digital-bachelor", title: "ОПП «Професійна освіта (Цифрові технології)»", level: "Перший (бакалаврський) рівень вищої освіти", degree: "Бакалавр", document: `${officialProgrammeFileBase}/a5-professional-education-digital-technologies-bachelor.pdf` },
  { slug: "digital-master", title: "ОПП «Професійна освіта (Цифрові технології)»", level: "Другий (магістерський) рівень вищої освіти", degree: "Магістр", document: `${officialProgrammeFileBase}/a5-professional-education-digital-technologies-master.pdf` },
  { slug: "phd", title: "ОНП «Професійна освіта»", level: "Третій (освітньо-науковий) рівень вищої освіти", degree: "Доктор філософії", document: "/documents/programmes/phd/2025/a5-professional-education.pdf" },
  { slug: "information-security-bachelor", title: "ОПП «Професійна освіта (Управління інформаційною безпекою)»", level: "Перший (бакалаврський) рівень вищої освіти", degree: "Бакалавр", document: "" },
  { slug: "information-security-master", title: "ОПП «Професійна освіта (Управління інформаційною безпекою)»", level: "Другий (магістерський) рівень вищої освіти", degree: "Магістр", document: "" },
].map((programme) => ({ ...programme, path: `${professionalEducationPath}/${programme.slug}` }));

export const professionalEducationSections = [
  { id: "overview", label: "Про освітню програму" },
  { id: "programme-documents", label: "Освітня програма" },
  { id: "curriculum", label: "Навчальні плани" },
  { id: "disciplines", label: "Обов’язкові дисципліни" },
  { id: "electives", label: "Вибіркові дисципліни" },
  { id: "practice", label: "Практична підготовка" },
  { id: "admissions", label: "Інформація щодо вступу" },
  { id: "quality", label: "Якість освіти" },
  { id: "documents", label: "Документи та матеріали" },
] as const;

export const digitalDepartmentSections = [
  { id: "about", label: "Про кафедру" },
  { id: "department-team", label: "Науково-педагогічний склад" },
  { id: "programmes", label: "Освітні програми" },
  { id: "science", label: "Наукова діяльність" },
  { id: "student-science", label: "Студентська наука" },
  { id: "partners", label: "Партнери" },
  { id: "news", label: "Новини" },
  { id: "quality", label: "Якість освіти" },
  { id: "documents", label: "Документи та матеріали" },
  { id: "contacts", label: "Контакти" },
] as const;
