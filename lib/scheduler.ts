import { replaceImportedSchedule, type ScheduleImportInput } from "@/lib/content";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type SchedulerKind = "staff" | "availability" | "requirement" | "run" | "question";
export type StaffRole = "teacher" | "assistant" | "coordinator";
export type RunStatus = "pending_approval" | "approved" | "rejected";

export type StaffPayload = {
  name: string;
  email: string;
  role: StaffRole;
  telegramChatId: string;
  canApprove: boolean;
  minBreakMinutes: number;
  maxDailyMinutes: number;
  active: boolean;
};

export type AvailabilityPayload = {
  staffId: string;
  weekday: number;
  startTime: string;
  endTime: string;
  preference: "preferred" | "available";
};

export type RequirementPayload = {
  course: string;
  group: string;
  faculty: string;
  type: string;
  teacherId: string;
  assistantId: string;
  durationMinutes: number;
  sessionsPerWeek: number;
  delivery: "onsite" | "online";
  room: string;
  earliestStart: string;
  latestEnd: string;
  preferredDays: number[];
};

export type ScheduleSlot = {
  id: string;
  requirementId: string;
  weekday: number;
  date: string;
  startTime: string;
  endTime: string;
  course: string;
  group: string;
  faculty: string;
  type: string;
  teacherId: string;
  assistantId: string;
  room: string;
  delivery: "onsite" | "online";
  conflict: boolean;
  conflictReason: string;
};

export type RunPayload = {
  name: string;
  weekStart: string;
  status: RunStatus;
  slots: ScheduleSlot[];
  scheduledCount: number;
  conflictCount: number;
  decisionNote: string;
  decidedAt: string;
  decidedBy: string;
};

export type QuestionPayload = {
  chatId: string;
  username: string;
  text: string;
  answer: string;
  answeredAt: string;
};

export type SchedulerPayload = StaffPayload | AvailabilityPayload | RequirementPayload | RunPayload | QuestionPayload;

export type SchedulerItem<K extends SchedulerKind = SchedulerKind> = {
  id: string;
  kind: K;
  status: string;
  payload: SchedulerPayload;
  createdAt: string;
  updatedAt: string;
  authorEmail: string;
};

type Row = {
  id: string;
  kind: SchedulerKind;
  status: string;
  payload: SchedulerPayload | string;
  created_at: string;
  updated_at: string;
  author_email: string;
};

const compatibilityCategory = "__academy_scheduler__";

function toCompatibilityRow(item: SchedulerItem) {
  return {
    id: item.id,
    slug: `scheduler-${item.id}`.slice(0, 110),
    title: `${item.kind}:${item.id}`,
    excerpt: item.status,
    body: JSON.stringify({ kind: item.kind, status: item.status, payload: item.payload }),
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

function fromCompatibilityRow(row: Record<string, unknown>): SchedulerItem {
  let data: { kind?: SchedulerKind; status?: string; payload?: SchedulerPayload } = {};
  try { data = JSON.parse(String(row.body || "{}")) as typeof data; } catch { data = {}; }
  return {
    id: String(row.id),
    kind: data.kind || "question",
    status: data.status || String(row.excerpt || "active"),
    payload: data.payload || ({} as SchedulerPayload),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    authorEmail: String(row.author_email),
  };
}

async function getCompatibilityItems(): Promise<SchedulerItem[]> {
  const { data, error } = await createSupabaseAdmin().from("editorial_posts")
    .select("*").eq("category", compatibilityCategory).order("created_at");
  if (error) throw error;
  return (data || []).map((row) => fromCompatibilityRow(row as Record<string, unknown>));
}

const createTableSql = `CREATE TABLE IF NOT EXISTS scheduler_items (
  id TEXT PRIMARY KEY NOT NULL, kind TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active',
  payload TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, author_email TEXT NOT NULL
)`;

async function db(): Promise<D1Database | null> {
  try {
    const moduleName = "cloudflare:workers";
    const { env } = await import(/* webpackIgnore: true */ moduleName);
    return env.DB ?? null;
  } catch { return null; }
}

function fromRow(row: Row | Record<string, unknown>): SchedulerItem {
  let payload: SchedulerPayload;
  if (typeof row.payload === "string") {
    try { payload = JSON.parse(row.payload) as SchedulerPayload; }
    catch { payload = {} as SchedulerPayload; }
  } else payload = row.payload as SchedulerPayload;
  return {
    id: String(row.id),
    kind: String(row.kind) as SchedulerKind,
    status: String(row.status || "active"),
    payload,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    authorEmail: String(row.author_email),
  };
}

function toRow(item: SchedulerItem) {
  return {
    id: item.id, kind: item.kind, status: item.status, payload: item.payload,
    created_at: item.createdAt, updated_at: item.updatedAt, author_email: item.authorEmail,
  };
}

let d1Ready = false;
async function ensureD1() {
  if (d1Ready) return;
  const database = await db();
  if (!database) return;
  await database.prepare(createTableSql).run();
  await database.prepare("CREATE INDEX IF NOT EXISTS scheduler_items_kind_updated_idx ON scheduler_items(kind, updated_at)").run();
  d1Ready = true;
}

export async function getSchedulerItems(): Promise<SchedulerItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await createSupabaseAdmin()
        .from("scheduler_items")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      const primary = (data || []).map((row) => fromRow(row as Row));
      const compatibility = await getCompatibilityItems();
      const primaryIds = new Set(primary.map((item) => item.id));
      return [...compatibility.filter((item) => !primaryIds.has(item.id)), ...primary]
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    } catch {
      return getCompatibilityItems();
    }
  }
  await ensureD1();
  const database = await db();
  if (!database) return [];
  const result = await database.prepare("SELECT * FROM scheduler_items ORDER BY created_at").all<Record<string, unknown>>();
  return result.results.map(fromRow);
}

