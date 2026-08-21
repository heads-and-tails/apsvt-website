"use client";

import { useState } from "react";
import type { EditorialProfile, EditorialRole, EditorialStatus } from "@/lib/auth";
import { accessScopeLabel, editorialAccessOptions } from "@/lib/editorial-access";

function toggleScope(values: string[], value: string, checked: boolean): string[] {
  if (value === "*") return checked ? ["*"] : [];
  const withoutAll = values.filter((scope) => scope !== "*");
  return checked ? [...new Set([...withoutAll, value])] : withoutAll.filter((scope) => scope !== value);
}

function ScopePicker({ values, disabled, onChange }: { values: string[]; disabled?: boolean; onChange: (values: string[]) => void }) {
  const count = values.includes("*") ? "усі" : String(values.length);
  const group = (name: "page" | "department", title: string) => <div className="scope-group"><h4>{title}</h4>{editorialAccessOptions.filter((option) => option.group === name).map((option) => <label key={option.value}><input type="checkbox" disabled={disabled} checked={values.includes(option.value)} onChange={(event) => onChange(toggleScope(values, option.value, event.target.checked))} /><span>{option.label}</span></label>)}</div>;
  return <details className={`scope-picker ${disabled ? "disabled" : ""}`}>
    <summary><span>{values.length ? accessScopeLabel(values) : "Оберіть сторінки"}</span><b>{count}</b></summary>
    <div className="scope-menu">
      <label className="scope-all"><input type="checkbox" disabled={disabled} checked={values.includes("*")} onChange={(event) => onChange(toggleScope(values, "*", event.target.checked))} /><span>Увесь сайт</span></label>
      {group("page", "Окремі сторінки")}
      {group("department", "Кафедри та програми")}
    </div>
  </details>;
}

