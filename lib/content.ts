export type ContentKind =
  | "lesson"
  | "exam"
  | "library_book"
  | "event"
  | "research_resource"
  | "admission_timeline";

export type ContentPayload = Record<string, string>;

export type ContentItem = {
  id: string;
  kind: ContentKind;
  payload: ContentPayload;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  authorEmail: string;
};

export type PublicContentItem = Pick<ContentItem, "id" | "kind" | "payload" | "sortOrder">;

export type ContentInput = {
  kind: ContentKind;
  payload: ContentPayload;
  sortOrder?: number;
};

import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const SEED_AUTHOR = "editorial@apsvt.local";
const SEED_DATE = "2026-07-18T00:00:00.000Z";

function seed(id: string, kind: ContentKind, payload: ContentPayload, sortOrder: number): ContentItem {
  return { id, kind, payload, sortOrder, createdAt: SEED_DATE, updatedAt: SEED_DATE, authorEmail: SEED_AUTHOR };
}

export const seedContent: ContentItem[] = [
  seed("lesson-01", "lesson", { date: "07.09", day: "Понеділок", time: "09:00–10:20", course: "Іноземна мова", type: "Практичне", group: "1 курс", faculty: "Економіка і туризм", teacher: "О. Мельник", room: "214" }, 10),
  seed("lesson-02", "lesson", { date: "07.09", day: "Понеділок", time: "10:35–11:55", course: "Основи менеджменту", type: "Лекція", group: "1 курс", faculty: "Економіка і туризм", teacher: "Н. Василець", room: "305" }, 20),
  seed("lesson-03", "lesson", { date: "07.09", day: "Понеділок", time: "12:20–13:40", course: "Теорія держави і права", type: "Лекція", group: "1 курс", faculty: "Право", teacher: "Я. Журавель", room: "118" }, 30),
  seed("lesson-04", "lesson", { date: "08.09", day: "Вівторок", time: "09:00–10:20", course: "Маркетингові дослідження", type: "Лабораторне", group: "2 курс", faculty: "Економіка і туризм", teacher: "Н. Писаренко", room: "311" }, 40),
  seed("lesson-05", "lesson", { date: "08.09", day: "Вівторок", time: "10:35–11:55", course: "Фінансовий аналіз", type: "Практичне", group: "3 курс", faculty: "Економіка і туризм", teacher: "Я. Ткаченко", room: "онлайн" }, 50),
  seed("lesson-06", "lesson", { date: "08.09", day: "Вівторок", time: "12:20–13:40", course: "Цивільне право", type: "Семінар", group: "2 курс", faculty: "Право", teacher: "Г. Муляр", room: "201" }, 60),
  seed("lesson-07", "lesson", { date: "09.09", day: "Середа", time: "10:35–11:55", course: "Психодіагностика", type: "Лабораторне", group: "2 курс", faculty: "Економіка і туризм", teacher: "Г. Пріб", room: "407" }, 70),
  seed("lesson-08", "lesson", { date: "09.09", day: "Середа", time: "12:20–13:40", course: "Соціальна політика", type: "Лекція", group: "1 курс", faculty: "Економіка і туризм", teacher: "Н. Балашова", room: "216" }, 80),
  seed("lesson-09", "lesson", { date: "09.09", day: "Середа", time: "14:00–15:20", course: "Кримінальний процес", type: "Практичне", group: "3 курс", faculty: "Право", teacher: "І. Діордіца", room: "Зала суду" }, 90),
  seed("lesson-10", "lesson", { date: "10.09", day: "Четвер", time: "09:00–10:20", course: "Управління проєктами", type: "Практичне", group: "3 курс", faculty: "Економіка і туризм", teacher: "Н. Василець", room: "305" }, 100),
  seed("lesson-11", "lesson", { date: "10.09", day: "Четвер", time: "12:20–13:40", course: "Юридична клініка", type: "Клінічна практика", group: "3 курс", faculty: "Право", teacher: "Я. Журавель", room: "Клініка" }, 110),
  seed("lesson-12", "lesson", { date: "11.09", day: "П’ятниця", time: "10:35–11:55", course: "Економіка підприємства", type: "Лекція", group: "2 курс", faculty: "Економіка і туризм", teacher: "І. Чорнодід", room: "Актова зала" }, 120),

  seed("exam-01", "exam", { date: "14.12.2026", time: "10:00", faculty: "Економіка і туризм", group: "1 курс", course: "Економічна теорія", form: "Іспит", teacher: "І. Чорнодід", room: "305" }, 10),
  seed("exam-02", "exam", { date: "16.12.2026", time: "10:00", faculty: "Право", group: "1 курс", course: "Теорія держави і права", form: "Іспит", teacher: "Я. Журавель", room: "118" }, 20),
  seed("exam-03", "exam", { date: "17.12.2026", time: "12:00", faculty: "Економіка і туризм", group: "2 курс", course: "Маркетингові дослідження", form: "Залік", teacher: "Н. Писаренко", room: "311" }, 30),
  seed("exam-04", "exam", { date: "18.12.2026", time: "10:00", faculty: "Право", group: "2 курс", course: "Цивільне право", form: "Іспит", teacher: "Г. Муляр", room: "201" }, 40),
  seed("exam-05", "exam", { date: "21.12.2026", time: "10:00", faculty: "Економіка і туризм", group: "2 курс", course: "Психодіагностика", form: "Іспит", teacher: "Г. Пріб", room: "407" }, 50),
  seed("exam-06", "exam", { date: "22.12.2026", time: "12:00", faculty: "Право", group: "3 курс", course: "Кримінальний процес", form: "Іспит", teacher: "І. Діордіца", room: "Зала суду" }, 60),
  seed("exam-07", "exam", { date: "23.12.2026", time: "10:00", faculty: "Економіка і туризм", group: "3 курс", course: "Управління проєктами", form: "Залік", teacher: "Н. Василець", room: "305" }, 70),
  seed("exam-08", "exam", { date: "28.12.2026", time: "10:00", faculty: "Економіка і туризм", group: "3 курс", course: "Фінансовий аналіз", form: "Іспит", teacher: "Я. Ткаченко", room: "онлайн" }, 80),

  seed("book-01", "library_book", { title: "Конституційне право України", author: "О. В. Совгиря, Н. Г. Шукліна", year: "2023", topic: "Право", type: "Підручник", code: "342(477) С56", status: "Доступна" }, 10),
  seed("book-02", "library_book", { title: "Цивільне право України", author: "Р. А. Майданик, Ю. О. Заіка", year: "2022", topic: "Право", type: "Підручник", code: "347(477) Ц58", status: "У читальній залі" }, 20),
  seed("book-03", "library_book", { title: "Менеджмент", author: "В. Г. Федоренко", year: "2021", topic: "Менеджмент", type: "Навчальний посібник", code: "005 Ф33", status: "Доступна" }, 30),
  seed("book-04", "library_book", { title: "Стратегічне управління", author: "З. Є. Шершньова", year: "2020", topic: "Менеджмент", type: "Підручник", code: "005.21 Ш50", status: "На руках" }, 40),
  seed("book-05", "library_book", { title: "Економіка праці та соціально-трудові відносини", author: "А. М. Колот", year: "2021", topic: "Економіка", type: "Підручник", code: "331 К61", status: "Доступна" }, 50),
  seed("book-06", "library_book", { title: "Соціальна політика", author: "О. М. Палій", year: "2020", topic: "Соціальна робота", type: "Навчальний посібник", code: "304 П14", status: "Доступна" }, 60),
  seed("book-07", "library_book", { title: "Психологія особистості", author: "П. П. Горностай", year: "2021", topic: "Психологія", type: "Посібник", code: "159.923 Г69", status: "У читальній залі" }, 70),
  seed("book-08", "library_book", { title: "Основи психологічного консультування", author: "В. Г. Панок", year: "2019", topic: "Психологія", type: "Практикум", code: "159.9 П16", status: "Доступна" }, 80),
  seed("book-09", "library_book", { title: "Організація туристичних подорожей", author: "І. М. Писаревський", year: "2020", topic: "Туризм", type: "Навчальний посібник", code: "338.48 П34", status: "Доступна" }, 90),
  seed("book-10", "library_book", { title: "Маркетинг туристичних дестинацій", author: "Н. В. Корж", year: "2022", topic: "Туризм", type: "Монографія", code: "338.48 К66", status: "На руках" }, 100),
  seed("book-11", "library_book", { title: "Публічне управління та адміністрування", author: "В. Д. Бакуменко", year: "2021", topic: "Публічне управління", type: "Підручник", code: "351 Б19", status: "Доступна" }, 110),
  seed("book-12", "library_book", { title: "Соціологія", author: "Н. П. Осипова", year: "2020", topic: "Соціальні науки", type: "Підручник", code: "316 О-74", status: "Доступна" }, 120),
  seed("book-13", "library_book", { title: "Методологія та організація наукових досліджень", author: "І. С. Добронравова", year: "2021", topic: "Наука", type: "Навчальний посібник", code: "001.8 Д56", status: "У читальній залі" }, 130),
  seed("book-14", "library_book", { title: "Академічне письмо", author: "Т. В. Яхонтова", year: "2022", topic: "Наука", type: "Посібник", code: "001.81 Я90", status: "Доступна" }, 140),

  seed("event-01", "event", { date: "2026-08-22", time: "11:00", title: "День відкритих дверей", place: "Кампус", description: "Знайомство з програмами, викладачами, кампусом і маршрутом вступу." }, 10),
  seed("event-02", "event", { date: "2026-09-04", time: "15:00", title: "Відкрита лекція: право і суспільні зміни", place: "Актова зала", description: "Розмова з практиками про нову роль юриста та роботу правничої спільноти." }, 20),
  seed("event-03", "event", { date: "2026-09-12", time: "17:30", title: "Кар’єрна лабораторія", place: "Онлайн", description: "Як перетворити навчальний проєкт на перший професійний кейс." }, 30),
  seed("event-04", "event", { date: "2026-09-25", time: "12:00", title: "Міжнародний день Академії", place: "Кампус", description: "Мобільність, Erasmus+, подвійний диплом і студентські історії." }, 40),

  seed("research-01", "research_resource", { year: "2026", category: "Дослідницький ресурс", title: "Google Scholar — профілі дослідників Академії", description: "Пошук авторів, цитувань і пов’язаних публікацій викладачів.", url: "https://scholar.google.com/" }, 10),
  seed("research-02", "research_resource", { year: "2020", category: "Наукове видання", title: "Вісник АПСВТ · №1–2", description: "Повний випуск наукового журналу Академії у форматі PDF.", url: "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_1-2_2020.pdf" }, 20),
  seed("research-03", "research_resource", { year: "2026", category: "Репозитарій", title: "Наукові публікації та матеріали конференцій", description: "Добірка академічних статей, монографій і збірників для навчання та досліджень.", url: "/materials" }, 30),

  seed("admission-01", "admission_timeline", { dateLabel: "1 липня 2026", title: "Старт електронних кабінетів", description: "Зареєструйте кабінет вступника в ЄДЕБО та перевірте персональні дані.", status: "Триває" }, 10),
  seed("admission-02", "admission_timeline", { dateLabel: "19 липня — 1 серпня, 18:00", title: "Подання заяв на бакалаврат", description: "Оберіть конкурсні пропозиції, додайте мотиваційні листи й установіть пріоритети.", status: "Ключовий етап" }, 20),
  seed("admission-03", "admission_timeline", { dateLabel: "Не пізніше 6 серпня", title: "Рекомендації до зарахування", description: "Перевірте статус заяви в електронному кабінеті та виконайте вимоги Академії.", status: "Очікується" }, 30),
  seed("admission-04", "admission_timeline", { dateLabel: "До 11 серпня, 18:00", title: "Підтвердження вибору", description: "Підтвердьте місце навчання електронно та надайте потрібні документи.", status: "Обов’язково" }, 40),
  seed("admission-05", "admission_timeline", { dateLabel: "До 13 серпня", title: "Зарахування", description: "Завершення зарахування на бюджет і контракт для заяв із пріоритетом.", status: "Фініш" }, 50),
  seed("admission-06", "admission_timeline", { dateLabel: "7–22 серпня 2026", title: "Подання заяв до магістратури", description: "Вступники на магістерські програми подають заяви через електронний кабінет.", status: "Магістратура" }, 60),
];