export async function createSchedulerItem<K extends SchedulerKind>(
  kind: K,
  payload: SchedulerPayload,
  authorEmail: string,
  status = "active",
): Promise<SchedulerItem<K>> {
  const now = new Date().toISOString();
  const item = { id: crypto.randomUUID(), kind, status, payload, createdAt: now, updatedAt: now, authorEmail } as SchedulerItem<K>;
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await createSupabaseAdmin().from("scheduler_items").insert(toRow(item)).select("*").single();
      if (error) throw error;
      return fromRow(data as Row) as SchedulerItem<K>;
    } catch {
      const { data, error } = await createSupabaseAdmin().from("editorial_posts")
        .insert(toCompatibilityRow(item)).select("*").single();
      if (error) throw error;
      return fromCompatibilityRow(data as Record<string, unknown>) as SchedulerItem<K>;
    }
  }
  await ensureD1();
  const database = await db();
  if (!database) throw new Error("PERSISTENCE_UNAVAILABLE");
  await database.prepare("INSERT INTO scheduler_items (id,kind,status,payload,created_at,updated_at,author_email) VALUES (?,?,?,?,?,?,?)")
    .bind(item.id, item.kind, item.status, JSON.stringify(item.payload), item.createdAt, item.updatedAt, item.authorEmail).run();
  return item;
}

export async function updateSchedulerItem(
  id: string,
  payload: SchedulerPayload,
  authorEmail: string,
  status = "active",
): Promise<SchedulerItem | null> {
  const updatedAt = new Date().toISOString();
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await createSupabaseAdmin().from("scheduler_items")
        .update({ payload, status, updated_at: updatedAt, author_email: authorEmail })
        .eq("id", id).select("*").maybeSingle();
      if (error) throw error;
      if (data) return fromRow(data as Row);
    } catch { /* Use the editorial compatibility store until the migration is applied. */ }
    const existing = (await getCompatibilityItems()).find((item) => item.id === id);
    if (!existing) return null;
    const updated: SchedulerItem = { ...existing, payload, status, updatedAt, authorEmail };
    const { data, error } = await createSupabaseAdmin().from("editorial_posts")
      .update(toCompatibilityRow(updated)).eq("id", id).eq("category", compatibilityCategory).select("*").maybeSingle();
    if (error) throw error;
    return data ? fromCompatibilityRow(data as Record<string, unknown>) : null;
  }
  await ensureD1();
  const database = await db();
  if (!database) throw new Error("PERSISTENCE_UNAVAILABLE");
  await database.prepare("UPDATE scheduler_items SET payload=?,status=?,updated_at=?,author_email=? WHERE id=?")
    .bind(JSON.stringify(payload), status, updatedAt, authorEmail, id).run();
  const row = await database.prepare("SELECT * FROM scheduler_items WHERE id=?").bind(id).first<Record<string, unknown>>();
  return row ? fromRow(row) : null;
}

export async function deleteSchedulerItem(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const admin = createSupabaseAdmin();
    const primary = await admin.from("scheduler_items").delete().eq("id", id);
    const fallback = await admin.from("editorial_posts").delete().eq("id", id).eq("category", compatibilityCategory);
    if (primary.error && fallback.error) throw fallback.error;
    return;
  }
  await ensureD1();
  const database = await db();
  if (!database) throw new Error("PERSISTENCE_UNAVAILABLE");
  await database.prepare("DELETE FROM scheduler_items WHERE id=?").bind(id).run();
}

function minutes(value: string): number {
  const [hours = "0", mins = "0"] = value.split(":");
  return Number(hours) * 60 + Number(mins);
}

