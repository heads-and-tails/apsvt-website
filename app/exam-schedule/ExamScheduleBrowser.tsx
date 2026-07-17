"use client";

import { useMemo, useState } from "react";

const exams = [
  { date: "14.12.2026", time: "10:00", faculty: "Економіка і туризм", group: "1 курс", course: "Економічна теорія", form: "Іспит", teacher: "І. Чорнодід", room: "305" },
  { date: "16.12.2026", time: "10:00", faculty: "Право", group: "1 курс", course: "Теорія держави і права", form: "Іспит", teacher: "Я. Журавель", room: "118" },
  { date: "17.12.2026", time: "12:00", faculty: "Економіка і туризм", group: "2 курс", course: "Маркетингові дослідження", form: "Залік", teacher: "Н. Писаренко", room: "311" },
  { date: "18.12.2026", time: "10:00", faculty: "Право", group: "2 курс", course: "Цивільне право", form: "Іспит", teacher: "Г. Муляр", room: "201" },
  { date: "21.12.2026", time: "10:00", faculty: "Економіка і туризм", group: "2 курс", course: "Психодіагностика", form: "Іспит", teacher: "Г. Пріб", room: "407" },
  { date: "22.12.2026", time: "12:00", faculty: "Право", group: "3 курс", course: "Кримінальний процес", form: "Іспит", teacher: "І. Діордіца", room: "Зала суду" },
  { date: "23.12.2026", time: "10:00", faculty: "Економіка і туризм", group: "3 курс", course: "Управління проєктами", form: "Залік", teacher: "Н. Василець", room: "305" },
  { date: "28.12.2026", time: "10:00", faculty: "Економіка і туризм", group: "3 курс", course: "Фінансовий аналіз", form: "Іспит", teacher: "Я. Ткаченко", room: "онлайн" },
];
export function ExamScheduleBrowser() {
  const [faculty, setFaculty] = useState("Усі факультети");
  const [group, setGroup] = useState("Усі курси");
  const filtered = useMemo(() => exams.filter((exam) => (faculty === "Усі факультети" || exam.faculty === faculty) && (group === "Усі курси" || exam.group === group)), [faculty, group]);
  return <div className="schedule-browser exam-browser"><div className="schedule-controls two"><label>Факультет<select value={faculty} onChange={(event) => setFaculty(event.target.value)}><option>Усі факультети</option><option>Економіка і туризм</option><option>Право</option></select></label><label>Курс<select value={group} onChange={(event) => setGroup(event.target.value)}><option>Усі курси</option><option>1 курс</option><option>2 курс</option><option>3 курс</option></select></label></div><div className="schedule-table-wrap"><table className="schedule-table"><thead><tr><th>Дата</th><th>Час</th><th>Дисципліна</th><th>Контроль</th><th>Курс</th><th>Викладач</th><th>Місце</th></tr></thead><tbody>{filtered.map((exam) => <tr key={`${exam.date}-${exam.course}`}><td><b>{exam.date}</b></td><td className="time-cell">{exam.time}</td><td><strong>{exam.course}</strong><small>{exam.faculty}</small></td><td><span className={exam.form === "Іспит" ? "lesson-type exam" : "lesson-type"}>{exam.form}</span></td><td>{exam.group}</td><td>{exam.teacher}</td><td><em className={exam.room === "онлайн" ? "room online" : "room"}>{exam.room}</em></td></tr>)}</tbody></table></div></div>;
}
