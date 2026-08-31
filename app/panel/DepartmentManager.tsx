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
type CategorizedEntryType = Exclude<DepartmentEntryType, "override">;
type ExistingPageElement = {
  selector: string;
  groupSelector: string;
  groupLabel: string;
  groupType: CategorizedEntryType;
  kind: ExistingElementKind;
  tag: string;
  label: string;
  value: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  order: number;
};

type ExistingPageGroup = {
  selector: string;
  label: string;
  preview: string;
  imageUrl: string;
  suggestedType: CategorizedEntryType;
  items: ExistingPageElement[];
  order: number;
};

type ExistingPageGroupView = ExistingPageGroup & { visibleItems: ExistingPageElement[] };

type InventoryPayload = { pagePath: string; pageUrl: string; html: string; error?: string };

const inventoryTextSelector = "h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,dt,dd";
const inventoryExcludedSelector = "header,footer,nav,script,style,noscript,button,form,[aria-hidden='true'],.loader,.scroll-progress,.admissions-hub-catalog,.admissions-active-toolbar,[data-editorial-rendered='true']";

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

function normalizedText(element: Element): string {
  return (element.textContent || "").replace(/\s+/g, " ").trim();
}

function inventoryGroupFor(element: Element, root: Element): Element {
  return element.closest("article,figure")
    || element.closest("details")
    || element.closest("a[href]")
    || element.closest("section")
    || element.parentElement
    || root;
}

function inventoryGroupLabel(group: Element, fallback: string): string {
  const heading = group.querySelector("h1,h2,h3,h4,h5,h6");
  const caption = group.querySelector("figcaption");
  const image = group.querySelector("img[alt]");
  const candidate = heading ? normalizedText(heading) : caption ? normalizedText(caption) : image?.getAttribute("alt") || fallback;
  return candidate.replace(/\s+/g, " ").trim().slice(0, 140) || "Блок сторінки";
}