const validKinds = new Set<ContentKind>(["lesson", "exam", "library_book", "event", "research_resource", "admission_timeline"]);

export function isContentKind(value: unknown): value is ContentKind {
  return typeof value === "string" && validKinds.has(value as ContentKind);
}

const createTableSql = `CREATE TABLE IF NOT EXISTS content_items (
  id TEXT PRIMARY KEY NOT NULL,
  kind TEXT NOT NULL,
  payload TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  author_email TEXT NOT NULL
)`;

async function db(): Promise<D1Database | null> {
  try {
    const moduleName = "cloudflare:workers";
    const { env } = await import(/* webpackIgnore: true */ moduleName);
    return env.DB ?? null;
  } catch {
    return null;
  }
}

let initialized = false;

export async function ensureContent(): Promise<void> {
  if (initialized) return;
  const database = await db();
  if (!database) return;
  await database.prepare(createTableSql).run();
  await database.prepare("CREATE INDEX IF NOT EXISTS content_items_kind_sort_idx ON content_items(kind, sort_order)").run();
  await database.batch(seedContent.map((item) => database.prepare(
    `INSERT OR IGNORE INTO content_items (id,kind,payload,sort_order,created_at,updated_at,author_email) VALUES (?,?,?,?,?,?,?)`,
  ).bind(item.id, item.kind, JSON.stringify(item.payload), item.sortOrder, item.createdAt, item.updatedAt, item.authorEmail)));
  initialized = true;
}

