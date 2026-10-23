"use client";

import { useEffect, useMemo, useState } from "react";
import type { PageDocument } from "@/lib/documents";
import {
  parseScheduleDocumentCategory,
  scheduleCollections,
  scheduleCourses,
  scheduleSemesters,
  scheduleStudyForms,
} from "@/lib/schedule-documents";

type Selection = { formId: string; semesterId: string; courseId: string; specialty: string };

const storageKey = "apsvt-my-schedule-documents";
const initialSelection: Selection = { formId: "full-time", semesterId: "semester-1", courseId: "course-1", specialty: "" };

export function MyScheduleDocuments({ documents }: { documents: PageDocument[] }) {
  const [selection, setSelection] = useState<Selection>(initialSelection);
  const [ready, setReady] = useState(false);
  const structured = useMemo(() => documents.flatMap((document) => {
    const category = parseScheduleDocumentCategory(document.category);
    return category ? [{ document, category }] : [];
  }), [documents]);
  const specialties = useMemo(() => [...new Set(structured.map(({ category }) => category.specialty).filter(Boolean))].sort((a, b) => a.localeCompare(b, "uk")), [structured]);

  /* eslint-disable react-hooks/set-state-in-effect -- restore a device-only schedule preference after hydration. */
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || "null") as Partial<Selection> | null;
      if (saved && scheduleStudyForms.some((item) => item.id === saved.formId)
        && scheduleSemesters.some((item) => item.id === saved.semesterId)
        && scheduleCourses.some((item) => item.id === saved.courseId)) {
        setSelection({ formId: saved.formId!, semesterId: saved.semesterId!, courseId: saved.courseId!, specialty: typeof saved.specialty === "string" ? saved.specialty : "" });
      }
    } catch {
      // Ignore outdated or malformed local preferences.
    }
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(selection));
    } catch {
      // Schedule remains usable when browser storage is unavailable.
    }
  }, [ready, selection]);

  function update(value: Partial<Selection>) {
    setSelection((current) => ({ ...current, ...value }));
  }

  const matches = structured.filter(({ category }) =>
    category.formId === selection.formId
    && category.semesterId === selection.semesterId
    && category.courseId === selection.courseId
    && (!selection.specialty || !category.specialty || category.specialty === selection.specialty));

  return <section className="my-schedule-documents" id="my-schedule">
    <div className="wrap">
      <div className="my-schedule-head"><div><span className="idx">Швидкий доступ</span><h2>Мій розклад</h2><p>Оберіть форму та курс один раз. Вибір збережеться лише в цьому браузері; обліковий запис і персональні дані не потрібні.</p></div><a href="#documents-by-course">Усі графіки й розклади ↓</a></div>
      <div className="my-schedule-controls">
        <label>Форма навчання<select value={selection.formId} onChange={(event) => update({ formId: event.target.value })}>{scheduleStudyForms.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
        <label>Семестр<select value={selection.semesterId} onChange={(event) => update({ semesterId: event.target.value })}>{scheduleSemesters.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
        <label>Курс<select value={selection.courseId} onChange={(event) => update({ courseId: event.target.value })}>{scheduleCourses.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
        {specialties.length > 0 && <label>Спеціальність<select value={selection.specialty} onChange={(event) => update({ specialty: event.target.value })}><option value="">Усі спеціальності</option>{specialties.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>}
      </div>
      <div className="my-schedule-results" aria-live="polite">
        {ready && matches.length > 0 ? scheduleCollections.map((collection) => {
          const files = matches.filter(({ category }) => category.collectionId === collection.id);
          if (!files.length) return null;
          return <div className="my-schedule-group" key={collection.id}><h3>{collection.label}</h3><div>{files.map(({ document, category }) => <a href={document.fileUrl} target="_blank" rel="noreferrer" key={document.id}><b>{document.title}</b><span>{category.specialty || "Для обраного курсу"} · {new Date(document.updatedAt).toLocaleDateString("uk-UA")}</span><strong>Відкрити файл ↗</strong></a>)}</div></div>;
        }) : <p>{ready ? "Для обраного курсу файлів поки немає. Перевірте іншу форму або семестр; навчальний відділ може ще оновлювати розклад." : "Завантажуємо ваш вибір…"}</p>}
      </div>
    </div>
  </section>;
}