function inventoryGroupType(group: Element): CategorizedEntryType {
  const hero = group.closest("section[class*='hero'],[class$='-hero'],[class*='-hero-']");
  if (hero) return "hero";
  if (group.closest(".criminal-department-team-grid,.academic-profile-grid,.department-teacher-grid,[class*='teacher-grid'],[class*='team-grid'],[class*='people-grid']")) return "teacher";
  if (group.closest(".programme-partners,.academic-partners,.department-partner-grid,[class*='partner-grid'],[class*='partners-grid']")) return "partner";
  if (group.closest(".department-photo-grid,[class*='photo-grid'],[class*='gallery-grid'],[class*='gallery-list']")) return "photo";
  if (group.closest(".department-news-grid,[class*='news-grid'],[class*='news-list'],[class*='events-grid']") || group.querySelector("time")) return "news";
  if (group.closest(".department-article-list,[class*='article-list'],[class*='publications-list']")) return "article";
  if (group.closest("[id*='quality'],[class*='quality']")) return "quality";
  if (group.closest(".programme-document-list,.department-material-list,[class*='document-list'],[class*='material-list'],[class*='resource-list']")) return "material";
  if (group.matches("figure")) return "photo";
  if (group.matches("a[href]")) {
    const href = group.getAttribute("href") || "";
    if (/\.(pdf|docx?|xlsx?|pptx?)(?:[?#]|$)/i.test(href)) return "material";
  }
  return "section";
}

function inventoryItemLabel(kind: ExistingElementKind, tag: string, value: string, alt: string): string {
  if (kind === "image") return alt || "Зображення";
  if (kind === "link") return value || "Посилання";
  if (/^h[1-6]$/.test(tag)) return "Заголовок";
  if (tag === "li") return "Пункт списку";
  if (tag === "figcaption") return "Підпис до фото";
  if (tag === "blockquote") return "Цитата";
  if (tag === "dt" || tag === "dd") return "Поле опису";
  return "Текст";
}

function groupExistingElements(elements: ExistingPageElement[]): ExistingPageGroup[] {
  const groups = new Map<string, ExistingPageGroup>();
  elements.forEach((item) => {
    const selector = item.groupSelector || item.selector;
    const current = groups.get(selector);
    if (current) {
      current.items.push(item);
      if (!current.imageUrl && item.kind === "image") current.imageUrl = item.imageUrl;
      return;
    }
    groups.set(selector, {
      selector,
      label: item.groupLabel || item.label,
      preview: "",
      imageUrl: item.kind === "image" ? item.imageUrl : "",
      suggestedType: item.groupType,
      items: [item],
      order: item.order,
    });
  });
  return Array.from(groups.values()).map((group) => {
    const seen = new Set<string>();
    const previewParts: string[] = [];
    group.items.forEach((item) => {
      const value = item.kind === "link" ? item.value : item.kind === "text" ? item.value : "";
      const normalized = value.replace(/\s+/g, " ").trim();
      if (!normalized || normalized === group.label || seen.has(normalized)) return;
      seen.add(normalized);
      previewParts.push(normalized);
    });
    return { ...group, preview: previewParts.join(" · ").slice(0, 520) };
  }).sort((a, b) => a.order - b.order).map((group, index) => ({ ...group, order: index }));
}

function ExistingGroupCards({
  groups,
  overrides,
  busy,
  onEdit,
  onRestore,
}: {
  groups: ExistingPageGroupView[];
  overrides: Map<string, DepartmentEntry>;
  busy: boolean;
  onEdit: (item: ExistingPageElement) => void;
  onRestore: (entry: DepartmentEntry) => void;
}) {
  return <div className="existing-content-groups">{groups.map((group) => {
    const savedItems = group.items.map((item) => overrides.get(`${item.kind}:${item.selector}`)).filter((entry): entry is DepartmentEntry => Boolean(entry));
    const firstImage = group.items.find((item) => item.kind === "image");
    const savedImage = firstImage ? overrides.get(`image:${firstImage.selector}`) : undefined;
    const previewImage = savedImage?.imageUrl || firstImage?.imageUrl || group.imageUrl;
    return <details className={savedItems.length ? "modified" : ""} key={group.selector}>
      <summary>
        {previewImage ? <img src={previewImage} alt="" /> : <span className="existing-content-group-index">{String(group.order + 1).padStart(2, "0")}</span>}
        <div><small>{group.items.length} {group.items.length === 1 ? "поле" : "полів"}{savedItems.length ? ` · змінено ${savedItems.length}` : ""}</small><h4>{group.label}</h4><p>{group.preview || "Зображення, посилання або службовий блок сторінки."}</p></div>
        <b aria-hidden="true">+</b>
      </summary>
      <div className="existing-content-group-body"><div className="existing-content-group-note"><b>Вміст блоку</b><span>Кожне поле можна змінити окремо, не переписуючи весь розділ.</span></div>{group.visibleItems.map((item) => {
        const saved = overrides.get(`${item.kind}:${item.selector}`);
        const effectiveText = saved?.summary || item.value;
        const effectiveImage = saved?.imageUrl || item.imageUrl;
        const effectiveHref = saved?.profileUrl || item.href;
        return <article className={saved ? "modified" : ""} key={`${item.kind}:${item.selector}`}>
          {item.kind === "image" && <img src={effectiveImage} alt={saved?.imageAlt || item.imageAlt || ""} />}
          <div><small>{item.kind === "text" ? item.label : item.kind === "image" ? "Зображення" : "Посилання"}{saved ? " · ЗМІНЕНО" : ""}</small>{item.kind === "link" && <h5>{effectiveText}</h5>}<p>{item.kind === "link" ? effectiveHref : item.kind === "image" ? saved?.imageAlt || item.imageAlt || "Без альтернативного опису" : effectiveText}</p></div>
          <div><button type="button" onClick={() => onEdit(item)}>{saved ? "Редагувати зміну" : "Редагувати поле"}</button>{saved && <button className="danger" disabled={busy} type="button" onClick={() => onRestore(saved)}>Відновити</button>}</div>
        </article>;
      })}</div>
    </details>;
  })}</div>;
}

function ExistingContentList({
  pageName,
  loading,
  error,
  totalElements,
  totalGroups,
  groups,
  query,
  filter,
  overrides,
  busy,
  onQueryChange,
  onFilterChange,
  onEdit,
  onRestore,
}: {
  pageName: string;
  loading: boolean;
  error: string;
  totalElements: number;
  totalGroups: number;
  groups: ExistingPageGroupView[];
  query: string;
  filter: "all" | ExistingElementKind;
  overrides: Map<string, DepartmentEntry>;
  busy: boolean;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: "all" | ExistingElementKind) => void;
  onEdit: (item: ExistingPageElement) => void;
  onRestore: (entry: DepartmentEntry) => void;
}) {
  return <div className="operations-list existing-content-list">
    <div className="operations-list-head"><div><small>{pageName}</small><h3>Готові блоки сторінки</h3></div><b>{groups.length}</b></div>
    <div className="existing-content-controls"><label>Знайти розділ, людину або матеріал<input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Наприклад: Ліпкан, партнери, навчальний план…" /></label><div role="group" aria-label="Фільтр наявного контенту">{(["all", "text", "image", "link"] as const).map((value) => <button type="button" className={filter === value ? "active" : ""} onClick={() => onFilterChange(value)} key={value}>{value === "all" ? "Усі блоки" : value === "text" ? "Тексти" : value === "image" ? "Фото" : "Посилання"}</button>)}</div><p>{totalElements} редагованих полів згруповано у {totalGroups} зрозумілих блоків.{groups.length !== totalGroups ? ` Показано ${groups.length}.` : ""} Відкрийте потрібний блок, щоб змінити окреме поле.</p></div>
    {loading && <p className="department-empty">Зчитуємо й упорядковуємо поточний вміст сторінки…</p>}
    {!loading && error && <p className="department-empty">{error}</p>}
    {!loading && !error && groups.length === 0 && <p className="department-empty">За цим пошуком блоків не знайдено.</p>}
    <ExistingGroupCards groups={groups} overrides={overrides} busy={busy} onEdit={onEdit} onRestore={onRestore} />
  </div>;
}

function CategorizedContentList({
  pageName,
  type,
  loading,
  error,
  nativeGroups,
  managedEntries,
  overrides,
  busy,
  onEditNative,
  onRestore,
  onEditManaged,
  onRemoveManaged,
}: {
  pageName: string;
  type: CategorizedEntryType;
  loading: boolean;
  error: string;
  nativeGroups: ExistingPageGroupView[];
  managedEntries: DepartmentEntry[];
  overrides: Map<string, DepartmentEntry>;
  busy: boolean;
  onEditNative: (item: ExistingPageElement) => void;
  onRestore: (entry: DepartmentEntry) => void;
  onEditManaged: (entry: DepartmentEntry) => void;
  onRemoveManaged: (entry: DepartmentEntry) => void;
}) {
  const total = nativeGroups.length + managedEntries.length;
  return <div className="operations-list department-entry-list categorized-content-list">
    <div className="operations-list-head"><div><small>{pageName}</small><h3>{typeLabels[type].label}</h3></div><b>{total}</b></div>
    {loading && <p className="department-empty">Зчитуємо вже опублікований вміст сторінки…</p>}
    {!loading && error && <p className="department-empty">{error}</p>}
    {!loading && !error && total === 0 && <p className="department-empty">На сторінці ще немає матеріалів цього типу. Додайте перший запис у формі поруч.</p>}
    {nativeGroups.length > 0 && <section className="categorized-existing-section"><header><div><small>Вже опубліковано на сайті</small><h4>{typeLabels[type].label}</h4></div><b>{nativeGroups.length}</b></header><p>Ці картки взяті безпосередньо з поточної сторінки. Розкрийте картку, щоб змінити фото, заголовок або текст.</p><ExistingGroupCards groups={nativeGroups} overrides={overrides} busy={busy} onEdit={onEditNative} onRestore={onRestore} /></section>}
    {managedEntries.length > 0 && <section className="categorized-managed-section"><header><div><small>Додано через редакційну панель</small><h4>Нові записи</h4></div><b>{managedEntries.length}</b></header>{managedEntries.map((entry) => <article key={entry.id}>{entry.imageUrl && <img src={entry.imageUrl} alt="" />}<div><small>{entry.status === "published" ? "Опубліковано" : "Чернетка"}{entry.date ? ` · ${entry.date}` : ""}</small><h4>{entry.title}</h4><p>{entry.role || entry.summary || entry.fileName}</p></div><div><button type="button" onClick={() => onEditManaged(entry)}>Редагувати</button><button className="danger" disabled={busy} type="button" onClick={() => onRemoveManaged(entry)}>Видалити</button></div></article>)}</section>}
  </div>;
}

function extractExistingElements(payload: InventoryPayload): ExistingPageElement[] {
  const documentSnapshot = new DOMParser().parseFromString(payload.html, "text/html");
  const root = documentSnapshot.querySelector("main");
  if (!root) return [];
  const elements: ExistingPageElement[] = [];
  let order = 0;
  root.querySelectorAll(`${inventoryTextSelector},img,a[href]`).forEach((element) => {
    if (element.closest(inventoryExcludedSelector)) return;
    const tag = element.tagName.toLowerCase();
    const selector = selectorForElement(element, root);
    if (!selector || selector.length > 1000) return;
    const group = inventoryGroupFor(element, root);
    const groupSelector = selectorForElement(group, root) || selector;
    const rawText = normalizedText(element);
    const groupLabel = inventoryGroupLabel(group, rawText);
    const groupType = inventoryGroupType(group);

    if (tag === "img") {
      const image = element as HTMLImageElement;
      const source = absoluteUrl(image.getAttribute("src") || "", payload.pageUrl);
      if (!source) return;
      const alt = (image.getAttribute("alt") || "").trim();
      elements.push({ selector, groupSelector, groupLabel, groupType, kind: "image", tag, label: inventoryItemLabel("image", tag, source, alt), value: source, imageUrl: source, imageAlt: alt, href: "", order: order++ });
      return;
    }

    if (tag === "a") {
      const anchor = element as HTMLAnchorElement;
      const href = absoluteUrl(anchor.getAttribute("href") || "", payload.pageUrl);
      if (!href || rawText.length < 2 || rawText.length > 500) return;
      elements.push({ selector, groupSelector, groupLabel, groupType, kind: "link", tag, label: inventoryItemLabel("link", tag, rawText, ""), value: rawText, imageUrl: "", imageAlt: "", href, order: order++ });
      return;
    }

    if (rawText.length < 2 || rawText.length > 2500) return;
    elements.push({ selector, groupSelector, groupLabel, groupType, kind: "text", tag, label: inventoryItemLabel("text", tag, rawText, ""), value: rawText, imageUrl: "", imageAlt: "", href: "", order: order++ });
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
  }, [pagePath]);

  const visible = useMemo(() => entries
    .filter((entry) => entry.pagePath === pagePath && entry.entryType === entryType)
    .sort((a, b) => a.sortOrder - b.sortOrder), [entries, pagePath, entryType]);

  const inventory = useMemo(
    () => inventoryResult.path === pagePath ? inventoryResult.items : [],
    [inventoryResult, pagePath],
  );
  const inventoryGroups = useMemo(() => groupExistingElements(inventory), [inventory]);
  const inventoryLoading = inventoryResult.path !== pagePath;
  const categorizedInventoryGroups = useMemo(() => new Map<CategorizedEntryType, ExistingPageGroupView[]>(
    departmentEntryTypes
      .filter((type): type is CategorizedEntryType => type !== "override")
      .map((type) => [type, inventoryGroups.filter((group) => group.suggestedType === type).map((group) => ({ ...group, visibleItems: group.items }))]),
  ), [inventoryGroups]);
  const filteredInventoryGroups = useMemo<ExistingPageGroupView[]>(() => {
    const query = inventoryQuery.trim().toLocaleLowerCase("uk");
    return inventoryGroups.flatMap((group) => {
      const searchable = `${group.label} ${group.preview} ${group.items.map((item) => `${item.label} ${item.value} ${item.href}`).join(" ")}`.toLocaleLowerCase("uk");
      if (query && !searchable.includes(query)) return [];
      const visibleItems = inventoryFilter === "all" ? group.items : group.items.filter((item) => item.kind === inventoryFilter);
      return visibleItems.length ? [{ ...group, visibleItems }] : [];
    });
  }, [inventoryFilter, inventoryGroups, inventoryQuery]);
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

  function startInventoryEdit(item: ExistingPageElement, keepSelectedType = false) {
    const existing = entries.find((entry) => entry.pagePath === pagePath && entry.entryType === "override" && entry.body === item.selector && entry.role === item.kind);
    if (existing) {
      if (keepSelectedType) {
        setEditing(existing.id);
        setForm({
          pagePath: existing.pagePath,
          entryType: "override",
          title: existing.title,
          summary: existing.summary,
          body: existing.body,
          imageUrl: existing.imageUrl,
          imageAlt: existing.imageAlt,
          fileUrl: existing.fileUrl,
          fileName: existing.fileName,
          date: existing.date,
          role: existing.role,
          email: existing.email,
          profileUrl: existing.profileUrl,
          status: existing.status,
          sortOrder: existing.sortOrder,
        });
        setMessage("Змініть потрібне поле й опублікуйте заміну.");
        document.querySelector("#department-entry-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else startEdit(existing);
      return;
    }
    if (!keepSelectedType) setEntryType("override");
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
    const payload = { ...form, pagePath, entryType: form.entryType };
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
  const editorType = form.entryType;
  const isOverride = editorType === "override";
  const needsImage = (isOverride && form.role === "image") || editorType === "hero" || editorType === "news" || editorType === "article" || editorType === "photo" || editorType === "teacher" || editorType === "partner" || editorType === "section";
  const needsBody = editorType === "news" || editorType === "article" || editorType === "section";
  const isMaterial = editorType === "material";
  const isTeacher = editorType === "teacher";
  const isPartner = editorType === "partner";
  const isHero = editorType === "hero";
  const isQuality = editorType === "quality";

  return <section className="department-manager" id="departments-editor">
    <div className="materials-head department-manager-head"><div><span>Увесь контент сайту</span><h2>Сторінки та матеріали</h2><p>Керуйте вже розміщеними текстами, фото й посиланнями, а також додавайте обкладинки, людей, партнерів, новини та файли.</p></div><a href={pagePath} target="_blank">Перевірити сторінку ↗</a></div>
    <div className="department-page-picker"><label>Сторінка<select value={pagePath} onChange={(event) => choosePage(event.target.value)}>{generalPages.length > 0 && <optgroup label="Загальні сторінки">{generalPages.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</optgroup>}{departmentPages.length > 0 && <optgroup label="Програми, факультети та кафедри">{departmentPages.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</optgroup>}</select></label><div><b>{pageLabel(pagePath)}</b><span>{entries.filter((entry) => entry.pagePath === pagePath).length} матеріалів</span></div></div>
    <div className="operations-tabs department-tabs" role="tablist" aria-label="Типи матеріалів сторінки">{departmentEntryTypes.map((type) => <button type="button" role="tab" aria-selected={entryType === type} className={entryType === type ? "active" : ""} onClick={() => chooseType(type)} key={type}><b>{typeLabels[type].label}</b><span>{type === "override" ? inventoryGroups.length : entries.filter((entry) => entry.pagePath === pagePath && entry.entryType === type).length + (categorizedInventoryGroups.get(type)?.length || 0)}</span></button>)}</div>
    <div className="operations-layout">
      <form className="operations-form" id="department-entry-editor" onSubmit={save}>
        <div className="operations-form-head"><div><small>{typeLabels[editorType].hint}</small><h3>{isOverride && !form.body ? "Оберіть елемент праворуч" : editing ? `Редагувати ${typeLabels[editorType].singular}` : `Додати ${typeLabels[editorType].singular}`}</h3></div>{(editing || (isOverride && form.body)) && <button type="button" onClick={reset}>Скасувати</button>}</div>
        {isOverride && !form.body ? <div className="existing-content-prompt"><b>Вміст сторінки впорядковано</b><p>Праворуч показані цілі розділи, картки людей, партнерів і матеріалів. Розкрийте блок та оберіть поле, яке потрібно змінити.</p></div> : <div className="operations-fields">
          <label className="wide">{isOverride ? "Елемент сторінки" : isTeacher ? "Ім’я та прізвище" : isPartner ? "Назва партнера / компанії" : isHero ? "Головний заголовок сторінки" : "Заголовок"}<input required readOnly={isOverride} value={form.title} onChange={(event) => change("title", event.target.value)} placeholder={isTeacher ? "ПІБ викладача" : isPartner ? "Назва організації" : "Зрозумілий заголовок"} /></label>
          {(editorType === "news" || editorType === "article" || isQuality) && <label>Дата<input type="date" value={form.date} onChange={(event) => change("date", event.target.value)} /></label>}
          {isTeacher && <><label>Посада / науковий ступінь<input required value={form.role} onChange={(event) => change("role", event.target.value)} /></label><label>Email<input type="email" value={form.email} onChange={(event) => change("email", event.target.value)} /></label><label>Науковий профіль<input type="url" value={form.profileUrl} onChange={(event) => change("profileUrl", event.target.value)} placeholder="ORCID, Google Scholar…" /></label></>}
          {isPartner && <><label>Тип партнерства<input value={form.role} onChange={(event) => change("role", event.target.value)} placeholder="Роботодавець, міжнародний партнер…" /></label><label>Сайт партнера<input type="url" value={form.profileUrl} onChange={(event) => change("profileUrl", event.target.value)} placeholder="https://…" /></label></>}
          {isQuality && <label className="wide">Рубрика<select required value={form.role} onChange={(event) => change("role", event.target.value)}>{educationQualityRubrics.map((rubric) => <option value={rubric.id} key={rubric.id}>{rubric.title}</option>)}</select></label>}
          {isOverride && <label>Тип елемента<input readOnly value={form.role === "text" ? "Текст" : form.role === "image" ? "Зображення" : "Посилання"} /></label>}
          {(!isOverride || form.role !== "image") && <label className="wide">{isOverride ? form.role === "link" ? "Текст посилання" : "Новий текст" : isTeacher ? "Короткий професійний профіль" : isPartner ? "Як співпрацює з Академією" : isHero ? "Вступний текст під заголовком" : editorType === "photo" ? "Підпис до фото" : "Короткий опис"}<textarea rows={isOverride ? 7 : 4} value={form.summary} onChange={(event) => change("summary", event.target.value)} /></label>}
          {isOverride && form.role === "link" && <label className="wide">Адреса посилання<input type="url" value={form.profileUrl} onChange={(event) => change("profileUrl", event.target.value)} placeholder="https://…" /></label>}
          {(needsBody || isQuality) && <label className="wide">Повний текст<textarea rows={9} value={form.body} onChange={(event) => change("body", event.target.value)} placeholder="Абзаци розділяйте порожнім рядком" /></label>}
          {needsImage && <div className="wide department-upload-field"><b>{isOverride ? "Замінити зображення" : isTeacher ? "Фото викладача" : isPartner ? "Логотип партнера" : isHero ? "Титульне фото" : "Зображення"}</b><label className={`document-drop ${form.imageUrl ? "ready" : ""}`}>{form.imageUrl ? <><img src={form.imageUrl} alt="" /><span>Фото готове · натисніть, щоб замінити</span></> : <><b>Обрати фото</b><span>JPG, PNG або WebP · до 8 МБ</span></>}<input type="file" disabled={busy} accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, "image"); }} /></label><label>Альтернативний опис<input value={form.imageAlt} onChange={(event) => change("imageAlt", event.target.value)} placeholder="Що зображено" /></label></div>}
          {isMaterial && <div className="wide department-upload-field"><b>Файл або посилання</b><label className={`document-drop ${form.fileUrl ? "ready" : ""}`}>{form.fileUrl ? <><b>{form.fileName || "Файл готовий"}</b><span>Натисніть, щоб замінити</span></> : <><b>Обрати файл</b><span>PDF, Word, Excel або PowerPoint · до 20 МБ</span></>}<input type="file" disabled={busy} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, "document"); }} /></label><label>Пряме посилання<input type="url" value={form.fileUrl} onChange={(event) => change("fileUrl", event.target.value)} placeholder="https://…" /></label></div>}
          {isQuality && <div className="wide department-upload-field"><b>Документ до рубрики (необов’язково)</b><label className={`document-drop ${form.fileUrl ? "ready" : ""}`}>{form.fileUrl ? <><b>{form.fileName || "Файл готовий"}</b><span>Натисніть, щоб замінити</span></> : <><b>Обрати файл</b><span>PDF, Word або таблиця · до 20 МБ</span></>}<input type="file" disabled={busy} accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, "document"); }} /></label><label>Або пряме посилання<input type="url" value={form.fileUrl} onChange={(event) => change("fileUrl", event.target.value)} placeholder="https://…" /></label></div>}
          <label>Статус<select value={form.status} onChange={(event) => change("status", event.target.value as "draft" | "published")}><option value="published">Опублікувати</option><option value="draft">Чернетка</option></select></label>
          {!isOverride && <label>Порядок<input type="number" min={0} step={10} value={form.sortOrder} onChange={(event) => change("sortOrder", Number(event.target.value))} /></label>}
        </div>}
        <div className="operations-save"><p>{message || (isOverride ? "Оберіть елемент сторінки у списку праворуч." : "Заповніть картку та збережіть зміни.")}</p><button disabled={busy || (isOverride && !form.body) || (editorType === "photo" && !form.imageUrl) || (isMaterial && !form.fileUrl)} type="submit">{busy ? "Зберігаємо…" : editing ? "Оновити" : isOverride ? "Опублікувати заміну" : "Додати на сторінку"}</button></div>
      </form>
      {entryType === "override" ? <ExistingContentList pageName={pageLabel(pagePath)} loading={inventoryLoading} error={inventoryResult.path === pagePath ? inventoryResult.error : ""} totalElements={inventory.length} totalGroups={inventoryGroups.length} groups={filteredInventoryGroups} query={inventoryQuery} filter={inventoryFilter} overrides={overrideBySelector} busy={busy} onQueryChange={setInventoryQuery} onFilterChange={setInventoryFilter} onEdit={startInventoryEdit} onRestore={(entry) => void remove(entry)} /> : <CategorizedContentList pageName={pageLabel(pagePath)} type={entryType} loading={inventoryLoading} error={inventoryResult.path === pagePath ? inventoryResult.error : ""} nativeGroups={categorizedInventoryGroups.get(entryType) || []} managedEntries={visible} overrides={overrideBySelector} busy={busy} onEditNative={(item) => startInventoryEdit(item, true)} onRestore={(entry) => void remove(entry)} onEditManaged={startEdit} onRemoveManaged={(entry) => void remove(entry)} />}
    </div>
  </section>;
}
