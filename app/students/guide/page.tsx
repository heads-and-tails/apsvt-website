import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Путівник студента",
  description: "Перші кроки студента АПСВТ: електронний кабінет, розклад, оцінювання, кампус, безпека та контакти.",
};

const firstSteps = [
  ["01", "Студентський квиток", "Після оформлення наказу про зарахування методист факультету повідомить, коли квиток буде готовий."],
  ["02", "Електронний кабінет", "У персональному кабінеті доступні індивідуальний навчальний план, дисципліни та підсумкові оцінки."],
  ["03", "Розклад", "На початку семестру перевіряйте розклад щодня: у перші тижні можливі зміни аудиторій і часу."],
  ["04", "Навчальний календар", "Семестри, сесії, практику й канікули зібрано в актуальному календарі навчального року."],
];

const services = [
  ["Moodle та електронний кабінет", "Навчальні матеріали, завдання, тести та індивідуальний план.", "https://moodle.socosvita.kiev.ua", "Зовнішній сервіс ↗"],
  ["Розклад занять", "Актуальні пари, аудиторії та онлайн-формат.", "/schedule", "Відкрити →"],
  ["Навчальний рік", "Семестри, сесії, практика та канікули.", "/academic-calendar", "Відкрити →"],
  ["Бібліотека", "Читальна зала, електронні ресурси й допомога з літературою.", "/facilities/library", "Відкрити →"],
  ["Гуртожиток", "Умови проживання, розташування та корисна інформація.", "/facilities/dormitory", "Відкрити →"],
  ["Міжнародні можливості", "Проєкти, мобільність, партнерства та навчальні ініціативи.", "/international", "Відкрити →"],
  ["Вартість та оплата", "Актуальна вартість навчання, реквізити й договори.", "/tuition", "Відкрити →"],
  ["Контакти Академії", "Факультети, приймальна комісія та основні канали зв’язку.", "/contacts", "Відкрити →"],
];

const grading = [
  ["90–100", "A", "Відмінно"], ["80–89", "B", "Добре"], ["70–79", "C", "Добре"],
  ["60–69", "D", "Задовільно"], ["50–59", "E", "Задовільно"],
  ["35–49", "FX", "Незадовільно"], ["0–34", "F", "Незадовільно"],
];

export default function Page() {
  return <main id="top"><SiteHeader />
    <section className="resource-hero student-guide-hero"><div className="wrap">
      <div className="crumb">Головна / Студенту / Путівник</div>
      <div className="resource-hero-grid"><div><span className="resource-kicker">Перші кроки в Академії</span><h1>Путівник<br />студента</h1><p>Зібрали найважливіше про навчання, цифрові сервіси, оцінювання, кампус і підтримку — без необхідності переглядати весь документ.</p></div><aside><span>Редакція</span><b>2024</b><p>Оригінальний путівник Академії</p><div><strong>28</strong><small>сторінок у PDF</small></div><a href="/documents/students/first-year-guide-2024.pdf" target="_blank" rel="noreferrer">Відкрити оригінал ↗</a></aside></div>
    </div></section><div className="phero-rule" />

    <nav className="resource-page-nav" aria-label="Навігація путівником"><div className="wrap"><a href="#start">Перші кроки</a><a href="#services">Сервіси</a><a href="#grading">Оцінювання</a><a href="#support">Підтримка</a></div></nav>

    <section className="guide-start" id="start"><div className="wrap">
      <div className="resource-section-head"><div><div className="idx">01 / Початок</div><h2>Що зробити насамперед</h2></div><p>Ці чотири кроки допоможуть швидко зорієнтуватися на початку навчання.</p></div>
      <div className="guide-step-grid">{firstSteps.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
    </div></section>

    <section className="student-services" id="services"><div className="wrap">
      <div className="resource-section-head"><div><div className="idx">02 / Онлайн і кампус</div><h2>Корисні сервіси</h2></div><p>Посилання ведуть одразу до актуальних сторінок і сервісів Академії.</p></div>
      <div className="resource-link-grid">{services.map(([title, description, href, action], index) => href.startsWith("http")
        ? <a href={href} target="_blank" rel="noreferrer" key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p><b>{action}</b></a>
        : <Link href={href} key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p><b>{action}</b></Link>)}</div>
    </div></section>

    <section className="guide-grading" id="grading"><div className="wrap guide-grading-layout"><div><div className="idx">03 / Навчання</div><h2>Як читається оцінка</h2><p>У путівнику наведено відповідність стобальної шкали, оцінок ECTS і національної шкали.</p><Link className="back-link" href="/documents#education">Положення про освітній процес →</Link></div><div className="grading-table" role="table" aria-label="Шкала оцінювання"><div className="grading-row heading" role="row"><b>Бали</b><b>ECTS</b><b>Результат</b></div>{grading.map(([score, ects, result]) => <div className="grading-row" role="row" key={ects}><span>{score}</span><strong>{ects}</strong><span>{result}</span></div>)}</div></div></section>

    <section className="guide-support" id="support"><div className="wrap"><div className="guide-support-card"><span>Важливо</span><div><h2>Безпека й підтримка</h2><p>Під час повітряної тривоги спокійно зберіть особисті речі, прямуйте до найближчого укриття та дотримуйтеся вказівок працівників Академії. Якщо потрібна довідка, консультація або допомога з навчанням, зверніться до методиста факультету чи через загальні контакти.</p><div><Link className="cta dark" href="/contacts"><span>Контакти Академії</span></Link><a className="cta guide-pdf" href="/documents/students/first-year-guide-2024.pdf" target="_blank" rel="noreferrer"><span>Путівник PDF ↗</span></a></div></div></div><p className="resource-reference-note">Путівник опубліковано у редакції 2024 року. Для розкладу, вартості навчання, календаря та контактів використовуйте актуальні сторінки сайту, посилання на які наведено вище.</p></div></section>
    <SiteFooter />
  </main>;
}
