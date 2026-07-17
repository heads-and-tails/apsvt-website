"use client";

import { useMemo, useState } from "react";

const lessons = [
  { day: "Понеділок", time: "09:00–10:20", course: "Іноземна мова", group: "1 курс", faculty: "Економіка і туризм", room: "Ауд. 214" },
  { day: "Понеділок", time: "10:35–11:55", course: "Основи менеджменту", group: "1 курс", faculty: "Економіка і туризм", room: "Ауд. 305" },
  { day: "Понеділок", time: "12:20–13:40", course: "Теорія держави і права", group: "1 курс", faculty: "Право", room: "Ауд. 118" },
  { day: "Вівторок", time: "09:00–10:20", course: "Маркетингові дослідження", group: "2 курс", faculty: "Економіка і туризм", room: "Ауд. 311" },
  { day: "Вівторок", time: "12:20–13:40", course: "Цивільне право", group: "2 курс", faculty: "Право", room: "Ауд. 201" },
  { day: "Середа", time: "10:35–11:55", course: "Психодіагностика", group: "2 курс", faculty: "Економіка і туризм", room: "Лаб. 407" },
  { day: "Середа", time: "14:00–15:20", course: "Кримінальний процес", group: "3 курс", faculty: "Право", room: "Зала судових засідань" },
  { day: "Четвер", time: "09:00–10:20", course: "Управління проєктами", group: "3 курс", faculty: "Економіка і туризм", room: "Ауд. 305" },
  { day: "Четвер", time: "12:20–13:40", course: "Юридична клініка", group: "3 курс", faculty: "Право", room: "Клініка" },
  { day: "П’ятниця", time: "10:35–11:55", course: "Соціальна політика", group: "1 курс", faculty: "Економіка і туризм", room: "Ауд. 216" },
];
const days = ["Усі дні", "Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця"];

export function ScheduleBrowser() {
  const [faculty, setFaculty] = useState("Усі факультети");
  const [group, setGroup] = useState("Усі курси");
  const [day, setDay] = useState("Усі дні");
  const filtered = useMemo(() => lessons.filter((lesson) => (faculty === "Усі факультети" || lesson.faculty === faculty) && (group === "Усі курси" || lesson.group === group) && (day === "Усі дні" || lesson.day === day)), [faculty, group, day]);
  return <div className="schedule-browser">
    <div className="schedule-controls"><label>Факультет<select value={faculty} onChange={(event) => setFaculty(event.target.value)}><option>Усі факультети</option><option>Економіка і туризм</option><option>Право</option></select></label><label>Курс<select value={group} onChange={(event) => setGroup(event.target.value)}><option>Усі курси</option><option>1 курс</option><option>2 курс</option><option>3 курс</option></select></label><label>День<select value={day} onChange={(event) => setDay(event.target.value)}>{days.map((item) => <option key={item}>{item}</option>)}</select></label></div>
    <div className="schedule-table"><div className="schedule-row head"><span>День</span><span>Час</span><span>Дисципліна</span><span>Група</span><span>Місце</span></div>{filtered.map((lesson) => <article className="schedule-row" key={`${lesson.day}-${lesson.time}-${lesson.course}`}><span data-label="День">{lesson.day}</span><b data-label="Час">{lesson.time}</b><div data-label="Дисципліна"><strong>{lesson.course}</strong><small>{lesson.faculty}</small></div><span data-label="Курс">{lesson.group}</span><em data-label="Місце">{lesson.room}</em></article>)}</div>
    {!filtered.length && <p className="schedule-empty">Для обраних фільтрів занять не знайдено.</p>}
  </div>;
}
