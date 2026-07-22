import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const workspaceSystems = ["workspace", "website", "documents", "assessment", "records", "integration"] as const;
export const workspaceStatuses = ["backlog", "planned", "in_progress", "review", "pilot", "live", "blocked", "archived"] as const;
export const workspacePriorities = ["critical", "high", "medium", "low"] as const;

export type WorkspaceSystem = typeof workspaceSystems[number];
export type WorkspaceStatus = typeof workspaceStatuses[number];
export type WorkspacePriority = typeof workspacePriorities[number];

export type WorkspaceItem = {
  id: string;
  title: string;
  description: string;
  system: WorkspaceSystem;
  status: WorkspaceStatus;
  priority: WorkspacePriority;
  owner: string;
  progress: number;
  dueDate: string | null;
  externalUrl: string | null;
  notes: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  authorEmail: string;
};

export type WorkspaceInput = Omit<WorkspaceItem, "id" | "createdAt" | "updatedAt" | "authorEmail">;

const seedWorkspace: WorkspaceItem[] = [
  { id: "system-academy-workspace", title: "Єдиний кабінет Академії", description: "Захищений простір для команди, ролей, рішень і щоденної координації BytesLab × АПСВТ.", system: "workspace", status: "live", priority: "critical", owner: "Адміністрація Академії", progress: 88, dueDate: null, externalUrl: "/panel", notes: "Доступ надається лише погодженим користувачам.", sortOrder: 10, createdAt: "2026-07-22T08:00:00.000Z", updatedAt: "2026-07-22T08:00:00.000Z", authorEmail: "vportnaia@kse.org.ua" },
  { id: "system-academy-website", title: "Публічний сайт АПСВТ", description: "Новини, програми, розклад, події, вступ і публічні матеріали з єдиною редакційною панеллю.", system: "website", status: "live", priority: "high", owner: "Редакційна команда", progress: 94, dueDate: null, externalUrl: "https://apsvt-academy-website.vercel.app", notes: "Контент оновлюється через редакційну панель.", sortOrder: 20, createdAt: "2026-07-22T08:00:00.000Z", updatedAt: "2026-07-22T08:00:00.000Z", authorEmail: "vportnaia@kse.org.ua" },
  { id: "system-document-studio", title: "BytesLab Document Studio", description: "Шаблони, методичні матеріали, накази, відомості та контроль версій навчальних документів.", system: "documents", status: "pilot", priority: "high", owner: "Навчально-методичний відділ", progress: 64, dueDate: "2026-09-15", externalUrl: null, notes: "Наступний крок — каталог шаблонів і права доступу кафедр.", sortOrder: 30, createdAt: "2026-07-22T08:00:00.000Z", updatedAt: "2026-07-22T08:00:00.000Z", authorEmail: "vportnaia@kse.org.ua" },
  { id: "system-gradeflow", title: "GradeFlow: роботи студентів", description: "Отримання робіт із Moodle, черга перевірки, рубрики, коментарі викладача та прозорий журнал рішень.", system: "assessment", status: "in_progress", priority: "critical", owner: "BytesLab + викладачі", progress: 42, dueDate: "2026-10-01", externalUrl: "https://apsvt-gradeflow.ikucha.chatgpt.site/", notes: "Автоматична перевірка після 14 днів лишається окремим контрольованим етапом.", sortOrder: 40, createdAt: "2026-07-22T08:00:00.000Z", updatedAt: "2026-07-22T08:00:00.000Z", authorEmail: "vportnaia@kse.org.ua" },
  { id: "system-ai-grading", title: "AI-помічник оцінювання", description: "Аналіз тексту, фото й голосу, проєкт оцінки, пояснення за рубрикою та обов’язковий зворотний зв’язок.", system: "assessment", status: "planned", priority: "critical", owner: "BytesLab AI", progress: 18, dueDate: "2026-11-15", externalUrl: null, notes: "Викладач затверджує або відхиляє результат до експорту оцінки.", sortOrder: 50, createdAt: "2026-07-22T08:00:00.000Z", updatedAt: "2026-07-22T08:00:00.000Z", authorEmail: "vportnaia@kse.org.ua" },
  { id: "system-grade-registers", title: "Електронні відомості", description: "Контроль повноти оцінок, підсумкові бали, історія змін, погодження та експорт відомостей.", system: "records", status: "review", priority: "high", owner: "Деканат", progress: 72, dueDate: "2026-09-30", externalUrl: null, notes: "Потрібно затвердити формат відомості й правила повторного оцінювання.", sortOrder: 60, createdAt: "2026-07-22T08:00:00.000Z", updatedAt: "2026-07-22T08:00:00.000Z", authorEmail: "vportnaia@kse.org.ua" },
  { id: "system-moodle", title: "Moodle: курси й оцінки", description: "Синхронізація курсів, студентів, файлів завдань, дедлайнів, фідбеку та фінальних оцінок.", system: "integration", status: "in_progress", priority: "critical", owner: "ІТ-відділ", progress: 46, dueDate: "2026-10-20", externalUrl: null, notes: "Потрібні Moodle URL, web service token і погоджений тестовий курс.", sortOrder: 70, createdAt: "2026-07-22T08:00:00.000Z", updatedAt: "2026-07-22T08:00:00.000Z", authorEmail: "vportnaia@kse.org.ua" },
  { id: "system-telegram", title: "Telegram-агент для викладачів", description: "Зчитування оцінок із голосових повідомлень і фото, перевірка відповідності студенту та підтвердження перед записом.", system: "integration", status: "backlog", priority: "medium", owner: "BytesLab", progress: 8, dueDate: "2026-12-15", externalUrl: null, notes: "Почати з голосового вводу та подвійного підтвердження оцінки.", sortOrder: 80, createdAt: "2026-07-22T08:00:00.000Z", updatedAt: "2026-07-22T08:00:00.000Z", authorEmail: "vportnaia@kse.org.ua" },
];

