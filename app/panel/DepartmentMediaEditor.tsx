"use client";

import { useState } from "react";
import type { DepartmentImage, DepartmentAttachment } from "@/lib/department-media";
import { uploadEditorialFile } from "@/lib/editorial-upload-client";

type SharedProps = { pagePath: string; disabled: boolean; onBusy: (busy: boolean) => void };

function ImageControls({ image, onChange, onRemove, disabled, portrait }: { image: DepartmentImage; onChange: (value: DepartmentImage) => void; onRemove: () => void; disabled: boolean; portrait?: boolean }) {
  const [size, setSize] = useState("");
  const [failed, setFailed] = useState(false);
  return <article className="editor-media-image">
    <div className={`editor-media-preview${portrait ? " editor-media-preview--portrait" : ""}${image.fit === "cover" ? " editor-media-preview--crop" : ""}`}>
      <img src={image.url} alt={image.alt} style={{ objectFit: image.fit || "contain", objectPosition: `${image.positionX ?? 50}% ${image.positionY ?? 50}%` }} onLoad={(event) => setSize(`${event.currentTarget.naturalWidth} × ${event.currentTarget.naturalHeight} px`)} onError={() => setFailed(true)} />
    </div>
    <div className="editor-media-options">
      <span>{failed ? "Зображення недоступне. Замініть його або приберіть." : size}</span>
      <label>Опис зображення<input disabled={disabled} value={image.alt} onChange={(event) => onChange({ ...image, alt: event.target.value })} /></label>
      <label>Відображення<select disabled={disabled} value={image.fit || "contain"} onChange={(event) => onChange({ ...image, fit: event.target.value as "contain" | "cover" })}><option value="contain">Показати повністю</option><option value="cover">Заповнити блок з кадруванням</option></select></label>
      {image.fit === "cover" && <><label>Кадр ліворуч / праворуч<input aria-label="Горизонтальне положення кадру" type="range" disabled={disabled} min={0} max={100} value={image.positionX ?? 50} onChange={(event) => onChange({ ...image, positionX: Number(event.target.value) })} /></label><label>Кадр вгорі / внизу<input aria-label="Вертикальне положення кадру" type="range" disabled={disabled} min={0} max={100} value={image.positionY ?? 50} onChange={(event) => onChange({ ...image, positionY: Number(event.target.value) })} /></label></>}
      <button type="button" disabled={disabled} onClick={onRemove}>Прибрати фото</button>
    </div>
  </article>;
}

export function DepartmentImageEditor({ value, onChange, defaultAlt, portrait = false, pagePath, disabled, onBusy, existingImages = [] }: SharedProps & { value: DepartmentImage[]; onChange: (value: DepartmentImage[]) => void; defaultAlt: string; portrait?: boolean; existingImages?: DepartmentImage[] }) {
  const [message, setMessage] = useState("");
  async function upload(file: File) {
    setMessage(""); onBusy(true);
    try {
      const result = await uploadEditorialFile(file, "image", pagePath);
      const image: DepartmentImage = { url: result.url, alt: defaultAlt, fit: "contain" };
      onChange(portrait ? [image] : [...value, image]);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Не вдалося завантажити фото"); }
    finally { onBusy(false); }
  }
  return <div className="wide editor-media-images">
    <b>{portrait ? "Фото викладача" : "Зображення матеріалу"}</b>
    {value.map((image, index) => <ImageControls key={`${image.url}-${index}`} image={image} portrait={portrait} disabled={disabled} onChange={(next) => onChange(value.map((item, itemIndex) => itemIndex === index ? next : item))} onRemove={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))} />)}
    <label className="editor-media-upload">{portrait && value.length ? "Замінити фото" : value.length ? "Додати ще фото" : "Додати фото"}<input type="file" disabled={disabled} accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); event.target.value = ""; }} /></label>
    {existingImages.length > 0 && <details className="editor-existing-images"><summary>Раніше завантажені зображення</summary><div>{existingImages.map((image) => <button type="button" key={image.url} disabled={disabled} onClick={() => onChange(portrait ? [{ ...image, fit: "contain" }] : [...value, { ...image, fit: "contain" }])}><img src={image.url} alt={image.alt} /><span>{image.alt || "Обрати зображення"}</span></button>)}</div></details>}
    <small>JPG, PNG або WebP · до 8 МБ. Оригінал зберігається без стиснення. {portrait ? "Для портрета рекомендовано від 800 × 1000 px." : "Для широкого банера рекомендовано від 1600 × 900 px; для афіші — від 1000 px завширшки. Логотипи: PNG або WebP із прозорим тлом."}</small>
    {message && <p role="alert">{message}</p>}
  </div>;
}

export function DepartmentAttachmentEditor({ value, onChange, pagePath, disabled, onBusy }: SharedProps & { value: DepartmentAttachment[]; onChange: (value: DepartmentAttachment[]) => void }) {
  const [message, setMessage] = useState("");
  async function upload(file: File) {
    setMessage(""); onBusy(true);
    try { const result = await uploadEditorialFile(file, "document", pagePath); onChange([...value, { url: result.url, label: result.fileName }]); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Не вдалося завантажити PDF"); }
    finally { onBusy(false); }
  }
  return <div className="wide editor-media-files"><b>Документи PDF</b>
    {value.map((file, index) => <div className="editor-file-row" key={`${file.url}-${index}`}><label>Назва документа<input disabled={disabled} required value={file.label} onChange={(event) => onChange(value.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item))} /></label><a href={file.url} target="_blank" rel="noopener noreferrer">Переглянути ↗</a><button type="button" disabled={disabled} onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}>Прибрати документ</button></div>)}
    <label className="editor-media-upload">Додати PDF<input type="file" disabled={disabled} accept=".pdf,application/pdf" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); event.target.value = ""; }} /></label><small>PDF · до 20 МБ. Назва вище буде текстом посилання на сторінці.</small>
    {message && <p role="alert">{message}</p>}
  </div>;
}
