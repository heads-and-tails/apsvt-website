"use client";

import { useMemo, useState } from "react";
import type { Publisher } from "@/lib/auth";
import {
  draftRecordToPayload,
  draftTargetConfigs,
  payloadToDraftRecord,
  type DraftRecord,
  type EditorialAiDraft,
  type EditorialDraftTarget,
} from "@/lib/editorial-drafts";
import { canEditPage, editorialAccessOptions } from "@/lib/editorial-access";

type UploadedSource = { url: string; fileName: string; mimeType: string; fileSize: number };

export function AiEditorialAssistant({ publisher }: { publisher: Publisher }) {
  const availableTargets = useMemo(
    () => draftTargetConfigs.filter((entry) => entry.id === "document" || canEditPage(publisher, entry.pagePath)),
    [publisher],
  );
  const pageOptions = useMemo(
    () => editorialAccessOptions.filter((option) => option.value !== "*" && canEditPage(publisher, option.value)),
    [publisher],
  );
  const [target, setTarget] = useState<EditorialDraftTarget>(availableTargets[0]?.id || "document");
  const [pagePath, setPagePath] = useState(pageOptions[0]?.value || "/materials");
  const [instruction, setInstruction] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [draft, setDraft] = useState<EditorialAiDraft | null>(null);
  const [uploaded, setUploaded] = useState<UploadedSource | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const config = draftTargetConfigs.find((entry) => entry.id === target)!;

  function chooseTarget(value: EditorialDraftTarget) {
    setTarget(value); setDraft(null); setUploaded(null); setMessage("");
  }

  async function uploadSource(selected: File): Promise<UploadedSource | null> {
    const isDocument = /\.(pdf|docx?)$/i.test(selected.name);
    const isNewsImage = target === "news" && selected.type.startsWith("image/");
    if (!isDocument && !isNewsImage) return null;
    const data = new FormData();
    data.append("file", selected);
    data.append("purpose", isDocument ? "document" : "image");
    const response = await fetch("/api/uploads", { method: "POST", body: data });
    const result = await response.json() as UploadedSource & { error?: string };
    if (!response.ok || !result.url) throw new Error(result.error || "Не вдалося зберегти вихідний файл");
    return result;
  }

  async function analyze(event: React.FormEvent) {
    event.preventDefault();
    if (!file) return;
    setBusy(true); setDraft(null); setUploaded(null);
    setMessage("AI читає файл, прибирає дублікати та готує структуру…");
    const data = new FormData();
    data.append("file", file); data.append("target", target); data.append("pagePath", pagePath); data.append("instruction", instruction);
    try {
      const [analysisResponse, source] = await Promise.all([
        fetch("/api/editorial/ai-import", { method: "POST", body: data }),
        uploadSource(file).catch(() => null),
      ]);
      const result = await analysisResponse.json() as EditorialAiDraft & { error?: string };
      if (!analysisResponse.ok) throw new Error(result.error || "Не вдалося створити чернетку");
      setDraft(result); setUploaded(source);
      setMessage(result.usedAi
        ? "Чернетка готова. Перевірте факти й натисніть кнопку публікації."
        : "Текст розпізнано. AI-ключ ще не активовано, тому обов’язково відредагуйте чернетку.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не вдалося створити чернетку");
    } finally { setBusy(false); }
  }

  function changeDraft(key: "title" | "summary" | "body", value: string) {
    setDraft((current) => current ? { ...current, [key]: value } : current);
  }

  function changeRecord(recordIndex: number, key: string, value: string) {
    setDraft((current) => current ? {
      ...current,
      records: current.records.map((record, index) => index === recordIndex
        ? { fields: record.fields.map((field) => field.key === key ? { ...field, value } : field) }
        : record),
    } : current);
  }

  function removeRecord(recordIndex: number) {
    setDraft((current) => current ? { ...current, records: current.records.filter((_, index) => index !== recordIndex) } : current);
  }

  function addRecord() {
    setDraft((current) => current ? { ...current, records: [...current.records, payloadToDraftRecord({}, config.fields)] } : current);
  }

  function recordHasContent(record: DraftRecord) {
    return record.fields.some((field) => field.value.trim());
  }

  async function publish() {
    if (!draft) return;
    const records = draft.records.filter(recordHasContent);
    if (!records.length) { setMessage("Додайте хоча б один заповнений запис."); return; }
    setBusy(true);
    setMessage(target === "news" || target === "document" ? "Зберігаємо чернетку…" : "Публікуємо перевірені записи…");
    try {
      if (target === "news") {
        const payload = draftRecordToPayload(records[0]);
        const response = await fetch("/api/posts", {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({
            title: payload.title || draft.title, excerpt: payload.excerpt || draft.summary,
            body: payload.body || draft.body, category: payload.category || "Новини",
            imageUrl: uploaded?.mimeType.startsWith("image/") ? uploaded.url : "",
            imageAlt: payload.title || draft.title, status: "draft", featured: false, publishedAt: null,
          }),
        });
        const result = await response.json() as { error?: string };
        if (!response.ok) throw new Error(result.error || "Не вдалося зберегти матеріал");
        setMessage("Матеріал збережено як чернетку в розділі «Новини». Відкрийте його у списку матеріалів для фінальної публікації.");
      } else if (target === "document") {
        if (!uploaded) throw new Error("Не вдалося зберегти вихідний файл. Спробуйте завантажити PDF або Word ще раз.");
        const payload = draftRecordToPayload(records[0]);
        const response = await fetch("/api/documents", {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({
            title: payload.title || draft.title, description: payload.description || draft.summary,
            category: payload.category || "Офіційний документ", pagePath,
            fileUrl: uploaded.url, fileName: uploaded.fileName, mimeType: uploaded.mimeType,
            fileSize: uploaded.fileSize, status: "draft", sortOrder: Date.now(),
          }),
        });
        const result = await response.json() as { error?: string };
        if (!response.ok) throw new Error(result.error || "Не вдалося зберегти документ");
        setMessage("Документ збережено як чернетку. У розділі «Документи» можна ще раз перевірити картку та опублікувати її.");
      } else {
        const contentKind = config.contentKind;
        if (!contentKind) throw new Error("Для цього розділу не налаштовано публікацію");
        for (let index = 0; index < records.length; index += 1) {
          const payload = draftRecordToPayload(records[index]);
          if (uploaded) {
            payload.sourceFileUrl = uploaded.url; payload.sourceFileName = uploaded.fileName;
            if (target === "student_thesis" && !payload.fileUrl) payload.fileUrl = uploaded.url;
          }
          const response = await fetch("/api/content", {
            method: "POST", headers: { "content-type": "application/json" },
            body: JSON.stringify({ kind: contentKind, payload, sortOrder: Date.now() + index }),
          });
          const result = await response.json() as { error?: string };
          if (!response.ok) throw new Error(result.error || `Не вдалося зберегти запис ${index + 1}`);
        }
        setMessage(`${records.length} ${records.length === 1 ? "запис опубліковано" : "записів опубліковано"} у розділі «${config.label}».`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не вдалося зберегти чернетку");
    } finally { setBusy(false); }
  }

  return <section className="ai-editorial" id="ai-import">
    <div className="materials-head ai-editorial-head"><div><span>AI-помічник редакції</span><h2>Файл → готова сторінка</h2><p>Завантажте Word, PDF, текст або фото, вкажіть потрібний розділ — помічник підготує структуру, заголовки й чистий текст для перевірки.</p></div><b>Публікація лише після вашого підтвердження</b></div>
    <form className="ai-import-card" onSubmit={analyze}>
      <div className="ai-import-step"><span>01</span><label>Куди додати матеріал<select value={target} onChange={(event) => chooseTarget(event.target.value as EditorialDraftTarget)}>{availableTargets.map((entry) => <option value={entry.id} key={entry.id}>{entry.label}</option>)}</select><small>{config.description}</small></label></div>
      {target === "document" && <div className="ai-import-step"><span>02</span><label>На яку сторінку<select value={pagePath} onChange={(event) => setPagePath(event.target.value)}>{pageOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label></div>}
      <div className="ai-import-step"><span>{target === "document" ? "03" : "02"}</span><label className="ai-file-picker"><b>{file ? file.name : "Оберіть файл"}</b><small>{file ? `${(file.size / 1024 / 1024).toFixed(1)} МБ` : "PDF, DOCX, TXT, JPG, PNG або WebP · до 12 МБ"}</small><input required type="file" accept=".pdf,.docx,.txt,.jpg,.jpeg,.png,.webp" disabled={busy} onChange={(event) => { setFile(event.target.files?.[0] || null); setDraft(null); }} /></label></div>
      <div className="ai-import-step ai-import-note"><span>{target === "document" ? "04" : "03"}</span><label>Поясніть, що і де потрібно<textarea rows={4} value={instruction} onChange={(event) => setInstruction(event.target.value)} placeholder="Наприклад: це оголошення про конкурс; кожну посаду зробити окремою карткою, дедлайн показати зверху." /></label></div>
      <button className="ai-analyze" type="submit" disabled={busy || !file}>{busy ? "Готуємо чернетку…" : "Підготувати з AI →"}</button>
    </form>
    {message && <div className="ai-editorial-message" aria-live="polite">{message}</div>}
    {draft && <div className="ai-draft">
      <header><div><span>{draft.usedAi ? "AI-чернетка" : "Чернетка з розпізнаного тексту"}</span><h3>Перевірте перед публікацією</h3></div><b>{draft.records.length} {draft.records.length === 1 ? "запис" : "записів"}</b></header>
      {draft.warnings.length > 0 && <div className="ai-warnings"><b>Потрібна увага</b><ul>{draft.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>}
      <div className="ai-draft-overview"><label>Заголовок чернетки<input value={draft.title} onChange={(event) => changeDraft("title", event.target.value)} /></label><label>Короткий опис<textarea rows={3} value={draft.summary} onChange={(event) => changeDraft("summary", event.target.value)} /></label></div>
      <div className="ai-records">{draft.records.map((record, recordIndex) => <article key={recordIndex}><header><b>{String(recordIndex + 1).padStart(2, "0")} / {config.label}</b>{draft.records.length > 1 && <button type="button" onClick={() => removeRecord(recordIndex)}>Прибрати</button>}</header><div>{config.fields.map((field) => {
        const value = record.fields.find((item) => item.key === field.key)?.value || "";
        return <label className={field.type === "textarea" ? "wide" : ""} key={field.key}>{field.label}{field.type === "textarea" ? <textarea rows={4} value={value} placeholder={field.placeholder} onChange={(event) => changeRecord(recordIndex, field.key, event.target.value)} /> : <input type={field.type === "date" || field.type === "url" ? field.type : "text"} value={value} placeholder={field.placeholder} onChange={(event) => changeRecord(recordIndex, field.key, event.target.value)} />}</label>;
      })}</div></article>)}</div>
      <div className="ai-draft-actions"><button type="button" onClick={addRecord}>+ Додати запис</button><p>AI не публікує самостійно. Натискаючи кнопку праворуч, редактор підтверджує перевірений результат.</p><button className="primary" type="button" disabled={busy} onClick={() => void publish()}>{target === "news" || target === "document" ? "Зберегти як чернетку" : `Опублікувати ${draft.records.length} →`}</button></div>
    </div>}
  </section>;
}