function fromRow(row: Record<string, unknown>): ContentItem {
  let payload: ContentPayload = {};
  if (row.payload && typeof row.payload === "object") payload = row.payload as ContentPayload;
  else try { payload = JSON.parse(String(row.payload)) as ContentPayload; } catch { payload = {}; }
  return {
    id: String(row.id),
    kind: String(row.kind) as ContentKind,
    payload,
    sortOrder: Number(row.sort_order) || 0,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    authorEmail: String(row.author_email),
  };
}

function toSupabaseRow(item: ContentItem) {
  return {
    id: item.id, kind: item.kind, payload: item.payload, sort_order: item.sortOrder,
    created_at: item.createdAt, updated_at: item.updatedAt, author_email: item.authorEmail,
  };
}

let supabaseContentSeeded = false;
async function ensureSupabaseContent(): Promise<void> {
  if (supabaseContentSeeded || !isSupabaseConfigured()) return;
  const admin = createSupabaseAdmin();
  const { data, error } = await admin.from("editorial_content_items").select("id").limit(1);
  if (error) throw error;
  if (!data?.length) {
    const inserted = await admin.from("editorial_content_items").upsert(seedContent.map(toSupabaseRow), { onConflict: "id" });
    if (inserted.error) throw inserted.error;
  }
  supabaseContentSeeded = true;
}

