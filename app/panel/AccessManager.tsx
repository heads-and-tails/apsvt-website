"use client";

import { useState } from "react";
import type { EditorialProfile, EditorialRole, EditorialStatus } from "@/lib/auth";
import { editorialAccessOptions } from "@/lib/editorial-access";

function AccessOptions() {
  return <>
    <option value="*">Увесь сайт</option>
    <optgroup label="Окремі сторінки">
      {editorialAccessOptions.filter((option) => option.group === "page").map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
    </optgroup>
    <optgroup label="Кафедри та програми">
      {editorialAccessOptions.filter((option) => option.group === "department").map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
    </optgroup>
  </>;
}

export function AccessManager({ initialProfiles, currentUserId }: { initialProfiles: EditorialProfile[]; currentUserId: string }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [invite, setInvite] = useState({ displayName: "", email: "", role: "editor" as EditorialRole, accessScope: "*" });

  async function addPerson(event: React.FormEvent) {
    event.preventDefault(); setBusyId("invite"); setMessage("");
    const response = await fetch("/api/editorial/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(invite),
    });
    const result = await response.json() as EditorialProfile & { error?: string };
    if (!response.ok) setMessage(result.error || "Не вдалося додати користувача");
    else {
      setProfiles((current) => [result, ...current.filter((profile) => profile.id !== result.id)]);
      setInvite({ displayName: "", email: "", role: "editor", accessScope: "*" });
      setMessage("Користувача додано й автоматично погоджено. Запрошення надіслано на пошту.");
    }
    setBusyId(null);
  }

  async function update(id: string, role: EditorialRole, status: EditorialStatus, accessScope: string) {
    setBusyId(id); setMessage("");
    const response = await fetch("/api/editorial/users", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, role, status, accessScope }),
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
    <div className="materials-head"><div><span>Безпека редакції</span><h2>Користувачі та доступ</h2><p>Призначайте редактору весь сайт, окрему сторінку або кафедру. Адміністратор завжди має повний доступ.</p></div><b>{profiles.filter((profile) => profile.status === "approved").length} активних</b></div>
    <form className="access-invite" onSubmit={addPerson}>
      <div><small>Новий користувач</small><h3>Додати людину до редакції</h3><p>Якщо акаунт уже існує, його права оновляться без повторного створення.</p></div>
      <label>Ім’я<input required value={invite.displayName} onChange={(event) => setInvite((current) => ({ ...current, displayName: event.target.value }))} placeholder="Ім’я та прізвище" /></label>
      <label>Електронна пошта<input required type="email" value={invite.email} onChange={(event) => setInvite((current) => ({ ...current, email: event.target.value }))} placeholder="name@example.com" /></label>
      <label>Роль<select value={invite.role} onChange={(event) => setInvite((current) => ({ ...current, role: event.target.value as EditorialRole }))}><option value="editor">Редактор</option><option value="admin">Адміністратор</option></select></label>
      <label>Може редагувати<select value={invite.accessScope} onChange={(event) => setInvite((current) => ({ ...current, accessScope: event.target.value }))}><AccessOptions /></select></label>
      <button disabled={busyId === "invite"} type="submit">{busyId === "invite" ? "Додаємо…" : "Додати й погодити →"}</button>
    </form>
    {message && <p className="access-message" role="status">{message}</p>}
    <div className="access-list">
      {profiles.map((profile) => <article key={profile.id}>
        <div className="access-avatar">{profile.displayName.slice(0, 2).toUpperCase()}</div>
        <div className="access-person"><b>{profile.displayName}</b><span>{profile.email}</span><small>Створено {new Intl.DateTimeFormat("uk-UA").format(new Date(profile.createdAt))}</small></div>
        <label>Роль<select value={profile.role} disabled={busyId === profile.id || profile.id === currentUserId} onChange={(event) => void update(profile.id, event.target.value as EditorialRole, profile.status, profile.accessScope)}><option value="editor">Редактор</option><option value="admin">Адміністратор</option></select></label>
        <label>Сторінка / кафедра<select value={profile.accessScope} disabled={busyId === profile.id || profile.id === currentUserId || profile.role === "admin"} onChange={(event) => void update(profile.id, profile.role, profile.status, event.target.value)}><AccessOptions /></select></label>
        <label>Доступ<select value={profile.status} disabled={busyId === profile.id || profile.id === currentUserId} onChange={(event) => void update(profile.id, profile.role, event.target.value as EditorialStatus, profile.accessScope)}><option value="pending">Очікує</option><option value="approved">Погоджено</option><option value="suspended">Призупинено</option></select></label>
        <span className={`access-status ${profile.status}`}>{profile.status === "approved" ? "Погоджено" : profile.status === "pending" ? "Очікує рішення" : "Призупинено"}</span>
      </article>)}
    </div>
  </section>;
}
