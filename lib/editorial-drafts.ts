import type { ContentKind } from "@/lib/content";

export type EditorialDraftTarget =
  | "vacancy"
  | "news"
  | "event"
  | "admission_timeline"
  | "research_resource"
  | "student_thesis"
  | "document";

export type DraftField = {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "date" | "textarea" | "url";
};

export type DraftRecord = {
  fields: { key: string; value: string }[];
};

export type EditorialAiDraft = {
  target: EditorialDraftTarget;
  title: string;
  summary: string;
  body: string;
  records: DraftRecord[];
  warnings: string[];
  sourceFileName: string;
  usedAi: boolean;
};

export type DraftTargetConfig = {
  id: EditorialDraftTarget;
  label: string;
  description: string;
  pagePath: string;
  contentKind?: ContentKind;
  fields: DraftField[];
};

export const draftTargetConfigs: DraftTargetConfig[] = [
  {
    id: "vacancy",
    label: "Вакансії",
    description: "Посади, кафедри, кількість місць і дедлайн конкурсу",
    pagePath: "/vacancies",
    contentKind: "vacancy",
    fields: [
      { key: "faculty", label: "Факультет" },
      { key: "department", label: "Кафедра" },
      { key: "title", label: "Посада" },
      { key: "count", label: "Кількість", placeholder: "1" },
      { key: "deadline", label: "Кінцевий термін", type: "date" },
      { key: "status", label: "Статус", placeholder: "Відкрито / Незабаром / Архів" },
      { key: "note", label: "Примітка", type: "textarea" },
    ],
  },
  {
    id: "news",
    label: "Новини",
    description: "Заголовок, короткий анонс і готовий текст новини",
    pagePath: "/news",
    fields: [
      { key: "title", label: "Заголовок" },
      { key: "excerpt", label: "Короткий анонс", type: "textarea" },
      { key: "body", label: "Текст матеріалу", type: "textarea" },
      { key: "category", label: "Категорія", placeholder: "Новини" },
    ],
  },
  {
    id: "event",
    label: "Події",
    description: "Дата, час, місце та опис події",
    pagePath: "/events",
    contentKind: "event",
    fields: [
      { key: "date", label: "Дата", type: "date" },
      { key: "time", label: "Час", placeholder: "11:00" },
      { key: "title", label: "Назва події" },
      { key: "place", label: "Місце / формат" },
      { key: "description", label: "Опис", type: "textarea" },
    ],
  },
  {
    id: "admission_timeline",
    label: "Вступнику",
    description: "Ключові дати, етапи та пояснення для вступників",
    pagePath: "/admissions",
    contentKind: "admission_timeline",
    fields: [
      { key: "dateLabel", label: "Дата або період" },
      { key: "title", label: "Етап" },
      { key: "status", label: "Позначка", placeholder: "Ключовий етап" },
      { key: "description", label: "Що потрібно зробити", type: "textarea" },
    ],
  },
  {
    id: "research_resource",
    label: "Наука",
    description: "Публікація, ресурс, збірник або посилання",
    pagePath: "/research",
    contentKind: "research_resource",
    fields: [
      { key: "title", label: "Назва" },
      { key: "category", label: "Категорія" },
      { key: "year", label: "Рік" },
      { key: "url", label: "Посилання", type: "url" },
      { key: "description", label: "Опис", type: "textarea" },
    ],
  },
  {
    id: "student_thesis",
    label: "Кваліфікаційні роботи",
    description: "Дані студента, програма, керівник та анотація",
    pagePath: "/research/theses",
    contentKind: "student_thesis",
    fields: [
      { key: "title", label: "Назва роботи" },
      { key: "student", label: "Студент / студентка" },
      { key: "level", label: "Рівень", placeholder: "Бакалавр / Магістр" },
      { key: "program", label: "Освітня програма" },
      { key: "year", label: "Рік захисту" },
      { key: "supervisor", label: "Науковий керівник" },
      { key: "abstract", label: "Анотація", type: "textarea" },
      { key: "keywords", label: "Ключові слова" },
      { key: "fileUrl", label: "Файл роботи", type: "url" },
    ],
  },
  {
    id: "document",
    label: "Документ на сторінку",
    description: "Зрозуміла назва, категорія та короткий опис файла",
    pagePath: "/materials",
    fields: [
      { key: "title", label: "Назва документа" },
      { key: "category", label: "Категорія", placeholder: "Положення / наказ / програма" },
      { key: "description", label: "Короткий опис", type: "textarea" },
    ],
  },
];

export function draftRecordToPayload(record: DraftRecord): Record<string, string> {
  return Object.fromEntries(record.fields.map((field) => [field.key, field.value]));
}

export function payloadToDraftRecord(payload: Record<string, string>, fields: DraftField[]): DraftRecord {
  return { fields: fields.map((field) => ({ key: field.key, value: payload[field.key] || "" })) };
}

