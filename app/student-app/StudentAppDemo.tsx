"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./StudentAppDemo.module.css";

export type DemoLesson = {
  id: string;
  kind: "lesson" | "exam";
  date: string;
  day: string;
  time: string;
  course: string;
  type: string;
  group: string;
  faculty: string;
  teacher: string;
  room: string;
  onlineLink: string;
  period: string;
};

type Tab = "today" | "schedule" | "settings";

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: "today", icon: "●", label: "Сьогодні" },
  { id: "schedule", icon: "▦", label: "Розклад" },
  { id: "settings", icon: "⚙", label: "Налаштування" },
];

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "uk"));
}

function parseDate(value: string): number {
  const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])).getTime();
  const local = value.match(/^(\d{1,2})[./](\d{1,2})(?:[./](\d{4}))?/);
  if (!local) return 0;
  return new Date(Number(local[3] || new Date().getFullYear()), Number(local[2]) - 1, Number(local[1])).getTime();
}

function LessonCard({ lesson, onJoin }: { lesson: DemoLesson; onJoin: (lesson: DemoLesson) => void }) {
  const online = Boolean(lesson.onlineLink) || lesson.room.toLowerCase().includes("онлайн");
  return <article className={`${styles.lessonCard} ${lesson.kind === "exam" ? styles.examCard : ""}`}>
    <div className={styles.lessonTime}><b>{lesson.time.split(/[–—-]/)[0]}</b><i /></div>
    <div className={styles.lessonBody}>
      <div className={styles.lessonMeta}><span>{lesson.type}</span>{online && <em>Online</em>}</div>
      <h4>{lesson.course}</h4>
      <p>{lesson.teacher}</p>
      <div className={styles.lessonPlace}>
        <b>{online ? "Онлайн" : `Ауд. ${lesson.room}`}</b>
        {lesson.onlineLink
          ? <a href={lesson.onlineLink} target="_blank" rel="noreferrer">Приєднатися ↗</a>
          : online && <button type="button" onClick={() => onJoin(lesson)}>Як працює посилання</button>}
      </div>
    </div>
  </article>;
}

