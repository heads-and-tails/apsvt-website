"use client";

import { useMemo, useState } from "react";

export type Exam = { date: string; time: string; faculty: string; group: string; course: string; form: string; teacher: string; room: string };
export function ExamScheduleBrowser({ exams }: { exams: Exam[] }) {
  const [faculty, setFaculty] = useState("Усі факультети");
  const [group, setGroup] = useState("Усі курси");
  const filtered = useMemo(() => exams.filter((exam) => (faculty === "Усі факультети" || exam.faculty === faculty) && (group === "Усі курси" || exam.group === group)), [faculty, group]);
  return <div className="schedule-browser exam-browser"><div className="schedule-controls two"><label>Факультет<select value={faculty} onChange={(event) => setFaculty(event.target.value)}><option>Усі факультети</option><option>Економіка і туризм</option><option>Право</option></select></label><label>Курс<select value={group} onChange={(event) => setGroup(event.target.value)}><option>Усі курси</option><option>1 курс</option><option>2 курс</option><option>3 курс</option></select></label></div><div className="schedule-table-wrap"><table className="schedule-table"><thead><tr><th>Дата</th><th>Час</th><th>Дисципліна</th><th>Контроль</th><th>Курс</th><th>Викладач</th><th>Місце</th></tr></thead><tbody>{filtered.map((exam) => <tr key={`${exam.date}-${exam.course}`}><td data-label="Дата"><b>{exam.date}</b></td><td className="time-cell" data-label="Час">{exam.time}</td><td className="schedule-subject" data-label="Дисципліна"><strong>{exam.course}</strong><small>{exam.faculty}</small></td><td data-label="Контроль"><span className={exam.form === "Іспит" ? "lesson-type exam" : "lesson-type"}>{exam.form}</span></td><td data-label="Курс">{exam.group}</td><td className="schedule-teacher" data-label="Викладач">{exam.teacher}</td><td data-label="Місце"><em className={exam.room === "онлайн" ? "room online" : "room"}>{exam.room}</em></td></tr>)}</tbody></table></div></div>;
}
