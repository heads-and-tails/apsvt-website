import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ProgramFinder } from "../programs/ProgramFinder";
import { ApplicantConsultationForm } from "./ApplicantConsultationForm";
import { ApplicantDocumentAssistant } from "./ApplicantDocumentAssistant";
import { ApplicantDocumentLibrary } from "./ApplicantDocumentLibrary";
import { EntranceExamSchedule } from "./EntranceExamSchedule";
import { EntranceExamPrograms } from "./EntranceExamPrograms";
import { EntranceExamResults } from "./EntranceExamResults";
import { EnrollmentOrders } from "./EnrollmentOrders";
import { ApplicantRankings } from "./ApplicantRankings";
import { UkrainiansAbroadAdmission } from "../components/UkrainiansAbroadAdmission";
import { PageJumpNav } from "../components/PageJumpNav";
import { getPublicContent as getContentItems } from "@/lib/content";

export const metadata: Metadata = { title: "Вступ 2026", description: "Маршрут вступу до АПСВТ у 2026 році: вибір програми, документи та персональна консультація." };
export const dynamic = "force-dynamic";

const steps = [
  ["01", "Знайдіть свій напрям", "Пройдіть короткий тест або порівняйте програми, навчальні плани й кар’єрні можливості."],
  ["02", "Перевірте умови", "Дізнайтеся вартість, формат навчання та персональний перелік документів."],
  ["03", "Подайте заяву", "Створіть електронний кабінет вступника та визначте пріоритети."],
  ["04", "Підтвердьте вибір", "Виконайте вимоги до зарахування, підпишіть договір і отримайте студентський профіль."],
];

