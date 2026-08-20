import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Аспірантура і докторантура",
  description: "Програми PhD і докторантури АПСВТ, вступна кампанія 2026 року, етапи підготовки, вартість та офіційні документи.",
};

const phdProgrammes = [
  { code: "A5", title: "Професійна освіта", note: "за спеціалізаціями", places: "3 місця" },
  { code: "C1", title: "Економіка та міжнародні економічні відносини", note: "освітньо-наукова програма «Економіка»", places: "4 місця" },
  { code: "C4", title: "Психологія", note: "освітньо-наукова програма «Психологія»", places: "4 місця" },
  { code: "D4", title: "Публічне управління та адміністрування", note: "підготовка дослідників для публічного сектору", places: "4 місця" },
  { code: "D8", title: "Право", note: "регульована спеціальність", places: "5 місць" },
] as const;

const admissionDates = [
  { date: "07-25 серпня", title: "Основна реєстрація", text: "Подання заяв на конкурсний відбір, іспит зі спеціальності та презентацію дослідницької пропозиції. Завершення - о 18:00 25 серпня." },
  { date: "26 серпня - 07 вересня", title: "Випробування в Академії", text: "Іспит зі спеціальності та презентація дослідницьких пропозицій або наукових досягнень." },
  { date: "з 08 вересня", title: "Рекомендації", text: "Академія надає рекомендації до зарахування вступникам основної сесії." },
  { date: "до 14 вересня", title: "Зарахування", text: "Зарахування вступників, які отримали рекомендацію та виконали всі вимоги." },
] as const;

const doctoralFields = [
  { code: "08", title: "Економічні науки", items: ["08.00.03 · Економіка та управління національним господарством"] },
  { code: "12", title: "Юридичні науки", items: ["12.00.02 · Конституційне право; муніципальне право", "12.00.07 · Адміністративне право і процес; фінансове та інформаційне право"] },
  { code: "13", title: "Педагогічні науки", items: ["13.00.04 · Теорія та методика професійної освіти"] },
  { code: "19", title: "Психологічні науки", items: ["19.00.01 · Загальна психологія, історія психології", "19.00.03 · Психологія праці; інженерна психологія", "19.00.04 · Медична психологія", "19.00.05 · Соціальна психологія; психологія соціальної роботи", "19.00.07 · Педагогічна та вікова психологія", "19.00.10 · Організаційна психологія; економічна психологія"] },
] as const;

const phdDocuments = [
  ["Наказ про набір до аспірантури у 2026 році", "/documents/research/postgraduate-doctoral/2026/phd-enrollment-order-2026.pdf", "PDF · 2 сторінки"],
  ["Строки, випробування та умови конкурсного відбору", "/documents/research/postgraduate-doctoral/2026/phd-admission-dates-and-selection-2026.pdf", "PDF · 3 сторінки"],
  ["Вартість навчання в аспірантурі у 2026 році", "/documents/research/postgraduate-doctoral/2026/phd-tuition-2026.pdf", "PDF · 1 сторінка"],
] as const;

const doctoralDocuments = [
  ["Наказ про відкриття докторантури у 2026 році", "/documents/research/postgraduate-doctoral/2026/doctoral-programme-opening-2026.pdf", "PDF · 2 сторінки"],
  ["Вартість навчання в докторантурі у 2026 році", "/documents/research/postgraduate-doctoral/2026/doctoral-tuition-2026.pdf", "PDF · 1 сторінка"],
] as const;