export function StudentAppDemo({ lessons }: { lessons: DemoLesson[] }) {
  const faculties = useMemo(() => unique(lessons.map((lesson) => lesson.faculty)), [lessons]);
  const [faculty, setFaculty] = useState(faculties[0] || "АПСВТ");
  const availableGroups = useMemo(() => unique(lessons.filter((lesson) => lesson.faculty === faculty).map((lesson) => lesson.group)), [faculty, lessons]);
  const [group, setGroup] = useState(availableGroups[0] || "1 курс");
  const [tab, setTab] = useState<Tab>("today");
  const [selectedDate, setSelectedDate] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [reminder, setReminder] = useState(15);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem("apsvt-app-demo");
    if (!stored) return;
    try {
      const value = JSON.parse(stored) as { faculty?: string; group?: string; reminder?: number; notifications?: boolean };
      if (value.faculty && faculties.includes(value.faculty)) setFaculty(value.faculty);
      if (value.group) setGroup(value.group);
      if (value.reminder) setReminder(value.reminder);
      if (typeof value.notifications === "boolean") setNotifications(value.notifications);
    } catch {
      // Ignore malformed local demo preferences.
    }
  }, [faculties]);

  useEffect(() => {
    window.localStorage.setItem("apsvt-app-demo", JSON.stringify({ faculty, group, reminder, notifications }));
  }, [faculty, group, reminder, notifications]);

  useEffect(() => {
    if (!availableGroups.includes(group)) setGroup(availableGroups[0] || "");
  }, [availableGroups, group]);

  const filtered = useMemo(() => lessons
    .filter((lesson) => lesson.faculty === faculty && lesson.group === group)
    .sort((a, b) => parseDate(a.date) - parseDate(b.date) || a.time.localeCompare(b.time, "uk")), [faculty, group, lessons]);
  const dates = useMemo(() => unique(filtered.map((lesson) => lesson.date)).sort((a, b) => parseDate(a) - parseDate(b)), [filtered]);
  const activeDate = dates.includes(selectedDate) ? selectedDate : dates[0] || "";
  const dayLessons = filtered.filter((lesson) => lesson.date === activeDate);
  const nextLesson = dayLessons[0] || filtered[0];

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3600);
  }

  async function testNotification() {
    if (!("Notification" in window)) {
      showToast("Цей браузер не підтримує системні сповіщення.");
      return;
    }
    const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
    if (permission === "granted") {
      const lesson = nextLesson;
      new Notification(`Пара через ${reminder} хв`, {
        body: lesson ? `${lesson.course} · ${lesson.time} · ${lesson.room}` : "Демо нагадування АПСВТ",
        icon: "/favicon.svg",
      });
      showToast("Демо-сповіщення надіслано.");
    } else {
      showToast("Дозвіл на сповіщення не надано.");
    }
  }

  function explainJoin(lesson: DemoLesson) {
    showToast(`Редакція додасть захищене посилання для «${lesson.course}» — у застосунку воно відкриється одним дотиком.`);
  }

  return <div className={styles.demoLayout}>
    <aside className={styles.demoCopy}>
      <div className={styles.index}>01 / Живе демо</div>
      <h2>Спробуйте<br />як студент.</h2>
      <p>Усі кнопки всередині телефона працюють. Змініть групу, відкрийте тиждень або надішліть собі тестове браузерне сповіщення.</p>
      <div className={styles.dataStatus}><i /><div><b>З’єднано з редакційною панеллю</b><span>{lessons.length} опублікованих занять та іспитів</span></div></div>
      <ul>
        <li><span>01</span>Оберіть вкладку «Налаштування».</li>
        <li><span>02</span>Змініть факультет або групу.</li>
        <li><span>03</span>Протестуйте нагадування.</li>
      </ul>
    </aside>

    <div className={styles.phoneStage}>
      <div className={styles.phone}>
        <div className={styles.phoneTop}><span>09:41</span><i /><b>● )))</b></div>
        <div className={styles.phoneScreen}>
          {tab === "today" && <div className={styles.screenContent}>
            <header className={styles.appHeader}>
              <div className={styles.appBrand}><span className={styles.appMark}><i /><i /><i /><i /></span><div><b>АПСВТ</b><small>Студентський розклад</small></div></div>
              <span className={styles.avatar}>СТ</span>
            </header>
            <div className={styles.greeting}><span>Ваш навчальний день</span><h3>Вітаємо!</h3><p>{group} · {faculty}</p></div>
            <div className={styles.dateStrip}>
              {dates.slice(0, 5).map((date, index) => <button type="button" className={date === activeDate ? styles.activeDate : ""} onClick={() => setSelectedDate(date)} key={date}><span>{["ПН", "ВТ", "СР", "ЧТ", "ПТ"][index] || "ДН"}</span><b>{date.match(/^\d{1,2}/)?.[0] || String(index + 1).padStart(2, "0")}</b></button>)}
            </div>
            <section className={styles.nextCard}>
              <div><span>Наступне заняття</span><b>{activeDate || "Дата уточнюється"}</b></div>
              {nextLesson ? <><time>{nextLesson.time}</time><h4>{nextLesson.course}</h4><p>{nextLesson.type} / {nextLesson.onlineLink ? "Онлайн" : nextLesson.room}</p></> : <h4>Для цієї групи розклад ще не опубліковано</h4>}
              <i />
            </section>
            <div className={styles.dailyHead}><div><span>{activeDate}</span><h3>Розклад дня</h3></div><button type="button" onClick={() => setTab("schedule")}>Увесь →</button></div>
            <div className={styles.lessonList}>{dayLessons.length ? dayLessons.map((lesson) => <LessonCard lesson={lesson} onJoin={explainJoin} key={lesson.id} />) : <div className={styles.emptyDay}>Занять для обраної групи немає.</div>}</div>
          </div>}

          {tab === "schedule" && <div className={styles.screenContent}>
            <div className={styles.innerHead}><span>Академічний тиждень</span><h3>Мій розклад</h3><p>{group} · {faculty}</p></div>
            <div className={styles.scheduleDays}>{dates.length ? dates.map((date) => {
              const entries = filtered.filter((lesson) => lesson.date === date);
              return <section key={date}><header><div><b>{entries[0]?.day || "Навчальний день"}</b><span>{date}</span></div><strong>{String(entries.length).padStart(2, "0")}</strong></header><div className={styles.lessonList}>{entries.map((lesson) => <LessonCard lesson={lesson} onJoin={explainJoin} key={lesson.id} />)}</div></section>;
            }) : <div className={styles.emptyDay}>Оберіть іншу групу — для цієї розклад ще не опубліковано.</div>}</div>
          </div>}

          {tab === "settings" && <div className={styles.screenContent}>
            <div className={styles.innerHead}><span>Персоналізація</span><h3>Налаштування</h3><p>Показуємо лише потрібні заняття.</p></div>
            <section className={styles.settingsCard}><span>01 / Навчання</span><label>Факультет<select value={faculty} onChange={(event) => setFaculty(event.target.value)}>{faculties.map((item) => <option key={item}>{item}</option>)}</select></label><label>Курс / група<select value={group} onChange={(event) => setGroup(event.target.value)}>{availableGroups.map((item) => <option key={item}>{item}</option>)}</select></label></section>
            <section className={styles.settingsCard}><span>02 / Нагадування</span><div className={styles.toggleRow}><div><b>Сповіщення про пари</b><small>Час, аудиторія та онлайн-посилання.</small></div><button type="button" className={notifications ? styles.toggleOn : ""} aria-label="Увімкнути сповіщення" aria-pressed={notifications} onClick={() => setNotifications((value) => !value)}><i /></button></div><label>Нагадати за<div className={styles.reminderChoices}>{[10, 15, 30].map((value) => <button type="button" className={reminder === value ? styles.selectedChoice : ""} onClick={() => setReminder(value)} key={value}>{value} хв</button>)}</div></label><button type="button" className={styles.testButton} disabled={!notifications} onClick={() => void testNotification()}>Надіслати демо-сповіщення <b>↗</b></button></section>
          </div>}
        </div>
        <nav className={styles.appTabs} aria-label="Навігація демо-застосунку">{tabs.map((item) => <button type="button" className={tab === item.id ? styles.activeTab : ""} onClick={() => setTab(item.id)} key={item.id}><span>{item.icon}</span><b>{item.label}</b></button>)}</nav>
        {toast && <div className={styles.toast} role="status">{toast}</div>}
      </div>
    </div>
  </div>;
}