export function AccessManager({ initialProfiles, currentUserId }: { initialProfiles: EditorialProfile[]; currentUserId: string }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [invite, setInvite] = useState({ displayName: "", email: "", role: "editor" as EditorialRole, accessScopes: ["*"] });

  async function addPerson(event: React.FormEvent) {
    event.preventDefault(); setBusyId("invite"); setMessage("");
    const response = await fetch("/api/editorial/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(invite),
    });
    const result = await response.json() as EditorialProfile & { error?: string; temporaryPasswordIssued?: boolean; deliveryMethod?: "temporary-password" | "password-setup-link" };
    if (!response.ok) setMessage(result.error || "Не вдалося додати користувача");
    else {
      setProfiles((current) => [result, ...current.filter((profile) => profile.id !== result.id)]);
      setInvite({ displayName: "", email: "", role: "editor", accessScopes: ["*"] });
      setMessage(result.temporaryPasswordIssued
        ? result.deliveryMethod === "password-setup-link"
          ? "Акаунт створено й погоджено. Безпечне посилання для створення пароля надіслано на пошту."
          : "Акаунт створено й погоджено. Тимчасовий пароль надіслано на пошту."
        : "Акаунт уже існував. Права доступу оновлено без зміни його пароля.");
    }
    setBusyId(null);
  }

  async function sendTemporaryPassword(id: string) {
    setBusyId(id); setMessage("");
    const response = await fetch("/api/editorial/users", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const result = await response.json() as EditorialProfile & { error?: string; deliveryMethod?: "temporary-password" | "password-setup-link" };
    if (!response.ok) setMessage(result.error || "Не вдалося надіслати лист активації");
    else {
      setProfiles((current) => current.map((profile) => profile.id === id ? result : profile));
      setMessage(result.deliveryMethod === "password-setup-link"
        ? "Безпечне посилання для створення нового пароля надіслано на пошту."
        : "Новий тимчасовий пароль надіслано на пошту. Попередній пароль більше не діє.");
    }
    setBusyId(null);
  }

  async function update(id: string, role: EditorialRole, status: EditorialStatus, accessScopes: string[]) {
    if (!accessScopes.length) { setMessage("Оберіть хоча б одну сторінку або кафедру"); return; }
    setBusyId(id); setMessage("");
    const response = await fetch("/api/editorial/users", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, role, status, accessScopes }),
    });
    const result = await response.json() as EditorialProfile & { error?: string };
    if (!response.ok) setMessage(result.error || "Не вдалося змінити доступ");
    else {
      setProfiles((current) => current.map((profile) => profile.id === id ? result : profile));
      setMessage("Доступ оновлено");
    }
    setBusyId(null);
  }

  return <section className="access-manager" id="access">
    <div className="materials-head"><div><span>Безпека редакції</span><h2>Користувачі та доступ</h2><p>Створюйте погоджені акаунти, призначайте сторінки й кафедри. Новий редактор отримає безпечний лист активації та створить власний пароль.</p></div><b>{profiles.filter((profile) => profile.status === "approved").length} активних</b></div>
    <form className="access-invite" onSubmit={addPerson}>
      <div><small>Новий користувач</small><h3>Створити редакційний акаунт</h3><p>Новому користувачу система надішле лист для безпечного створення пароля. Якщо акаунт існує, зміняться лише права.</p></div>
      <label>Ім’я<input required value={invite.displayName} onChange={(event) => setInvite((current) => ({ ...current, displayName: event.target.value }))} placeholder="Ім’я та прізвище" /></label>
      <label>Електронна пошта<input required type="email" value={invite.email} onChange={(event) => setInvite((current) => ({ ...current, email: event.target.value }))} placeholder="name@example.com" /></label>
      <label>Роль<select value={invite.role} onChange={(event) => setInvite((current) => ({ ...current, role: event.target.value as EditorialRole }))}><option value="editor">Редактор</option><option value="admin">Адміністратор</option></select></label>
      <div className="access-scope-field"><span>Може редагувати</span><ScopePicker values={invite.accessScopes} onChange={(accessScopes) => setInvite((current) => ({ ...current, accessScopes }))} /></div>
      <button disabled={busyId === "invite" || !invite.accessScopes.length} type="submit">{busyId === "invite" ? "Створюємо…" : "Створити й надіслати доступ →"}</button>
    </form>
    {message && <p className="access-message" role="status">{message}</p>}
    <div className="access-list">
      {profiles.map((profile) => <article key={profile.id}>
        <div className="access-avatar">{profile.displayName.slice(0, 2).toUpperCase()}</div>
        <div className="access-person"><b>{profile.displayName}</b><span>{profile.email}</span><small>Створено {new Intl.DateTimeFormat("uk-UA").format(new Date(profile.createdAt))}</small></div>
        <label>Роль<select value={profile.role} disabled={busyId === profile.id || profile.id === currentUserId} onChange={(event) => void update(profile.id, event.target.value as EditorialRole, profile.status, profile.accessScopes)}><option value="editor">Редактор</option><option value="admin">Адміністратор</option></select></label>
        <div className="access-scope-field"><span>Сторінки / кафедри</span><ScopePicker values={profile.accessScopes} disabled={busyId === profile.id || profile.id === currentUserId || profile.role === "admin"} onChange={(accessScopes) => void update(profile.id, profile.role, profile.status, accessScopes)} /></div>
        <label>Доступ<select value={profile.status} disabled={busyId === profile.id || profile.id === currentUserId} onChange={(event) => void update(profile.id, profile.role, event.target.value as EditorialStatus, profile.accessScopes)}><option value="pending">Очікує</option><option value="approved">Погоджено</option><option value="suspended">Призупинено</option></select></label>
        <div className="access-account-actions"><span className={`access-status ${profile.status}`}>{profile.mustChangePassword ? "Очікує зміни пароля" : profile.status === "approved" ? "Погоджено" : profile.status === "pending" ? "Очікує рішення" : "Призупинено"}</span>{profile.id !== currentUserId && <button type="button" disabled={busyId === profile.id} onClick={() => void sendTemporaryPassword(profile.id)}>{busyId === profile.id ? "Надсилаємо…" : "Надіслати доступ"}</button>}</div>
      </article>)}
    </div>
  </section>;
}
