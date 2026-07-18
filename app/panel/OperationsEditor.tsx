"use client";

import { useMemo, useState } from "react";
import type { ContentItem, ContentKind, ContentPayload } from "@/lib/content";

type Field = { key: string; label: string; placeholder?: string; type?: "text" | "date" | "url" | "textarea"; options?: string[] };

const sections: { kind: ContentKind; label: string; singular: string; description: string; publicHref: string; fields: Field[] }[] = [
  { kind: "lesson", label: "Розклад занять", singular: "заняття", description: "Пари, викладачі, групи та аудиторії", publicHref: "/schedule", fields: [
    { key: "date", label: "Дата", placeholder: "07.09" }, { key: "day", label: "День", options: ["Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця", "Субота"] },
    { key: "time", label: "Час", placeholder: "09:00–10:20" }, { key: "course", label: "Дисципліна" }, { key: "type", label: "Тип", placeholder: "Лекція / практичне" },
    { key: "group", label: "Курс / група", placeholder: "1 курс" }, { key: "faculty", label: "Факультет", options: ["Економіка і туризм", "Право"] }, { key: "teacher", label: "Викладач" }, { key: "room", label: "Аудиторія / посилання" },
  ] },
  { kind: "exam", label: "Сесія", singular: "іспит або залік", description: "Дати сесії, контроль і місце проведення", publicHref: "/exam-schedule", fields: [
    { key: "date", label: "Дата", placeholder: "14.12.2026" }, { key: "time", label: "Час", placeholder: "10:00" }, { key: "course", label: "Дисципліна" },
    { key: "form", label: "Форма", options: ["Іспит", "Залік", "Захист", "Консультація"] }, { key: "group", label: "Курс / група" }, { key: "faculty", label: "Факультет", options: ["Економіка і туризм", "Право"] }, { key: "teacher", label: "Викладач" }, { key: "room", label: "Місце" },
  ] },
  { kind: "library_book", label: "Бібліотека", singular: "книгу", description: "Нові видання та статус доступності", publicHref: "/facilities/library#catalogue", fields: [
    { key: "title", label: "Назва" }, { key: "author", label: "Автор" }, { key: "year", label: "Рік" }, { key: "topic", label: "Напрям" },
    { key: "type", label: "Тип видання" }, { key: "code", label: "Бібліотечний шифр" }, { key: "status", label: "Статус", options: ["Доступна", "У читальній залі", "На руках"] },
  ] },
  { kind: "event", label: "Події", singular: "подію", description: "Календар і реєстраційна форма", publicHref: "/events", fields: [
    { key: "date", label: "Дата", type: "date" }, { key: "time", label: "Час", placeholder: "11:00" }, { key: "title", label: "Назва події" }, { key: "place", label: "Місце / формат" }, { key: "description", label: "Опис", type: "textarea" },
  ] },
  { kind: "research_resource", label: "Наукові ресурси", singular: "ресурс", description: "Журнали, репозитарії, бази й збірники", publicHref: "/research", fields: [
    { key: "title", label: "Назва" }, { key: "category", label: "Категорія" }, { key: "year", label: "Рік" }, { key: "url", label: "Посилання", type: "url" }, { key: "description", label: "Опис", type: "textarea" },
  ] },
  { kind: "admission_timeline", label: "Вступ", singular: "дату вступу", description: "Ключові етапи та дедлайни кампанії", publicHref: "/admissions", fields: [
    { key: "dateLabel", label: "Дата або період", placeholder: "19 липня — 1 серпня, 18:00" }, { key: "title", label: "Етап" }, { key: "status", label: "Позначка", placeholder: "Ключовий етап" }, { key: "description", label: "Що потрібно зробити", type: "textarea" },
  ] },
];

function blank(fields: Field[]): ContentPayload {
  return Object.fromEntries(fields.map((field) => [field.key, ""]));
}

function itemTitle(item: ContentItem): string {
  return item.payload.title || item.payload.course || item.payload.dateLabel || "Запис";
}

