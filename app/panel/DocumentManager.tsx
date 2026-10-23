"use client";

import { uploadEditorialFile } from "@/lib/editorial-upload-client";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { DepartmentEntry } from "@/lib/department-content";
import { parseProgrammeDocumentCategory, programmeDocumentCategory, programmeDocumentCategoryLabel, programmeFolderSection } from "@/lib/programme-folders";
import { ProgrammeFolderEditor } from "./ProgrammeFolderEditor";
import type { DocumentStatus, PageDocument, PageDocumentInput } from "@/lib/documents";
import type { Publisher } from "@/lib/auth";
import { requestJson } from "@/lib/client-request";
import { canEditPage, editorialAccessOptions } from "@/lib/editorial-access";
import { professionalEducationProgrammes } from "@/lib/professional-education";
import { lawFacultySubpages } from "@/lib/law-faculty-structure";
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

export function DocumentManager({ documents, setDocuments, folders, setFolders, publisher }: {
  documents: PageDocument[]; setDocuments: Dispatch<SetStateAction<PageDocument[]>>;
  folders: DepartmentEntry[]; setFolders: Dispatch<SetStateAction<DepartmentEntry[]>>; publisher: Publisher;
}) {
  const allowedPageOptions = pageOptions.filter(([value]) => value === "*" ? publisher.role === "admin" || publisher.accessScopes.includes("*") : canEditPage(publisher, value));
  const bulkPageOptions = allowedPageOptions.filter(([path]) => path !== "*" && path !== "/schedule"
    && !professionalEducationProgrammes.some((programme) => programme.path === path)
    && !lawFacultySubpages.some((page) => page.path === path && page.sectionId === "faculty-programmes"));
  const [form, setForm] = useState<PageDocumentInput>({ ...empty, pagePath: allowedPageOptions[0]?.[0] || "/materials" });
  const [editing, setEditing] = useState<string | null>(null);
  const [scheduleSelection, setScheduleSelection] = useState<ScheduleDocumentSelection>(defaultScheduleDocumentSelection);
  const [programmeDocumentKind, setProgrammeDocumentKind] = useState("Освітня програма");
  const [programmeDocumentYear, setProgrammeDocumentYear] = useState("");
  const [folderId, setFolderId] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [bulkFiles, setBulkFiles] = useState<{ id: string; file: File; title: string }[]>([]);
  const [bulkPagePath, setBulkPagePath] = useState(bulkPageOptions[0]?.[0] || "");
  const [bulkCategory, setBulkCategory] = useState("Навчальні матеріали");
  const [bulkStatus, setBulkStatus] = useState<DocumentStatus>("published");
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkMessage, setBulkMessage] = useState("");
  const published = useMemo(() => documents.filter((document) => document.status === "published").length, [documents]);
  const isProfessionalProgramme = professionalEducationProgrammes.some((programme) => programme.path === form.pagePath);
  const isLawProgramme = lawFacultySubpages.some((page) => page.path === form.pagePath && page.sectionId === "faculty-programmes");
  const folderSection = isLawProgramme ? programmeFolderSection(programmeDocumentKind) : undefined;
  const listedDocuments = isLawProgramme ? documents.filter((document) => {
    const parsed = parseProgrammeDocumentCategory(document.category);
    return document.pagePath === form.pagePath && parsed.kind === programmeDocumentKind && (!folderSection || parsed.folderId === folderId);
  }) : documents;

  function queueFiles(files: FileList | null) {
    if (!files?.length) return;
    const available = Math.max(0, 20 - bulkFiles.length);
    const incoming = Array.from(files).slice(0, available).map((file) => ({
      id: crypto.randomUUID(),
      file,
      title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim(),
    }));
    setBulkFiles((current) => [...current, ...incoming]);
    setBulkMessage(incoming.length < files.length ? "За один раз можна додати до 20 файлів." : "Перевірте назви перед публікацією.");
  }

  async function publishBatch() {
    if (!bulkFiles.length || !bulkCategory.trim()) {
      setBulkMessage("Оберіть файли та вкажіть категорію.");
      return;
    }
    setBulkBusy(true);
    let completed = 0;
    try {
      for (const queued of bulkFiles) {
        if (!queued.title.trim()) throw new Error(`Вкажіть назву для «${queued.file.name}».`);
        setBulkMessage(`Завантажуємо ${completed + 1} із ${bulkFiles.length}: ${queued.file.name}`);
        const uploaded = await uploadEditorialFile(queued.file, "document", bulkPagePath);
        const created = await requestJson<PageDocument>("/api/documents", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            title: queued.title.trim(), description: "", category: bulkCategory.trim(), pagePath: bulkPagePath,
            fileUrl: uploaded.url, fileName: uploaded.fileName, mimeType: uploaded.mimeType,
            fileSize: uploaded.fileSize, status: bulkStatus, sortOrder: Date.now() + completed,
          } satisfies PageDocumentInput),
        }, 60_000);
        setDocuments((current) => [created, ...current]);
        setBulkFiles((current) => current.filter((item) => item.id !== queued.id));
        completed += 1;
      }
      setBulkMessage(`${completed} файлів ${bulkStatus === "published" ? "опубліковано" : "збережено як чернетки"}. ${bulkStatus === "published" ? "Перевірте їх на вибраній сторінці та в загальному каталозі." : ""}`);
    } catch (error) {
      setBulkMessage(`${completed} із ${bulkFiles.length} файлів збережено. ${error instanceof Error ? error.message : "Не вдалося завершити завантаження."} Невдалі файли залишилися в черзі.`);
    } finally {
      setBulkBusy(false);
    }
  }

  function change<K extends keyof PageDocumentInput>(key: K, value: PageDocumentInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setProgrammeCategory(kind: string, year: string, nextFolderId = kind === programmeDocumentKind ? folderId : "") {
    setProgrammeDocumentKind(kind);
    setProgrammeDocumentYear(year);
    setFolderId(nextFolderId);
    change("category", programmeDocumentCategory(kind, year, nextFolderId));
  }

  function changePagePath(pagePath: string) {
    const isProgramme = professionalEducationProgrammes.some((programme) => programme.path === pagePath) || lawFacultySubpages.some((page) => page.path === pagePath && page.sectionId === "faculty-programmes");
    setFolderId("");
    setForm((current) => ({ ...current, pagePath, category: isProgramme ? "Освітня програма" : current.category }));
    if (isProgramme) { setProgrammeDocumentKind("Освітня програма"); setProgrammeDocumentYear(""); }
  }

  async function upload(file: File) {
    setBusy(true); setMessage("Завантажуємо документ…");
    try {
      const result = await uploadEditorialFile(file, "document", form.pagePath);
      setForm((current) => ({ ...current, fileUrl: result.url, fileName: result.fileName,
        mimeType: result.mimeType, fileSize: result.fileSize,
        title: current.title || file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      }));
      setMessage("Файл завантажено. Тепер збережіть документ.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не вдалося завантажити документ");
    } finally { setBusy(false); }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("Зберігаємо документ…");
    try {
      const payload = form.pagePath === "/schedule" ? { ...form, category: buildScheduleDocumentCategory(scheduleSelection) } : form;
      const response = await fetch(editing ? `/api/documents/${editing}` : "/api/documents", {
        method: editing ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
      });
      const result = await response.json() as PageDocument & { error?: string };
      if (!response.ok) throw new Error(result.error || "Не вдалося зберегти документ");
      setDocuments((current) => editing ? current.map((item) => item.id === editing ? result : item) : [result, ...current]);
      setMessage(result.status === "published" ? "Документ опубліковано на вибраній сторінці та автоматично додано до загального каталогу" : "Чернетку документа збережено");
      setEditing(null);
      if (isLawProgramme) setForm({ ...empty, pagePath: form.pagePath, category: form.category });
      else { setForm({ ...empty, pagePath: allowedPageOptions[0]?.[0] || "/materials" }); setScheduleSelection(defaultScheduleDocumentSelection); setProgrammeDocumentKind("Освітня програма"); setProgrammeDocumentYear(""); setFolderId(""); }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не вдалося зберегти документ");
    } finally { setBusy(false); }
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
    const { kind, year, folderId: itemFolderId } = parseProgrammeDocumentCategory(item.category);
    setFolderId(itemFolderId);
    if (professionalEducationProgrammes.some((programme) => programme.path === item.pagePath) || lawFacultySubpages.some((page) => page.path === item.pagePath && page.sectionId === "faculty-programmes")) {
      setProgrammeDocumentKind(kind || "Освітня програма");
      setProgrammeDocumentYear(year);
    }
    setMessage("");
    window.document.querySelector("#document-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function reset() { setEditing(null); setForm({ ...empty, pagePath: form.pagePath, category: form.category }); setMessage(""); }

  async function remove(document: PageDocument) {
    if (!confirm(`Видалити «${document.title}» зі сторінки?`)) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/documents/${document.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Не вдалося видалити документ");
      setDocuments((current) => current.filter((item) => item.id !== document.id));
      if (editing === document.id) reset();
      setMessage("Документ видалено зі сторінки");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не вдалося видалити документ");
    } finally { setBusy(false); }
  }

  return <section className="document-manager" id="documents">
    <div className="materials-head"><div><span>Файли сторінок</span><h2>Документи</h2><p>Завантажуйте PDF, Word, Excel або PowerPoint і призначайте файл потрібній сторінці.</p></div><b>{published} опубліковано</b></div>
    {bulkPageOptions.length > 0 && <section className="document-bulk" aria-labelledby="document-bulk-title">
      <div><span>Швидка публікація</span><h3 id="document-bulk-title">Кілька документів одразу</h3><p>Оберіть сторінку один раз, додайте до 20 файлів і перевірте назви. Кожен файл отримає окрему картку на сторінці та в загальному каталозі.</p></div>
      <div className="document-bulk-controls">
        <label>Сторінка<select value={bulkPagePath} disabled={bulkBusy} onChange={(event) => setBulkPagePath(event.target.value)}>{bulkPageOptions.map(([path, label]) => <option value={path} key={path}>{label}</option>)}</select></label>
        <label>Категорія<input value={bulkCategory} disabled={bulkBusy} onChange={(event) => setBulkCategory(event.target.value)} /></label>
        <label>Статус<select value={bulkStatus} disabled={bulkBusy} onChange={(event) => setBulkStatus(event.target.value as DocumentStatus)}><option value="published">Опублікувати</option><option value="draft">Чернетка</option></select></label>
      </div>
      <label className="document-bulk-picker">Оберіть файли<input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" disabled={bulkBusy || bulkFiles.length >= 20} onChange={(event) => { queueFiles(event.target.files); event.currentTarget.value = ""; }} /></label>
      {bulkFiles.length > 0 && <div className="document-bulk-queue">{bulkFiles.map((item) => <div key={item.id}><label>Назва на сайті<input value={item.title} disabled={bulkBusy} onChange={(event) => setBulkFiles((current) => current.map((entry) => entry.id === item.id ? { ...entry, title: event.target.value } : entry))} /></label><small>{item.file.name}</small><button type="button" disabled={bulkBusy} onClick={() => setBulkFiles((current) => current.filter((entry) => entry.id !== item.id))}>Прибрати</button></div>)}</div>}
      <div className="document-bulk-actions"><p role="status">{bulkMessage || "Файли до 20 МБ кожен. Розклади завантажуйте в окремому розділі «Розклад»."}</p><button type="button" disabled={bulkBusy || !bulkFiles.length || !bulkCategory.trim()} onClick={() => void publishBatch()}>{bulkBusy ? "Завантажуємо…" : `Зберегти файли (${bulkFiles.length})`}</button>{bulkMessage.includes("файлів опубліковано") && <a href={bulkPagePath} target="_blank" rel="noreferrer">Перевірити сторінку ↗</a>}</div>
    </section>}
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
        <label className={`document-drop ${form.fileUrl ? "ready" : ""}`}>{form.fileUrl ? <><b>{form.fileName}</b><span>Файл готовий до публікації</span></> : <><b>Оберіть файл</b><span>PDF, DOC, DOCX, XLS, XLSX, PPT або PPTX</span></>}<input type="file" required={!form.fileUrl} disabled={busy} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); event.target.value = ""; }} /></label>
        <div className="document-fields">
          <label>Назва документа<input required value={form.title} onChange={(event) => change("title", event.target.value)} /></label>
          {form.pagePath !== "/schedule" && !isProfessionalProgramme && !isLawProgramme && <label>Категорія<input required value={form.category} onChange={(event) => change("category", event.target.value)} placeholder="Наказ, положення, програма…" /></label>}
          {(isProfessionalProgramme || isLawProgramme) && <fieldset className="schedule-document-fields wide programme-document-fields">
            <legend>Де показати документ у програмі</legend>
            <p>Додавайте необмежену кількість освітніх програм і навчальних планів: один файл на кожний потрібний рік.</p>
            <label>Тип документа<select value={programmeDocumentKind} onChange={(event) => setProgrammeCategory(event.target.value, programmeDocumentYear)}><option>Освітня програма</option><option>Навчальний план</option>{isLawProgramme && <><option>Робоча програма</option><option>Анотація</option></>}<option>Інший документ</option></select></label>
            <label>Рік / навчальний рік<input required={!folderSection} value={programmeDocumentYear} onChange={(event) => setProgrammeCategory(programmeDocumentKind, event.target.value)} placeholder="Наприклад: 2026 або 2026/27" /></label>
            {folderSection && <ProgrammeFolderEditor pagePath={form.pagePath} sectionId={folderSection} folders={folders} setFolders={setFolders} documents={documents} selectedId={folderId} onSelect={(id) => setProgrammeCategory(programmeDocumentKind, programmeDocumentYear, id)} busy={busy} setBusy={setBusy} onMessage={setMessage} />}
          </fieldset>}
          <label className="wide">Короткий опис<textarea rows={3} value={form.description} onChange={(event) => change("description", event.target.value)} /></label>
          <label>Сторінка<select value={form.pagePath} onChange={(event) => changePagePath(event.target.value)}>{allowedPageOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
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
        <div className="operations-save"><p role="status">{message || "Після збереження файл з’явиться на вибраній сторінці."}</p><button disabled={busy || !form.fileUrl} type="submit">{busy ? "Зберігаємо…" : editing ? "Оновити документ" : "Додати на сторінку"}</button></div>
      </form>
      <div className="document-list"><div className="operations-list-head"><div><small>{isLawProgramme ? "Вибрана програма та розділ" : "Усі файли"}</small><h3>Документи сторінок</h3></div><b>{listedDocuments.length}</b></div>
        {listedDocuments.length === 0 && <p>У вибраному розділі документів ще немає.</p>}
        {listedDocuments.map((document) => <article key={document.id}><div><small>{pageLabel(document.pagePath)} · {document.status === "published" ? "Опубліковано" : "Чернетка"}</small><h4>{document.title}</h4><p>{document.pagePath === "/schedule" ? scheduleDocumentCategoryLabel(document.category) : programmeDocumentCategoryLabel(document.category, folders)} · {document.fileName}</p></div><div><a href={document.fileUrl} target="_blank" rel="noreferrer">Відкрити ↗</a><button disabled={busy} type="button" onClick={() => edit(document)}>Редагувати</button><button className="danger" disabled={busy} type="button" onClick={() => void remove(document)}>Видалити</button></div></article>)}
      </div>
    </div>
  </section>;
}
