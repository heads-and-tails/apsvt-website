"use client";

import { useMemo, useState } from "react";
import type { Publisher } from "@/lib/auth";
import type { AvailabilityPayload, QuestionPayload, RequirementPayload, RunPayload, SchedulerItem, StaffPayload } from "@/lib/scheduler";

const days = [
  { value: 1, short: "Пн", long: "Понеділок" }, { value: 2, short: "Вт", long: "Вівторок" },
  { value: 3, short: "Ср", long: "Середа" }, { value: 4, short: "Чт", long: "Четвер" },
  { value: 5, short: "Пт", long: "П’ятниця" }, { value: 6, short: "Сб", long: "Субота" },
  { value: 7, short: "Нд", long: "Неділя" },
];
const emptyStaff: StaffPayload = { name: "", email: "", role: "teacher", telegramChatId: "", canApprove: false, minBreakMinutes: 15, maxDailyMinutes: 360, active: true };
const emptyRequirement: RequirementPayload = { course: "", group: "", faculty: "", type: "Лекція", teacherId: "", assistantId: "", durationMinutes: 80, sessionsPerWeek: 1, delivery: "onsite", room: "", earliestStart: "08:00", latestEnd: "19:00", preferredDays: [1, 2, 3, 4, 5] };

function nextMonday() {
  const date = new Date();
  const day = date.getDay();
  date.setDate(date.getDate() + (day === 0 ? 1 : 8 - day));
  return date.toISOString().slice(0, 10);
}
function runStatus(status: RunPayload["status"]) {
  return status === "approved" ? "Погоджено" : status === "rejected" ? "Відхилено" : "Очікує рішення";
}

