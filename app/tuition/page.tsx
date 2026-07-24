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
    title: "Туризм і рекреація",
    note: "Бакалаврська програма J3 для вступників 2026 року.",
    full: ["43 500", "21 750", "4 350"],
    part: ["34 800", "17 400", "3 480"],
  },
  {
    number: "03",
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
    <section className="tuition-hero"><div className="wrap tuition-hero-grid"><div><div className="crumb">Головна / Вартість та оплата</div><span className="tuition-kicker">Офіційні тарифи · 2026/27</span><h1>Вартість<br />навчання<br /><em>2026 / 27</em></h1><p className="lead">Ціни за рік, семестр і місяць, реквізити для безпечної оплати та шаблони договорів — в одному місці.</p></div><aside><span className="mono">Для вступників 2026 року</span><b>від 30 900 <i>₴ / рік</i></b><p>Заочний бакалаврат на більшості програм.</p><div className="tuition-hero-links"><a href="#prices">Усі тарифи ↓</a><a href="#payment">Перейти до оплати →</a></div></aside></div></section>

    <nav className="tuition-page-nav" aria-label="Навігація сторінкою вартості"><div className="wrap">
      <a href="#prices"><span>01</span><b>Вступникам 2026</b></a>
      <a href="#continuing"><span>02</span><b>Старші курси</b></a>
      <a href="#international-tuition"><span>03</span><b>Іноземним студентам</b></a>
      <a href="#payment"><span>04</span><b>Оплата</b></a>
      <a href="#contracts"><span>05</span><b>Договори</b></a>
    </div></nav>

    <section id="prices"><div className="wrap"><div className="tuition-section-head"><div><div className="idx">01 / Вступникам 2026 року</div><h2>Оберіть свою<br />траєкторію</h2></div><p>Суми затверджені для 2026/27 навчального року. У кожній картці: навчальний рік / семестр / місяць.</p></div>
      <div className="tuition-rate-grid">{entrantRates.map((rate) => <article className="tuition-rate-card" key={rate.title}><span>{rate.number}</span><h3>{rate.title}</h3><p>{rate.note}</p><div className="tuition-rate-columns"><div><small>Денна форма</small><b>{rate.full[0]} ₴</b><dl><div><dt>Семестр</dt><dd>{rate.full[1]} ₴</dd></div><div><dt>Місяць</dt><dd>{rate.full[2]} ₴</dd></div></dl></div><div><small>Заочна форма</small><b>{rate.part[0]} ₴</b><dl><div><dt>Семестр</dt><dd>{rate.part[1]} ₴</dd></div><div><dt>Місяць</dt><dd>{rate.part[2]} ₴</dd></div></dl></div></div></article>)}</div>
      <div className="tuition-source-note"><span>PDF · 4 сторінки</span><div><b>Офіційний наказ про вартість 2026/27</b><p>Локальна копія документа Академії. У ній наведені всі програми, курси, форми та періоди оплати.</p></div><a href="/documents/tuition/tuition-2026-2027.pdf" target="_blank" rel="noreferrer">Відкрити PDF ↗</a></div>
    </div></section>

    <section className="tuition-continuing" id="continuing"><div className="wrap"><div className="tuition-section-head"><div><div className="idx">02 / Для тих, хто вже навчається</div><h2>Вартість старших<br />курсів</h2></div><p>Річна оплата у 2026/27 році залежить від року вступу. Значення нижче відтворюють додатки 1–2 офіційного документа.</p></div>
      <div className="tuition-table-wrap"><table className="tuition-table"><thead><tr><th>Курс</th><th>Рік вступу</th><th>Денна / рік</th><th>Заочна / рік</th></tr></thead><tbody>{continuingRates.map((row) => <tr key={row[0]}><td data-label="Курс">{row[0]}</td><td data-label="Рік вступу">{row[1]}</td><td data-label="Денна / рік"><b>{row[2]} ₴</b></td><td data-label="Заочна / рік"><b>{row[3]} ₴</b></td></tr>)}</tbody></table></div>
    </div></section>

    <section id="international-tuition"><div className="wrap tuition-international-grid"><div><div className="idx">03 / Іноземним студентам</div><h2>Тарифи у валютному еквіваленті</h2><p className="lead">Додаток 3 містить тарифи для іноземних студентів, які вступили з 2025 року. Оплата в Україні здійснюється у гривнях за офіційним курсом НБУ на дату платежу.</p><Link className="cta dark" href="/international#foreign-applicants"><span>Гід для іноземних вступників</span></Link></div><div className="foreign-tuition-cards"><article><span>Бакалаврат · I–IV курс</span><b>$415 <i>/ рік</i></b><small>$207,50 / семестр · $41,50 / місяць</small></article><article><span>Магістратура · I курс</span><b>$500 <i>/ рік</i></b><small>$250 / семестр · $50 / місяць</small></article><article><span>Підготовче відділення</span><b>$1 500 <i>/ рік</i></b><small>$750 / семестр · $150 / місяць</small></article></div></div>
    </section>

    <section className="tuition-payment-section" id="payment"><div className="wrap"><div className="tuition-section-head inverse"><div><div className="idx">04 / Безпечна оплата</div><h2>Скопіюйте.<br />Звірте. Сплатіть.</h2></div><p>Помічник готує реквізити, але не приймає гроші й не бачить дані картки. Платіж завершується тільки у вашому банківському застосунку.</p></div><TuitionPaymentAssistant />
      <div className="payment-verification"><span>!</span><div><b>Реквізити опубліковані Академією станом на 31.08.2023</b><p>Перед першим або великим платежем підтвердьте актуальність рахунку та призначення платежу у бухгалтерії.</p></div><a href="tel:+380964508504">Світлана Василівна<br /><b>+38 096 450 85 04</b></a></div>
    </div></section>

    <section id="contracts"><div className="wrap"><div className="tuition-section-head"><div><div className="idx">05 / Документи</div><h2>Договори<br />для навчання</h2></div><p>Офіційні шаблони, опубліковані Академією. Приймальна комісія заповнює остаточний договір; він набирає чинності після зарахування.</p></div>
      <div className="tuition-contract-grid"><a href="/documents/tuition/contract-paid-educational-service.docx" download><span>DOCX · шаблон 2025</span><div><b>Договір про надання платної освітньої послуги</b><p>Для підготовки фахівців за кошти фізичної або юридичної особи.</p></div><strong>Завантажити ↓</strong></a><a href="/documents/tuition/contract-education.docx" download><span>DOCX · шаблон 2025</span><div><b>Договір про навчання в Академії</b><p>Основний договір між Академією та здобувачем освіти.</p></div><strong>Завантажити ↓</strong></a></div>
      <p className="tuition-contract-note">Не підписуйте порожній шаблон і не надсилайте персональні дані через невідомі форми. Остаточну версію та порядок підписання погоджуйте з Приймальною комісією.</p>
    </div></section>

    <section className="bigcta"><div className="wrap"><div className="mono">Потрібна перевірка?</div><h2>Уточніть суму<br />до оплати.</h2><Link className="cta" href="/admissions#consultation"><span>Отримати консультацію</span></Link></div></section>
    <SiteFooter />
  </main>;
}
