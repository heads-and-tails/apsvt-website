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
const weekdays = ["Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця", "Субота", "Неділя"];

function lessonDate(value: string): Date | null {
  const match = value.match(/(\d{1,2})[./](\d{1,2})(?:[./](\d{4}))?/);
  if (!match) return null;
  return new Date(Date.UTC(Number(match[3] || "2026"), Number(match[2]) - 1, Number(match[1])));
}

function dateKey(value: string): number {
  return lessonDate(value)?.getTime() || 0;
}

function weekKey(value: string): string {
  const date = lessonDate(value);
  if (!date) return "Без визначеного тижня";
  const monday = new Date(date);
  const day = monday.getUTCDay();
  monday.setUTCDate(monday.getUTCDate() - (day === 0 ? 6 : day - 1));
  return monday.toISOString().slice(0, 10);
}

function options(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "uk"));
}

function weekLabel(lessons: Lesson[]): string {
  const dated = lessons.filter((lesson) => lessonDate(lesson.date)).sort((a, b) => dateKey(a.date) - dateKey(b.date));
  if (!dated.length) return "Тиждень без визначених дат";
  return dated[0].date === dated.at(-1)?.date ? dated[0].date : `${dated[0].date} – ${dated.at(-1)?.date}`;
}

function LessonCard({ lesson }: { lesson: Lesson }) {
  return <article className="schedule-entry">
    <strong>{lesson.course}</strong>
    <span>{[lesson.type, lesson.group].filter(Boolean).join(" · ")}</span>
    <small>{lesson.teacher}</small>
    {lesson.program && <small>{lesson.program}</small>}
    {lesson.onlineLink
      ? <a className="room online-link" href={lesson.onlineLink} target="_blank" rel="noreferrer">Приєднатися ↗</a>
      : <em className={lesson.room.toLowerCase().includes("онлайн") ? "room online" : "room"}>{lesson.room}</em>}
  </article>;
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

  const weeks = useMemo(() => {
    const grouped = new Map<string, Lesson[]>();
    filtered.forEach((lesson) => grouped.set(weekKey(lesson.date), [...(grouped.get(weekKey(lesson.date)) || []), lesson]));
    return [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, entries]) => ({ key, entries }));
  }, [filtered]);

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
      <label>День<select data-testid="schedule-day-filter" value={day} onChange={(event) => setDay(event.target.value)}><option value={allValue}>Усі дні</option>{weekdays.map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>

    {weeks.length > 0 ? <div className="schedule-weeks">
      {weeks.map((week) => {
        const visibleDays = day === allValue
          ? weekdays.filter((weekday) => week.entries.some((lesson) => lesson.day === weekday))
          : [day];
        const times = options(week.entries.map((lesson) => lesson.time)).sort((a, b) => a.localeCompare(b));
        const dates = new Map(week.entries.map((lesson) => [lesson.day, lesson.date]));
        return <section className="schedule-week" key={week.key}>
          <div className="schedule-week-heading"><span>Навчальний тиждень</span><b>{weekLabel(week.entries)}</b></div>
          <div className="weekly-schedule-wrap">
            <table className={`weekly-schedule ${visibleDays.length === 1 ? "single-day" : ""}`}>
              <thead><tr><th>Час</th>{visibleDays.map((weekday) => <th key={weekday}><span>{weekday}</span><small>{dates.get(weekday) || "—"}</small></th>)}</tr></thead>
              <tbody>{times.map((time) => <tr key={time}>
                <th><b>{time}</b></th>
                {visibleDays.map((weekday) => {
                  const entries = week.entries.filter((lesson) => lesson.day === weekday && lesson.time === time);
                  return <td key={weekday}>{entries.length
                    ? entries.map((lesson, index) => <LessonCard lesson={lesson} key={`${lesson.sourceFile || "schedule"}-${lesson.date}-${lesson.course}-${index}`} />)
                    : <span className="schedule-free">—</span>}</td>;
                })}
              </tr>)}</tbody>
            </table>
          </div>

          <div className="schedule-mobile-days">
            {visibleDays.map((weekday) => {
              const entries = week.entries.filter((lesson) => lesson.day === weekday).sort((a, b) => a.time.localeCompare(b.time));
              if (!entries.length) return null;
              return <section className="schedule-mobile-day" key={weekday}>
                <header><div><span>{weekday}</span><small>{dates.get(weekday)}</small></div><b>{entries.length} {entries.length === 1 ? "пара" : "пари"}</b></header>
                {entries.map((lesson, index) => <div className="schedule-mobile-row" key={`${lesson.date}-${lesson.time}-${lesson.course}-${index}`}>
                  <time>{lesson.time}</time>
                  <div data-label="Дисципліна"><LessonCard lesson={lesson} /></div>
                </div>)}
              </section>;
            })}
          </div>
        </section>;
      })}
    </div> : <p className="schedule-empty">Для обраних фільтрів занять не знайдено.</p>}
  </div>;
}
