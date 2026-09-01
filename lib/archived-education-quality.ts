import type { DepartmentEntry } from "@/lib/department-content";
import type { EducationQualityRubricId } from "@/lib/education-quality";

type ArchivedQualityMaterial = {
  title: string;
  summary: string;
  fileUrl: string;
  fileName: string;
  role: EducationQualityRubricId;
  date?: string;
};

const archiveRoot = "/documents/archive/may-2026";
const qualityRoot = `${archiveRoot}/quality`;

const academyMaterials: ArchivedQualityMaterial[] = [
  {
    title: "Система внутрішнього забезпечення якості вищої освіти",
    summary: "Загальноакадемічний документ про принципи, процедури та відповідальність у системі забезпечення якості.",
    fileUrl: `${archiveRoot}/quality-system.pdf`,
    fileName: "Відкрити систему забезпечення якості",
    role: "monitoring",
  },
  {
    title: "Анкети для оцінювання якості навчання",
    summary: "Архівний комплект інструментів опитування здобувачів освіти та інших учасників освітнього процесу.",
    fileUrl: `${archiveRoot}/student-survey-questionnaires.pdf`,
    fileName: "Відкрити анкети",
    role: "monitoring",
  },
  {
    title: "Етапи затвердження нової редакції освітньої програми",
    summary: "Порядок підготовки, відкритого обговорення, погодження та затвердження змін до освітніх програм.",
    fileUrl: "/documents/archive/old-site/educational-programme-approval-stages.pdf",
    fileName: "Відкрити етапи затвердження",
    role: "programme-discussion",
  },
  {
    title: "Положення про гаранта освітньої програми",
    summary: "Документ визначає роль гаранта у розвитку, моніторингу та перегляді освітньої програми.",
    fileUrl: "/documents/archive/old-site/programme-guarantor.pdf",
    fileName: "Відкрити положення",
    role: "programme-discussion",
  },
  {
    title: "Підвищення кваліфікації науково-педагогічних працівників",
    summary: "Положення про професійний розвиток, стажування та підвищення кваліфікації працівників Академії.",
    fileUrl: "/documents/archive/old-site/academic-staff-development-2025.pdf",
    fileName: "Відкрити положення",
    role: "npp-evaluation",
  },
  {
    title: "Присвоєння професійних кваліфікацій",
    summary: "Нормативний документ, пов’язаний з оцінюванням результатів навчання та професійних компетентностей.",
    fileUrl: "/documents/archive/old-site/professional-qualifications-regulation.pdf",
    fileName: "Відкрити документ",
    role: "npp-evaluation",
  },
];

