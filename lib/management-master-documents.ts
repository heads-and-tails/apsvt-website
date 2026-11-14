export type ManagementMasterDocument = {
  title: string;
  href: string;
};

export const managementMasterProgramme: ManagementMasterDocument = { title: "Освітньо-професійна програма «Менеджмент» · магістр · 2026", href: "/documents/management/master-2026/programme.pdf" };

export const managementMasterStudyPlan: ManagementMasterDocument = { title: "Навчальний план · заочна форма · 2026", href: "/documents/management/master-2026/study-plan-part-time.pdf" };

export const managementMasterCourseDocuments: readonly ManagementMasterDocument[] = [
  { title: "Іноземна мова професійного спрямування", href: "/documents/management/master-2026/foreign-professional-language.pdf" },
  { title: "Методологія наукових досліджень", href: "/documents/management/master-2026/research-methodology.pdf" },
  { title: "Сталий розвиток", href: "/documents/management/master-2026/sustainable-development.pdf" },
  { title: "Бренд-менеджмент", href: "/documents/management/master-2026/brand-management.pdf" },
  { title: "Фінансовий менеджмент", href: "/documents/management/master-2026/financial-management.pdf" },
  { title: "Інформаційні системи та технології в управлінні організацією", href: "/documents/management/master-2026/information-systems.pdf" },
  { title: "Антикризовий менеджмент підприємства", href: "/documents/management/master-2026/crisis-management.pdf" },
  { title: "Психологія управління", href: "/documents/management/master-2026/management-psychology.pdf" },
  { title: "Стратегічний менеджмент", href: "/documents/management/master-2026/strategic-management.pdf" },
  { title: "Управління проєктами", href: "/documents/management/master-2026/project-management.pdf" },
  { title: "Менеджмент персоналу", href: "/documents/management/master-2026/human-resources-management.pdf" },
  { title: "Економічне діагностування підприємницької діяльності", href: "/documents/management/master-2026/business-diagnostics.pdf" },
];

export const managementMasterPracticeDocuments: readonly ManagementMasterDocument[] = [
  { title: "Програма педагогічної практики", href: "/documents/management/master-2026/teaching-practice.pdf" },
  { title: "Програма переддипломної практики", href: "/documents/management/master-2026/pre-diploma-practice.pdf" },
  { title: "Методичні рекомендації по виконанню та захисту кваліфікаційної роботи", href: "/documents/management/master-2026/qualification-work-guidelines.pdf" },
];

export const managementMasterAnnotationGroups: readonly { title: string; documents: readonly ManagementMasterDocument[] }[] = [
  {
    title: "Анотації дисциплін · 1 курс",
    documents: [
      { title: "Громадські організації в Україні", href: "/documents/management/master-2026/annotations/public-organizations.docx" },
      { title: "Соціальний менеджмент", href: "https://bscmsv7ysiioa246.public.blob.vercel-storage.com/management-annotations-20261114/social-management-135e30ae.docx" },
      { title: "Інформаційні системи та технології в управлінні організацією", href: "/documents/management/master-2026/annotations/information-systems.docx" },
      { title: "Консалтингові послуги в сфері управління", href: "/documents/management/master-2026/annotations/management-consulting.docx" },
      { title: "Маркетинг туристичних дестинацій", href: "/documents/management/master-2026/annotations/tourist-destinations.docx" },
      { title: "Медичний туризм", href: "/documents/management/master-2026/annotations/medical-tourism.docx" },
      { title: "Організація круїзних подорожей", href: "/documents/management/master-2026/annotations/cruise-travel.docx" },
      { title: "Управління потенціалом підприємства", href: "/documents/management/master-2026/annotations/enterprise-potential.docx" },
      { title: "Управлінський облік", href: "/documents/management/master-2026/annotations/management-accounting.docx" },
    ],
  },
  {
    title: "Анотації дисциплін · 2 курс",
    documents: [
      { title: "Грантова діяльність", href: "/documents/management/master-2026/annotations/grant-activities.docx" },
      { title: "Мотиваційний механізм підприємства", href: "/documents/management/master-2026/annotations/enterprise-motivation.docx" },
      { title: "Управління ефективністю розвитку підприємства", href: "/documents/management/master-2026/annotations/enterprise-development-performance.docx" },
    ],
  },
  {
    title: "Анотації вибіркових дисциплін",
    documents: [
      { title: "Сучасні інструменти фінансування бізнесу", href: "https://bscmsv7ysiioa246.public.blob.vercel-storage.com/management-annotations-20261114/modern-business-financing-f6205a26.docx" },
    ],
  },
];
