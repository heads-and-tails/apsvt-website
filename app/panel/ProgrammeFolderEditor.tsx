"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import type { DepartmentEntry } from "@/lib/department-content";
import type { PageDocument } from "@/lib/documents";
import { programmeFolderHasDocuments, programmeFolderInput, type ProgrammeFolderSection } from "@/lib/programme-folders";

export function ProgrammeFolderEditor({ pagePath, sectionId, folders, setFolders, documents, selectedId, onSelect, busy, setBusy, onMessage }: {
  pagePath: string;
  sectionId: ProgrammeFolderSection;
  folders: DepartmentEntry[];
  setFolders: Dispatch<SetStateAction<DepartmentEntry[]>>;
  documents: PageDocument[];
  selectedId: string;
  onSelect: (id: string) => void;
  busy: boolean;
  setBusy: Dispatch<SetStateAction<boolean>>;
  onMessage: (message: string) => void;
}) {
  const [name, setName] = useState("");
  const available = folders.filter((folder) => folder.pagePath === pagePath && folder.sectionId === sectionId);
  const selected = available.find((folder) => folder.id === selectedId);
  const hasDocuments = selected && programmeFolderHasDocuments(selected, documents);

  async function save(folder?: DepartmentEntry) {
    const title = folder ? prompt("Нова назва папки", folder.title) : name;
    if (!title?.trim()) return;
    setBusy(true);
    try {
      const response = await fetch(folder ? `/api/department-content/${folder.id}` : "/api/department-content", {
        method: folder ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(folder ? { ...folder, title: title.trim() } : programmeFolderInput(pagePath, sectionId, title, (available.length + 1) * 10)),
      });
      const result = await response.json() as DepartmentEntry & { error?: string };
      if (!response.ok) throw new Error(result.error || "Не вдалося зберегти папку");
      setFolders((current) => folder ? current.map((item) => item.id === folder.id ? result : item) : [...current, result]);
      onSelect(result.id); setName(""); onMessage(folder ? "Назву папки оновлено" : "Папку створено. Додайте до неї документи.");
    } catch (error) { onMessage(error instanceof Error ? error.message : "Не вдалося зберегти папку"); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!selected || hasDocuments || !confirm(`Видалити порожню папку «${selected.title}»?`)) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/department-content/${selected.id}`, { method: "DELETE" });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Не вдалося видалити папку");
      setFolders((current) => current.filter((item) => item.id !== selected.id));
      onSelect(""); onMessage("Папку видалено");
    } catch (error) { onMessage(error instanceof Error ? error.message : "Не вдалося видалити папку"); }
    finally { setBusy(false); }
  }

  return <div className="programme-folder-editor wide">
    <label>Папка<select value={selectedId} disabled={busy} onChange={(event) => onSelect(event.target.value)}>
      <option value="">Без папки</option>
      {available.map((folder) => <option key={folder.id} value={folder.id}>{folder.title}{folder.status === "draft" ? " (чернетка)" : ""}</option>)}
    </select></label>
    <div className="programme-folder-actions"><button disabled={busy || !selected} type="button" onClick={() => void save(selected)}>Перейменувати папку</button><button disabled={busy || !selected || Boolean(hasDocuments)} type="button" onClick={() => void remove()}>Видалити папку</button></div>
    {hasDocuments && <p>Щоб видалити папку, спочатку перенесіть або видаліть її документи.</p>}
    <label>Назва нової папки<input value={name} disabled={busy} onChange={(event) => setName(event.target.value)} /></label>
    <button disabled={busy || !name.trim()} type="button" onClick={() => void save()}>Створити папку</button>
  </div>;
}