function clock(value: number): string {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

function dateForWeekday(weekStart: string, weekday: number): string {
  const date = new Date(`${weekStart}T12:00:00`);
  date.setDate(date.getDate() + weekday - 1);
  return date.toISOString().slice(0, 10);
}

function overlaps(start: number, end: number, slotStart: number, slotEnd: number, breakMinutes = 0) {
  return start < slotEnd + breakMinutes && end + breakMinutes > slotStart;
}

export function generateSchedule(
  name: string,
  weekStart: string,
  items: SchedulerItem[],
): RunPayload {
  const staff = items.filter((item) => item.kind === "staff").map((item) => ({ ...item, payload: item.payload as StaffPayload }));
  const availabilities = items.filter((item) => item.kind === "availability").map((item) => ({ ...item, payload: item.payload as AvailabilityPayload }));
  const requirements = items.filter((item) => item.kind === "requirement").map((item) => ({ ...item, payload: item.payload as RequirementPayload }));
  const scheduled: ScheduleSlot[] = [];

  const staffById = new Map(staff.map((item) => [item.id, item.payload]));
  const dailyMinutes = new Map<string, number>();

  for (const requirement of requirements) {
    const input = requirement.payload;
    for (let occurrence = 0; occurrence < input.sessionsPerWeek; occurrence += 1) {
      const teacher = staffById.get(input.teacherId);
      const assistant = input.assistantId ? staffById.get(input.assistantId) : null;
      const teacherWindows = availabilities.filter((entry) => entry.payload.staffId === input.teacherId);
      const assistantWindows = assistant ? availabilities.filter((entry) => entry.payload.staffId === input.assistantId) : [];
      const candidates: Array<{ weekday: number; start: number; score: number }> = [];

      for (const window of teacherWindows) {
        const day = window.payload.weekday;
        const matchingAssistant = assistant
          ? assistantWindows.filter((entry) => entry.payload.weekday === day)
          : [null];
        for (const assistantWindow of matchingAssistant) {
          const startBoundary = Math.max(
            minutes(window.payload.startTime),
            minutes(input.earliestStart),
            assistantWindow ? minutes(assistantWindow.payload.startTime) : 0,
          );
          const endBoundary = Math.min(
            minutes(window.payload.endTime),
            minutes(input.latestEnd),
            assistantWindow ? minutes(assistantWindow.payload.endTime) : 24 * 60,
          );
          for (let start = startBoundary; start + input.durationMinutes <= endBoundary; start += 15) {
            let score = 0;
            if (window.payload.preference === "preferred") score += 30;
            if (assistantWindow?.payload.preference === "preferred") score += 20;
            if (input.preferredDays.includes(day)) score += 25;
            if (!scheduled.some((slot) => slot.requirementId === requirement.id && slot.weekday === day)) score += 15;
            score -= start / 10000;
            candidates.push({ weekday: day, start, score });
          }
        }
      }

      candidates.sort((a, b) => b.score - a.score);
      let chosen: { weekday: number; start: number } | null = null;
      for (const candidate of candidates) {
        const end = candidate.start + input.durationMinutes;
        const people = [input.teacherId, input.assistantId].filter(Boolean);
        const blocked = scheduled.some((slot) => {
          if (slot.conflict || slot.weekday !== candidate.weekday) return false;
          const sameResource = slot.group === input.group ||
            (input.room && input.delivery === "onsite" && slot.room === input.room) ||
            people.some((person) => person === slot.teacherId || person === slot.assistantId);
          if (!sameResource) return false;
          const breakMinutes = people.includes(slot.teacherId) || people.includes(slot.assistantId)
            ? Math.max(teacher?.minBreakMinutes || 0, assistant?.minBreakMinutes || 0)
            : 0;
          return overlaps(candidate.start, end, minutes(slot.startTime), minutes(slot.endTime), breakMinutes);
        });
        const teacherKey = `${input.teacherId}:${candidate.weekday}`;
        const assistantKey = `${input.assistantId}:${candidate.weekday}`;
        const exceedsTeacher = (dailyMinutes.get(teacherKey) || 0) + input.durationMinutes > (teacher?.maxDailyMinutes || 480);
        const exceedsAssistant = assistant && (dailyMinutes.get(assistantKey) || 0) + input.durationMinutes > assistant.maxDailyMinutes;
        if (!blocked && !exceedsTeacher && !exceedsAssistant) {
          chosen = candidate;
          break;
        }
      }

      const slotBase = {
        id: crypto.randomUUID(), requirementId: requirement.id,
        course: input.course, group: input.group, faculty: input.faculty, type: input.type,
        teacherId: input.teacherId, assistantId: input.assistantId, room: input.room, delivery: input.delivery,
      };
      if (!chosen) {
        scheduled.push({
          ...slotBase, weekday: 0, date: "", startTime: "", endTime: "",
          conflict: true,
          conflictReason: teacherWindows.length ? "Немає вільного перетину без конфліктів" : "Викладач ще не вказав доступність",
        });
        continue;
      }
      const end = chosen.start + input.durationMinutes;
      scheduled.push({
        ...slotBase, weekday: chosen.weekday, date: dateForWeekday(weekStart, chosen.weekday),
        startTime: clock(chosen.start), endTime: clock(end), conflict: false, conflictReason: "",
      });
      const teacherKey = `${input.teacherId}:${chosen.weekday}`;
      dailyMinutes.set(teacherKey, (dailyMinutes.get(teacherKey) || 0) + input.durationMinutes);
      if (input.assistantId) {
        const assistantKey = `${input.assistantId}:${chosen.weekday}`;
        dailyMinutes.set(assistantKey, (dailyMinutes.get(assistantKey) || 0) + input.durationMinutes);
      }
    }
  }

  scheduled.sort((a, b) => a.weekday - b.weekday || a.startTime.localeCompare(b.startTime));
  return {
    name, weekStart, status: "pending_approval", slots: scheduled,
    scheduledCount: scheduled.filter((slot) => !slot.conflict).length,
    conflictCount: scheduled.filter((slot) => slot.conflict).length,
    decisionNote: "", decidedAt: "", decidedBy: "",
  };
}

const dayNames: Record<number, string> = {
  1: "Понеділок", 2: "Вівторок", 3: "Середа", 4: "Четвер", 5: "П’ятниця", 6: "Субота", 7: "Неділя",
};

function displayDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
}

