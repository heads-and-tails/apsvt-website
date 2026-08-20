import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { TuitionPaymentAssistant } from "./TuitionPaymentAssistant";

export const metadata: Metadata = {
  title: "Вартість навчання та оплата",
  description: "Офіційна вартість навчання в АПСВТ на 2026/27 рік, банківські реквізити, безпечний помічник оплати та договори.",
};

const entrantRates = [
  {
    number: "01",
    title: "Бакалаврат",
    note: "Право, публічне управління, соціальна робота, фінанси, менеджмент, маркетинг, торгівля, психологія та професійна освіта / цифрові технології.",
    full: ["38 600", "19 300", "3 860"],
    part: ["30 900", "15 450", "3 090"],
  },
  {
    number: "02",
    title: "Магістратура",
    note: "Перший рік навчання на програмах, зазначених у додатку до офіційного наказу.",
    full: ["43 500", "21 750", "4 350"],
    part: ["34 800", "17 400", "3 480"],
  },
];

const continuingRates = [
  ["II курс", "Вступ 2025/26", "36 300", "23 500"],
  ["III курс", "Вступ 2024/25", "34 700", "22 600"],
  ["IV курс", "Вступ 2023/24", "34 700", "22 600"],
  ["Магістратура, II курс", "Вступ 2025/26", "20 400", "17 400"],
];

export default function Page() {
  return <main id="top"><SiteHeader />
    <section className="tuition-hero"><div className="wrap tuition-hero-grid"><div><div className="crumb">Головна / Вартість та оплата</div><span className="tuition-kicker">2026/27 навчальний рік</span><h1>Вартість<br />навчання</h1><p className="lead">Офіційні суми для вступників і студентів — за навчальний рік, семестр та місяць.</p><div className="tuition-hero-actions"><a href="#prices">Переглянути тарифи ↓</a><a href="#payment">Оплата навчання →</a></div></div></div></section>

    <nav className="tuition-page-nav" aria-label="Навігація сторінкою вартості"><div className="wrap">
      <a href="#prices"><span>01</span><b>Вступникам 2026</b></a>
      <a href="#continuing"><span>02</span><b>Старші курси</b></a>
      <a href="#payment"><span>03</span><b>Оплата</b></a>
      <a href="#contracts"><span>04</span><b>Договори</b></a>
    </div></nav>

    <section id="prices"><div className="wrap"><div className="tuition-section-head single"><div><div className="idx">01 / Вступникам 2026 року</div><h2>Вартість навчання<br />для вступників</h2></div></div>
      <div className="tuition-applicant-table-wrap"><table className="tuition-applicant-table"><thead><tr><th>Рівень і програма</th><th>Форма навчання</th><th>Навчальний рік</th><th>Семестр</th><th>Місяць</th></tr></thead><tbody>{entrantRates.flatMap((rate) => [
        <tr key={`${rate.title}-full`}><th rowSpan={2} scope="rowgroup"><span>{rate.number}</span><b>{rate.title}</b><small>{rate.note}</small></th><td data-label="Форма">Денна</td><td data-label="Навчальний рік"><b>{rate.full[0]} ₴</b></td><td data-label="Семестр">{rate.full[1]} ₴</td><td data-label="Місяць">{rate.full[2]} ₴</td></tr>,
        <tr key={`${rate.title}-part`}><td data-label="Форма">Заочна</td><td data-label="Навчальний рік"><b>{rate.part[0]} ₴</b></td><td data-label="Семестр">{rate.part[1]} ₴</td><td data-label="Місяць">{rate.part[2]} ₴</td></tr>,
      ])}</tbody></table></div>
      <div className="tuition-source-note compact"><span>PDF · 4 сторінки</span><div><b>Офіційний наказ про вартість 2026/27</b></div><a href="/documents/tuition/tuition-2026-2027.pdf" target="_blank" rel="noreferrer">Відкрити PDF ↗</a></div>
    </div></section>

    <section className="tuition-continuing" id="continuing"><div className="wrap"><div className="tuition-section-head"><div><div className="idx">02 / Для тих, хто вже навчається</div><h2>Вартість старших<br />курсів</h2></div><p>Річна оплата у 2026/27 році залежить від року вступу. Значення нижче відтворюють додатки 1–2 офіційного документа.</p></div>
      <div className="tuition-table-wrap"><table className="tuition-table"><thead><tr><th>Курс</th><th>Рік вступу</th><th>Денна / рік</th><th>Заочна / рік</th></tr></thead><tbody>{continuingRates.map((row) => <tr key={row[0]}><td data-label="Курс">{row[0]}</td><td data-label="Рік вступу">{row[1]}</td><td data-label="Денна / рік"><b>{row[2]} ₴</b></td><td data-label="Заочна / рік"><b>{row[3]} ₴</b></td></tr>)}</tbody></table></div>
    </div></section>

    <section className="tuition-payment-section" id="payment"><div className="wrap"><div className="tuition-section-head inverse"><div><div className="idx">03 / Оплата навчання</div><h2>Оплата<br />навчання</h2></div><p>Сформуйте суму й призначення платежу, а потім перевірте реквізити перед підтвердженням у банку.</p></div><TuitionPaymentAssistant />
      <div className="payment-verification"><span>!</span><div><b>Банківські реквізити для оплати навчання</b><p>Перед першим або великим платежем підтвердьте IBAN і призначення платежу у бухгалтерії Академії.</p></div><a href="tel:+380964508504">Світлана Василівна<br /><b>+38 096 450 85 04</b></a></div>
      <div className="tuition-portal-link"><div><span>Для студентів Академії</span><h3>Перевірте, чи зараховано платіж</h3><p>В особистому кабінеті видно актуальний залишок, прострочення, підтверджені оплати та договори.</p></div><Link href="/student">Відкрити особистий кабінет →</Link></div>
    </div></section>

    <section id="contracts"><div className="wrap"><div className="tuition-section-head"><div><div className="idx">04 / Документи</div><h2>Договори<br />для навчання</h2></div><p>Офіційні шаблони, опубліковані Академією. Приймальна комісія заповнює остаточний договір; він набирає чинності після зарахування.</p></div>
      <div className="tuition-contract-grid"><a href="/documents/tuition/contract-paid-educational-service.docx" download><span>DOCX · шаблон 2025</span><div><b>Договір про надання платної освітньої послуги</b><p>Для підготовки фахівців за кошти фізичної або юридичної особи.</p></div><strong>Завантажити ↓</strong></a><a href="/documents/tuition/contract-education.docx" download><span>DOCX · шаблон 2025</span><div><b>Договір про навчання в Академії</b><p>Основний договір між Академією та здобувачем освіти.</p></div><strong>Завантажити ↓</strong></a></div>
      <p className="tuition-contract-note">Не підписуйте порожній шаблон і не надсилайте персональні дані через невідомі форми. Остаточну версію та порядок підписання погоджуйте з Приймальною комісією.</p>
    </div></section>

    <section className="bigcta"><div className="wrap"><div className="mono">Потрібна перевірка?</div><h2>Уточніть суму<br />до оплати.</h2><Link className="cta" href="/admissions#consultation"><span>Отримати консультацію</span></Link></div></section>
    <SiteFooter />
  </main>;
}