export function OperationsEditor({ initialContent }: { initialContent: ContentItem[] }) {
  const [items, setItems] = useState(initialContent);
  const [active, setActive] = useState<ContentKind>("lesson");
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const section = sections.find((entry) => entry.kind === active)!;
  const [payload, setPayload] = useState<ContentPayload>(() => blank(section.fields));
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const visible = useMemo(() => items.filter((item) => item.kind === active).sort((a, b) => a.sortOrder - b.sortOrder), [items, active]);

  function choose(kind: ContentKind) {
    const next = sections.find((entry) => entry.kind === kind)!;
    setActive(kind); setEditing(null); setPayload(blank(next.fields)); setMessage("");
  }

  function startEdit(item: ContentItem) {
    setEditing(item); setPayload(item.payload); setMessage("");
    document.querySelector("#operations-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function reset() { setEditing(null); setPayload(blank(section.fields)); setMessage(""); }

  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("Зберігаємо…");
    const response = await fetch(editing ? `/api/content/${editing.id}` : "/api/content", {
      method: editing ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind: active, payload, sortOrder: editing?.sortOrder ?? (visible.length + 1) * 10 }),
    });
    const result = await response.json() as ContentItem & { error?: string };
    if (!response.ok) { setMessage(result.error || "Не вдалося зберегти"); setBusy(false); return; }
    setItems((current) => editing ? current.map((item) => item.id === editing.id ? result : item) : [...current, result]);
    setMessage("Зміни опубліковано на сайті"); setEditing(null); setPayload(blank(section.fields)); setBusy(false);
  }

  async function remove(item: ContentItem) {
    if (!confirm(`Видалити «${itemTitle(item)}»?`)) return;
    setBusy(true);
    const response = await fetch(`/api/content/${item.id}`, { method: "DELETE" });
    if (response.ok) { setItems((current) => current.filter((entry) => entry.id !== item.id)); setMessage("Запис видалено"); }
    else setMessage("Не вдалося видалити запис");
    setBusy(false);
  }

  return <section className="operations" id="operations">
    <div className="materials-head operations-heading"><div><span>Операційний контент</span><h2>Керування сайтом</h2><p>Зміни одразу використовуються у відповідних публічних розділах.</p></div><a href={section.publicHref} target="_blank">Перевірити розділ ↗</a></div>
    <div className="operations-tabs" role="tablist" aria-label="Розділи сайту">{sections.map((entry) => <button type="button" role="tab" aria-selected={active === entry.kind} className={active === entry.kind ? "active" : ""} onClick={() => choose(entry.kind)} key={entry.kind}><b>{entry.label}</b><span>{items.filter((item) => item.kind === entry.kind).length}</span></button>)}</div>
    <div className="operations-layout">
      <form className="operations-form" id="operations-editor" onSubmit={save}><div className="operations-form-head"><div><small>{section.description}</small><h3>{editing ? `Редагувати ${section.singular}` : `Додати ${section.singular}`}</h3></div>{editing && <button type="button" onClick={reset}>Скасувати</button>}</div><div className="operations-fields">{section.fields.map((field) => <label className={field.type === "textarea" ? "wide" : ""} key={field.key}>{field.label}{field.options ? <select required value={payload[field.key] || ""} onChange={(event) => setPayload((current) => ({ ...current, [field.key]: event.target.value }))}><option value="">Оберіть</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : field.type === "textarea" ? <textarea required rows={4} value={payload[field.key] || ""} placeholder={field.placeholder} onChange={(event) => setPayload((current) => ({ ...current, [field.key]: event.target.value }))} /> : <input required type={field.type || "text"} value={payload[field.key] || ""} placeholder={field.placeholder} onChange={(event) => setPayload((current) => ({ ...current, [field.key]: event.target.value }))} />}</label>)}</div><div className="operations-save"><p>{message || "Заповніть поля та збережіть запис."}</p><button disabled={busy} type="submit">{busy ? "Зберігаємо…" : editing ? "Оновити запис" : "Додати на сайт"}</button></div></form>
      <div className="operations-list"><div className="operations-list-head"><div><small>Опубліковано</small><h3>{section.label}</h3></div><b>{visible.length}</b></div>{visible.map((item) => <article key={item.id}><div><small>{item.payload.dateLabel || item.payload.date || item.payload.year || item.payload.time}</small><h4>{itemTitle(item)}</h4><p>{item.payload.description || [item.payload.time, item.payload.teacher, item.payload.author, item.payload.place].filter(Boolean).join(" · ")}</p></div><div><button type="button" onClick={() => startEdit(item)}>Редагувати</button><button className="danger" disabled={busy} type="button" onClick={() => void remove(item)}>Видалити</button></div></article>)}</div>
    </div>
  </section>;
}