export async function decideScheduleRun(
  run: SchedulerItem,
  decision: "approve" | "reject",
  note: string,
  authorEmail: string,
): Promise<SchedulerItem> {
  if (run.kind !== "run") throw new Error("RUN_NOT_FOUND");
  const payload = run.payload as RunPayload;
  const next: RunPayload = {
    ...payload,
    status: decision === "approve" ? "approved" : "rejected",
    decisionNote: note,
    decidedAt: new Date().toISOString(),
    decidedBy: authorEmail,
  };
  if (decision === "approve") {
    const items = await getSchedulerItems();
    const staff = new Map(items.filter((item) => item.kind === "staff").map((item) => [item.id, item.payload as StaffPayload]));
    const entries: ScheduleImportInput[] = next.slots.filter((slot) => !slot.conflict).map((slot) => ({
      kind: slot.type.toLowerCase().includes("іспит") || slot.type.toLowerCase().includes("екзамен") ? "exam" : "lesson",
      payload: {
        date: displayDate(slot.date),
        day: dayNames[slot.weekday] || "",
        time: `${slot.startTime}–${slot.endTime}`,
        course: slot.course,
        type: slot.type,
        group: slot.group,
        faculty: slot.faculty,
        teacher: staff.get(slot.teacherId)?.name || "",
        assistant: staff.get(slot.assistantId)?.name || "",
        room: slot.delivery === "online" ? "Онлайн" : slot.room,
        period: next.name,
        sourceId: `scheduler:${run.id}`,
      },
    }));
    if (entries.length) await replaceImportedSchedule(entries, authorEmail);
  }
  const updated = await updateSchedulerItem(run.id, next, authorEmail, next.status);
  if (!updated) throw new Error("RUN_NOT_FOUND");
  return updated;
}

export function isStaffPayload(value: unknown): value is StaffPayload {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<StaffPayload>;
  return typeof item.name === "string" && typeof item.email === "string" &&
    ["teacher", "assistant", "coordinator"].includes(String(item.role)) &&
    typeof item.telegramChatId === "string" && typeof item.canApprove === "boolean" &&
    typeof item.minBreakMinutes === "number" && typeof item.maxDailyMinutes === "number" && typeof item.active === "boolean";
}

export function isAvailabilityPayload(value: unknown): value is AvailabilityPayload {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<AvailabilityPayload>;
  return typeof item.staffId === "string" && Number.isInteger(item.weekday) && Number(item.weekday) >= 1 && Number(item.weekday) <= 7 &&
    typeof item.startTime === "string" && typeof item.endTime === "string" && minutes(item.endTime) > minutes(item.startTime) &&
    ["preferred", "available"].includes(String(item.preference));
}

export function isRequirementPayload(value: unknown): value is RequirementPayload {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<RequirementPayload>;
  return typeof item.course === "string" && item.course.trim().length > 1 && typeof item.group === "string" &&
    typeof item.faculty === "string" && typeof item.type === "string" && typeof item.teacherId === "string" &&
    typeof item.assistantId === "string" && typeof item.durationMinutes === "number" && item.durationMinutes >= 30 &&
    typeof item.sessionsPerWeek === "number" && item.sessionsPerWeek >= 1 && item.sessionsPerWeek <= 10 &&
    ["onsite", "online"].includes(String(item.delivery)) && typeof item.room === "string" &&
    typeof item.earliestStart === "string" && typeof item.latestEnd === "string" && Array.isArray(item.preferredDays);
}
