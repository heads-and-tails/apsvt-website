"use client";

import { useId, useRef } from "react";
import { TeacherResumeText } from "@/app/components/TeacherResume";

export function TeacherResumeEditor({ value, onChange, label = "Резюме та наукові профілі", helpText = "Наукова біографія, освіта, наукові інтереси, вибрані публікації, монографії, підвищення кваліфікації та посилання на ORCID, Google Scholar, Scopus і Web of Science.", placeholder = "## Освіта\n\nВставте відомості з резюме викладача…\n\n## Наукові профілі\n\n[ORCID](https://orcid.org/…)", previewLabel = "Попередній перегляд резюме" }: { value: string; onChange: (value: string) => void; label?: string; helpText?: string; placeholder?: string; previewLabel?: string }) {
  const id = useId();
  const input = useRef<HTMLTextAreaElement>(null);

  function insert(before: string, after = "", placeholder = "Текст", block = false) {
    const field = input.current;
    if (!field) return;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const prefix = block && start > 0 && value[start - 1] !== "\n" ? "\n\n" : "";
    const suffix = block && end < value.length && value[end] !== "\n" ? "\n\n" : "";
    onChange(value.slice(0, start) + prefix + before + selected + after + suffix + value.slice(end));
    requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(start + prefix.length + before.length, start + prefix.length + before.length + selected.length);
    });
  }

  return <div className="wide teacher-resume-editor">
    <label htmlFor={id}>{label}</label>
    <p id={`${id}-help`}>{helpText}</p>
    <div className="teacher-resume-toolbar" role="group" aria-label={`Форматування: ${label}`}>
      <button type="button" onClick={() => insert("## ", "", "Назва розділу", true)}>Заголовок</button>
      <button type="button" onClick={() => insert("**", "**")}>Жирний</button>
      <button type="button" onClick={() => insert("- ", "", "Пункт списку", true)}>Список</button>
      <button type="button" onClick={() => insert("1. ", "", "Пункт списку", true)}>Нумерований список</button>
      <button type="button" onClick={() => insert("[", "](https://)", "Назва профілю")}>Посилання</button>
    </div>
    <textarea ref={input} id={id} rows={14} value={value} aria-describedby={`${id}-help ${id}-format`} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    <p id={`${id}-format`}>Виділіть текст і натисніть кнопку форматування. Для посилання замініть https:// у дужках на повну адресу. Звичайні адреси https:// також стануть активними. Порожнє поле не відображатиметься на сайті.</p>
    <details className="teacher-resume-preview"><summary>{previewLabel}</summary>{value.trim() ? <TeacherResumeText text={value} /> : <p>Додайте текст, щоб побачити попередній перегляд.</p>}</details>
  </div>;
}