export async function getContentItems(kind: ContentKind): Promise<ContentItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await createSupabasePublicClient().from("editorial_content_items").select("*").eq("kind", kind).order("sort_order", { ascending: true });
      if (error) throw error;
      if (data?.length) return data.map((row) => fromRow(row as Record<string, unknown>));
    } catch {
      // Keep public schedules and catalogues available with bundled data.
    }
  }
  try {
    await ensureContent();
    const database = await db();
    if (!database) throw new Error("D1_UNAVAILABLE");
    const result = await database.prepare("SELECT * FROM content_items WHERE kind = ? ORDER BY sort_order ASC, created_at ASC").bind(kind).all<Record<string, unknown>>();
    return result.results.map(fromRow);
  } catch {
    return seedContent.filter((item) => item.kind === kind);
  }
}

export async function getPublicContent(kind: ContentKind): Promise<PublicContentItem[]> {
  return (await getContentItems(kind)).map(({ id, kind: itemKind, payload, sortOrder }) => ({ id, kind: itemKind, payload, sortOrder }));
}

export async function getAllContent(): Promise<ContentItem[]> {
  if (isSupabaseConfigured()) {
    try {
      await ensureSupabaseContent();
      const { data, error } = await createSupabaseAdmin().from("editorial_content_items").select("*").order("kind").order("sort_order");
      if (error) throw error;
      return (data || []).map((row) => fromRow(row as Record<string, unknown>));
    } catch {
      // Fall through to the existing storage or seed content.
    }
  }
  try {
    await ensureContent();
    const database = await db();
    if (!database) throw new Error("D1_UNAVAILABLE");
    const result = await database.prepare("SELECT * FROM content_items ORDER BY kind ASC, sort_order ASC, created_at ASC").all<Record<string, unknown>>();
    return result.results.map(fromRow);
  } catch {
    return seedContent;
  }
}

