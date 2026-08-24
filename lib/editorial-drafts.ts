import type { ContentKind } from "@/lib/content";

export type EditorialDraftTarget =
  | "vacancy"
  | "news"
  | "event"
  | "schedule_lesson"
  | "schedule_exam"
  | "library_book"
  | "admission_timeline"
  | "research_resource"
  | "student_thesis"
  | "department_section"
  | "department_news"
  | "department_article"
  | "department_material"
  | "department_photo"
  | "department_teacher"
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
  departmentEntryType?: "section" | "news" | "article" | "material" | "photo" | "teacher";
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
    id: "schedule_lesson",
    label: "Розклад занять",
    description: "Дати, пари, групи, викладачі, аудиторії та формат занять",
    pagePath: "/schedule",
    contentKind: "lesson",
    fields: [
      { key: "date", label: "Дата" },
      { key: "day", label: "День тижня" },
      { key: "time", label: "Час", placeholder: "09:00–10:20" },
      { key: "course", label: "Дисципліна" },
      { key: "type", label: "Тип заняття", placeholder: "Лекція / практичне" },
      { key: "group", label: "Група / курс" },
      { key: "faculty", label: "Факультет / програма" },
      { key: "teacher", label: "Викладач" },
      { key: "room", label: "Аудиторія / онлайн" },
    ],
  },
  {
    id: "schedule_exam",
    label: "Розклад іспитів",
    description: "Іспити, співбесіди, консультації та інші контрольні заходи",
    pagePath: "/exam-schedule",
    contentKind: "exam",
    fields: [
      { key: "date", label: "Дата" },
      { key: "time", label: "Час", placeholder: "10:00" },
      { key: "faculty", label: "Факультет / програма" },
      { key: "group", label: "Група / рівень" },
      { key: "course", label: "Дисципліна" },
      { key: "form", label: "Форма", placeholder: "Іспит / співбесіда" },
      { key: "teacher", label: "Викладач / комісія" },
      { key: "room", label: "Аудиторія / посилання" },
    ],
  },
  {
    id: "library_book",
    label: "Бібліотека",
    description: "Книги, посібники, шифри, тематики та статус доступності",
    pagePath: "/facilities/library",
    contentKind: "library_book",
    fields: [
      { key: "title", label: "Назва" },
      { key: "author", label: "Автор / укладач" },
      { key: "year", label: "Рік" },
      { key: "topic", label: "Тематика" },
      { key: "type", label: "Тип видання", placeholder: "Підручник / посібник" },
      { key: "code", label: "Бібліотечний шифр" },
      { key: "status", label: "Доступність", placeholder: "Доступна / у читальній залі" },
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
    id: "department_section",
    label: "Кафедра · розділ сторінки",
    description: "Опис кафедри, напрями роботи, досягнення або контакти",
    pagePath: "/programs",
    departmentEntryType: "section",
    fields: [
      { key: "title", label: "Заголовок" },
      { key: "summary", label: "Короткий опис", type: "textarea" },
      { key: "body", label: "Повний текст", type: "textarea" },
      { key: "imageAlt", label: "Опис зображення" },
    ],
  },
  {
    id: "department_news",
    label: "Кафедра · новина",
    description: "Новина, оголошення або подія для конкретної кафедри",
    pagePath: "/programs",
    departmentEntryType: "news",
    fields: [
      { key: "title", label: "Заголовок" },
      { key: "date", label: "Дата", type: "date" },
      { key: "summary", label: "Короткий анонс", type: "textarea" },
      { key: "body", label: "Текст", type: "textarea" },
      { key: "imageAlt", label: "Опис фото" },
    ],
  },
  {
    id: "department_article",
    label: "Кафедра · стаття",
    description: "Розгорнутий авторський, методичний або аналітичний матеріал",
    pagePath: "/programs",
    departmentEntryType: "article",
    fields: [
      { key: "title", label: "Заголовок" },
      { key: "date", label: "Дата", type: "date" },
      { key: "summary", label: "Короткий анонс", type: "textarea" },
      { key: "body", label: "Текст статті", type: "textarea" },
      { key: "imageAlt", label: "Опис фото" },
    ],
  },
  {
    id: "department_material",
    label: "Кафедра · матеріал",
    description: "Методичний файл, програма, презентація або корисне посилання",
    pagePath: "/programs",
    departmentEntryType: "material",
    fields: [
      { key: "title", label: "Назва матеріалу" },
      { key: "summary", label: "Опис", type: "textarea" },
    ],
  },
  {
    id: "department_photo",
    label: "Кафедра · фотогалерея",
    description: "Фото з готовим заголовком, підписом і альтернативним описом",
    pagePath: "/programs",
    departmentEntryType: "photo",
    fields: [
      { key: "title", label: "Назва фото" },
      { key: "summary", label: "Підпис", type: "textarea" },
      { key: "imageAlt", label: "Альтернативний опис" },
    ],
  },
  {
    id: "department_teacher",
    label: "Кафедра · викладач",
    description: "Профіль викладача з фото, посадою, біографією та науковим профілем",
    pagePath: "/programs",
    departmentEntryType: "teacher",
    fields: [
      { key: "title", label: "Ім’я та прізвище" },
      { key: "role", label: "Посада / науковий ступінь" },
      { key: "summary", label: "Професійний профіль", type: "textarea" },
      { key: "email", label: "Email" },
      { key: "profileUrl", label: "ORCID / Google Scholar", type: "url" },
      { key: "imageAlt", label: "Опис фото" },
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
