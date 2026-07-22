"use client";

import { useState } from "react";
import type { EditorialProfile, EditorialRole, EditorialStatus } from "@/lib/auth";

export function AccessManager({ initialProfiles, currentUserId }: { initialProfiles: EditorialProfile[]; currentUserId: string }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function update(id: string, role: EditorialRole, status: EditorialStatus) {
    setBusyId(id); setMessage("");
    const response = await fetch("/api/editorial/users", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, role, status }),
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
    <div className="materials-head"><div><span>Безпека редакції</span><h2>Користувачі та доступ</h2><p>Нові акаунти залишаються в очікуванні, доки адміністратор їх не погодить.</p></div><b>{profiles.filter((profile) => profile.status === "approved").length} активних</b></div>
    {message && <p className="access-message" role="status">{message}</p>}
    <div className="access-list">
      {profiles.map((profile) => <article key={profile.id}>
        <div className="access-avatar">{profile.displayName.slice(0, 2).toUpperCase()}</div>
        <div className="access-person"><b>{profile.displayName}</b><span>{profile.email}</span><small>Створено {new Intl.DateTimeFormat("uk-UA").format(new Date(profile.createdAt))}</small></div>
        <label>Роль<select value={profile.role} disabled={busyId === profile.id || profile.id === currentUserId} onChange={(event) => void update(profile.id, event.target.value as EditorialRole, profile.status)}><option value="editor">Редактор</option><option value="admin">Адміністратор</option></select></label>
        <label>Доступ<select value={profile.status} disabled={busyId === profile.id || profile.id === currentUserId} onChange={(event) => void update(profile.id, profile.role, event.target.value as EditorialStatus)}><option value="pending">Очікує</option><option value="approved">Погоджено</option><option value="suspended">Призупинено</option></select></label>
        <span className={`access-status ${profile.status}`}>{profile.status === "approved" ? "Погоджено" : profile.status === "pending" ? "Очікує рішення" : "Призупинено"}</span>
      </article>)}
    </div>
  </section>;
}