const compatibilityCategory = "__byteslab_workspace__";

function toCompatibilityRow(item: WorkspaceItem) {
  return {
    id: item.id,
    slug: `workspace-${item.id}`.slice(0, 110),
    title: item.title,
    excerpt: item.description,
    body: JSON.stringify({ system: item.system, status: item.status, priority: item.priority, owner: item.owner, progress: item.progress, dueDate: item.dueDate, externalUrl: item.externalUrl, notes: item.notes, sortOrder: item.sortOrder }),
    category: compatibilityCategory,
    image_url: "",
    image_alt: "",
    status: "draft",
    featured: false,
    published_at: null,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
    author_email: item.authorEmail,
  };
}

function fromCompatibilityRow(row: Record<string, unknown>): WorkspaceItem {
  let payload: Partial<WorkspaceInput> = {};
  try { payload = JSON.parse(String(row.body || "{}")) as Partial<WorkspaceInput>; } catch { payload = {}; }
  return {
    id: String(row.id), title: String(row.title), description: String(row.excerpt || ""),
    system: (payload.system || "workspace") as WorkspaceSystem, status: (payload.status || "planned") as WorkspaceStatus,
    priority: (payload.priority || "medium") as WorkspacePriority, owner: String(payload.owner || "Команда Академії"),
    progress: Math.max(0, Math.min(100, Number(payload.progress) || 0)), dueDate: payload.dueDate || null,
    externalUrl: payload.externalUrl || null, notes: String(payload.notes || ""), sortOrder: Number(payload.sortOrder) || 0,
    createdAt: String(row.created_at), updatedAt: String(row.updated_at), authorEmail: String(row.author_email),
  };
}

async function getCompatibilityItems(): Promise<WorkspaceItem[]> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin.from("editorial_posts").select("*").eq("category", compatibilityCategory).order("created_at");
  if (error) throw error;
  if (!data?.length) {
    const inserted = await admin.from("editorial_posts").upsert(seedWorkspace.map(toCompatibilityRow), { onConflict: "id" });
    if (inserted.error) throw inserted.error;
    return seedWorkspace;
  }
  return data.map((row) => fromCompatibilityRow(row as Record<string, unknown>)).sort((a, b) => a.sortOrder - b.sortOrder);
}

