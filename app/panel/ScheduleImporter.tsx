"use client";

import { useMemo, useState } from "react";
import type { ContentItem, ContentKind, ContentPayload } from "@/lib/content";
import { parseScheduleDocx, type ImportedScheduleEntry, type ParsedScheduleFile } from "@/lib/schedule-import";

const weekdays = ["Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця", "Субота", "Неділя"];

type ImportResponse = {
  items?: ContentItem[];
  replacedSourceIds?: string[];
  error?: string;
};

type MetaKey = "faculty" | "program" | "group" | "period";

export function ScheduleImporter({
  allowedKinds,
  onImported,
}: {
  allowedKinds: ContentKind[];
  onImported: (items: ContentItem[], replacedSourceIds: string[]) => void;
}) {
  const [documents, setDocuments] = useState<ParsedScheduleFile[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [publishLinks, setPublishLinks] = useState(false);
  const entries = useMemo(() => documents.flatMap((document) => document.entries), [documents]);
  const selected = entries.filter((entry) => entry.selected && allowedKinds.includes(entry.kind));

  async function readFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setMessage("Розпізнаємо таблиці й виправляємо формат…");
    const parsed: ParsedScheduleFile[] = [];
    const errors: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const result = parseScheduleDocx(new Uint8Array(await file.arrayBuffer()), file.name);
        if (!allowedKinds.includes("exam")) {
          result.entries = result.entries.map((entry) => entry.kind === "exam"
            ? { ...entry, selected: false, warnings: [...entry.warnings, "Немає доступу до розділу сесії"] }
            : entry);
        }
        parsed.push(result);
      } catch (error) {
        errors.push(`${file.name}: ${error instanceof Error ? error.message : "не вдалося прочитати"}`);
      }
    }
    setDocuments(parsed);
    const count = parsed.reduce((sum, document) => sum + document.entries.length, 0);
    setMessage(errors.length
      ? `${count} записів готові. Не прочитано: ${errors.join("; ")}`
      : `${count} записів готові до перевірки.`);
    setBusy(false);
  }

  function updateEntry(id: string, update: (entry: ImportedScheduleEntry) => ImportedScheduleEntry) {
    setDocuments((current) => current.map((document) => ({
      ...document,
      entries: document.entries.map((entry) => entry.id === id ? update(entry) : entry),
    })));
  }

  function updatePayload(id: string, key: string, value: string) {
    updateEntry(id, (entry) => ({ ...entry, payload: { ...entry.payload, [key]: value } }));
  }

  function updateKind(id: string, kind: "lesson" | "exam") {
    updateEntry(id, (entry) => {
      const payload = { ...entry.payload };
      if (kind === "exam") {
        payload.form = payload.form || payload.type || "Іспит";
        delete payload.type;
      } else {
        payload.type = payload.type || payload.form || "Заняття";
        delete payload.form;
      }
      return { ...entry, kind, payload };
    });
  }

  function updateMeta(sourceId: string, key: MetaKey, value: string) {
    setDocuments((current) => current.map((document) => document.sourceId !== sourceId ? document : {
      ...document,
      [key]: value,
      entries: document.entries.map((entry) => ({ ...entry, payload: { ...entry.payload, [key]: value } })),
    }));
  }

  function removeDocument(sourceId: string) {
    setDocuments((current) => current.filter((document) => document.sourceId !== sourceId));
  }

  async function publish() {
    if (!selected.length) {
      setMessage("Оберіть хоча б один рядок для публікації.");
      return;
    }
    setBusy(true);
    setMessage("Публікуємо впорядкований розклад…");
    const response = await fetch("/api/content/import-schedule", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        entries: selected.map((entry) => ({
          kind: entry.kind,
          payload: { ...entry.payload, onlineLink: publishLinks ? entry.payload.onlineLink : "" },
        })),
      }),
    });
    const result = await response.json() as ImportResponse;
    if (!response.ok || !result.items) {
      setMessage(result.error || "Не вдалося опублікувати розклад.");
      setBusy(false);
      return;
    }
    onImported(result.items, result.replacedSourceIds || []);
    setMessage(`${result.items.length} записів опубліковано. Попередні версії цих файлів замінено.`);
    setDocuments([]);
    setBusy(false);
  }

  return <section className="schedule-importer" aria-labelledby="schedule-import-title">
    <div className="schedule-import-head">
      <div>
        <span>Імпорт із Word</span>
        <h3 id="schedule-import-title">Завантажити комплект розкладів</h3>
        <p>Оберіть один або кілька DOCX. Панель вирівняє дати й час, розділить заняття та іспити й покаже все перед публікацією.</p>
      </div>
      <label className="schedule-import-pick">
        {busy ? "Обробляємо…" : "Обрати Word-файли"}
        <input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" multiple disabled={busy} onChange={(event) => void readFiles(event.target.files)} />
      </label>
    </div>

    {documents.length > 0 && <>
      <div className="schedule-import-files">
        {documents.map((document) => <article key={document.sourceId}>
          <header>
            <div><small>Джерело</small><b>{document.fileName}</b></div>
            <button type="button" onClick={() => removeDocument(document.sourceId)} aria-label={`Прибрати ${document.fileName}`}>×</button>
          </header>
          <div className="schedule-import-meta">
            <label>Факультет<input value={document.faculty} onChange={(event) => updateMeta(document.sourceId, "faculty", event.target.value)} /></label>
            <label>Програма<input value={document.program} onChange={(event) => updateMeta(document.sourceId, "program", event.target.value)} /></label>
            <label>Курс / група<input value={document.group} onChange={(event) => updateMeta(document.sourceId, "group", event.target.value)} /></label>
            <label>Період<input value={document.period} onChange={(event) => updateMeta(document.sourceId, "period", event.target.value)} /></label>
          </div>
          <footer>
            <b>{document.entries.length} записів</b>
            <span>{document.entries.filter((entry) => entry.kind === "exam").length} іспитів / заліків</span>
            {document.warnings.map((warning) => <em key={warning}>{warning}</em>)}
          </footer>
        </article>)}
      </div>

      <div className="schedule-import-review">
        <div className="schedule-import-review-head">
          <div><small>Попередній перегляд</small><h4>Перевірте розпізнані рядки</h4></div>
          <b>{selected.length} обрано</b>
        </div>
        <div className="schedule-import-table-wrap">
          <table className="schedule-import-table">
            <thead><tr><th aria-label="Обрати" /><th>Дата і день</th><th>Час</th><th>Дисципліна</th><th>Тип</th><th>Викладач</th><th>Місце</th></tr></thead>
            <tbody>{entries.map((entry) => <tr key={entry.id} className={entry.warnings.length ? "needs-review" : ""}>
              <td><input type="checkbox" checked={entry.selected} onChange={(event) => updateEntry(entry.id, (current) => ({ ...current, selected: event.target.checked }))} aria-label={`Додати ${entry.payload.course}`} /></td>
              <td><input aria-label="Дата" value={entry.payload.date} onChange={(event) => updatePayload(entry.id, "date", event.target.value)} /><select aria-label="День" value={entry.payload.day} onChange={(event) => updatePayload(entry.id, "day", event.target.value)}>{weekdays.map((day) => <option key={day}>{day}</option>)}</select></td>
              <td><input aria-label="Час" value={entry.payload.time} onChange={(event) => updatePayload(entry.id, "time", event.target.value)} /></td>
              <td><textarea aria-label="Дисципліна" rows={2} value={entry.payload.course} onChange={(event) => updatePayload(entry.id, "course", event.target.value)} />{entry.warnings.map((warning) => <small key={warning}>{warning}</small>)}</td>
              <td><select aria-label="Розділ" value={entry.kind} onChange={(event) => updateKind(entry.id, event.target.value as "lesson" | "exam")} disabled={!allowedKinds.includes("exam")}><option value="lesson">Заняття</option><option value="exam">Іспит / залік</option></select><input aria-label="Тип заняття" value={entry.payload.type || entry.payload.form || ""} onChange={(event) => updatePayload(entry.id, entry.kind === "exam" ? "form" : "type", event.target.value)} /></td>
              <td><input aria-label="Викладач" value={entry.payload.teacher} onChange={(event) => updatePayload(entry.id, "teacher", event.target.value)} /></td>
              <td><input aria-label="Місце" value={entry.payload.room} onChange={(event) => updatePayload(entry.id, "room", event.target.value)} />{entry.payload.onlineLink && <small>Посилання знайдено</small>}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>

      <div className="schedule-import-actions">
        <label><input type="checkbox" checked={publishLinks} onChange={(event) => setPublishLinks(event.target.checked)} /><span><b>Показувати онлайн-посилання на публічному сайті</b><small>Вимкнено за замовчуванням, щоб не відкривати доступ до навчальних конференцій.</small></span></label>
        <button type="button" disabled={busy || !selected.length} onClick={() => void publish()}>{busy ? "Публікуємо…" : `Опублікувати ${selected.length} записів`}</button>
      </div>
    </>}

    <p className="schedule-import-message" aria-live="polite">{message || "Файли не змінюються: панель лише читає таблиці та створює охайний веброзклад."}</p>
  </section>;
}
