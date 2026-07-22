"use client";

import { useMemo, useState } from "react";
import type { Publisher } from "@/lib/auth";
import { workspacePriorities, workspaceStatuses, workspaceSystems, type WorkspaceInput, type WorkspaceItem, type WorkspaceStatus, type WorkspaceSystem } from "@/lib/workspace";

const statusLabels: Record<WorkspaceStatus, string> = { backlog: "Беклог", planned: "Заплановано", in_progress: "У роботі", review: "На перевірці", pilot: "Пілот", live: "Працює", blocked: "Заблоковано", archived: "Архів" };
const systemLabels: Record<WorkspaceSystem, string> = { workspace: "Workspace", website: "Сайт", documents: "Документи", assessment: "AI та оцінювання", records: "Відомості", integration: "Інтеграції" };
const priorityLabels = { critical: "Критичний", high: "Високий", medium: "Середній", low: "Низький" } as const;

const blank: WorkspaceInput = { title: "", description: "", system: "workspace", status: "planned", priority: "medium", owner: "", progress: 0, dueDate: null, externalUrl: null, notes: "", sortOrder: 100 };

function pipelineStep(title: string, copy: string, state: "ready" | "next" | "future") {
  return <li className={`workspace-pipeline-step ${state}`}><span>{state === "ready" ? "✓" : state === "next" ? "→" : "·"}</span><div><b>{title}</b><p>{copy}</p></div></li>;
}

