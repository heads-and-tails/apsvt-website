"use client";

import { useMemo, useState } from "react";
import type { Publisher } from "@/lib/auth";
import {
  departmentEntryTypes,
  type DepartmentEntry,
  type DepartmentEntryInput,
  type DepartmentEntryType,
} from "@/lib/department-content";
import { canEditPage, editorialAccessOptions } from "@/lib/editorial-access";
import { educationQualityRubrics, normalizeEducationQualityRubricId } from "@/lib/education-quality";

const typeLabels: Record<DepartmentEntryType, { label: string; singular: string; hint: string }> = {
  section: { label: "Розділи сторінки", singular: "текстовий розділ", hint: "Опис кафедри, напрями роботи, досягнення або контакти" },
  news: { label: "Новини", singular: "новину", hint: "Коротка актуальна новина кафедри або факультету" },
  article: { label: "Статті", singular: "статтю", hint: "Розгорнутий авторський чи аналітичний матеріал" },
  material: { label: "Матеріали", singular: "матеріал", hint: "Програма, методичний файл, презентація або корисне посилання" },
  photo: { label: "Фотогалерея", singular: "фотографію", hint: "Фото з підписом для галереї сторінки" },
  teacher: { label: "Викладачі", singular: "профіль викладача", hint: "Фото, посада, біографія та науковий профіль" },
  quality: { label: "Якість освіти", singular: "матеріал з якості освіти", hint: "Моніторинг якості, обговорення змін до ОП або щорічне оцінювання НПП" },
};

const emptyEntry = (pagePath: string, entryType: DepartmentEntryType): DepartmentEntryInput => ({
  pagePath,
  entryType,
  title: "",
  summary: "",
  body: "",
  imageUrl: "",
  imageAlt: "",
  fileUrl: "",
  fileName: "",
  date: "",
  role: entryType === "quality" ? "monitoring" : "",
  email: "",
  profileUrl: "",
  status: "published",
  sortOrder: 10,
});

function pageLabel(path: string): string {
  return editorialAccessOptions.find((option) => option.value === path)?.label || path;
}

