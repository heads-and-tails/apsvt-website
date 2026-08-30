"use client";

import { useEffect, useMemo, useState } from "react";
import type { Publisher } from "@/lib/auth";
import {
  departmentEntryTypes,
  type DepartmentEntry,
  type DepartmentEntryInput,
  type DepartmentEntryType,
} from "@/lib/department-content";
import { canEditPage, editorialAccessOptions } from "@/lib/editorial-access";
import { educationQualityRubrics, normalizeEducationQualityRubricId } from "@/lib/education-quality";
import { uploadEditorialFile } from "@/lib/editorial-upload-client";

const typeLabels: Record<DepartmentEntryType, { label: string; singular: string; hint: string }> = {
  override: { label: "Існуючий контент", singular: "зміну існуючого елемента", hint: "Тексти, фото й посилання, які вже розміщені на сторінці" },
  hero: { label: "Обкладинка", singular: "обкладинку сторінки", hint: "Головний заголовок, вступний текст і титульне зображення сторінки" },
  section: { label: "Розділи сторінки", singular: "текстовий розділ", hint: "Опис кафедри, напрями роботи, досягнення або контакти" },
  news: { label: "Новини", singular: "новину", hint: "Коротка актуальна новина кафедри або факультету" },
  article: { label: "Статті", singular: "статтю", hint: "Розгорнутий авторський чи аналітичний матеріал" },
  material: { label: "Матеріали", singular: "матеріал", hint: "Програма, методичний файл, презентація або корисне посилання" },
  photo: { label: "Фотогалерея", singular: "фотографію", hint: "Фото з підписом для галереї сторінки" },
  teacher: { label: "Викладачі", singular: "профіль викладача", hint: "Фото, посада, біографія та науковий профіль" },
  partner: { label: "Партнери", singular: "партнера або компанію", hint: "Логотип, опис співпраці та посилання на сайт партнера" },
  quality: { label: "Якість освіти", singular: "матеріал з якості освіти", hint: "Моніторинг якості, обговорення змін до ОП або щорічне оцінювання НПП" },
};

type ExistingElementKind = "text" | "image" | "link";
type ExistingPageElement = {
  selector: string;
  kind: ExistingElementKind;
  tag: string;
  label: string;
  value: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  order: number;
};

type InventoryPayload = { pagePath: string; pageUrl: string; html: string; error?: string };

const inventoryTextSelector = "h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,dt,dd";
const inventoryExcludedSelector = "header,footer,nav,script,style,noscript,button,form,[aria-hidden='true'],.loader,.scroll-progress,[data-editorial-rendered='true']";

function selectorForElement(element: Element, root: Element): string {
  const parts: string[] = [];
  let current: Element | null = element;
  while (current && current !== root) {
    let part = current.tagName.toLowerCase();
    const parent: Element | null = current.parentElement;
    if (!parent) return "";
    const sameTag = Array.from(parent.children).filter((child) => child.tagName === current?.tagName);
    if (sameTag.length > 1) part += `:nth-of-type(${sameTag.indexOf(current) + 1})`;
    parts.unshift(part);
    current = parent;
  }
  return current === root && parts.length ? `main > ${parts.join(" > ")}` : "";
}

function absoluteUrl(value: string, pageUrl: string): string {
  if (!value || value.startsWith("data:")) return value;
  try { return new URL(value, pageUrl).toString(); } catch { return value; }
}