export function WorkspaceDashboard({ initialItems, publisher }: { initialItems: WorkspaceItem[]; publisher: Publisher }) {
  const [items, setItems] = useState(initialItems);
  const [system, setSystem] = useState<WorkspaceSystem | "all">("all");
  const [status, setStatus] = useState<WorkspaceStatus | "all">("all");
  const [editing, setEditing] = useState<WorkspaceItem | null>(null);
  const [form, setForm] = useState<WorkspaceInput>(blank);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const isAdmin = publisher.role === "admin";
  const visible = useMemo(() => items.filter((item) => (system === "all" || item.system === system) && (status === "all" || item.status === status)), [items, system, status]);
  const live = items.filter((item) => item.status === "live").length;
  const moving = items.filter((item) => ["in_progress", "review", "pilot"].includes(item.status)).length;
  const average = Math.round(items.reduce((sum, item) => sum + item.progress, 0) / Math.max(items.length, 1));

  function startCreate() { setEditing(null); setForm({ ...blank, sortOrder: (items.length + 1) * 10 }); setShowForm(true); setMessage(""); }
  function startEdit(item: WorkspaceItem) { setEditing(item); setForm({ title: item.title, description: item.description, system: item.system, status: item.status, priority: item.priority, owner: item.owner, progress: item.progress, dueDate: item.dueDate, externalUrl: item.externalUrl, notes: item.notes, sortOrder: item.sortOrder }); setShowForm(true); setMessage(""); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function change<K extends keyof WorkspaceInput>(key: K, value: WorkspaceInput[K]) { setForm((current) => ({ ...current, [key]: value })); }

  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("Зберігаємо напрям…");
    const response = await fetch(editing ? `/api/workspace/${editing.id}` : "/api/workspace", { method: editing ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    const result = await response.json() as WorkspaceItem & { error?: string };
    if (!response.ok) { setMessage(result.error || "Не вдалося зберегти"); setBusy(false); return; }
    setItems((current) => editing ? current.map((item) => item.id === editing.id ? result : item) : [...current, result]);
    setShowForm(false); setEditing(null); setForm(blank); setMessage("Зміни збережено"); setBusy(false);
  }

  async function setItemStatus(item: WorkspaceItem, next: WorkspaceStatus) {
    if (!isAdmin) return; setBusy(true); setMessage(`Оновлюємо статус «${item.title}»…`);
    const input: WorkspaceInput = { title: item.title, description: item.description, system: item.system, status: next, priority: item.priority, owner: item.owner, progress: next === "live" ? 100 : item.progress, dueDate: item.dueDate, externalUrl: item.externalUrl, notes: item.notes, sortOrder: item.sortOrder };
    const response = await fetch(`/api/workspace/${item.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(input) });
    const result = await response.json() as WorkspaceItem & { error?: string };
    if (response.ok) { setItems((current) => current.map((entry) => entry.id === item.id ? result : entry)); setMessage("Статус оновлено адміністратором"); }
    else setMessage(result.error || "Не вдалося оновити статус");
    setBusy(false);
  }

  async function remove(item: WorkspaceItem) {
    if (!isAdmin || !confirm(`Видалити «${item.title}»?`)) return; setBusy(true);
    const response = await fetch(`/api/workspace/${item.id}`, { method: "DELETE" });
    if (response.ok) { setItems((current) => current.filter((entry) => entry.id !== item.id)); setMessage("Напрям видалено"); }
    else setMessage("Не вдалося видалити напрям"); setBusy(false);
  }

  return <div className="workspace-shell">
    <aside className="workspace-side">
      <a className="workspace-brand" href="/panel/workspace"><span>BL</span><div><b>BytesLab</b><small>× Academy</small></div></a>
      <nav aria-label="Навігація робочого простору"><a className="active" href="#overview">Огляд</a><a href="#roadmap">Напрями</a><a href="#ai-pipeline">AI-оцінювання</a><a href="#systems">Системи</a><a href="/panel">Редакційна панель</a><a href="/" target="_blank">Публічний сайт ↗</a></nav>
      <div className="workspace-user"><small>{isAdmin ? "Адміністратор" : "Редактор"}</small><b>{publisher.displayName}</b><p>{isAdmin ? "Повний контроль статусів" : "Статуси доступні лише для перегляду"}</p><form action="/auth/signout" method="post"><button type="submit">Вийти</button></form></div>
    </aside>
    <main className="workspace-main">
      <header className="workspace-hero" id="overview"><div><span className="workspace-kicker">Єдиний операційний простір</span><h1>BytesLab <i>×</i><br/>Академія</h1><p>Від публічного сайту й документів до майбутньої AI-перевірки робіт, Moodle та електронних відомостей.</p></div><div className="workspace-health"><span>Стан екосистеми</span><b>{average}%</b><div><i style={{ width: `${average}%` }}/></div><small>{items.length} напрямів під контролем</small></div></header>

      <section className="workspace-metrics" aria-label="Ключові показники"><article><span>01</span><b>{items.length}</b><p>систем і напрямів</p></article><article><span>02</span><b>{live}</b><p>працюють зараз</p></article><article><span>03</span><b>{moving}</b><p>у роботі або пілоті</p></article><article><span>04</span><b>{items.filter((item) => item.status === "blocked").length}</b><p>заблоковано</p></article></section>

      {showForm && <section className="workspace-editor" aria-label="Редагування напряму"><div className="workspace-section-head"><div><span>Картка напряму</span><h2>{editing ? "Редагувати" : "Новий напрям"}</h2></div><button type="button" onClick={() => setShowForm(false)}>Закрити ×</button></div><form onSubmit={save}><label className="wide">Назва<input required value={form.title} onChange={(event) => change("title", event.target.value)} /></label><label>Система<select value={form.system} onChange={(event) => change("system", event.target.value as WorkspaceSystem)}>{workspaceSystems.map((entry) => <option value={entry} key={entry}>{systemLabels[entry]}</option>)}</select></label><label>Пріоритет<select value={form.priority} onChange={(event) => change("priority", event.target.value as WorkspaceInput["priority"])}>{workspacePriorities.map((entry) => <option value={entry} key={entry}>{priorityLabels[entry]}</option>)}</select></label><label>Власник<input required value={form.owner} onChange={(event) => change("owner", event.target.value)} /></label><label>Дедлайн<input type="date" value={form.dueDate || ""} onChange={(event) => change("dueDate", event.target.value || null)} /></label><label>Прогрес: {form.progress}%<input type="range" min="0" max="100" value={form.progress} onChange={(event) => change("progress", Number(event.target.value))} /></label><label>Посилання<input type="url" value={form.externalUrl || ""} onChange={(event) => change("externalUrl", event.target.value || null)} placeholder="https://…" /></label><label className="wide">Опис<textarea required rows={3} value={form.description} onChange={(event) => change("description", event.target.value)} /></label><label className="wide">Наступний крок / примітка<textarea rows={2} value={form.notes} onChange={(event) => change("notes", event.target.value)} /></label>{isAdmin && <label>Статус<select value={form.status} onChange={(event) => change("status", event.target.value as WorkspaceStatus)}>{workspaceStatuses.map((entry) => <option value={entry} key={entry}>{statusLabels[entry]}</option>)}</select></label>}<div className="workspace-save"><p>{message || (isAdmin ? "Ви можете змінювати статуси." : "Статус збереже адміністратор.")}</p><button disabled={busy} type="submit">{busy ? "Зберігаємо…" : "Зберегти"}</button></div></form></section>}

      <section className="workspace-roadmap" id="roadmap"><div className="workspace-section-head"><div><span>Керування портфелем</span><h2>Напрями й статуси</h2><p>{isAdmin ? "Статус змінюється тут і фіксується централізовано." : "Ви можете редагувати деталі; статус змінює адміністратор."}</p></div><button type="button" onClick={startCreate}>+ Додати напрям</button></div>
        <div className="workspace-filters"><label>Система<select value={system} onChange={(event) => setSystem(event.target.value as WorkspaceSystem | "all")}><option value="all">Усі системи</option>{workspaceSystems.map((entry) => <option value={entry} key={entry}>{systemLabels[entry]}</option>)}</select></label><label>Статус<select value={status} onChange={(event) => setStatus(event.target.value as WorkspaceStatus | "all")}><option value="all">Усі статуси</option>{workspaceStatuses.map((entry) => <option value={entry} key={entry}>{statusLabels[entry]}</option>)}</select></label><span>{visible.length} із {items.length}</span></div>
        {message && !showForm && <p className="workspace-message" role="status">{message}</p>}
        <div className="workspace-grid">{visible.map((item, index) => <article className="workspace-card" key={item.id}><div className="workspace-card-top"><span>{String(index + 1).padStart(2, "0")} / {systemLabels[item.system]}</span><b className={`priority ${item.priority}`}>{priorityLabels[item.priority]}</b></div><h3>{item.title}</h3><p>{item.description}</p><div className="workspace-progress"><div><i style={{ width: `${item.progress}%` }}/></div><b>{item.progress}%</b></div><dl><div><dt>Власник</dt><dd>{item.owner}</dd></div><div><dt>Дедлайн</dt><dd>{item.dueDate ? new Intl.DateTimeFormat("uk-UA").format(new Date(`${item.dueDate}T12:00:00`)) : "Постійно"}</dd></div></dl>{item.notes && <small className="workspace-note">Наступне: {item.notes}</small>}<div className="workspace-card-actions"><select aria-label={`Статус ${item.title}`} disabled={!isAdmin || busy} value={item.status} className={`status-${item.status}`} onChange={(event) => void setItemStatus(item, event.target.value as WorkspaceStatus)}>{workspaceStatuses.map((entry) => <option value={entry} key={entry}>{statusLabels[entry]}</option>)}</select>{item.externalUrl && <a href={item.externalUrl} target="_blank">Відкрити ↗</a>}<button type="button" onClick={() => startEdit(item)}>Редагувати</button>{isAdmin && <button className="danger" type="button" onClick={() => void remove(item)}>Видалити</button>}</div></article>)}</div>
      </section>

      <section className="workspace-ai" id="ai-pipeline"><div><span className="workspace-kicker">Майбутній контур</span><h2>Від роботи студента<br/>до Moodle</h2><p>AI готує оцінку й аргументований фідбек, але рішення залишається контрольованим і видимим.</p></div><ol>{pipelineStep("Отримати роботу", "Файл завдання з Moodle, фото або голос через Telegram.", "ready")}{pipelineStep("Зіставити студента", "Курс, група, завдання, дедлайн і версія роботи.", "next")}{pipelineStep("Оцінити за рубрикою", "Проєкт бала, пояснення, помилки та корисні рекомендації.", "future")}{pipelineStep("Погодити рішення", "Викладач затверджує або відхиляє; після 14 днів працює визначене правило.", "future")}{pipelineStep("Записати результат", "Фідбек, оцінка, відомість і журнал змін синхронізуються з Moodle.", "future")}</ol></section>

      <section className="workspace-systems" id="systems"><div className="workspace-section-head"><div><span>Архітектура екосистеми</span><h2>Усі системи разом</h2></div><b>Єдині ролі · єдині статуси · один журнал рішень</b></div><div className="system-map"><article><span>01</span><h3>Workspace</h3><p>Користувачі, ролі, плани, статуси та контроль доступу.</p></article><article><span>02</span><h3>Academy Website</h3><p>Публічний контент, розклад, події та вступ.</p></article><article><span>03</span><h3>Documents</h3><p>Шаблони, методичні матеріали, накази та версії.</p></article><article><span>04</span><h3>GradeFlow</h3><p>Роботи студентів, рубрики, AI-фідбек і погодження.</p></article><article><span>05</span><h3>Відомості</h3><p>Підсумкові бали, контроль повноти та експорт.</p></article><article><span>06</span><h3>Moodle + Telegram</h3><p>Курси, файли, оцінки, фото, голос і повідомлення.</p></article></div></section>
    </main>
  </div>;
}
