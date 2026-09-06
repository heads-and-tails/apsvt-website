"use client";

import { useMemo, useRef, useState } from "react";
import type { PageDocument, PageDocumentInput } from "@/lib/documents";
import {
  buildScheduleDocumentCategory,
  defaultScheduleDocumentSelection,
  parseScheduleDocumentCategory,
  scheduleCollections,
  scheduleCourses,
  scheduleSemesters,
  scheduleStudyForms,
  type ScheduleCollectionId,
  type ScheduleCourseId,
  type ScheduleDocumentSelection,
  type ScheduleSemesterId,
  type ScheduleStudyFormId,
} from "@/lib/schedule-documents";
import { requestJson } from "@/lib/client-request";

type QueuedFile = { id: string; file: File; title: string };
type UploadResult = { url: string; fileName: string; mimeType: string; fileSize: number };

const acceptedFiles = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx";

function cleanTitle(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function initialSelection(): ScheduleDocumentSelection {
  return {
    ...defaultScheduleDocumentSelection,
    semesterId: new Date().getMonth() >= 7 || new Date().getMonth() === 0 ? "semester-1" : "semester-2",
  };
}

function formatSize(value: number) {
  return value >= 1024 * 1024 ? `${(value / 1024 / 1024).toFixed(1)} МБ` : `${Math.max(1, Math.round(value / 1024))} КБ`;
}

export function ScheduleDocumentManager({ initialDocuments }: { initialDocuments: PageDocument[] }) {
  const [documents, setDocuments] = useState(() => initialDocuments.filter((item) => item.pagePath === "/schedule"));
  const [selection, setSelection] = useState<ScheduleDocumentSelection>(initialSelection);
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const replacementInput = useRef<HTMLInputElement>(null);
  const [replacement, setReplacement] = useState<PageDocument | null>(null);

  const visibleDocuments = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("uk");
    return documents.filter((item) => !normalized || `${item.title} ${item.category} ${item.fileName}`.toLocaleLowerCase("uk").includes(normalized));
  }, [documents, query]);

  function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const next = Array.from(files).slice(0, Math.max(0, 20 - queue.length)).map((file) => ({
      id: crypto.randomUUID(),
      file,
      title: cleanTitle(file.name),
    }));
    setQueue((current) => [...current, ...next]);
    setMessage(next.length < files.length ? "За один раз можна додати до 20 файлів." : `${next.length} файлів додано до комплекту.`);
  }

  async function upload(file: File): Promise<UploadResult> {
    const data = new FormData();
    data.append("file", file);
    data.append("purpose", "document");
    data.append("pagePath", "/schedule");
    return requestJson<UploadResult>("/api/uploads", { method: "POST", body: data }, 60_000);
  }

  async function publishSet() {
    if (!queue.length) {
      setMessage("Спочатку оберіть файли розкладу.");
      return;
    }
    setBusy(true);
    setMessage(`Завантажуємо ${queue.length} файлів…`);
    try {
      const uploaded = await Promise.all(queue.map((item) => upload(item.file)));
      const category = buildScheduleDocumentCategory(selection);
      const now = Date.now();
      const payload: PageDocumentInput[] = uploaded.map((file, index) => ({
        title: queue[index].title || cleanTitle(file.fileName),
        description: `Розклад · ${category}`,
        category,
        pagePath: "/schedule",
        fileUrl: file.url,
        fileName: file.fileName,
        mimeType: file.mimeType,
        fileSize: file.fileSize,
        status: "published",
        sortOrder: now + index,
      }));
      const result = await requestJson<{ documents: PageDocument[] }>("/api/documents/bulk", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ documents: payload }),
      }, 60_000);
      setDocuments((current) => [...result.documents, ...current]);
      setQueue([]);
      setMessage(`${result.documents.length} файлів опубліковано. Параметри комплекту залишено — можна додати наступний.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не вдалося опублікувати комплект");
    } finally {
      setBusy(false);
    }
  }

  async function replaceFile(document: PageDocument, file: File) {
    setBusy(true);
    setMessage(`Замінюємо «${document.title}»…`);
    try {
      const uploaded = await upload(file);
      const result = await requestJson<PageDocument>(`/api/documents/${document.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle(file.name) || document.title,
          description: document.description,
          category: document.category,
          pagePath: document.pagePath,
          fileUrl: uploaded.url,
          fileName: uploaded.fileName,
          mimeType: uploaded.mimeType,
          fileSize: uploaded.fileSize,
          status: document.status,
          sortOrder: document.sortOrder,
        } satisfies PageDocumentInput),
      }, 60_000);
      setDocuments((current) => current.map((item) => item.id === document.id ? result : item));
      setMessage("Файл замінено. Курс, семестр і місце на сайті збережено.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не вдалося замінити файл");
    } finally {
      setBusy(false);
      setReplacement(null);
      if (replacementInput.current) replacementInput.current.value = "";
    }
  }

  async function remove(document: PageDocument) {
    if (!confirm(`Видалити «${document.title}» з розкладу?`)) return;
    setBusy(true);
    setMessage("Видаляємо файл…");
    try {
      await requestJson<{ ok: true }>(`/api/documents/${document.id}`, { method: "DELETE" });
      setDocuments((current) => current.filter((item) => item.id !== document.id));
      setMessage("Файл видалено з розкладу.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не вдалося видалити файл");
    } finally {
      setBusy(false);
    }
  }

  return <section className="schedule-manager" aria-labelledby="schedule-manager-title">
    <div className="schedule-manager-intro">
      <div><span>Простий режим</span><h2 id="schedule-manager-title">Розклад без зайвих кроків</h2><p>Один раз оберіть курс і семестр, потім завантажте весь комплект. Усі файли одразу з’являться в одному розділі сайту.</p></div>
      <div><b>3</b><span>кроки до публікації</span><a href="https://t.me/academyeditbot" target="_blank" rel="noreferrer">Відкрити Telegram-бота ↗</a></div>
    </div>

    <div className="schedule-bulk-form">
      <section className="schedule-bulk-step">
        <header><span>01</span><div><h3>Куди додати</h3><p>Ці параметри застосуються до всіх вибраних файлів.</p></div></header>
        <div className="schedule-bulk-fields">
          <label>Розділ<select value={selection.collectionId} onChange={(event) => setSelection((current) => ({ ...current, collectionId: event.target.value as ScheduleCollectionId }))}>{scheduleCollections.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></label>
          <label>Форма навчання<select value={selection.formId} onChange={(event) => setSelection((current) => ({ ...current, formId: event.target.value as ScheduleStudyFormId }))}>{scheduleStudyForms.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></label>
          <label>Семестр<select value={selection.semesterId} onChange={(event) => setSelection((current) => ({ ...current, semesterId: event.target.value as ScheduleSemesterId }))}>{scheduleSemesters.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></label>
          <label>Курс / рівень<select value={selection.courseId} onChange={(event) => setSelection((current) => ({ ...current, courseId: event.target.value as ScheduleCourseId }))}>{scheduleCourses.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></label>
          <label className="wide">Спеціальність або група — за потреби<input value={selection.specialty} onChange={(event) => setSelection((current) => ({ ...current, specialty: event.target.value }))} placeholder="Наприклад: D8 Право · група ПР-21" /></label>
        </div>
      </section>

      <section className="schedule-bulk-step">
        <header><span>02</span><div><h3>Оберіть усі файли</h3><p>Можна виділити одразу до 20 документів.</p></div></header>
        <label className="schedule-bulk-picker"><b>{queue.length ? `Обрано ${queue.length} файлів` : "Обрати кілька файлів"}</b><span>PDF, Word, Excel або PowerPoint · кожен до 20 МБ</span><input type="file" multiple accept={acceptedFiles} disabled={busy || queue.length >= 20} onChange={(event) => { addFiles(event.target.files); event.currentTarget.value = ""; }} /></label>
        {queue.length > 0 && <div className="schedule-file-queue">{queue.map((item, index) => <article key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><label>Назва на сайті<input value={item.title} onChange={(event) => setQueue((current) => current.map((queued) => queued.id === item.id ? { ...queued, title: event.target.value } : queued))} /></label><small>{item.file.name}<br />{formatSize(item.file.size)}</small><button type="button" disabled={busy} onClick={() => setQueue((current) => current.filter((queued) => queued.id !== item.id))}>Прибрати</button></article>)}</div>}
      </section>

      <section className="schedule-bulk-step schedule-publish-step">
        <header><span>03</span><div><h3>Опублікуйте комплект</h3><p>Перевіряти кожен документ окремо не потрібно.</p></div></header>
        <div><p aria-live="polite">{message || "Параметри й файли можна перевірити перед публікацією."}</p><button type="button" disabled={busy || !queue.length} onClick={() => void publishSet()}>{busy ? "Завантажуємо…" : `Опублікувати ${queue.length || "всі"} файлів`}</button></div>
      </section>
    </div>

    <section className="schedule-current">
      <div className="schedule-current-head"><div><span>Опубліковані файли</span><h3>Заміна й видалення</h3><p>Для заміни не потрібно знову обирати курс — виберіть лише новий файл.</p></div><label>Пошук<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Назва, курс або група" /></label></div>
      <input ref={replacementInput} className="schedule-replacement-input" type="file" accept={acceptedFiles} onChange={(event) => { const file = event.target.files?.[0]; if (file && replacement) void replaceFile(replacement, file); }} />
      <div className="schedule-current-list">{visibleDocuments.map((document) => {
        const parsed = parseScheduleDocumentCategory(document.category);
        return <article key={document.id}><div><small>{parsed ? `${scheduleCourses.find((item) => item.id === parsed.courseId)?.label} · ${scheduleSemesters.find((item) => item.id === parsed.semesterId)?.label}` : "Розклад"}</small><h4>{document.title}</h4><p>{document.category}</p><span>{document.fileName} · {formatSize(document.fileSize)}</span></div><div><a href={document.fileUrl} target="_blank" rel="noreferrer">Переглянути ↗</a><button type="button" disabled={busy} onClick={() => { setReplacement(document); replacementInput.current?.click(); }}>Замінити файл</button><button className="danger" type="button" disabled={busy} onClick={() => void remove(document)}>Видалити</button></div></article>;
      })}{visibleDocuments.length === 0 && <div className="schedule-empty"><b>{documents.length ? "Нічого не знайдено" : "Розкладів ще немає"}</b><p>{documents.length ? "Змініть пошуковий запит." : "Оберіть параметри й завантажте перший комплект вище."}</p></div>}</div>
    </section>
  </section>;
}
