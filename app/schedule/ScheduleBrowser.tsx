"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type Lesson = {
  date: string;
  day: string;
  time: string;
  course: string;
  type: string;
  group: string;
  faculty: string;
  teacher: string;
  room: string;
  period?: string;
  program?: string;
  studyForm?: string;
  onlineLink?: string;
  sourceFile?: string;
};

const allValue = "Усі";

function dateKey(value: string): number {
  const match = value.match(/(\d{1,2})[./](\d{1,2})(?:[./](\d{4}))?/);
  if (!match) return 0;
  return Number(`${match[3] || "2026"}${match[2].padStart(2, "0")}${match[1].padStart(2, "0")}`);
}

function options(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "uk"));
}

export function ScheduleBrowser({ lessons }: { lessons: Lesson[] }) {
  const periods = useMemo(() => {
    const result = new Map<string, number>();
    lessons.forEach((lesson) => {
      const period = lesson.period || "Поточний навчальний тиждень";
      result.set(period, Math.max(result.get(period) || 0, dateKey(lesson.date)));
    });
    return [...result.entries()].sort((a, b) => b[1] - a[1]).map(([label]) => label);
  }, [lessons]);
  const [period, setPeriod] = useState(periods[0] || allValue);
  const [faculty, setFaculty] = useState(allValue);
  const [group, setGroup] = useState(allValue);
  const [day, setDay] = useState(allValue);

  const filtered = useMemo(
    () => lessons.filter((lesson) =>
      (period === allValue || (lesson.period || "Поточний навчальний тиждень") === period) &&
      (faculty === allValue || lesson.faculty === faculty) &&
      (group === allValue || lesson.group === group) &&
      (day === allValue || lesson.day === day)
    ).sort((a, b) => dateKey(a.date) - dateKey(b.date) || a.time.localeCompare(b.time, "uk")),
    [lessons, period, faculty, group, day],
  );

  return <div className="schedule-browser">
    <div className="schedule-toolbar">
      <div className="schedule-period-current">
        <small>Обраний період</small>
        <b>{period === allValue ? "Усі опубліковані розклади" : period}</b>
        <span>{filtered.length} {filtered.length === 1 ? "заняття" : "занять"}</span>
      </div>
      <Link className="session-link" href="/schedule#session">Графік сесії <b>↓</b></Link>
    </div>

    <div className="schedule-controls four">
      <label>Період<select value={period} onChange={(event) => setPeriod(event.target.value)}><option value={allValue}>Усі періоди</option>{periods.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Факультет<select value={faculty} onChange={(event) => setFaculty(event.target.value)}><option value={allValue}>Усі факультети</option>{options(lessons.map((lesson) => lesson.faculty)).map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Курс / група<select value={group} onChange={(event) => setGroup(event.target.value)}><option value={allValue}>Усі курси й групи</option>{options(lessons.map((lesson) => lesson.group)).map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>День<select data-testid="schedule-day-filter" value={day} onChange={(event) => setDay(event.target.value)}><option value={allValue}>Усі дні</option>{options(lessons.map((lesson) => lesson.day)).map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>

    {filtered.length > 0 ? <div className="schedule-table-wrap">
      <table className="schedule-table">
        <thead><tr><th>Дата</th><th>Час</th><th>Дисципліна</th><th>Курс / група</th><th>Викладач</th><th>Місце</th></tr></thead>
        <tbody>{filtered.map((lesson, index) => <tr key={`${lesson.sourceFile || "schedule"}-${lesson.date}-${lesson.time}-${lesson.course}-${index}`}>
          <td data-label="Дата"><b>{lesson.date}</b><small>{lesson.day}</small></td>
          <td data-label="Час"><b>{lesson.time}</b></td>
          <td className="schedule-subject" data-label="Дисципліна"><strong>{lesson.course}</strong><small>{[lesson.type, lesson.program, lesson.studyForm].filter(Boolean).join(" · ")}</small></td>
          <td data-label="Курс / група"><span>{lesson.group}</span><small>{lesson.faculty}</small></td>
          <td className="schedule-teacher" data-label="Викладач">{lesson.teacher}</td>
          <td data-label="Місце">{lesson.onlineLink
            ? <a className="room online-link" href={lesson.onlineLink} target="_blank" rel="noreferrer">Приєднатися ↗</a>
            : <em className={lesson.room.toLowerCase().includes("онлайн") ? "room online" : "room"}>{lesson.room}</em>}</td>
        </tr>)}</tbody>
      </table>
    </div> : <p className="schedule-empty">Для обраних фільтрів занять не знайдено.</p>}
  </div>;
}
