import { strFromU8, unzipSync } from "fflate";
import type { ContentKind, ContentPayload } from "@/lib/content";

export type ImportedScheduleEntry = {
  id: string;
  kind: Extract<ContentKind, "lesson" | "exam">;
  payload: ContentPayload;
  selected: boolean;
  warnings: string[];
};

export type ParsedScheduleFile = {
  fileName: string;
  sourceId: string;
  faculty: string;
  program: string;
  group: string;
  period: string;
  entries: ImportedScheduleEntry[];
  warnings: string[];
};

const monthNumbers: Record<string, number> = {
  січня: 0,
  лютого: 1,
  березня: 2,
  квітня: 3,
  травня: 4,
  червня: 5,
  липня: 6,
  серпня: 7,
  вересня: 8,
  жовтня: 9,
  листопада: 10,
  грудня: 11,
};

const monthLabels = Object.keys(monthNumbers);
const weekdayLabels = ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця", "Субота"];

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function textFromXml(fragment: string): string {
  const withBreaks = fragment.replace(/<w:(?:tab|br)\b[^>]*\/>/g, " ");
  const paragraphs = [...withBreaks.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)];
  const blocks = paragraphs.length ? paragraphs.map((paragraph) => paragraph[0]) : [withBreaks];
  return blocks
    .map((block) => [...block.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)]
      .map((match) => decodeXml(match[1]))
      .join(""))
    .join(" ")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tableRows(documentXml: string): string[][] {
  const table = documentXml.match(/<w:tbl\b[\s\S]*?<\/w:tbl>/)?.[0] || "";
  return [...table.matchAll(/<w:tr\b[\s\S]*?<\/w:tr>/g)].map((row) =>
    [...row[0].matchAll(/<w:tc\b[\s\S]*?<\/w:tc>/g)].map((cell) => textFromXml(cell[0])),
  );
}

function documentParagraphs(documentXml: string): string[] {
  const withoutTables = documentXml.replace(/<w:tbl\b[\s\S]*?<\/w:tbl>/g, "");
  return [...withoutTables.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)]
    .map((paragraph) => textFromXml(paragraph[0]))
    .filter(Boolean);
}

function normalizedSourceId(fileName: string): string {
  const stem = fileName.replace(/\.docx$/i, "").normalize("NFKC").toLowerCase();
  return `word:${stem.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "")}`;
}

function canonicalDay(value: string): string {
  const letters = value.toUpperCase().replace(/[^А-ЯІЇЄҐ]/g, "");
  if (letters.includes("ПОНЕДІЛОК")) return "Понеділок";
  if (letters.includes("ВІВТОРОК")) return "Вівторок";
  if (letters.includes("СЕРЕДА")) return "Середа";
  if (letters.includes("ЧЕТВЕР")) return "Четвер";
  if (letters.includes("ПЯТНИЦЯ") || letters.includes("П’ЯТНИЦЯ")) return "П’ятниця";
  if (letters.includes("СУБОТА")) return "Субота";
  if (letters.includes("НЕДІЛЯ")) return "Неділя";
  return "";
}

function isoParts(value: Date): { day: number; month: number; year: number } {
  return { day: value.getUTCDate(), month: value.getUTCMonth(), year: value.getUTCFullYear() };
}

function displayDate(value: Date): string {
  const { day, month, year } = isoParts(value);
  return `${String(day).padStart(2, "0")}.${String(month + 1).padStart(2, "0")}.${year}`;
}

function parseDateRange(metadata: string): { start: Date; end: Date; label: string } | null {
  const match = metadata.toLowerCase().match(
    /з\s+(\d{1,2})(?:\s+([а-яіїєґ]+))?\s+(?:по|до)\s+(\d{1,2})\s+([а-яіїєґ]+)\s+(\d{4})/,
  );
  if (!match) return null;
  const endMonth = monthNumbers[match[4]];
  const startMonth = match[2] ? monthNumbers[match[2]] : endMonth;
  if (startMonth === undefined || endMonth === undefined) return null;
  const year = Number(match[5]);
  const start = new Date(Date.UTC(year, startMonth, Number(match[1])));
  const end = new Date(Date.UTC(year, endMonth, Number(match[3])));
  const sameMonth = startMonth === endMonth;
  const label = sameMonth
    ? `${Number(match[1])}–${Number(match[3])} ${monthLabels[endMonth]} ${year}`
    : `${Number(match[1])} ${monthLabels[startMonth]} – ${Number(match[3])} ${monthLabels[endMonth]} ${year}`;
  return { start, end, label };
}