const createTableSql = `CREATE TABLE IF NOT EXISTS workspace_items (
  id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL,
  system TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'planned', priority TEXT NOT NULL DEFAULT 'medium',
  owner TEXT NOT NULL, progress INTEGER NOT NULL DEFAULT 0, due_date TEXT, external_url TEXT,
  notes TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL, author_email TEXT NOT NULL
)`;

async function db(): Promise<D1Database | null> {
  try {
    const moduleName = "cloudflare:workers";
    const { env } = await import(/* webpackIgnore: true */ moduleName);
    return env.DB ?? null;
  } catch { return null; }
}

function fromRow(row: Record<string, unknown>): WorkspaceItem {
  return {
    id: String(row.id), title: String(row.title), description: String(row.description),
    system: String(row.system) as WorkspaceSystem, status: String(row.status) as WorkspaceStatus,
    priority: String(row.priority) as WorkspacePriority, owner: String(row.owner),
    progress: Math.max(0, Math.min(100, Number(row.progress) || 0)),
    dueDate: row.due_date ? String(row.due_date) : null,
    externalUrl: row.external_url ? String(row.external_url) : null,
    notes: String(row.notes || ""), sortOrder: Number(row.sort_order) || 0,
    createdAt: String(row.created_at), updatedAt: String(row.updated_at), authorEmail: String(row.author_email),
  };
}

function toRow(item: WorkspaceItem) {
  return { id: item.id, title: item.title, description: item.description, system: item.system, status: item.status,
    priority: item.priority, owner: item.owner, progress: item.progress, due_date: item.dueDate,
    external_url: item.externalUrl, notes: item.notes, sort_order: item.sortOrder, created_at: item.createdAt,
    updated_at: item.updatedAt, author_email: item.authorEmail };
}