const programmeMaterials: Record<string, ArchivedQualityMaterial[]> = {
  "/programs/finance": [
    {
      title: "Результати анкетування здобувачів програми «Фінанси»",
      summary: "Моніторинг академічної доброчесності, якості освітньої програми та освітнього середовища; опитування 2021 року.",
      fileUrl: `${qualityRoot}/finance-monitoring-2021.pdf`,
      fileName: "Відкрити результати анкетування",
      role: "monitoring",
      date: "2021",
    },
    {
      title: "Витяг із протоколу обговорення результатів анкетування",
      summary: "Зафіксовані висновки кафедри та рішення за підсумками моніторингу якості освіти.",
      fileUrl: `${qualityRoot}/finance-survey-discussion-extract.pdf`,
      fileName: "Відкрити витяг із протоколу",
      role: "monitoring",
      date: "Архів кафедри",
    },
  ],
  "/programs/management": [
    {
      title: "Результати анкетування здобувачів програми «Менеджмент»",
      summary: "Результати моніторингу академічної доброчесності, якості програми та організації освітнього процесу.",
      fileUrl: `${qualityRoot}/management-monitoring-2020.pdf`,
      fileName: "Відкрити результати анкетування",
      role: "monitoring",
      date: "2020",
    },
    {
      title: "Освітня програма «Менеджмент»: бакалаврський рівень",
      summary: "Архівний перелік обов’язкових і вибіркових компонентів програми для перегляду та обговорення.",
      fileUrl: `${qualityRoot}/management-bachelor-programme-discussion.pdf`,
      fileName: "Відкрити структуру програми",
      role: "programme-discussion",
      date: "Бакалаврат",
    },
    {
      title: "Освітня програма «Менеджмент»: магістерський рівень",
      summary: "Архівний перелік освітніх компонентів магістерської програми для перегляду та обговорення.",
      fileUrl: `${qualityRoot}/management-master-programme-discussion.pdf`,
      fileName: "Відкрити структуру програми",
      role: "programme-discussion",
      date: "Магістратура",
    },
  ],
  "/programs/marketing": [
    {
      title: "Результати анкетування здобувачів програми «Маркетинг»",
      summary: "Результати анонімного опитування студентів бакалаврського та магістерського рівнів, проведеного через Moodle.",
      fileUrl: `${qualityRoot}/marketing-monitoring-2024.pdf`,
      fileName: "Відкрити результати анкетування",
      role: "monitoring",
      date: "2024",
    },
  ],
  "/programs/psychology": [
    {
      title: "Результати опитування здобувачів магістерського рівня",
      summary: "Комплект матеріалів кафедри психології: академічна доброчесність, освітнє середовище та оцінювання якості програми.",
      fileUrl: `${qualityRoot}/psychology-master-monitoring-2024.pdf`,
      fileName: "Відкрити результати опитування",
      role: "monitoring",
      date: "2023–2024",
    },
    {
      title: "Академічна доброчесність: опитування бакалаврів",
      summary: "Результати опитування здобувачів першого рівня вищої освіти спеціальності 053 «Психологія».",
      fileUrl: `${qualityRoot}/psychology-bachelor-integrity-monitoring-2024.pdf`,
      fileName: "Відкрити результати опитування",
      role: "monitoring",
      date: "2024",
    },
    {
      title: "Самооцінювання освітньої програми «Психологія»",
      summary: "Відомості про самооцінювання бакалаврської програми, підготовлені для акредитаційної справи.",
      fileUrl: `${qualityRoot}/psychology-bachelor-self-evaluation.pdf`,
      fileName: "Відкрити відомості про самооцінювання",
      role: "programme-discussion",
      date: "Бакалаврат",
    },
    {
      title: "Самооцінювання програми «Психологія бізнесу та управління»",
      summary: "Відомості про самооцінювання магістерської програми, підготовлені для акредитаційної справи.",
      fileUrl: `${qualityRoot}/psychology-business-self-evaluation.pdf`,
      fileName: "Відкрити відомості про самооцінювання",
      role: "programme-discussion",
      date: "Магістратура",
    },
  ],
  "/programs/public-administration": [
    {
      title: "Самооцінювання програми «Публічне управління та адміністрування»",
      summary: "Відомості про самооцінювання магістерської освітньої програми для акредитаційної справи.",
      fileUrl: `${qualityRoot}/public-administration-self-evaluation.pdf`,
      fileName: "Відкрити відомості про самооцінювання",
      role: "programme-discussion",
      date: "Магістратура",
    },
  ],
  "/programs/social-work": [
    {
      title: "Аналіз анкетування здобувачів ступеня доктора філософії",
      summary: "Моніторинг освітньо-наукової програми зі спеціальності 231 «Соціальна робота».",
      fileUrl: `${qualityRoot}/social-work-phd-monitoring-2020.pdf`,
      fileName: "Відкрити аналіз анкетування",
      role: "monitoring",
      date: "2020",
    },
    {
      title: "Публічне обговорення освітньо-наукової програми",
      summary: "Результати анкетування роботодавців, науковців, випускників та інших стейкголдерів програми «Соціальна робота».",
      fileUrl: `${qualityRoot}/social-work-stakeholders-monitoring-2020.pdf`,
      fileName: "Відкрити результати обговорення",
      role: "programme-discussion",
      date: "2020",
    },
  ],
  "/programs/professional-education": [
    {
      title: "Результати анкетування програми «Професійна освіта (Цифрові технології)»",
      summary: "Моніторинг якості програми, академічної доброчесності та освітнього середовища.",
      fileUrl: `${qualityRoot}/professional-education-monitoring-2023.pdf`,
      fileName: "Відкрити результати анкетування",
      role: "monitoring",
      date: "2023",
    },
    {
      title: "Результати анкетування здобувачів програми",
      summary: "Актуальніший архівний звіт про опитування бакалаврів і магістрів програми «Професійна освіта (Цифрові технології)».",
      fileUrl: `${qualityRoot}/professional-education-monitoring-2025.pdf`,
      fileName: "Відкрити результати анкетування",
      role: "monitoring",
      date: "2025",
    },
    {
      title: "Самооцінювання програми «Професійна освіта»",
      summary: "Відомості про самооцінювання магістерської освітньої програми для акредитаційної справи.",
      fileUrl: `${qualityRoot}/professional-education-self-evaluation.pdf`,
      fileName: "Відкрити відомості про самооцінювання",
      role: "programme-discussion",
      date: "Магістратура",
    },
  ],
  "/departments/economics-social-tourism-faculty": [
    {
      title: "Протоколи кафедр за результатами анкетування",
      summary: "Архівні рішення кафедр факультету за підсумками опитування здобувачів освіти.",
      fileUrl: `${qualityRoot}/faculty-survey-results-protocols.pdf`,
      fileName: "Відкрити протоколи",
      role: "monitoring",
      date: "Архів факультету",
    },
  ],
};

function toDepartmentEntry(pagePath: string, material: ArchivedQualityMaterial, index: number): DepartmentEntry {
  const timestamp = "2026-05-31T00:00:00.000Z";
  return {
    id: `archive-quality-${pagePath.replace(/[^a-z0-9]+/gi, "-")}-${index}`,
    pagePath,
    sectionId: "quality",
    entryType: "quality",
    title: material.title,
    summary: material.summary,
    body: "",
    imageUrl: "",
    imageAlt: "",
    fileUrl: material.fileUrl,
    fileName: material.fileName,
    date: material.date || "Архів сайту · травень 2026",
    role: material.role,
    email: "",
    profileUrl: "",
    status: "published",
    sortOrder: 900 + index,
    createdAt: timestamp,
    updatedAt: timestamp,
    authorEmail: "archive@socosvita.kiev.ua",
  };
}

export function getArchivedEducationQualityEntries(pagePath: string): DepartmentEntry[] {
  const materials = [...(programmeMaterials[pagePath] || []), ...academyMaterials];
  return materials.map((material, index) => toDepartmentEntry(pagePath, material, index));
}