function datesByWeekday(range: ReturnType<typeof parseDateRange>): Map<string, string[]> {
  const result = new Map<string, string[]>();
  if (!range) return result;
  for (let cursor = new Date(range.start); cursor <= range.end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const label = weekdayLabels[cursor.getUTCDay()];
    result.set(label, [...(result.get(label) || []), displayDate(cursor)]);
  }
  return result;
}

function explicitDate(value: string): string {
  const match = value.match(/\b(\d{1,2})[./](\d{1,2})[./](\d{2,4})\b/);
  if (!match) return "";
  const year = match[3].length === 2 ? `20${match[3]}` : match[3];
  return `${match[1].padStart(2, "0")}.${match[2].padStart(2, "0")}.${year}`;
}

function normalizeTime(value: string): string {
  const matches = [...value.matchAll(/(\d{1,2})[.:](\d{2})/g)].slice(0, 2);
  if (matches.length < 2) return "";
  return matches.map((match) => `${match[1].padStart(2, "0")}:${match[2]}`).join("–");
}

function courseLabel(rows: string[][]): string {
  const value = rows.slice(0, 4).flat().find((cell) => /курс/i.test(cell)) || "";
  const raw = value.match(/(\d+|[IVXІХУ]+)\s*курс/i)?.[1] || "";
  if (/^\d+$/.test(raw)) return `${Number(raw)} курс`;
  const roman = raw.toUpperCase().replace(/І/g, "I").replace(/Х/g, "X").replace(/У/g, "V");
  const courses: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6 };
  return courses[roman] ? `${courses[roman]} курс` : value.replace(/\s+/g, " ").trim();
}

function groupAndProgram(rows: string[][]): { group: string; program: string } {
  const headers = rows.slice(0, 3).flat().map((cell) => cell.trim()).filter(Boolean);
  const groupCode = headers.find((cell) => /група/i.test(cell))?.replace(/^.*?група\s*/i, "").trim() || "";
  const programCandidates = headers.filter((cell) =>
    !/^(день|час)$/i.test(cell) && !/курс/i.test(cell) && !/група/i.test(cell),
  );
  const program = programCandidates.sort((a, b) => b.length - a.length)[0] || "Освітня програма";
  return { group: groupCode, program };
}

function facultyLabel(metadata: string): string {
  if (/юридичн/i.test(metadata)) return "Право";
  if (/економік|соціальн.*технолог|туризм/i.test(metadata)) return "Економіка, соціальні технології і туризм";
  return "Факультет не визначено";
}

function studyFormLabel(metadata: string): string {
  const match = metadata.match(/(заочна|денна|дистанційна)\s*форма/i);
  if (!match) return "Форму навчання не визначено";
  return `${match[1][0].toUpperCase()}${match[1].slice(1).toLowerCase()} форма`;
}

function lessonType(raw: string): string {
  if (/\(\s*Л\s*\)|(?:^|\s)Л\s*[-–]/i.test(raw)) return "Лекція";
  if (/\(\s*С\s*\)/i.test(raw)) return "Семінар";
  if (/\(\s*(?:практ|пр)\.?\s*\)/i.test(raw)) return "Практичне";
  if (/ЕКЗАМЕН/i.test(raw)) return "Іспит";
  if (/ЗАЛІК/i.test(raw)) return "Залік";
  return "Заняття";
}

function teacherFrom(raw: string): string {
  const parenthesized = raw.match(/\(((?:(?:проф|доц|ст\.?\s*викл|викл)\.?)[^)]+)\)/i)?.[1];
  if (parenthesized) return parenthesized.replace(/\s+/g, " ").trim();
  const trailing = raw.match(/(?:[-–]\s*)?((?:проф|доц|ст\.?\s*викл|викл)\.?[^|]+?)(?=\s*(?:https?:|Zoom|Google|онлайн)|$)/i)?.[1];
  return trailing?.replace(/\s+/g, " ").trim() || "Викладача уточнюйте";
}

function firstUrl(raw: string): string {
  return raw.match(/https?:\/\/[^\s|]+/i)?.[0] || "";
}

function subjectFrom(raw: string, teacher: string): string {
  const url = firstUrl(raw);
  let value = raw
    .replace(url, " ")
    .replace(/\b(?:Zoom|Google Meet|онлайн)\b[\s\S]*$/i, " ")
    .replace(/(?:Ідентифікатор конференції|Код доступу|Код доступа)[\s\S]*$/i, " ")
    .replace(/(?:ЕКЗАМЕН|ЗАЛІК)/gi, " ")
    .replace(/\(\s*(?:Л|С|практ|пр)\.?\s*\)/gi, " ")
    .replace(/(?:^|\s)[ЛС]\s*[-–]/gi, " ")
    .replace(teacher, " ")
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[\s|,.;:–-]+|[\s|,.;:–-]+$/g, "")
    .trim();
  if (!value) value = "Дисципліна потребує уточнення";
  return value;
}

