"use client";

import { useMemo, useState } from "react";
import type { DocumentStatus, PageDocument, PageDocumentInput } from "@/lib/documents";
import type { Publisher } from "@/lib/auth";
import { canEditPage, editorialAccessOptions } from "@/lib/editorial-access";
import {
  buildScheduleDocumentCategory,
  defaultScheduleDocumentSelection,
  parseScheduleDocumentCategory,
  scheduleCollections,
  scheduleCourses,
  scheduleDocumentCategoryLabel,
  scheduleSemesters,
  scheduleStudyForms,
  type ScheduleCollectionId,
  type ScheduleCourseId,
  type ScheduleDocumentSelection,
  type ScheduleSemesterId,
  type ScheduleStudyFormId,
} from "@/lib/schedule-documents";

const pageOptions = editorialAccessOptions.map((option) => [option.value, option.value === "*" ? "Усі доступні сторінки" : option.label] as const);

const empty: PageDocumentInput = {
  title: "",
  description: "",
  category: "Офіційний документ",
  pagePath: "/materials",
  fileUrl: "",
  fileName: "",
  mimeType: "",
  fileSize: 0,
  status: "published",
  sortOrder: 10,
};

function pageLabel(path: string): string {
  return pageOptions.find(([value]) => value === path)?.[1] || path;
}