export function SchedulerDashboard({ initialItems, publisher, telegramConfigured }: {
  initialItems: SchedulerItem[]; publisher: Publisher; telegramConfigured: boolean;
}) {
  const [items, setItems] = useState(initialItems);
  const [staffForm, setStaffForm] = useState(emptyStaff);
  const [editingStaff, setEditingStaff] = useState("");
  const [availability, setAvailability] = useState<AvailabilityPayload>({ staffId: "", weekday: 1, startTime: "09:00", endTime: "17:00", preference: "preferred" });
  const [requirement, setRequirement] = useState(emptyRequirement);
  const [runName, setRunName] = useState("Навчальний тиждень");
  const [weekStart, setWeekStart] = useState(nextMonday());
  const [decisionNote, setDecisionNote] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const isAdmin = publisher.role === "admin";

  const staff = useMemo(() => items.filter((item) => item.kind === "staff"), [items]);
  const staffById = useMemo(() => new Map(staff.map((item) => [item.id, item.payload as StaffPayload])), [staff]);
  const ownStaff = staff.find((item) => (item.payload as StaffPayload).email.toLowerCase() === publisher.email.toLowerCase());
  const allowedStaff = isAdmin ? staff : ownStaff ? [ownStaff] : [];
  const availabilityItems = items.filter((item) => item.kind === "availability");
  const requirements = items.filter((item) => item.kind === "requirement");
  const latestRun = items.filter((item) => item.kind === "run").at(-1);
  const latest = latestRun?.payload as RunPayload | undefined;
  const questions = items.filter((item) => item.kind === "question").slice().reverse();

  async function refresh() {
    const response = await fetch("/api/scheduler", { cache: "no-store" });
    if (response.ok) setItems(await response.json() as SchedulerItem[]);
  }
  async function post(body: object, success: string) {
    setBusy(true); setMessage("");
    const response = await fetch("/api/scheduler", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json() as { error?: string };
    setMessage(response.ok ? success : result.error || "Не вдалося зберегти");
    if (response.ok) await refresh();
    setBusy(false);
    return response.ok;
  }
  async function remove(id: string) {
    if (!confirm("Видалити цей запис?")) return;
    setBusy(true);
    const response = await fetch(`/api/scheduler?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const result = await response.json() as { error?: string };
    setMessage(response.ok ? "Запис видалено" : result.error || "Не вдалося видалити");
    if (response.ok) await refresh();
    setBusy(false);
  }
  async function decide(decision: "approve" | "reject") {
    if (!latestRun) return;
    setBusy(true);
    const response = await fetch("/api/scheduler", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: latestRun.id, decision, note: decisionNote }) });
    const result = await response.json() as { error?: string };
    setMessage(response.ok ? decision === "approve" ? "Розклад погоджено й опубліковано" : "Чернетку відхилено" : result.error || "Не вдалося зберегти рішення");
    if (response.ok) await refresh();
    setBusy(false);
  }

  return <div className="scheduler-shell">
    <aside className="scheduler-side">
      <a className="scheduler-brand" href="/panel/scheduler"><span>АП</span><div><b>Schedule Lab</b><small>АПСВТ × BytesLab</small></div></a>
      <nav><a className="active" href="#overview">Огляд</a><a href="#availability">Доступність</a>{isAdmin && <><a href="#team">Команда</a><a href="#requirements">Заняття</a><a href="#generator">Генератор</a></>}<a href="#review">Погодження</a><a href="#telegram">Telegram</a><a href="/panel">Редакційна панель</a><a href="/panel/workspace">Workspace</a><a href="/schedule" target="_blank">Розклад ↗</a></nav>
      <div className="scheduler-user"><small>{isAdmin ? "Адміністратор" : "Викладач / асистент"}</small><b>{publisher.displayName}</b><p>{isAdmin ? "Створення й остаточне рішення" : "Власна доступність"}</p><form action="/auth/signout" method="post"><button type="submit">Вийти</button></form></div>
    </aside>

    <main className="scheduler-main">
      <header className="scheduler-hero" id="overview">
        <div><span className="scheduler-kicker">Автоматичне планування занять</span><h1>Час людей.<br/><i>Один розклад.</i></h1><p>Збираємо доступність викладачів і асистентів, враховуємо тривалість, групи, аудиторії та перерви — і готуємо контрольовану чернетку.</p></div>
        <div className="scheduler-state"><span>Остання версія</span><b>{latest ? runStatus(latest.status) : "Ще немає"}</b><dl><div><dt>Команда</dt><dd>{staff.length}</dd></div><div><dt>Вікна часу</dt><dd>{availabilityItems.length}</dd></div><div><dt>Заняття</dt><dd>{requirements.length}</dd></div><div><dt>Конфлікти</dt><dd>{latest?.conflictCount || 0}</dd></div></dl></div>
      </header>
      {message && <p className="scheduler-message" role="status">{message}</p>}
      <section className="scheduler-flow"><article><span>01</span><b>Доступність</b><p>Кожен обирає дні та години.</p></article><article><span>02</span><b>Правила</b><p>Тривалість, група, аудиторія, перерви.</p></article><article><span>03</span><b>Чернетка</b><p>Алгоритм знаходить найкращі перетини.</p></article><article><span>04</span><b>Рішення</b><p>Approve / disapprove у панелі або Telegram.</p></article></section>

      <section className="scheduler-section" id="availability">
        <div className="scheduler-heading"><div><span>Особистий календар</span><h2>Доступність команди</h2><p>Можна додати кілька вікон. «Бажано» отримує пріоритет під час генерації.</p></div></div>
        {allowedStaff.length ? <div className="scheduler-split">
          <form className="scheduler-form" onSubmit={async (event) => {
            event.preventDefault();
            const staffId = availability.staffId || allowedStaff[0]?.id || "";
            if (await post({ action: "add_availability", payload: { ...availability, staffId } }, "Доступність додано")) setAvailability((current) => ({ ...current, staffId }));
          }}>
            <label>Викладач / асистент<select value={availability.staffId || allowedStaff[0]?.id || ""} onChange={(event) => setAvailability({ ...availability, staffId: event.target.value })}>{allowedStaff.map((item) => <option key={item.id} value={item.id}>{(item.payload as StaffPayload).name}</option>)}</select></label>
            <label>День<select value={availability.weekday} onChange={(event) => setAvailability({ ...availability, weekday: Number(event.target.value) })}>{days.map((day) => <option value={day.value} key={day.value}>{day.long}</option>)}</select></label>
            <div className="scheduler-form-row"><label>Від<input type="time" value={availability.startTime} onChange={(event) => setAvailability({ ...availability, startTime: event.target.value })}/></label><label>До<input type="time" value={availability.endTime} onChange={(event) => setAvailability({ ...availability, endTime: event.target.value })}/></label></div>
            <label>Пріоритет<select value={availability.preference} onChange={(event) => setAvailability({ ...availability, preference: event.target.value as AvailabilityPayload["preference"] })}><option value="preferred">Бажано</option><option value="available">Можливо</option></select></label>
            <button disabled={busy} type="submit">+ Додати вікно</button>
          </form>
          <div className="availability-board">{days.map((day) => <article key={day.value}><b>{day.short}</b><div>{availabilityItems.filter((item) => {
            const payload = item.payload as AvailabilityPayload;
            return payload.weekday === day.value && (isAdmin || payload.staffId === ownStaff?.id);
          }).map((item) => {
            const payload = item.payload as AvailabilityPayload;
            return <span className={payload.preference} key={item.id}><i>{staffById.get(payload.staffId)?.name}</i>{payload.startTime}–{payload.endTime}<button type="button" onClick={() => void remove(item.id)}>×</button></span>;
          })}</div></article>)}</div>
        </div> : <div className="scheduler-empty"><b>Ваш профіль ще не додано.</b><p>Адміністратор має додати {publisher.email} до команди.</p></div>}
      </section>

      {isAdmin && <section className="scheduler-section" id="team">
        <div className="scheduler-heading"><div><span>Ролі та обмеження</span><h2>Команда</h2></div></div>
        <div className="scheduler-split">
          <form className="scheduler-form" onSubmit={async (event) => {
            event.preventDefault();
            if (await post({ action: "save_staff", id: editingStaff || undefined, payload: staffForm }, editingStaff ? "Дані оновлено" : "Учасника додано")) { setStaffForm(emptyStaff); setEditingStaff(""); }
          }}>
            <label>Ім’я<input required value={staffForm.name} onChange={(event) => setStaffForm({ ...staffForm, name: event.target.value })}/></label>
            <label>Email<input type="email" required value={staffForm.email} onChange={(event) => setStaffForm({ ...staffForm, email: event.target.value })}/></label>
            <label>Роль<select value={staffForm.role} onChange={(event) => setStaffForm({ ...staffForm, role: event.target.value as StaffPayload["role"] })}><option value="teacher">Викладач</option><option value="assistant">Асистент</option><option value="coordinator">Координатор</option></select></label>
            <div className="scheduler-form-row"><label>Перерва, хв<input type="number" min="0" max="120" value={staffForm.minBreakMinutes} onChange={(event) => setStaffForm({ ...staffForm, minBreakMinutes: Number(event.target.value) })}/></label><label>Макс. хв/день<input type="number" min="30" max="720" value={staffForm.maxDailyMinutes} onChange={(event) => setStaffForm({ ...staffForm, maxDailyMinutes: Number(event.target.value) })}/></label></div>
            <label>Telegram chat ID<input value={staffForm.telegramChatId} onChange={(event) => setStaffForm({ ...staffForm, telegramChatId: event.target.value })} placeholder="Напр. 123456789"/></label>
            <label className="scheduler-check"><input type="checkbox" checked={staffForm.canApprove} onChange={(event) => setStaffForm({ ...staffForm, canApprove: event.target.checked })}/><span>Може погоджувати через Telegram</span></label>
            <button disabled={busy} type="submit">{editingStaff ? "Зберегти зміни" : "+ Додати учасника"}</button>
            {editingStaff && <button className="secondary" type="button" onClick={() => { setEditingStaff(""); setStaffForm(emptyStaff); }}>Скасувати</button>}
          </form>
          <div className="team-list">{staff.map((item) => {
            const payload = item.payload as StaffPayload;
            return <article key={item.id}><div><span>{payload.role === "teacher" ? "Викладач" : payload.role === "assistant" ? "Асистент" : "Координатор"}</span><h3>{payload.name}</h3><p>{payload.email}</p></div><dl><div><dt>Перерва</dt><dd>{payload.minBreakMinutes} хв</dd></div><div><dt>Ліміт</dt><dd>{payload.maxDailyMinutes} хв</dd></div><div><dt>Telegram</dt><dd>{payload.telegramChatId ? "Підключено" : "Не додано"}</dd></div></dl><div><button type="button" onClick={() => { setEditingStaff(item.id); setStaffForm(payload); }}>Редагувати</button><button className="danger" type="button" onClick={() => void remove(item.id)}>Видалити</button></div></article>;
          })}</div>
        </div>
      </section>}

      {isAdmin && <section className="scheduler-section" id="requirements">
        <div className="scheduler-heading"><div><span>Навчальне навантаження</span><h2>Параметри занять</h2><p>Одна картка може створити кілька занять протягом тижня.</p></div></div>
        <div className="scheduler-split requirements-layout">
          <form className="scheduler-form" onSubmit={async (event) => {
            event.preventDefault();
            if (await post({ action: "add_requirement", payload: requirement }, "Заняття додано")) setRequirement((current) => ({ ...emptyRequirement, teacherId: current.teacherId }));
          }}>
            <label>Дисципліна<input required value={requirement.course} onChange={(event) => setRequirement({ ...requirement, course: event.target.value })}/></label>
            <div className="scheduler-form-row"><label>Група<input required value={requirement.group} onChange={(event) => setRequirement({ ...requirement, group: event.target.value })}/></label><label>Факультет / кафедра<input required value={requirement.faculty} onChange={(event) => setRequirement({ ...requirement, faculty: event.target.value })}/></label></div>
            <div className="scheduler-form-row"><label>Викладач<select required value={requirement.teacherId} onChange={(event) => setRequirement({ ...requirement, teacherId: event.target.value })}><option value="">Оберіть</option>{staff.filter((item) => (item.payload as StaffPayload).role !== "assistant").map((item) => <option key={item.id} value={item.id}>{(item.payload as StaffPayload).name}</option>)}</select></label><label>Асистент<select value={requirement.assistantId} onChange={(event) => setRequirement({ ...requirement, assistantId: event.target.value })}><option value="">Без асистента</option>{staff.filter((item) => (item.payload as StaffPayload).role === "assistant").map((item) => <option key={item.id} value={item.id}>{(item.payload as StaffPayload).name}</option>)}</select></label></div>
            <div className="scheduler-form-row"><label>Тривалість, хв<input type="number" min="30" step="5" value={requirement.durationMinutes} onChange={(event) => setRequirement({ ...requirement, durationMinutes: Number(event.target.value) })}/></label><label>Разів на тиждень<input type="number" min="1" max="10" value={requirement.sessionsPerWeek} onChange={(event) => setRequirement({ ...requirement, sessionsPerWeek: Number(event.target.value) })}/></label></div>
            <div className="scheduler-form-row"><label>Формат<select value={requirement.delivery} onChange={(event) => setRequirement({ ...requirement, delivery: event.target.value as RequirementPayload["delivery"] })}><option value="onsite">В аудиторії</option><option value="online">Онлайн</option></select></label><label>Аудиторія<input value={requirement.room} onChange={(event) => setRequirement({ ...requirement, room: event.target.value })}/></label></div>
            <div className="scheduler-form-row"><label>Не раніше<input type="time" value={requirement.earliestStart} onChange={(event) => setRequirement({ ...requirement, earliestStart: event.target.value })}/></label><label>Не пізніше<input type="time" value={requirement.latestEnd} onChange={(event) => setRequirement({ ...requirement, latestEnd: event.target.value })}/></label></div>
            <fieldset><legend>Бажані дні</legend><div className="day-toggles">{days.map((day) => <label key={day.value}><input type="checkbox" checked={requirement.preferredDays.includes(day.value)} onChange={(event) => setRequirement({ ...requirement, preferredDays: event.target.checked ? [...requirement.preferredDays, day.value] : requirement.preferredDays.filter((value) => value !== day.value) })}/><span>{day.short}</span></label>)}</div></fieldset>
            <label>Тип заняття<select value={requirement.type} onChange={(event) => setRequirement({ ...requirement, type: event.target.value })}><option>Лекція</option><option>Практичне</option><option>Семінар</option><option>Лабораторне</option><option>Іспит</option></select></label>
            <button disabled={busy || staff.length === 0} type="submit">+ Додати заняття</button>
          </form>
          <div className="requirement-list">{requirements.map((item, index) => {
            const payload = item.payload as RequirementPayload;
            return <article key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{payload.course}</h3><p>{payload.group} · {payload.type} · {payload.durationMinutes} хв × {payload.sessionsPerWeek}</p><small>{staffById.get(payload.teacherId)?.name || "Викладача не знайдено"}</small></div><button type="button" onClick={() => void remove(item.id)}>×</button></article>;
          })}</div>
        </div>
      </section>}

      {isAdmin && <section className="scheduler-generator" id="generator">
        <div><span className="scheduler-kicker">Schedule engine</span><h2>Створити чернетку</h2><p>Система пояснить нерозв’язані конфлікти й не публікуватиме нічого без рішення адміністратора.</p></div>
        <form onSubmit={async (event) => { event.preventDefault(); await post({ action: "generate", name: runName, weekStart }, "Чернетку створено й надіслано на погодження"); }}><label>Назва періоду<input required value={runName} onChange={(event) => setRunName(event.target.value)}/></label><label>Понеділок тижня<input type="date" required value={weekStart} onChange={(event) => setWeekStart(event.target.value)}/></label><button disabled={busy || !requirements.length} type="submit">{busy ? "Плануємо…" : "Згенерувати розклад →"}</button></form>
      </section>}

      <section className="scheduler-section" id="review">
        <div className="scheduler-heading"><div><span>Контроль перед публікацією</span><h2>Чернетка розкладу</h2>{latest && <p>{latest.name} · тиждень від {latest.weekStart}</p>}</div>{latest && <b className={`run-status ${latest.status}`}>{runStatus(latest.status)}</b>}</div>
        {latest ? <>
          <div className="schedule-grid">{days.map((day) => <article key={day.value}><header><span>{day.short}</span><b>{day.long}</b></header><div>{latest.slots.filter((slot) => !slot.conflict && slot.weekday === day.value).map((slot) => <div className="schedule-slot" key={slot.id}><time>{slot.startTime}–{slot.endTime}</time><h3>{slot.course}</h3><p>{slot.group} · {slot.type}</p><small>{staffById.get(slot.teacherId)?.name || "—"}{slot.assistantId ? ` + ${staffById.get(slot.assistantId)?.name || "—"}` : ""}<br/>{slot.delivery === "online" ? "Онлайн" : `ауд. ${slot.room || "—"}`}</small></div>)}</div></article>)}</div>
          {latest.conflictCount > 0 && <div className="conflict-list"><h3>Потрібне ручне рішення · {latest.conflictCount}</h3>{latest.slots.filter((slot) => slot.conflict).map((slot) => <article key={slot.id}><b>{slot.course}</b><span>{slot.group} · {staffById.get(slot.teacherId)?.name || "—"}</span><p>{slot.conflictReason}</p></article>)}</div>}
          {isAdmin && latest.status === "pending_approval" && <div className="decision-box"><label>Коментар<textarea rows={2} value={decisionNote} onChange={(event) => setDecisionNote(event.target.value)} placeholder="Необов’язково"/></label><div><button disabled={busy} className="reject" type="button" onClick={() => void decide("reject")}>Відхилити</button><button disabled={busy || latest.scheduledCount === 0} className="approve" type="button" onClick={() => void decide("approve")}>Погодити й опублікувати</button></div></div>}
          {latest.decisionNote && <p className="decision-note">Коментар: {latest.decisionNote}</p>}
        </> : <div className="scheduler-empty"><b>Чернетку ще не створено.</b><p>Додайте команду, доступність і заняття, потім запустіть генератор.</p></div>}
      </section>

      <section className="scheduler-telegram" id="telegram">
        <div><span className="scheduler-kicker">Telegram agent</span><h2>Питання та рішення в телефоні</h2><p>Бот приймає питання, показує статус і надсилає кнопки погодження координаторам.</p><span className={`telegram-state ${telegramConfigured ? "live" : "waiting"}`}>{telegramConfigured ? "● Бот підключено" : "○ Очікує токен BotFather"}</span></div>
        <div className="telegram-commands"><b>Команди агента</b><code>/start</code><code>/availability</code><code>/status</code><small>Webhook: /api/telegram/scheduler</small></div>
      </section>

      {isAdmin && questions.length > 0 && <section className="scheduler-section questions-section"><div className="scheduler-heading"><div><span>Вхідні звернення</span><h2>Питання з Telegram</h2></div></div><div className="question-list">{questions.map((item) => {
        const payload = item.payload as QuestionPayload;
        return <article key={item.id}><header><b>@{payload.username || payload.chatId}</b><span>{item.status === "answered" ? "Надіслано" : "Очікує"}</span></header><p>{payload.text}</p>{payload.answer ? <blockquote>{payload.answer}</blockquote> : <div><textarea rows={2} value={answers[item.id] || ""} onChange={(event) => setAnswers({ ...answers, [item.id]: event.target.value })} placeholder="Відповідь…"/><button type="button" onClick={async () => {
          const answer = answers[item.id]?.trim();
          if (answer && await post({ action: "answer_question", id: item.id, payload: { answer } }, "Відповідь надіслано")) setAnswers({ ...answers, [item.id]: "" });
        }}>Надіслати</button></div>}</article>;
      })}</div></section>}
    </main>
  </div>;
}