let d1Ready = false;
async function ensureD1(): Promise<void> {
  if (d1Ready) return;
  const database = await db(); if (!database) return;
  await database.prepare(createTableSql).run();
  await database.prepare("CREATE INDEX IF NOT EXISTS workspace_items_status_sort_idx ON workspace_items(status, sort_order)").run();
  await database.prepare("CREATE INDEX IF NOT EXISTS workspace_items_system_idx ON workspace_items(system)").run();
  await database.batch(seedWorkspace.map((item) => database.prepare(`INSERT OR IGNORE INTO workspace_items
    (id,title,description,system,status,priority,owner,progress,due_date,external_url,notes,sort_order,created_at,updated_at,author_email)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(item.id,item.title,item.description,item.system,item.status,item.priority,item.owner,item.progress,item.dueDate,item.externalUrl,item.notes,item.sortOrder,item.createdAt,item.updatedAt,item.authorEmail)));
  d1Ready = true;
}

let supabaseReady = false;
async function ensureSupabase(): Promise<void> {
  if (supabaseReady || !isSupabaseConfigured()) return;
  const admin = createSupabaseAdmin();
  const { data, error } = await admin.from("workspace_items").select("id").limit(1);
  if (error) throw error;
  if (!data?.length) {
    const inserted = await admin.from("workspace_items").upsert(seedWorkspace.map(toRow), { onConflict: "id" });
    if (inserted.error) throw inserted.error;
  }
  supabaseReady = true;
}

export async function getWorkspaceItems(): Promise<WorkspaceItem[]> {
  if (isSupabaseConfigured()) {
    try {
      await ensureSupabase();
      const { data, error } = await createSupabaseAdmin().from("workspace_items").select("*").order("sort_order");
      if (error) throw error;
      return (data || []).map((row) => fromRow(row as Record<string, unknown>));
    } catch {
      try { return await getCompatibilityItems(); }
      catch { /* Keep workspace available through its hosted store or seed plan. */ }
    }
  }
  try {
    await ensureD1(); const database = await db(); if (!database) throw new Error("D1_UNAVAILABLE");
    const result = await database.prepare("SELECT * FROM workspace_items ORDER BY sort_order, created_at").all<Record<string, unknown>>();
    return result.results.map(fromRow);
  } catch { return seedWorkspace; }
}

export async function createWorkspaceItem(input: WorkspaceInput, authorEmail: string): Promise<WorkspaceItem> {
  const now = new Date().toISOString();
  const item: WorkspaceItem = { ...input, id: crypto.randomUUID(), progress: Math.max(0, Math.min(100, input.progress)), createdAt: now, updatedAt: now, authorEmail };
  if (isSupabaseConfigured()) {
    try {
      await ensureSupabase();
      const { data, error } = await createSupabaseAdmin().from("workspace_items").insert(toRow(item)).select("*").single();
      if (error) throw error; return fromRow(data as Record<string, unknown>);
    } catch {
      const { data, error } = await createSupabaseAdmin().from("editorial_posts").insert(toCompatibilityRow(item)).select("*").single();
      if (error) throw error; return fromCompatibilityRow(data as Record<string, unknown>);
    }
  }
  await ensureD1(); const database = await db(); if (!database) throw new Error("PERSISTENCE_UNAVAILABLE");
  await database.prepare(`INSERT INTO workspace_items (id,title,description,system,status,priority,owner,progress,due_date,external_url,notes,sort_order,created_at,updated_at,author_email) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(item.id,item.title,item.description,item.system,item.status,item.priority,item.owner,item.progress,item.dueDate,item.externalUrl,item.notes,item.sortOrder,item.createdAt,item.updatedAt,item.authorEmail).run();
  return item;
}

export async function updateWorkspaceItem(id: string, input: WorkspaceInput, authorEmail: string): Promise<WorkspaceItem | null> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await createSupabaseAdmin().from("workspace_items").update({
        title: input.title, description: input.description, system: input.system, status: input.status,
        priority: input.priority, owner: input.owner, progress: Math.max(0, Math.min(100, input.progress)),
        due_date: input.dueDate, external_url: input.externalUrl, notes: input.notes, sort_order: input.sortOrder,
        updated_at: now, author_email: authorEmail,
      }).eq("id", id).select("*").maybeSingle();
      if (error) throw error; return data ? fromRow(data as Record<string, unknown>) : null;
    } catch {
      const existing = (await getCompatibilityItems()).find((item) => item.id === id);
      if (!existing) return null;
      const updated: WorkspaceItem = { ...input, id, createdAt: existing.createdAt, updatedAt: now, authorEmail };
      const { data, error } = await createSupabaseAdmin().from("editorial_posts").update(toCompatibilityRow(updated)).eq("id", id).select("*").maybeSingle();
      if (error) throw error; return data ? fromCompatibilityRow(data as Record<string, unknown>) : null;
    }
  }
  await ensureD1(); const database = await db(); if (!database) throw new Error("PERSISTENCE_UNAVAILABLE");
  await database.prepare(`UPDATE workspace_items SET title=?,description=?,system=?,status=?,priority=?,owner=?,progress=?,due_date=?,external_url=?,notes=?,sort_order=?,updated_at=?,author_email=? WHERE id=?`).bind(input.title,input.description,input.system,input.status,input.priority,input.owner,Math.max(0,Math.min(100,input.progress)),input.dueDate,input.externalUrl,input.notes,input.sortOrder,now,authorEmail,id).run();
  const row = await database.prepare("SELECT * FROM workspace_items WHERE id=?").bind(id).first<Record<string, unknown>>();
  return row ? fromRow(row) : null;
}

export async function deleteWorkspaceItem(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const admin = createSupabaseAdmin();
    const result = await admin.from("workspace_items").delete().eq("id", id);
    if (!result.error) return;
    const fallback = await admin.from("editorial_posts").delete().eq("id", id).eq("category", compatibilityCategory);
    if (fallback.error) throw fallback.error; return;
  }
  await ensureD1(); const database = await db(); if (!database) throw new Error("PERSISTENCE_UNAVAILABLE");
  await database.prepare("DELETE FROM workspace_items WHERE id=?").bind(id).run();
}

export function isWorkspaceSystem(value: unknown): value is WorkspaceSystem { return workspaceSystems.includes(value as WorkspaceSystem); }
export function isWorkspaceStatus(value: unknown): value is WorkspaceStatus { return workspaceStatuses.includes(value as WorkspaceStatus); }
export function isWorkspacePriority(value: unknown): value is WorkspacePriority { return workspacePriorities.includes(value as WorkspacePriority); }