export function DocumentManager({ initialDocuments, publisher }: { initialDocuments: PageDocument[]; publisher: Publisher }) {
  const allowedPageOptions = pageOptions.filter(([value]) => value === "*" ? publisher.role === "admin" || publisher.accessScopes.includes("*") : canEditPage(publisher, value));
  const [documents, setDocuments] = useState(initialDocuments);
  const [form, setForm] = useState<PageDocumentInput>({ ...empty, pagePath: allowedPageOptions[0]?.[0] || "/materials" });
  const [editing, setEditing] = useState<string | null>(null);
  const [scheduleSelection, setScheduleSelection] = useState<ScheduleDocumentSelection>(defaultScheduleDocumentSelection);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const published = useMemo(() => documents.filter((document) => document.status === "published").length, [documents]);

  function change<K extends keyof PageDocumentInput>(key: K, value: PageDocumentInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function upload(file: File) {
    setBusy(true); setMessage("Завантажуємо документ…");
    const data = new FormData();
    data.append("file", file);
    data.append("purpose", "document");
    data.append("pagePath", form.pagePath);
    const response = await fetch("/api/uploads", { method: "POST", body: data });
    const result = await response.json() as { url?: string; fileName?: string; mimeType?: string; fileSize?: number; error?: string };
    if (!response.ok || !result.url) {
      setMessage(result.error || "Не вдалося завантажити документ");
      setBusy(false);
      return;
    }
    setForm((current) => ({
      ...current,
      fileUrl: result.url || "",
      fileName: result.fileName || file.name,
      mimeType: result.mimeType || file.type,
      fileSize: result.fileSize || file.size,
      title: current.title || file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
    }));
    setMessage("Файл завантажено. Тепер збережіть документ.");
    setBusy(false);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("Зберігаємо документ…");
    const payload = form.pagePath === "/schedule"
      ? { ...form, category: buildScheduleDocumentCategory(scheduleSelection) }
      : form;
    const response = await fetch(editing ? `/api/documents/${editing}` : "/api/documents", {
      method: editing ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json() as PageDocument & { error?: string };
    if (!response.ok) {
      setMessage(result.error || "Не вдалося зберегти документ");
      setBusy(false);
      return;
    }
    setDocuments((current) => editing ? current.map((item) => item.id === editing ? result : item) : [result, ...current]);
    setMessage(result.status === "published" ? "Документ опубліковано на вибраній сторінці та автоматично додано до загального каталогу" : "Чернетку документа збережено");
    setEditing(null); setForm({ ...empty, pagePath: allowedPageOptions[0]?.[0] || "/materials" }); setScheduleSelection(defaultScheduleDocumentSelection); setBusy(false);
  }

  function edit(item: PageDocument) {
    setEditing(item.id);
    setForm({
      title: item.title,
      description: item.description,
      category: item.category,
      pagePath: item.pagePath,
      fileUrl: item.fileUrl,
      fileName: item.fileName,
      mimeType: item.mimeType,
      fileSize: item.fileSize,
      status: item.status,
      sortOrder: item.sortOrder,
    });
    setScheduleSelection(parseScheduleDocumentCategory(item.category) || defaultScheduleDocumentSelection);
    setMessage("");
    window.document.querySelector("#document-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function reset() { setEditing(null); setForm({ ...empty, pagePath: allowedPageOptions[0]?.[0] || "/materials" }); setScheduleSelection(defaultScheduleDocumentSelection); setMessage(""); }

  async function remove(document: PageDocument) {
    if (!confirm(`Видалити «${document.title}» зі сторінки?`)) return;
    setBusy(true);
    const response = await fetch(`/api/documents/${document.id}`, { method: "DELETE" });
    if (response.ok) {
      setDocuments((current) => current.filter((item) => item.id !== document.id));
      setMessage("Документ видалено зі сторінки");
    } else setMessage("Не вдалося видалити документ");
    setBusy(false);
  }

  return <section className="document-manager" id="documents">
    <div className="materials-head"><div><span>Файли сторінок</span><h2>Документи</h2><p>Завантажуйте PDF, Word, Excel або PowerPoint і призначайте файл потрібній сторінці.</p></div><b>{published} опубліковано</b></div>
    <details className="document-guide" open>
      <summary><span>Підказка</span><b>Як самостійно додати або оновити документ</b><i>+</i></summary>
      <div className="document-guide-steps">
        <article><span>01</span><div><b>Оберіть файл</b><p>Натисніть «Оберіть файл» у формі нижче. Для офіційних документів найкраще використовувати PDF до 20 МБ.</p></div></article>
        <article><span>02</span><div><b>Заповніть картку</b><p>Додайте зрозумілу назву, категорію та короткий опис без технічних скорочень у назві файла.</p></div></article>
        <article><span>03</span><div><b>Призначте сторінку</b><p>Для матеріалів вступної кампанії оберіть сторінку «Вступ». Порядок 10, 20, 30 дозволяє пізніше вставляти нові документи між ними.</p></div></article>
        <article><span>04</span><div><b>Опублікуйте</b><p>Оберіть статус «Опублікувати» й натисніть «Додати на сторінку». Файл автоматично з’явиться також у загальному каталозі документів. Для заміни базового файла завантажте новий із тим самим номером порядку.</p></div></article>
      </div>
      <p className="document-guide-slots"><b>Позиції вкладки «Вступнику»:</b> 10 — Правила прийому · 20 — Приймальна комісія · 30 — Положення про комісії · 40–100 — Порядки · 110 — Додаток.</p>
    </details>
    <div className="document-layout">
      <form className="document-form" id="document-editor" onSubmit={save}>
        <div className="operations-form-head"><div><small>До 20 МБ</small><h3>{editing ? "Редагувати документ" : "Додати документ"}</h3></div>{editing && <button type="button" onClick={reset}>Скасувати</button>}</div>
        <label className={`document-drop ${form.fileUrl ? "ready" : ""}`}>{form.fileUrl ? <><b>{form.fileName}</b><span>Файл готовий до публікації</span></> : <><b>Оберіть файл</b><span>PDF, DOC, DOCX, XLS, XLSX, PPT або PPTX</span></>}<input type="file" required={!form.fileUrl} disabled={busy} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} /></label>
        <div className="document-fields">
          <label>Назва документа<input required value={form.title} onChange={(event) => change("title", event.target.value)} /></label>
          {form.pagePath !== "/schedule" && <label>Категорія<input required value={form.category} onChange={(event) => change("category", event.target.value)} placeholder="Наказ, положення, програма…" /></label>}
          <label className="wide">Короткий опис<textarea rows={3} value={form.description} onChange={(event) => change("description", event.target.value)} /></label>
          <label>Сторінка<select value={form.pagePath} onChange={(event) => change("pagePath", event.target.value)}>{allowedPageOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
          <label>Статус<select value={form.status} onChange={(event) => change("status", event.target.value as DocumentStatus)}><option value="published">Опублікувати</option><option value="draft">Чернетка</option></select></label>
          <label>Порядок<input type="number" min={0} value={form.sortOrder} onChange={(event) => change("sortOrder", Number(event.target.value))} /></label>
          {form.pagePath === "/schedule" && <fieldset className="schedule-document-fields wide">
            <legend>Де показати файл у розкладі</legend>
            <p>Після збереження файл автоматично з’явиться саме в обраному курсі.</p>
            <label>Розділ<select value={scheduleSelection.collectionId} onChange={(event) => setScheduleSelection((current) => ({ ...current, collectionId: event.target.value as ScheduleCollectionId }))}>{scheduleCollections.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></label>
            <label>Форма навчання<select value={scheduleSelection.formId} onChange={(event) => setScheduleSelection((current) => ({ ...current, formId: event.target.value as ScheduleStudyFormId }))}>{scheduleStudyForms.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></label>
            <label>Семестр<select value={scheduleSelection.semesterId} onChange={(event) => setScheduleSelection((current) => ({ ...current, semesterId: event.target.value as ScheduleSemesterId }))}>{scheduleSemesters.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></label>
            <label>Курс / рівень<select value={scheduleSelection.courseId} onChange={(event) => setScheduleSelection((current) => ({ ...current, courseId: event.target.value as ScheduleCourseId }))}>{scheduleCourses.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></label>
            <label className="wide">Спеціальність<input value={scheduleSelection.specialty} onChange={(event) => setScheduleSelection((current) => ({ ...current, specialty: event.target.value }))} placeholder="Наприклад: D8 Право" /></label>
          </fieldset>}
        </div>
        <div className="operations-save"><p>{message || "Після збереження файл з’явиться на вибраній сторінці."}</p><button disabled={busy || !form.fileUrl} type="submit">{busy ? "Зберігаємо…" : editing ? "Оновити документ" : "Додати на сторінку"}</button></div>
      </form>
      <div className="document-list"><div className="operations-list-head"><div><small>Усі файли</small><h3>Документи сторінок</h3></div><b>{documents.length}</b></div>
        {documents.map((document) => <article key={document.id}><div><small>{pageLabel(document.pagePath)} · {document.status === "published" ? "Опубліковано" : "Чернетка"}</small><h4>{document.title}</h4><p>{document.pagePath === "/schedule" ? scheduleDocumentCategoryLabel(document.category) : document.category} · {document.fileName}</p></div><div><a href={document.fileUrl} target="_blank" rel="noreferrer">Відкрити ↗</a><button type="button" onClick={() => edit(document)}>Редагувати</button><button className="danger" disabled={busy} type="button" onClick={() => void remove(document)}>Видалити</button></div></article>)}
      </div>
    </div>
  </section>;
}