export default async function Page() {
  const timeline = await getContentItems("admission_timeline");
  return <main id="top"><SiteHeader />
    <section className="phero img admissions-hero"><div className="bgi"><img src="/apsvt-regional-students.png" alt="Міжнародна студентська спільнота Академії" /></div><div className="wrap"><div className="crumb">Головна / Вступ 2026</div><h1>Ваш маршрут<br />до Академії</h1><p className="lead">Від першого запитання до зарахування — з тестом на програму та персональною підтримкою команди.</p><div className="admissions-hero-actions"><a className="cta" href="#test"><span>Знайти свою програму</span></a><a className="cta ghost" href="#consultation"><span>Отримати консультацію</span></a></div></div></section><div className="phero-rule" />

    <PageJumpNav className="applicant-section-nav" ariaLabel="Навігація для вступника" label="Розділи для вступника">
      <a href="#route"><span>01</span><b>Як вступити</b></a>
      <a href="#dates"><span>02</span><b>Ключові дати</b></a>
      <a href="#tuition"><span>03</span><b>Вартість і оплата</b></a>
      <a href="#documents"><span>04</span><b>Що підготувати</b></a>
      <a href="#ukrainians-abroad"><span>04.1</span><b>Українцям за кордоном</b></a>
      <a href="#entrance-exams"><span>05</span><b>Розклад випробувань</b></a>
      <a href="#entrance-programs"><span>06</span><b>Програми випробувань</b></a>
      <a href="#entrance-results"><span>07</span><b>Результати випробувань</b></a>
      <a href="#enrollment-orders"><span>07.1</span><b>Накази про зарахування</b></a>
      <a href="#applicant-rankings"><span>08</span><b>Рейтингові списки</b></a>
      <a href="#admission-rules"><span>09</span><b>Правила і документи</b></a>
      <a href="#document-assistant"><span>10</span><b>Запитати помічника</b></a>
      <a href="#test"><span>11</span><b>Обрати програму</b></a>
      <a href="#consultation"><span>12</span><b>Консультація</b></a>
    </PageJumpNav>

    <section id="route"><div className="wrap"><div className="sec-head"><div><div className="idx">01 / Чотири кроки</div><h2>Від вибору до зарахування</h2></div></div><div className="steps">{steps.map(([number, title, description]) => <article className="step" key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>

    <section className="admission-dates" id="dates"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Календар вступника</div><h2>Ключові дати 2026</h2></div><p>Дати відповідають актуальному календарю МОН. Редакція може оперативно оновити їх у разі офіційних змін.</p></div><div className="admission-timeline">{timeline.map(({id,payload},index)=><article key={id}><span>{String(index+1).padStart(2,"0")}</span><div><small>{payload.status}</small><b>{payload.dateLabel}</b><h3>{payload.title}</h3><p>{payload.description}</p></div></article>)}</div><p className="timeline-source">Для вступників на бакалаврат і магістратуру. Перевіряйте персональний статус заяви в електронному кабінеті ЄДЕБО.</p></div></section>

    <section id="tuition"><div className="wrap split"><div className="copy"><div className="idx">03 / Вартість і оплата</div><h2>Знайте суму до договору</h2><p className="lead">Офіційні тарифи 2026/27 показані за рік, семестр і місяць — для денної та заочної форми.</p><p>Скористайтеся безпечним помічником: він підготує банківські реквізити й призначення платежу, не запитуючи дані картки.</p><Link className="cta dark" href="/tuition"><span>Переглянути тарифи й оплату</span></Link></div><div className="panel"><h3>На сторінці вартості</h3><ul><li><span className="y">01</span>Тарифи для вступників 2026</li><li><span className="y">02</span>Вартість старших курсів</li><li><span className="y">03</span>Оплата для іноземних студентів</li><li><span className="y">04</span>Банківські реквізити</li><li><span className="y">05</span>Офіційні договори DOCX</li></ul></div></div></section>

    <section className="soft" id="documents"><div className="wrap detail-layout"><div className="detail-copy"><div className="idx">04 / Документи вступника</div><h2>Підготуйтеся заздалегідь</h2><p className="lede">Точний перелік залежить від освітнього рівня та категорії вступника. Основний пакет можна підготувати онлайн.</p><div className="rows"><div className="row"><span className="rnum">01</span><div><h3>Документ про освіту</h3><p>Атестат або диплом із додатком.</p></div></div><div className="row"><span className="rnum">02</span><div><h3>Документ, що посвідчує особу</h3><p>Паспорт або ID-картка та реєстраційний номер.</p></div></div><div className="row"><span className="rnum">03</span><div><h3>Мотиваційний лист</h3><p>Ваша історія, цілі та причина обрати програму.</p></div></div></div></div><aside className="detail-aside"><div className="panel"><h3>Приймальна комісія</h3><ul><li><span className="y">Тел.</span><a href="tel:+380445260664">+38 (044) 526-06-64</a></li><li><span className="y">Email</span><a href="mailto:pk@socosvita.kiev.ua">pk@socosvita.kiev.ua</a></li><li><span className="y">Адреса</span>Кільцева дорога, 3-А, Київ</li></ul></div><p className="aside-hint">Не впевнені у своєму переліку? Залиште запит нижче — команда перевірить вашу ситуацію.</p></aside></div></section>

    <UkrainiansAbroadAdmission index="04.1" />

    <EntranceExamSchedule />

    <EntranceExamPrograms />

    <EntranceExamResults />

    <EnrollmentOrders />

    <ApplicantRankings />

    <ApplicantDocumentLibrary />

    <ApplicantDocumentAssistant />

    <ProgramFinder index="11 / Тест на програму" />

    <section id="consultation" className="admission-consultation"><div className="wrap admission-consultation-grid"><div className="admission-consultation-copy"><div className="idx">12 / Персональна консультація</div><h2>Розкажіть, що плануєте</h2><p className="lead">Три короткі кроки — і команда вступу підготує відповідь саме для вашого рівня, програми та ситуації.</p><div className="consultation-benefits"><div><span>01</span><p><b>Без листування навмання</b>Оберіть зручний канал і час відповіді.</p></div><div><span>02</span><p><b>Персональний маршрут</b>Отримайте перелік документів і наступних дій.</p></div><div><span>03</span><p><b>Спокійний вибір</b>Порівняйте програми до подання заяви.</p></div></div></div><ApplicantConsultationForm /></div></section>

    <SiteFooter />
  </main>;
}