function rowEntry(
  fileName: string,
  sourceId: string,
  cells: string[],
  fallbackDay: string,
  fallbackDate: string,
  meta: { faculty: string; program: string; group: string; period: string; studyForm: string },
  index: number,
): ImportedScheduleEntry | null {
  if (cells.length < 2) return null;
  const timeCell = cells.length >= 3 ? cells[1] : cells[0];
  const raw = cells[cells.length - 1].trim();
  const time = normalizeTime(timeCell);
  if (!time || !raw) return null;

  const warnings: string[] = [];
  const day = canonicalDay(cells[0]) || fallbackDay;
  const date = explicitDate(cells[0]) || fallbackDate;
  const type = lessonType(raw);
  const kind = /^(Іспит|Залік)$/.test(type) ? "exam" : "lesson";
  const teacher = teacherFrom(raw);
  const course = subjectFrom(raw, teacher);
  const onlineLink = firstUrl(raw);
  const room = /https?:|Zoom|Google Meet|онлайн/i.test(raw) ? "онлайн" : "Аудиторію уточнюйте";
  if (!day) warnings.push("Не визначено день");
  if (!date) warnings.push("Не визначено дату");
  if (teacher === "Викладача уточнюйте") warnings.push("Перевірте викладача");
  if (course === "Дисципліна потребує уточнення") warnings.push("Перевірте дисципліну");

  const common: ContentPayload = {
    date,
    day,
    time,
    course,
    group: meta.group,
    faculty: meta.faculty,
    teacher,
    room,
    period: meta.period,
    program: meta.program,
    studyForm: meta.studyForm,
    sourceFile: fileName,
    sourceId,
    onlineLink,
  };
  const payload = kind === "exam" ? { ...common, form: type } : { ...common, type };
  return { id: `${sourceId}:${index}`, kind, payload, selected: true, warnings };
}

export function parseScheduleDocx(bytes: Uint8Array, fileName: string): ParsedScheduleFile {
  const archive = unzipSync(bytes);
  const documentBytes = archive["word/document.xml"];
  if (!documentBytes) throw new Error("У файлі немає таблиці Word");
  const documentXml = strFromU8(documentBytes);
  const rows = tableRows(documentXml);
  if (!rows.length) throw new Error("У документі не знайдено таблицю розкладу");

  const paragraphs = documentParagraphs(documentXml);
  const metadata = paragraphs.join(" ");
  const range = parseDateRange(metadata);
  const weekdayDates = datesByWeekday(range);
  const course = courseLabel(rows);
  const header = groupAndProgram(rows);
  const faculty = facultyLabel(metadata);
  const studyForm = studyFormLabel(metadata);
  const group = [course, header.group].filter(Boolean).join(" · ") || "Групу не визначено";
  const period = range?.label || "Період не визначено";
  const sourceId = normalizedSourceId(fileName);
  const warnings: string[] = [];
  if (!range) warnings.push("Не вдалося визначити період — перевірте дати");
  if (faculty === "Факультет не визначено") warnings.push("Не вдалося визначити факультет");
  if (!header.group) warnings.push("Не вдалося визначити код групи");

  let currentDay = "";
  let currentDate = "";
  const usedFallbackDates = new Map<string, number>();
  const entries: ImportedScheduleEntry[] = [];
  rows.forEach((cells, index) => {
    const detectedDay = canonicalDay(cells[0] || "");
    if (detectedDay) {
      currentDay = detectedDay;
      const explicit = explicitDate(cells[0]);
      if (explicit) currentDate = explicit;
      else {
        const candidates = weekdayDates.get(currentDay) || [];
        const used = usedFallbackDates.get(currentDay) || 0;
        currentDate = candidates[Math.min(used, Math.max(candidates.length - 1, 0))] || "";
        if (candidates.length > 1) usedFallbackDates.set(currentDay, used + 1);
      }
    }
    const entry = rowEntry(
      fileName,
      sourceId,
      cells,
      currentDay,
      explicitDate(cells[0] || "") || currentDate,
      { faculty, program: header.program, group, period, studyForm },
      index,
    );
    if (entry) entries.push(entry);
  });

  if (!entries.length) warnings.push("Не знайдено жодного заняття");
  const rowsToReview = entries.filter((entry) => entry.warnings.length).length;
  if (rowsToReview) warnings.push(`${rowsToReview} рядків потребують перевірки`);
  return { fileName, sourceId, faculty, program: header.program, group, period, entries, warnings };
}