function extractExistingElements(payload: InventoryPayload): ExistingPageElement[] {
  const documentSnapshot = new DOMParser().parseFromString(payload.html, "text/html");
  const root = documentSnapshot.querySelector("main");
  if (!root) return [];
  const elements: ExistingPageElement[] = [];
  let order = 0;
  root.querySelectorAll(inventoryTextSelector).forEach((element) => {
    if (element.closest(inventoryExcludedSelector)) return;
    const value = (element.textContent || "").replace(/\s+/g, " ").trim();
    const selector = selectorForElement(element, root);
    if (!selector || selector.length > 1000 || value.length < 2 || value.length > 2500) return;
    elements.push({ selector, kind: "text", tag: element.tagName.toLowerCase(), label: value.slice(0, 90), value, imageUrl: "", imageAlt: "", href: "", order: order++ });
  });
  root.querySelectorAll("img").forEach((element) => {
    if (element.closest(inventoryExcludedSelector)) return;
    const selector = selectorForElement(element, root);
    const source = absoluteUrl(element.getAttribute("src") || "", payload.pageUrl);
    if (!selector || selector.length > 1000 || !source) return;
    const alt = (element.getAttribute("alt") || "").trim();
    elements.push({ selector, kind: "image", tag: "img", label: alt || `Зображення ${order + 1}`, value: source, imageUrl: source, imageAlt: alt, href: "", order: order++ });
  });
  root.querySelectorAll("a[href]").forEach((element) => {
    if (element.closest(inventoryExcludedSelector) || element.querySelector("img")) return;
    const selector = selectorForElement(element, root);
    const value = (element.textContent || "").replace(/\s+/g, " ").trim();
    const href = absoluteUrl(element.getAttribute("href") || "", payload.pageUrl);
    if (!selector || selector.length > 1000 || value.length < 2 || value.length > 300 || !href) return;
    elements.push({ selector, kind: "link", tag: "a", label: value.slice(0, 90), value, imageUrl: "", imageAlt: "", href, order: order++ });
  });
  return elements.sort((a, b) => a.order - b.order).slice(0, 400);
}

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
  const allowedPages = editorialAccessOptions.filter((option) => option.group !== "all" && canEditPage(publisher, option.value));
  const generalPages = allowedPages.filter((option) => option.group === "page");
  const departmentPages = allowedPages.filter((option) => option.group === "department");
  const firstPage = allowedPages[0]?.value || "/";
  const [entries, setEntries] = useState(initialEntries);
  const [pagePath, setPagePath] = useState(firstPage);
  const [entryType, setEntryType] = useState<DepartmentEntryType>("override");
  const [form, setForm] = useState<DepartmentEntryInput>(() => emptyEntry(firstPage, "override"));
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [inventoryResult, setInventoryResult] = useState<{ path: string; items: ExistingPageElement[]; error: string }>({ path: "", items: [], error: "" });
  const [inventoryFilter, setInventoryFilter] = useState<"all" | ExistingElementKind>("all");
  const [inventoryQuery, setInventoryQuery] = useState("");

  useEffect(() => {
    if (entryType !== "override") return;
    const controller = new AbortController();
    fetch(`/api/page-content-inventory?path=${encodeURIComponent(pagePath)}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as InventoryPayload;
        if (!response.ok) throw new Error(payload.error || "Не вдалося зчитати сторінку");
        return payload;
      })
      .then((payload) => setInventoryResult({ path: pagePath, items: extractExistingElements(payload), error: "" }))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setInventoryResult({ path: pagePath, items: [], error: error instanceof Error ? error.message : "Не вдалося зчитати сторінку" });
        }
      });
    return () => controller.abort();
  }, [entryType, pagePath]);

  const visible = useMemo(() => entries
    .filter((entry) => entry.pagePath === pagePath && entry.entryType === entryType)
    .sort((a, b) => a.sortOrder - b.sortOrder), [entries, pagePath, entryType]);

  const inventory = useMemo(
    () => inventoryResult.path === pagePath ? inventoryResult.items : [],
    [inventoryResult, pagePath],
  );
  const inventoryLoading = entryType === "override" && inventoryResult.path !== pagePath;
  const filteredInventory = useMemo(() => {
    const query = inventoryQuery.trim().toLocaleLowerCase("uk");
    return inventory.filter((item) => {
      if (inventoryFilter !== "all" && item.kind !== inventoryFilter) return false;
      return !query || `${item.label} ${item.value} ${item.href}`.toLocaleLowerCase("uk").includes(query);
    });
  }, [inventory, inventoryFilter, inventoryQuery]);
  const overrideBySelector = useMemo(() => new Map(
    entries
      .filter((entry) => entry.pagePath === pagePath && entry.entryType === "override")
      .map((entry) => [`${entry.role}:${entry.body}`, entry]),
  ), [entries, pagePath]);

  function change<K extends keyof DepartmentEntryInput>(key: K, value: DepartmentEntryInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function choosePage(value: string) {
    setPagePath(value);
    setEditing(null);
    setForm(emptyEntry(value, entryType));
    setInventoryFilter("all");
    setInventoryQuery("");
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

  function startInventoryEdit(item: ExistingPageElement) {
    const existing = entries.find((entry) => entry.pagePath === pagePath && entry.entryType === "override" && entry.body === item.selector && entry.role === item.kind);
    if (existing) {
      startEdit(existing);
      return;
    }
    setEntryType("override");
    setEditing(null);
    setForm({
      ...emptyEntry(pagePath, "override"),
      title: item.label || `${item.tag} · ${item.order + 1}`,
      summary: item.kind === "image" ? "" : item.value,
      body: item.selector,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
      role: item.kind,
      profileUrl: item.href,
      sortOrder: item.order * 10,
    });
    setMessage("Змініть потрібне поле й опублікуйте заміну.");
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
    try {
      const result = await uploadEditorialFile(file, purpose, pagePath);
      if (purpose === "image") {
        setForm((current) => ({ ...current, imageUrl: result.url, imageAlt: current.imageAlt || current.title || file.name.replace(/[-_]/g, " ") }));
      } else {
        setForm((current) => ({ ...current, fileUrl: result.url, fileName: result.fileName || file.name, title: current.title || file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") }));
      }
      setMessage("Файл готовий. Тепер збережіть запис.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не вдалося завантажити файл");
    } finally {
      setBusy(false);
    }
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
    if (!confirm(entry.entryType === "override" ? `Відновити початковий вміст «${entry.title}»?` : `Видалити «${entry.title}»?`)) return;
    setBusy(true);
    const response = await fetch(`/api/department-content/${entry.id}`, { method: "DELETE" });
    if (response.ok) {
      setEntries((current) => current.filter((item) => item.id !== entry.id));
      if (editing === entry.id) {
        setEditing(null);
        setForm(emptyEntry(pagePath, entryType));
      }
      setMessage(entry.entryType === "override" ? "Початковий вміст відновлено" : "Запис видалено зі сторінки");
    } else setMessage("Не вдалося видалити запис");
    setBusy(false);
  }

  if (!allowedPages.length) return null;
  const isOverride = entryType === "override";
  const needsImage = (isOverride && form.role === "image") || entryType === "hero" || entryType === "news" || entryType === "article" || entryType === "photo" || entryType === "teacher" || entryType === "partner" || entryType === "section";
  const needsBody = entryType === "news" || entryType === "article" || entryType === "section";
  const isMaterial = entryType === "material";
  const isTeacher = entryType === "teacher";
  const isPartner = entryType === "partner";
  const isHero = entryType === "hero";
  const isQuality = entryType === "quality";

  return <section className="department-manager" id="departments-editor">
    <div className="materials-head department-manager-head"><div><span>Увесь контент сайту</span><h2>Сторінки та матеріали</h2><p>Керуйте вже розміщеними текстами, фото й посиланнями, а також додавайте обкладинки, людей, партнерів, новини та файли.</p></div><a href={pagePath} target="_blank">Перевірити сторінку ↗</a></div>
    <div className="department-page-picker"><label>Сторінка<select value={pagePath} onChange={(event) => choosePage(event.target.value)}>{generalPages.length > 0 && <optgroup label="Загальні сторінки">{generalPages.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</optgroup>}{departmentPages.length > 0 && <optgroup label="Програми, факультети та кафедри">{departmentPages.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</optgroup>}</select></label><div><b>{pageLabel(pagePath)}</b><span>{entries.filter((entry) => entry.pagePath === pagePath).length} матеріалів</span></div></div>
    <div className="operations-tabs department-tabs" role="tablist" aria-label="Типи матеріалів сторінки">{departmentEntryTypes.map((type) => <button type="button" role="tab" aria-selected={entryType === type} className={entryType === type ? "active" : ""} onClick={() => chooseType(type)} key={type}><b>{typeLabels[type].label}</b><span>{type === "override" ? inventory.length : entries.filter((entry) => entry.pagePath === pagePath && entry.entryType === type).length}</span></button>)}</div>
    <div className="operations-layout">
      <form className="operations-form" id="department-entry-editor" onSubmit={save}>
        <div className="operations-form-head"><div><small>{typeLabels[entryType].hint}</small><h3>{isOverride && !form.body ? "Оберіть елемент праворуч" : editing ? `Редагувати ${typeLabels[entryType].singular}` : `Додати ${typeLabels[entryType].singular}`}</h3></div>{(editing || (isOverride && form.body)) && <button type="button" onClick={reset}>Скасувати</button>}</div>
        {isOverride && !form.body ? <div className="existing-content-prompt"><b>Вміст сторінки вже завантажується</b><p>Оберіть текст, зображення або посилання у списку праворуч. Тут відкриється його редактор.</p></div> : <div className="operations-fields">
          <label className="wide">{isOverride ? "Елемент сторінки" : isTeacher ? "Ім’я та прізвище" : isPartner ? "Назва партнера / компанії" : isHero ? "Головний заголовок сторінки" : "Заголовок"}<input required readOnly={isOverride} value={form.title} onChange={(event) => change("title", event.target.value)} placeholder={isTeacher ? "ПІБ викладача" : isPartner ? "Назва організації" : "Зрозумілий заголовок"} /></label>
          {(entryType === "news" || entryType === "article" || isQuality) && <label>Дата<input type="date" value={form.date} onChange={(event) => change("date", event.target.value)} /></label>}
          {isTeacher && <><label>Посада / науковий ступінь<input required value={form.role} onChange={(event) => change("role", event.target.value)} /></label><label>Email<input type="email" value={form.email} onChange={(event) => change("email", event.target.value)} /></label><label>Науковий профіль<input type="url" value={form.profileUrl} onChange={(event) => change("profileUrl", event.target.value)} placeholder="ORCID, Google Scholar…" /></label></>}
          {isPartner && <><label>Тип партнерства<input value={form.role} onChange={(event) => change("role", event.target.value)} placeholder="Роботодавець, міжнародний партнер…" /></label><label>Сайт партнера<input type="url" value={form.profileUrl} onChange={(event) => change("profileUrl", event.target.value)} placeholder="https://…" /></label></>}
          {isQuality && <label className="wide">Рубрика<select required value={form.role} onChange={(event) => change("role", event.target.value)}>{educationQualityRubrics.map((rubric) => <option value={rubric.id} key={rubric.id}>{rubric.title}</option>)}</select></label>}
          {isOverride && <label>Тип елемента<input readOnly value={form.role === "text" ? "Текст" : form.role === "image" ? "Зображення" : "Посилання"} /></label>}
          {(!isOverride || form.role !== "image") && <label className="wide">{isOverride ? form.role === "link" ? "Текст посилання" : "Новий текст" : isTeacher ? "Короткий професійний профіль" : isPartner ? "Як співпрацює з Академією" : isHero ? "Вступний текст під заголовком" : entryType === "photo" ? "Підпис до фото" : "Короткий опис"}<textarea rows={isOverride ? 7 : 4} value={form.summary} onChange={(event) => change("summary", event.target.value)} /></label>}
          {isOverride && form.role === "link" && <label className="wide">Адреса посилання<input type="url" value={form.profileUrl} onChange={(event) => change("profileUrl", event.target.value)} placeholder="https://…" /></label>}
          {(needsBody || isQuality) && <label className="wide">Повний текст<textarea rows={9} value={form.body} onChange={(event) => change("body", event.target.value)} placeholder="Абзаци розділяйте порожнім рядком" /></label>}
          {needsImage && <div className="wide department-upload-field"><b>{isOverride ? "Замінити зображення" : isTeacher ? "Фото викладача" : isPartner ? "Логотип партнера" : isHero ? "Титульне фото" : "Зображення"}</b><label className={`document-drop ${form.imageUrl ? "ready" : ""}`}>{form.imageUrl ? <><img src={form.imageUrl} alt="" /><span>Фото готове · натисніть, щоб замінити</span></> : <><b>Обрати фото</b><span>JPG, PNG або WebP · до 8 МБ</span></>}<input type="file" disabled={busy} accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, "image"); }} /></label><label>Альтернативний опис<input value={form.imageAlt} onChange={(event) => change("imageAlt", event.target.value)} placeholder="Що зображено" /></label></div>}
          {isMaterial && <div className="wide department-upload-field"><b>Файл або посилання</b><label className={`document-drop ${form.fileUrl ? "ready" : ""}`}>{form.fileUrl ? <><b>{form.fileName || "Файл готовий"}</b><span>Натисніть, щоб замінити</span></> : <><b>Обрати файл</b><span>PDF, Word, Excel або PowerPoint · до 20 МБ</span></>}<input type="file" disabled={busy} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, "document"); }} /></label><label>Пряме посилання<input type="url" value={form.fileUrl} onChange={(event) => change("fileUrl", event.target.value)} placeholder="https://…" /></label></div>}
          {isQuality && <div className="wide department-upload-field"><b>Документ до рубрики (необов’язково)</b><label className={`document-drop ${form.fileUrl ? "ready" : ""}`}>{form.fileUrl ? <><b>{form.fileName || "Файл готовий"}</b><span>Натисніть, щоб замінити</span></> : <><b>Обрати файл</b><span>PDF, Word або таблиця · до 20 МБ</span></>}<input type="file" disabled={busy} accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, "document"); }} /></label><label>Або пряме посилання<input type="url" value={form.fileUrl} onChange={(event) => change("fileUrl", event.target.value)} placeholder="https://…" /></label></div>}
          <label>Статус<select value={form.status} onChange={(event) => change("status", event.target.value as "draft" | "published")}><option value="published">Опублікувати</option><option value="draft">Чернетка</option></select></label>
          {!isOverride && <label>Порядок<input type="number" min={0} step={10} value={form.sortOrder} onChange={(event) => change("sortOrder", Number(event.target.value))} /></label>}
        </div>}
        <div className="operations-save"><p>{message || (isOverride ? "Оберіть елемент сторінки у списку праворуч." : "Заповніть картку та збережіть зміни.")}</p><button disabled={busy || (isOverride && !form.body) || (entryType === "photo" && !form.imageUrl) || (isMaterial && !form.fileUrl)} type="submit">{busy ? "Зберігаємо…" : editing ? "Оновити" : isOverride ? "Опублікувати заміну" : "Додати на сторінку"}</button></div>
      </form>
      {isOverride ? <div className="operations-list existing-content-list"><div className="operations-list-head"><div><small>{pageLabel(pagePath)}</small><h3>Контент, який уже є</h3></div><b>{inventory.length}</b></div><div className="existing-content-controls"><label>Знайти елемент<input value={inventoryQuery} onChange={(event) => setInventoryQuery(event.target.value)} placeholder="Заголовок, ім’я, назва…" /></label><div role="group" aria-label="Фільтр наявного контенту">{(["all", "text", "image", "link"] as const).map((filter) => <button type="button" className={inventoryFilter === filter ? "active" : ""} onClick={() => setInventoryFilter(filter)} key={filter}>{filter === "all" ? "Усе" : filter === "text" ? "Тексти" : filter === "image" ? "Фото" : "Посилання"}</button>)}</div></div>{inventoryLoading && <p className="department-empty">Зчитуємо поточний вміст сторінки…</p>}{inventoryResult.path === pagePath && inventoryResult.error && <p className="department-empty">{inventoryResult.error}</p>}{!inventoryLoading && !inventoryResult.error && filteredInventory.length === 0 && <p className="department-empty">За цим фільтром елементів не знайдено.</p>}<div className="existing-content-grid">{filteredInventory.map((item) => { const saved = overrideBySelector.get(`${item.kind}:${item.selector}`); const effectiveText = saved?.summary || item.value; const effectiveImage = saved?.imageUrl || item.imageUrl; const effectiveHref = saved?.profileUrl || item.href; return <article className={saved ? "modified" : ""} key={`${item.kind}:${item.selector}`}>{item.kind === "image" && <img src={effectiveImage} alt={saved?.imageAlt || item.imageAlt || ""} />}<div><small>{item.kind === "text" ? item.tag.toUpperCase() : item.kind === "image" ? "ЗОБРАЖЕННЯ" : "ПОСИЛАННЯ"}{saved ? " · ЗМІНЕНО" : ""}</small><h4>{item.label}</h4><p>{item.kind === "link" ? effectiveHref : effectiveText}</p></div><div><button type="button" onClick={() => startInventoryEdit(item)}>{saved ? "Редагувати зміну" : "Редагувати"}</button>{saved && <button className="danger" disabled={busy} type="button" onClick={() => void remove(saved)}>Відновити</button>}</div></article>; })}</div></div> : <div className="operations-list department-entry-list"><div className="operations-list-head"><div><small>{pageLabel(pagePath)}</small><h3>{typeLabels[entryType].label}</h3></div><b>{visible.length}</b></div>{visible.length === 0 && <p className="department-empty">Ще немає записів цього типу. Додайте перший матеріал у формі поруч.</p>}{visible.map((entry) => <article key={entry.id}>{entry.imageUrl && <img src={entry.imageUrl} alt="" />}<div><small>{entry.status === "published" ? "Опубліковано" : "Чернетка"}{entry.date ? ` · ${entry.date}` : ""}</small><h4>{entry.title}</h4><p>{entry.role || entry.summary || entry.fileName}</p></div><div><button type="button" onClick={() => startEdit(entry)}>Редагувати</button><button className="danger" disabled={busy} type="button" onClick={() => void remove(entry)}>Видалити</button></div></article>)}</div>}
    </div>
  </section>;
}
