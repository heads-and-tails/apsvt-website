import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { getPublicContent } from "@/lib/content";
import { StudentAppDemo, type DemoLesson } from "./StudentAppDemo";

export const metadata: Metadata = {
  title: "Демо студентського застосунку",
  description: "Інтерактивне демо мобільного розкладу АПСВТ із фільтрами групи, нагадуваннями та посиланнями на онлайн-заняття.",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const [lessonItems, examItems] = await Promise.all([getPublicContent("lesson"), getPublicContent("exam")]);
  const lessons: DemoLesson[] = [...lessonItems, ...examItems].map((item) => ({
    id: item.id,
    kind: item.kind as "lesson" | "exam",
    date: item.payload.date || "",
    day: item.payload.day || "",
    time: item.payload.time || "",
    course: item.payload.course || "Заняття",
    type: item.kind === "exam" ? item.payload.form || "Іспит" : item.payload.type || "Заняття",
    group: item.payload.group || "Усі групи",
    faculty: item.payload.faculty || "АПСВТ",
    teacher: item.payload.teacher || "Викладач уточнюється",
    room: item.payload.room || (item.payload.onlineLink ? "Онлайн" : "Уточнюється"),
    onlineLink: item.payload.onlineLink || "",
    period: item.payload.period || "",
  }));

  return <main id="top" className="student-app-page">
    <SiteHeader />
    <section className="phero student-app-hero">
      <div className="wrap">
        <div className="crumb">Головна / Студенту / Мобільний застосунок</div>
        <div className="student-app-hero-grid">
          <div>
            <span className="student-app-beta">Interactive demo · iOS + Android</span>
            <h1>Розклад<br />у кишені.</h1>
            <p className="lead">Оберіть групу, перегляньте день і протестуйте нагадування. Для персональних нарахувань, оплат і договорів використовуйте захищений особистий кабінет.</p>
            <Link className="cta" href="/student"><span>Увійти до особистого кабінету</span></Link>
          </div>
          <div className="student-app-hero-note">
            <span>01</span>
            <p>Це браузерне демо майбутнього мобільного застосунку. Воно не встановлює нічого на ваш пристрій.</p>
          </div>
        </div>
      </div>
    </section>
    <div className="phero-rule" />

    <section className="student-app-demo-section">
      <div className="wrap">
        <StudentAppDemo lessons={lessons} />
      </div>
    </section>

    <section className="soft student-app-flow">
      <div className="wrap">
        <div className="sec-head">
          <div><div className="idx">02 / Як це працює</div><h2>Один розклад.<br />Три прості дії.</h2></div>
          <p>Редакція публікує пару — студент одразу бачить час, аудиторію або онлайн-посилання.</p>
        </div>
        <div className="student-app-steps">
          <article><span>01</span><h3>Оберіть групу</h3><p>Факультет і курс зберігаються на пристрої, тому зайві пари не заважають.</p></article>
          <article><span>02</span><h3>Отримайте нагадування</h3><p>Застосунок попереджає за 10, 15 або 30 хвилин до початку.</p></article>
          <article><span>03</span><h3>Приєднайтеся онлайн</h3><p>Посилання з редакційної панелі відкривається прямо з картки заняття.</p></article>
        </div>
      </div>
    </section>

    <section className="student-app-cta">
      <div className="wrap">
        <div><span>Особисті сервіси</span><h2>Оплата, договори<br />та розклад.</h2></div>
        <div className="student-app-cta-actions"><Link className="cta" href="/student"><span>Особистий кабінет</span></Link><Link className="cta ghost" href="/schedule"><span>Відкрити розклад</span></Link></div>
      </div>
    </section>
    <SiteFooter />
  </main>;
}