export default function Page() {
  return <main id="top" className="postgraduate-page">
    <SiteHeader />

    <section className="phero postgraduate-hero">
      <div className="wrap">
        <div className="crumb">Головна / Аспірантура і докторантура</div>
        <div className="postgraduate-hero-grid">
          <div>
            <span className="postgraduate-kicker">Наукова кар’єра · вступ 2026</span>
            <h1>Від дослідження до наукового ступеня</h1>
            <p className="lead">Оберіть свій маршрут: здобуття ступеня доктора філософії в аспірантурі або підготовка наукового результату для здобуття ступеня доктора наук.</p>
          </div>
          <div className="postgraduate-hero-facts" aria-label="Ключові показники набору 2026 року">
            <article><b>5</b><span>програм PhD</span><small>набір 2026</small></article>
            <article><b>20</b><span>місць</span><small>за наказом Академії</small></article>
            <article><b>10</b><span>спеціальностей</span><small>у докторантурі</small></article>
          </div>
        </div>
      </div>
    </section>
    <div className="phero-rule" />

    <nav className="postgraduate-jump-nav" aria-label="Навігація сторінкою">
      <div className="wrap">
        <a href="#phd"><small>01</small><span>Аспірантура</span></a>
        <a href="#programmes"><small>02</small><span>Програми PhD</span></a>
        <a href="#admission"><small>03</small><span>Вступ 2026</span></a>
        <a href="#doctoral"><small>04</small><span>Докторантура</span></a>
        <a href="#cost"><small>05</small><span>Вартість</span></a>
        <a href="#documents"><small>06</small><span>Документи</span></a>
      </div>
    </nav>

    <section id="phd" className="postgraduate-choice">
      <div className="wrap">
        <header className="postgraduate-section-head">
          <div><span className="idx">01 / Вибір рівня</span><h2>Два маршрути наукової кар’єри</h2></div>
          <p>Розділи поділено за рівнями, щоб одразу перейти до потрібних програм, умов вступу, вартості та документів.</p>
        </header>
        <div className="postgraduate-track-grid">
          <article className="postgraduate-track-card is-phd">
            <span>PhD · доктор філософії</span>
            <h3>Аспірантура</h3>
            <p>Для вступників, які мають освіту рівня магістра або спеціаліста та хочуть розвинути власну дослідницьку тему в межах освітньо-наукової програми.</p>
            <ul><li>вступ через ЄВІ, ЄВВ та випробування в Академії</li><li>навчальні компоненти й індивідуальний план дослідження</li><li>підготовка та захист дисертації</li></ul>
            <a href="#programmes">Переглянути програми <b>→</b></a>
          </article>
          <article className="postgraduate-track-card is-doctoral">
            <span>DSc · доктор наук</span>
            <h3>Докторантура</h3>
            <p>Для сформованих дослідників, які працюють над вагомим науковим результатом після здобуття ступеня доктора філософії або кандидата наук.</p>
            <ul><li>докторантуру в Академії відкрито у 2026 році</li><li>чотири галузі наук і десять спеціальностей</li><li>індивідуальна підготовка на кафедрі</li></ul>
            <a href="#doctoral">Переглянути спеціальності <b>→</b></a>
          </article>
        </div>
      </div>
    </section>

    <section id="programmes" className="soft postgraduate-programmes">
      <div className="wrap">
        <header className="postgraduate-section-head">
          <div><span className="idx">02 / Програми PhD</span><h2>Набір до аспірантури у 2026 році</h2></div>
          <p>Наказом Академії оголошено набір на п’ять освітньо-наукових програм. Біля кожної програми вказано затверджений обсяг набору.</p>
        </header>
        <div className="postgraduate-programme-grid">
          {phdProgrammes.map((programme, index) => <article key={programme.code}>
            <div><small>{String(index + 1).padStart(2, "0")}</small><b>{programme.code}</b></div>
            <h3>{programme.title}</h3>
            <p>{programme.note}</p>
            <strong>{programme.places}</strong>
          </article>)}
        </div>
        <div className="postgraduate-programme-total"><span>Загальний обсяг набору</span><b>20 місць</b><Link href="/programs#doctoral-programmes">Освітньо-наукові програми та матеріали →</Link></div>
      </div>
    </section>

    <section id="admission" className="postgraduate-admission">
      <div className="wrap">
        <header className="postgraduate-section-head">
          <div><span className="idx">03 / Вступ 2026</span><h2>Календар основної сесії</h2></div>
          <p>Для конкурсу враховуються результати ЄВІ та ЄВВ, іспит зі спеціальності в АПСВТ і презентація дослідницької пропозиції або наукових досягнень.</p>
        </header>
        <div className="postgraduate-timeline">
          {admissionDates.map((item, index) => <article key={item.title}>
            <span>{String(index + 1).padStart(2, "0")}</span><small>{item.date}</small><h3>{item.title}</h3><p>{item.text}</p>
          </article>)}
        </div>
        <div className="postgraduate-admission-note">
          <div><span>Що потрібно скласти</span><h3>ЄВІ + ЄВВ + спеціальність + дослідницька пропозиція</h3></div>
          <ul>
            <li>Приймаються результати ЄВІ 2024, 2025 або 2026 року.</li>
            <li>Приймаються результати ЄВВ 2025 або 2026 року.</li>
            <li>Мінімальна сума оцінок тесту загальної навчальної компетентності та тесту з іноземної мови ЄВІ - 300 балів.</li>
            <li>Для визначених правилами категорій передбачено спеціальні умови участі.</li>
          </ul>
          <a href={phdDocuments[1][1]} target="_blank" rel="noreferrer">Повні умови вступу у PDF <b>↗</b></a>
        </div>
      </div>
    </section>

    <section className="postgraduate-route">
      <div className="wrap postgraduate-route-grid">
        <div><span className="idx">04 / Як проходить підготовка</span><h2>Зрозумілий маршрут аспіранта</h2><p>Освітня складова допомагає опанувати методологію, а дослідницька - послідовно пройти шлях від задуму до захисту.</p></div>
        <ol>
          <li><span>01</span><div><h3>Тема і керівник</h3><p>Формування дослідницької проблеми, робочого плану та очікуваних результатів.</p></div></li>
          <li><span>02</span><div><h3>Освітня програма</h3><p>Навчальні компоненти, методологія досліджень і розвиток академічних компетентностей.</p></div></li>
          <li><span>03</span><div><h3>Власне дослідження</h3><p>Збір і аналіз даних, апробація результатів, публікації та участь у наукових подіях.</p></div></li>
          <li><span>04</span><div><h3>Завершення і захист</h3><p>Підготовка дисертації, проходження встановлених процедур та публічний захист.</p></div></li>
        </ol>
      </div>
    </section>

    <section id="doctoral" className="postgraduate-doctoral">
      <div className="wrap">
        <header className="postgraduate-section-head">
          <div><span className="idx">05 / Докторантура</span><h2>Підготовка докторів наук</h2></div>
          <p>Докторантуру відкрито наказом Академії № 30 від 30 квітня 2026 року. Після зарахування передбачена настановна зустріч і робота з профільною кафедрою.</p>
        </header>
        <div className="postgraduate-doctoral-grid">
          {doctoralFields.map((field) => <article key={field.code}>
            <span>{field.code}</span><h3>{field.title}</h3><ul>{field.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>)}
        </div>
        <p className="postgraduate-disclaimer">Опубліковані документи підтверджують відкриття спеціальностей і вартість підготовки. Умови подання матеріалів та індивідуальний маршрут вступу варто попередньо узгодити з відділом аспірантури та докторантури.</p>
      </div>
    </section>

    <section id="cost" className="postgraduate-cost">
      <div className="wrap">
        <header className="postgraduate-section-head">
          <div><span className="idx">06 / Вартість</span><h2>Оплата у 2026 році</h2></div>
          <p>Суми наведено за затвердженими кошторисами для вступу у 2026 році. Перед укладенням договору уточніть актуальні умови оплати.</p>
        </header>
        <div className="postgraduate-cost-grid">
          <article><span>Аспірантура · PhD</span><h3>70 000 грн</h3><p>за навчальний рік</p><div><b>35 000 грн</b><small>за семестр</small></div><strong>усі 5 спеціальностей набору 2026</strong></article>
          <article><span>Докторантура · DSc</span><h3>80 000 грн</h3><p>за навчальний рік</p><div><b>40 000 грн</b><small>за семестр</small></div><strong>юридичні, економічні, психологічні та педагогічні науки</strong></article>
          <aside><span>Вступні іспити до аспірантури</span><b>4 500 грн</b><small>за затвердженим кошторисом 2026 року</small></aside>
        </div>
      </div>
    </section>

    <section id="documents" className="soft postgraduate-documents">
      <div className="wrap">
        <header className="postgraduate-section-head">
          <div><span className="idx">07 / Офіційні матеріали</span><h2>Документи без пошуку по сайту</h2></div>
          <p>Уся ключова інформація вже пояснена вище. Тут зібрані першоджерела: накази, детальні умови вступу та затверджена вартість.</p>
        </header>
        <div className="postgraduate-document-groups">
          <article>
            <div className="postgraduate-document-heading"><span>PhD</span><div><small>Аспірантура</small><h3>Набір і вступ 2026</h3></div></div>
            <div className="postgraduate-document-list">{phdDocuments.map(([title, href, meta], index) => <a href={href} target="_blank" rel="noreferrer" key={href}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{meta}</small><b>{title}</b></div><strong>↗</strong></a>)}</div>
          </article>
          <article>
            <div className="postgraduate-document-heading"><span>DSc</span><div><small>Докторантура</small><h3>Відкриття і вартість</h3></div></div>
            <div className="postgraduate-document-list">{doctoralDocuments.map(([title, href, meta], index) => <a href={href} target="_blank" rel="noreferrer" key={href}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{meta}</small><b>{title}</b></div><strong>↗</strong></a>)}</div>
          </article>
        </div>
      </div>
    </section>

    <section className="postgraduate-contact">
      <div className="wrap postgraduate-contact-grid">
        <div><span>Консультація</span><h2>Потрібна допомога з вибором маршруту?</h2><p>Відділ аспірантури та докторантури допоможе уточнити програму, вступні випробування, перелік матеріалів і формат навчання. У наказах 2026 року відповідальною за напрям зазначено завідувачку аспірантури Тетяну Лесюк.</p></div>
        <div><Link className="cta" href="/admissions#consultation"><span>Отримати консультацію</span></Link><Link href="/contacts">Контакти Академії <b>→</b></Link></div>
      </div>
    </section>

    <SiteFooter />
  </main>;
}
