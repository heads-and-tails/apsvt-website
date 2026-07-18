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
};

const weekdays = ["Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця"];

function LessonCard({ lesson }: { lesson: Lesson }) {
  return <article className="schedule-entry">
    <strong>{lesson.course}</strong>
    <span>{lesson.type} · {lesson.group}</span>
    <small>{lesson.teacher}</small>
    <small>{lesson.faculty}</small>
    <em className={lesson.room === "онлайн" ? "room online" : "room"}>{lesson.room}</em>
  </article>;
}

export function ScheduleBrowser({ lessons }: { lessons: Lesson[] }) {
  const [faculty, setFaculty] = useState("Усі факультети");
  const [group, setGroup] = useState("Усі курси");
  const [day, setDay] = useState("Усі дні");
  const [week, setWeek] = useState(0);

  const filtered = useMemo(
    () => lessons.filter((lesson) =>
      (faculty === "Усі факультети" || lesson.faculty === faculty) &&
      (group === "Усі курси" || lesson.group === group) &&
      (day === "Усі дні" || lesson.day === day)
    ),
    [lessons, faculty, group, day],
  );

  const visibleDays = day === "Усі дні" ? weekdays : [day];
  const times = useMemo(
    () => [...new Set(filtered.map((lesson) => lesson.time))].sort((a, b) => a.localeCompare(b)),
    [filtered],
  );
  const dates = useMemo(
    () => lessons.reduce((result, lesson) => {
      if (!result.has(lesson.day)) result.set(lesson.day, lesson.date);
      return result;
    }, new Map<string, string>()),
    [lessons],
  );

  return <div className="schedule-browser">
    <div className="schedule-toolbar">
      <div className="week-switch">
        <button type="button" onClick={() => setWeek((value) => Math.max(-1, value - 1))} aria-label="Попередній тиждень">←</button>
        <div>
          <small>{week === 0 ? "Поточний навчальний тиждень" : week < 0 ? "Попередній тиждень" : "Наступний тиждень"}</small>
          <b>{week === 0 ? "07–11 вересня 2026" : week < 0 ? "31 серпня–04 вересня 2026" : "14–18 вересня 2026"}</b>
        </div>
        <button type="button" onClick={() => setWeek((value) => Math.min(1, value + 1))} aria-label="Наступний тиждень">→</button>
      </div>
      <Link className="session-link" href="/schedule#session">Графік сесії <b>↓</b></Link>
    </div>

    <div className="schedule-controls">
      <label>Факультет<select value={faculty} onChange={(event) => setFaculty(event.target.value)}><option>Усі факультети</option><option>Економіка і туризм</option><option>Право</option></select></label>
      <label>Курс<select value={group} onChange={(event) => setGroup(event.target.value)}><option>Усі курси</option><option>1 курс</option><option>2 курс</option><option>3 курс</option></select></label>
      <label>День<select data-testid="schedule-day-filter" value={day} onChange={(event) => setDay(event.target.value)}><option>Усі дні</option>{weekdays.map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>

    {!!filtered.length && <>
      <div className="weekly-schedule-wrap">
        <table className={`weekly-schedule ${visibleDays.length === 1 ? "single-day" : ""}`}>
          <thead><tr><th>Час</th>{visibleDays.map((weekday) => <th key={weekday}><span>{weekday}</span><small>{dates.get(weekday) ? `${dates.get(weekday)}.2026` : "—"}</small></th>)}</tr></thead>
          <tbody>{times.map((time) => <tr key={time}>
            <th><b>{time}</b></th>
            {visibleDays.map((weekday) => {
              const entries = filtered.filter((lesson) => lesson.day === weekday && lesson.time === time);
              return <td key={weekday}>{entries.length ? entries.map((lesson) => <LessonCard lesson={lesson} key={`${lesson.date}-${lesson.time}-${lesson.course}`} />) : <span className="schedule-free">—</span>}</td>;
            })}
          </tr>)}</tbody>
        </table>
      </div>

      <div className="schedule-mobile-days">
        {visibleDays.map((weekday) => {
          const entries = filtered.filter((lesson) => lesson.day === weekday).sort((a, b) => a.time.localeCompare(b.time));
          if (!entries.length) return null;
          return <section className="schedule-mobile-day" key={weekday}>
            <header><div><span>{weekday}</span><small>{dates.get(weekday)}.2026</small></div><b>{entries.length} {entries.length === 1 ? "пара" : "пари"}</b></header>
            {entries.map((lesson) => <div className="schedule-mobile-row" key={`${lesson.date}-${lesson.time}-${lesson.course}`}>
              <time>{lesson.time}</time>
              <div data-label="Дисципліна"><LessonCard lesson={lesson} /></div>
            </div>)}
          </section>;
        })}
      </div>
    </>}

    {!filtered.length && <p className="schedule-empty">Для обраних фільтрів занять не знайдено.</p>}
  </div>;
}
