"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const lessons = [
  { date: "07.09", day: "Понеділок", time: "09:00–10:20", course: "Іноземна мова", type: "Практичне", group: "1 курс", faculty: "Економіка і туризм", teacher: "О. Мельник", room: "214" },
  { date: "07.09", day: "Понеділок", time: "10:35–11:55", course: "Основи менеджменту", type: "Лекція", group: "1 курс", faculty: "Економіка і туризм", teacher: "Н. Василець", room: "305" },
  { date: "07.09", day: "Понеділок", time: "12:20–13:40", course: "Теорія держави і права", type: "Лекція", group: "1 курс", faculty: "Право", teacher: "Я. Журавель", room: "118" },
  { date: "08.09", day: "Вівторок", time: "09:00–10:20", course: "Маркетингові дослідження", type: "Лабораторне", group: "2 курс", faculty: "Економіка і туризм", teacher: "Н. Писаренко", room: "311" },
  { date: "08.09", day: "Вівторок", time: "10:35–11:55", course: "Фінансовий аналіз", type: "Практичне", group: "3 курс", faculty: "Економіка і туризм", teacher: "Я. Ткаченко", room: "онлайн" },
  { date: "08.09", day: "Вівторок", time: "12:20–13:40", course: "Цивільне право", type: "Семінар", group: "2 курс", faculty: "Право", teacher: "Г. Муляр", room: "201" },
  { date: "09.09", day: "Середа", time: "10:35–11:55", course: "Психодіагностика", type: "Лабораторне", group: "2 курс", faculty: "Економіка і туризм", teacher: "Г. Пріб", room: "407" },
  { date: "09.09", day: "Середа", time: "12:20–13:40", course: "Соціальна політика", type: "Лекція", group: "1 курс", faculty: "Економіка і туризм", teacher: "Н. Балашова", room: "216" },
  { date: "09.09", day: "Середа", time: "14:00–15:20", course: "Кримінальний процес", type: "Практичне", group: "3 курс", faculty: "Право", teacher: "І. Діордіца", room: "Зала суду" },
  { date: "10.09", day: "Четвер", time: "09:00–10:20", course: "Управління проєктами", type: "Практичне", group: "3 курс", faculty: "Економіка і туризм", teacher: "Н. Василець", room: "305" },
  { date: "10.09", day: "Четвер", time: "12:20–13:40", course: "Юридична клініка", type: "Клінічна практика", group: "3 курс", faculty: "Право", teacher: "Я. Журавель", room: "Клініка" },
  { date: "11.09", day: "П’ятниця", time: "10:35–11:55", course: "Економіка підприємства", type: "Лекція", group: "2 курс", faculty: "Економіка і туризм", teacher: "І. Чорнодід", room: "Актова зала" },
];
const days = ["Усі дні", "Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця"];

export function ScheduleBrowser() {
  const [faculty, setFaculty] = useState("Усі факультети");
  const [group, setGroup] = useState("Усі курси");
  const [day, setDay] = useState("Усі дні");
  const [week, setWeek] = useState(0);
  const filtered = useMemo(() => lessons.filter((lesson) => (faculty === "Усі факультети" || lesson.faculty === faculty) && (group === "Усі курси" || lesson.group === group) && (day === "Усі дні" || lesson.day === day)), [faculty, group, day]);
  return <div className="schedule-browser">
    <div className="schedule-toolbar"><div className="week-switch"><button type="button" onClick={() => setWeek((value) => Math.max(-1, value - 1))} aria-label="Попередній тиждень">←</button><div><small>{week === 0 ? "Поточний навчальний тиждень" : week < 0 ? "Попередній тиждень" : "Наступний тиждень"}</small><b>{week === 0 ? "07–11 вересня 2026" : week < 0 ? "31 серпня–04 вересня 2026" : "14–18 вересня 2026"}</b></div><button type="button" onClick={() => setWeek((value) => Math.min(1, value + 1))} aria-label="Наступний тиждень">→</button></div><Link className="session-link" href="/exam-schedule">Графік сесії <b>→</b></Link></div>
    <div className="schedule-controls"><label>Факультет<select value={faculty} onChange={(event) => setFaculty(event.target.value)}><option>Усі факультети</option><option>Економіка і туризм</option><option>Право</option></select></label><label>Курс<select value={group} onChange={(event) => setGroup(event.target.value)}><option>Усі курси</option><option>1 курс</option><option>2 курс</option><option>3 курс</option></select></label><label>День<select value={day} onChange={(event) => setDay(event.target.value)}>{days.map((item) => <option key={item}>{item}</option>)}</select></label></div>
    <div className="schedule-table-wrap"><table className="schedule-table"><thead><tr><th>Дата / день</th><th>Час</th><th>Дисципліна</th><th>Тип</th><th>Курс</th><th>Викладач</th><th>Аудиторія</th></tr></thead><tbody>{filtered.map((lesson) => <tr key={`${lesson.date}-${lesson.time}-${lesson.course}`}><td><b>{lesson.date}</b><small>{lesson.day}</small></td><td className="time-cell">{lesson.time}</td><td><strong>{lesson.course}</strong><small>{lesson.faculty}</small></td><td><span className="lesson-type">{lesson.type}</span></td><td>{lesson.group}</td><td>{lesson.teacher}</td><td><em className={lesson.room === "онлайн" ? "room online" : "room"}>{lesson.room}</em></td></tr>)}</tbody></table></div>
    {!filtered.length && <p className="schedule-empty">Для обраних фільтрів занять не знайдено.</p>}
  </div>;
}