export function DepartmentManager({ initialEntries, publisher }: { initialEntries: DepartmentEntry[]; publisher: Publisher }) {
  const allowedPages = editorialAccessOptions.filter((option) => option.group === "department" && canEditPage(publisher, option.value));
  const firstPage = allowedPages[0]?.value || "/programs/law";
  const [entries, setEntries] = useState(initialEntries);
  const [pagePath, setPagePath] = useState(firstPage);
  const [entryType, setEntryType] = useState<DepartmentEntryType>("news");
  const [form, setForm] = useState<DepartmentEntryInput>(() => emptyEntry(firstPage, "news"));
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const visible = useMemo(() => entries
    .filter((entry) => entry.pagePath === pagePath && entry.entryType === entryType)
    .sort((a, b) => a.sortOrder - b.sortOrder), [entries, pagePath, entryType]);

  function change<K extends keyof DepartmentEntryInput>(key: K, value: DepartmentEntryInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function choosePage(value: string) {
    setPagePath(value);
    setEditing(null);
    setForm(emptyEntry(value, entryType));
    setMessage("");
  }

  function chooseType(value: DepartmentEntryType) {
    setEntryType(value);
    setEditing(null);
    setForm(emptyEntry(pagePath, value));
    setMessage("");
  }

  function startEdit(entry: DepartmentEntry) {
    setPagePath(entry.pagePath);
    setEntryType(entry.entryType);
    setEditing(entry.id);
    setForm({
      pagePath: entry.pagePath,
      entryType: entry.entryType,
      title: entry.title,
      summary: entry.summary,
      body: entry.body,
      imageUrl: entry.imageUrl,
      imageAlt: entry.imageAlt,
      fileUrl: entry.fileUrl,
      fileName: entry.fileName,
      date: entry.date,
      role: entry.entryType === "quality" ? normalizeEducationQualityRubricId(entry.role, `${entry.title} ${entry.summary}`) : entry.role,
      email: entry.email,
      profileUrl: entry.profileUrl,
      status: entry.status,
      sortOrder: entry.sortOrder,
    });
    setMessage("");
    document.querySelector("#department-entry-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function reset() {
    setEditing(null);
    setForm(emptyEntry(pagePath, entryType));
    setMessage("");
  }

  async function upload(file: File, purpose: "image" | "document") {
    setBusy(true);
    setMessage(purpose === "image" ? "Завантажуємо фото…" : "Завантажуємо файл…");
    const data = new FormData();
    data.append("file", file);
    data.append("purpose", purpose);
    data.append("pagePath", pagePath);
    const response = await fetch("/api/uploads", { method: "POST", body: data });
    const result = await response.json() as { url?: string; fileName?: string; error?: string };
    if (!response.ok || !result.url) {
      setMessage(result.error || "Не вдалося завантажити файл");
      setBusy(false);
      return;
    }
    if (purpose === "image") {
      setForm((current) => ({ ...current, imageUrl: result.url || "", imageAlt: current.imageAlt || current.title || file.name.replace(/[-_]/g, " ") }));
    } else {
      setForm((current) => ({ ...current, fileUrl: result.url || "", fileName: result.fileName || file.name, title: current.title || file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") }));
    }
    setMessage("Файл готовий. Тепер збережіть запис.");
    setBusy(false);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("Зберігаємо зміни…");
    const payload = { ...form, pagePath, entryType };
    const response = await fetch(editing ? `/api/department-content/${editing}` : "/api/department-content", {
      method: editing ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json() as DepartmentEntry & { error?: string };
    if (!response.ok) {
      setMessage(result.error || "Не вдалося зберегти запис");
      setBusy(false);
      return;
    }
    setEntries((current) => editing ? current.map((entry) => entry.id === editing ? result : entry) : [...current, result]);
    setMessage(result.status === "published" ? "Зміни опубліковано на сторінці" : "Чернетку збережено");
    setEditing(null);
    setForm(emptyEntry(pagePath, entryType));
    setBusy(false);
  }

  async function remove(entry: DepartmentEntry) {
    if (!confirm(`Видалити «${entry.title}»?`)) return;
    setBusy(true);
    const response = await fetch(`/api/department-content/${entry.id}`, { method: "DELETE" });
    if (response.ok) {
      setEntries((current) => current.filter((item) => item.id !== entry.id));
      setMessage("Запис видалено зі сторінки");
    } else setMessage("Не вдалося видалити запис");
    setBusy(false);
  }

  if (!allowedPages.length) return null;
  const needsImage = entryType === "news" || entryType === "article" || entryType === "photo" || entryType === "teacher" || entryType === "section";
  const needsBody = entryType === "news" || entryType === "article" || entryType === "section";
  const isMaterial = entryType === "material";
  const isTeacher = entryType === "teacher";
  const isQuality = entryType === "quality";

  return <section className="department-manager" id="departments-editor">
    <div className="materials-head department-manager-head"><div><span>Кафедри та факультети</span><h2>Керування сторінками</h2><p>Новини, статті, матеріали, профілі викладачів і рубрики якості освіти з’являються саме на вибраній сторінці.</p></div><a href={pagePath} target="_blank">Перевірити сторінку ↗</a></div>
    <div className="department-page-picker"><label>Сторінка<select value={pagePath} onChange={(event) => choosePage(event.target.value)}>{allowedPages.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label><div><b>{pageLabel(pagePath)}</b><span>{entries.filter((entry) => entry.pagePath === pagePath).length} матеріалів</span></div></div>
    <div className="operations-tabs department-tabs" role="tablist" aria-label="Типи матеріалів кафедри">{departmentEntryTypes.map((type) => <button type="button" role="tab" aria-selected={entryType === type} className={entryType === type ? "active" : ""} onClick={() => chooseType(type)} key={type}><b>{typeLabels[type].label}</b><span>{entries.filter((entry) => entry.pagePath === pagePath && entry.entryType === type).length}</span></button>)}</div>
    <div className="operations-layout">
      <form className="operations-form" id="department-entry-editor" onSubmit={save}>
        <div className="operations-form-head"><div><small>{typeLabels[entryType].hint}</small><h3>{editing ? `Редагувати ${typeLabels[entryType].singular}` : `Додати ${typeLabels[entryType].singular}`}</h3></div>{editing && <button type="button" onClick={reset}>Скасувати</button>}</div>
        <div className="operations-fields">
          <label className="wide">{isTeacher ? "Ім’я та прізвище" : "Заголовок"}<input required value={form.title} onChange={(event) => change("title", event.target.value)} placeholder={isTeacher ? "ПІБ викладача" : "Зрозумілий заголовок"} /></label>
          {(entryType === "news" || entryType === "article" || isQuality) && <label>Дата<input type="date" value={form.date} onChange={(event) => change("date", event.target.value)} /></label>}
          {isTeacher && <><label>Посада / науковий ступінь<input required value={form.role} onChange={(event) => change("role", event.target.value)} /></label><label>Email<input type="email" value={form.email} onChange={(event) => change("email", event.target.value)} /></label><label>Науковий профіль<input type="url" value={form.profileUrl} onChange={(event) => change("profileUrl", event.target.value)} placeholder="ORCID, Google Scholar…" /></label></>}
          {isQuality && <label className="wide">Рубрика<select required value={form.role} onChange={(event) => change("role", event.target.value)}>{educationQualityRubrics.map((rubric) => <option value={rubric.id} key={rubric.id}>{rubric.title}</option>)}</select></label>}
          <label className="wide">{isTeacher ? "Короткий професійний профіль" : entryType === "photo" ? "Підпис до фото" : "Короткий опис"}<textarea rows={4} value={form.summary} onChange={(event) => change("summary", event.target.value)} /></label>
          {(needsBody || isQuality) && <label className="wide">Повний текст<textarea rows={9} value={form.body} onChange={(event) => change("body", event.target.value)} placeholder="Абзаци розділяйте порожнім рядком" /></label>}
          {needsImage && <div className="wide department-upload-field"><b>{isTeacher ? "Фото викладача" : "Зображення"}</b><label className={`document-drop ${form.imageUrl ? "ready" : ""}`}>{form.imageUrl ? <><img src={form.imageUrl} alt="" /><span>Фото готове · натисніть, щоб замінити</span></> : <><b>Обрати фото</b><span>JPG, PNG або WebP · до 8 МБ</span></>}<input type="file" disabled={busy} accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, "image"); }} /></label><label>Альтернативний опис<input value={form.imageAlt} onChange={(event) => change("imageAlt", event.target.value)} placeholder="Що зображено" /></label></div>}
          {isMaterial && <div className="wide department-upload-field"><b>Файл або посилання</b><label className={`document-drop ${form.fileUrl ? "ready" : ""}`}>{form.fileUrl ? <><b>{form.fileName || "Файл готовий"}</b><span>Натисніть, щоб замінити</span></> : <><b>Обрати файл</b><span>PDF, Word, Excel або PowerPoint · до 20 МБ</span></>}<input type="file" disabled={busy} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, "document"); }} /></label><label>Пряме посилання<input type="url" value={form.fileUrl} onChange={(event) => change("fileUrl", event.target.value)} placeholder="https://…" /></label></div>}
          {isQuality && <div className="wide department-upload-field"><b>Документ до рубрики (необов’язково)</b><label className={`document-drop ${form.fileUrl ? "ready" : ""}`}>{form.fileUrl ? <><b>{form.fileName || "Файл готовий"}</b><span>Натисніть, щоб замінити</span></> : <><b>Обрати файл</b><span>PDF, Word або таблиця · до 20 МБ</span></>}<input type="file" disabled={busy} accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, "document"); }} /></label><label>Або пряме посилання<input type="url" value={form.fileUrl} onChange={(event) => change("fileUrl", event.target.value)} placeholder="https://…" /></label></div>}
          <label>Статус<select value={form.status} onChange={(event) => change("status", event.target.value as "draft" | "published")}><option value="published">Опублікувати</option><option value="draft">Чернетка</option></select></label>
          <label>Порядок<input type="number" min={0} step={10} value={form.sortOrder} onChange={(event) => change("sortOrder", Number(event.target.value))} /></label>
        </div>
        <div className="operations-save"><p>{message || "Заповніть картку та збережіть зміни."}</p><button disabled={busy || (entryType === "photo" && !form.imageUrl) || (isMaterial && !form.fileUrl)} type="submit">{busy ? "Зберігаємо…" : editing ? "Оновити" : "Додати на сторінку"}</button></div>
      </form>
      <div className="operations-list department-entry-list"><div className="operations-list-head"><div><small>{pageLabel(pagePath)}</small><h3>{typeLabels[entryType].label}</h3></div><b>{visible.length}</b></div>{visible.length === 0 && <p className="department-empty">Ще немає записів цього типу. Додайте перший матеріал у формі поруч.</p>}{visible.map((entry) => <article key={entry.id}>{entry.imageUrl && <img src={entry.imageUrl} alt="" />}<div><small>{entry.status === "published" ? "Опубліковано" : "Чернетка"}{entry.date ? ` · ${entry.date}` : ""}</small><h4>{entry.title}</h4><p>{entry.role || entry.summary || entry.fileName}</p></div><div><button type="button" onClick={() => startEdit(entry)}>Редагувати</button><button className="danger" disabled={busy} type="button" onClick={() => void remove(entry)}>Видалити</button></div></article>)}</div>
    </div>
  </section>;
}