export async function createContentItem(input: ContentInput, authorEmail: string): Promise<ContentItem> {
  if (isSupabaseConfigured()) {
    await ensureSupabaseContent();
    const now = new Date().toISOString();
    const item: ContentItem = { id: crypto.randomUUID(), kind: input.kind, payload: input.payload, sortOrder: input.sortOrder ?? Date.now(), createdAt: now, updatedAt: now, authorEmail };
    const { data, error } = await createSupabaseAdmin().from("editorial_content_items").insert(toSupabaseRow(item)).select("*").single();
    if (error) throw error;
    return fromRow(data as Record<string, unknown>);
  }
  await ensureContent();
  const database = await db();
  if (!database) throw new Error("PERSISTENCE_UNAVAILABLE");
  const now = new Date().toISOString();
  const item: ContentItem = { id: crypto.randomUUID(), kind: input.kind, payload: input.payload, sortOrder: input.sortOrder ?? Date.now(), createdAt: now, updatedAt: now, authorEmail };
  await database.prepare("INSERT INTO content_items (id,kind,payload,sort_order,created_at,updated_at,author_email) VALUES (?,?,?,?,?,?,?)").bind(item.id, item.kind, JSON.stringify(item.payload), item.sortOrder, item.createdAt, item.updatedAt, item.authorEmail).run();
  return item;
}

export async function updateContentItem(id: string, input: ContentInput, authorEmail: string): Promise<ContentItem | null> {
  if (isSupabaseConfigured()) {
    const { data, error } = await createSupabaseAdmin().from("editorial_content_items").update({
      kind: input.kind, payload: input.payload, sort_order: input.sortOrder ?? 0,
      updated_at: new Date().toISOString(), author_email: authorEmail,
    }).eq("id", id).select("*").maybeSingle();
    if (error) throw error;
    return data ? fromRow(data as Record<string, unknown>) : null;
  }
  await ensureContent();
  const database = await db();
  if (!database) throw new Error("PERSISTENCE_UNAVAILABLE");
  const now = new Date().toISOString();
  await database.prepare("UPDATE content_items SET kind=?, payload=?, sort_order=?, updated_at=?, author_email=? WHERE id=?").bind(input.kind, JSON.stringify(input.payload), input.sortOrder ?? 0, now, authorEmail, id).run();
  const row = await database.prepare("SELECT * FROM content_items WHERE id = ?").bind(id).first<Record<string, unknown>>();
  return row ? fromRow(row) : null;
}

export async function deleteContentItem(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await createSupabaseAdmin().from("editorial_content_items").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  await ensureContent();
  const database = await db();
  if (!database) throw new Error("PERSISTENCE_UNAVAILABLE");
  await database.prepare("DELETE FROM content_items WHERE id = ?").bind(id).run();
}
