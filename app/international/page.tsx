import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PageDocuments } from "../components/PageDocuments";

export const metadata: Metadata = {
  title: "Міжнародне співробітництво та вступ іноземців",
  description: "Партнери АПСВТ, академічна мобільність, вступ іноземних громадян, електронне запрошення на навчання, документи та офіційні джерела.",
};
export const dynamic = "force-dynamic";

const partners = [
  {
    number: "01",
    country: "Німеччина",
    title: "Studieninstitut POLS®-Seminare",
    place: "Нойштадт-ан-дер-Вайнштрассе",
    text: "Угода про науково-освітнє та гуманітарне співробітництво: обмін викладачами, спільні наукові публікації та участь у міжнародних програмах.",
  },
  {
    number: "02",
    country: "Латвія",
    title: "Transport and Telecommunication Institute · TSI",
    place: "Рига",
    text: "Партнерство у форматі академічних ознайомчих візитів, обміну досвідом у навчальних програмах та спільної наукової діяльності.",
  },
  {
    number: "03",
    country: "Словаччина",
    title: "Vysoká škola technická a ekonomická v Prešove",
    place: "Пряшів",
    text: "Академічні ознайомчі візити, обмін досвідом у навчальних програмах і розвиток спільної наукової роботи.",
  },
];

const cooperationAreas = [
  "Академічна мобільність студентів і викладачів",
  "Спільні наукові дослідження та публікації",
  "Erasmus+ та інші міжнародні освітні ініціативи",
  "Обмін методичною літературою й освітніми матеріалами",
  "Спільні конференції, семінари та тренінги",
];

const applicantSteps = [
  ["01", "Створіть кабінет", "Зареєструйтеся в офіційній Єдиній системі для іноземних вступників."],
  ["02", "Оберіть АПСВТ", "Подайте електронну заяву до Академії та завантажте копії документів."],
  ["03", "Отримайте пропозицію", "Академія перевірить документи й надішле освітню пропозицію з умовами навчання."],
  ["04", "Підтвердьте навчання", "Прийміть освітню пропозицію у своєму електронному кабінеті."],
  ["05", "Отримайте запрошення", "Академія оформить і підпише електронне запрошення на навчання."],
  ["06", "Складіть випробування", "Пройдіть співбесіду або інше передбачене випробування очно чи дистанційно."],
];

const typicalDocuments = [
  "Паспортний документ або документ особи без громадянства",
  "Документ про попередню освіту та додаток до нього",
  "Академічна довідка — для переведення або поновлення з другого курсу",
  "Кольорове цифрове фото обличчя",
  "Легалізація або апостиль і нотаріально засвідчений переклад українською — коли це вимагається",
];

const legalGroups = [
  {
    title: "Вступ і визнання освіти",
    links: [
      ["Закон України «Про вищу освіту»", "https://zakon.rada.gov.ua/laws/show/1556-18#Text"],
      ["Постанова КМУ № 758 — Єдина система прийому іноземців", "https://zakon.rada.gov.ua/laws/show/758-2024-%D0%BF#Text"],
      ["Наказ МОН № 1541 — набір і навчання іноземців", "https://zakon.rada.gov.ua/laws/show/z2004-13#Text"],
      ["Наказ МОН № 504 — визнання іноземних документів про освіту", "https://zakon.rada.gov.ua/laws/show/z0614-15#Text"],
    ],
  },
  {
    title: "Віза та в’їзд в Україну",
    links: [
      ["Правила оформлення віз для в’їзду в Україну · Постанова № 118", "https://zakon.rada.gov.ua/laws/show/118-2017-%D0%BF#Text"],
      ["Підтвердження достатнього фінансового забезпечення · Постанова № 884", "https://zakon.rada.gov.ua/laws/show/884-2013-%D0%BF#Text"],
      ["Закон України «Про правовий статус іноземців та осіб без громадянства»", "https://zakon.rada.gov.ua/laws/show/3773-17#Text"],
    ],
  },
  {
    title: "Документи Академії",
    links: [
      ["Правила прийому АПСВТ у 2026 році", "/documents/admissions/01-pravyla-pryiomu-apsvt-2026.pdf"],
      ["Порядок організації прийому іноземців до АПСВТ", "/documents/admissions/07-poriadok-pryiomu-inozemtsiv.pdf"],
      ["Порядок проведення вступних випробувань", "/documents/admissions/08-poriadok-provedennia-vstupnykh-vyprobuvan.pdf"],
    ],
  },
];

const faq = [
  {
    question: "Чи оформлює Академія запрошення на навчання?",
    answer: "Так. Після перевірки документів Академія надсилає освітню пропозицію. Коли вступник приймає її в Єдиній системі, формується електронне запрошення, яке Академія підписує кваліфікованим електронним підписом або печаткою. Запрошення не є автоматичною гарантією отримання візи.",
  },
  {
    question: "Де подати заяву на запрошення?",
    answer: "Заява подається через офіційний електронний кабінет іноземного вступника Study in Ukraine. У кабінеті потрібно обрати Академію, завантажити документи та відстежувати рішення.",
  },
  {
    question: "Скільки часу розглядають заяву?",
    answer: "Відповідно до державного Порядку заклад освіти розглядає заяву для формування запрошення не більше п’яти робочих днів. Для окремих держав або випадків додаткова перевірка компетентними органами може тривати довше.",
  },
  {
    question: "Якою мовою відбувається навчання?",
    answer: "Мова навчання в Академії — українська. Конкретні мовні вимоги та можливу підготовку потрібно погодити з міжнародним відділом до подання документів.",
  },
  {
    question: "Коли можна вступати?",
    answer: "Набір іноземців проводиться у два етапи: перший — до 30 квітня, другий — у строки чинних Правил прийому Академії, але не пізніше 1 листопада. Перед поданням заяви обов’язково перевірте актуальний календар.",
  },
  {
    question: "Чи можна пройти вступні випробування дистанційно?",
    answer: "Так. Вступні іспити, співбесіди або фахові випробування можуть проводитися очно або дистанційно з обов’язковою ідентифікацією вступника.",
  },
  {
    question: "Чи є бюджетні місця для іноземних громадян?",
    answer: "АПСВТ є приватним закладом вищої освіти, тому навчання відбувається на контрактній основі, якщо інше прямо не передбачене міжнародним договором, законодавством або програмою академічної мобільності.",
  },
  {
    question: "Куди звернутися, якщо я не впевнений у документах?",
    answer: "Надішліть запит міжнародному відділу. Команда перевірить вашу ситуацію, підкаже порядок перекладу й легалізації та допоможе пройти офіційний маршрут подання.",
  },
];

export default function Page() {
  return <main id="top"><SiteHeader />
    <section className="phero img international-hero">
      <div className="bgi"><img src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1900&q=92&auto=format&fit=crop" alt="Міжнародна студентська мобільність" /></div>
      <div className="wrap">
        <div className="crumb">Головна / Міжнародне співробітництво</div>
        <h1>Академія<br />без кордонів</h1>
        <p className="lead">Партнерства, академічна мобільність і зрозумілий маршрут вступу для іноземних громадян.</p>
        <div className="international-hero-actions">
          <a className="cta" href="#foreign-applicants"><span>Вступ іноземців</span></a>
          <a className="cta ghost" href="#partners"><span>Наші партнери</span></a>
        </div>
      </div>
    </section><div className="phero-rule" />

    <nav className="intl-page-nav" aria-label="Навігація міжнародною сторінкою"><div className="wrap">
      <a href="#partners"><span>01</span><b>Партнери</b></a>
      <a href="#cooperation"><span>02</span><b>Напрями співпраці</b></a>
      <a href="#foreign-applicants"><span>03</span><b>Іноземним вступникам</b></a>
      <a href="#legal"><span>04</span><b>Офіційні джерела</b></a>
      <a href="#international-faq"><span>05</span><b>Запитання й відповіді</b></a>
      <a href="#international-contact"><span>06</span><b>Контакти</b></a>
    </div></nav>

    <section id="partners"><div className="wrap">
      <div className="international-intro">
        <div><div className="idx">01 / Міжнародне співробітництво</div><h2>Партнерства, що створюють можливості</h2></div>
        <p>АПСВТ розвиває академічну співпрацю з європейськими закладами освіти для обміну досвідом, підвищення якості освітніх програм і розширення можливостей для студентів та викладачів.</p>
      </div>
      <div className="international-partners">{partners.map((partner) => <article key={partner.number}>
        <span>{partner.number}</span><small>{partner.country} · {partner.place}</small><h3>{partner.title}</h3><p>{partner.text}</p>
      </article>)}</div>
      <div className="erasmus-note"><span>ERASMUS+</span><div><b>Cooperation Partnerships · KA220-HED</b><p>Академія готує спільну заявку з європейськими партнерами, спрямовану на інтеграцію сталого розвитку та цифрових технологій у вищу освіту.</p></div></div>
    </div></section>

    <section className="intl-band" id="cooperation"><div className="wrap">
      <div><div className="idx">02 / Напрями співпраці</div><h2>Працюємо разом</h2><p className="intl-band-lead">Від мобільності до спільних досліджень — міжнародне партнерство має давати практичний результат.</p></div>
      <div className="intl-directions">{cooperationAreas.map((area, index) => <p key={area}><b>{String(index + 1).padStart(2, "0")}</b>{area}<span>↗</span></p>)}</div>
    </div></section>

    <section className="foreign-applicants" id="foreign-applicants"><div className="wrap">
      <div className="foreign-applicants-head">
        <div><div className="idx">03 / International applicants</div><h2>Вступ іноземних громадян</h2></div>
        <p>Офіційний маршрут від електронної заяви до зарахування — без посередників і неперевірених інструкцій.</p>
      </div>

      <div className="invitation-callout">
        <span>Так</span>
        <div><small>Invitation letter</small><h3>Академія оформлює електронне запрошення на навчання</h3><p>Після перевірки документів і прийняття вами освітньої пропозиції АПСВТ підписує електронне запрошення в офіційній Єдиній системі. Воно дійсне шість місяців.</p></div>
        <a href="https://apply.studyinukraine.gov.ua/home" target="_blank" rel="noreferrer">Створити кабінет ↗</a>
      </div>

      <div className="foreign-steps">{applicantSteps.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>

      <div className="foreign-facts">
        <div><b>UA</b><span>мова навчання</span></div>
        <div><b>2</b><span>етапи набору</span></div>
        <div><b>5</b><span>робочих днів на розгляд*</span></div>
        <div><b>6</b><span>місяців дії запрошення</span></div>
      </div>
      <p className="foreign-facts-note">* Базовий строк розгляду заяви закладом освіти. Додаткова державна перевірка в окремих випадках може тривати довше.</p>
    </div></section>

    <section className="soft"><div className="wrap foreign-documents-layout">
      <div>
        <div className="idx">04 / Що підготувати</div><h2>Типовий пакет документів</h2>
        <div className="foreign-checklist">{typicalDocuments.map((document, index) => <div key={document}><span>{String(index + 1).padStart(2, "0")}</span><p>{document}</p></div>)}</div>
      </div>
      <aside className="foreign-deadlines">
        <span>Вступ 2026</span><h3>Строки та формат</h3>
        <div><small>I етап</small><b>до 30 квітня</b></div>
        <div><small>II етап</small><b>за Правилами, не пізніше 1 листопада</b></div>
        <div><small>Випробування</small><b>очно або дистанційно</b></div>
        <p>Навчання в Академії — на контрактній основі. Точний перелік документів залежить від рівня освіти та особистої ситуації.</p>
        <a href="/documents/admissions/07-poriadok-pryiomu-inozemtsiv.pdf" target="_blank" rel="noreferrer">Відкрити Порядок АПСВТ ↗</a>
      </aside>
    </div></section>

    <section className="international-legal" id="legal"><div className="wrap">
      <div className="international-legal-head"><div><div className="idx">05 / Перевірені посилання</div><h2>Офіційні джерела</h2></div><p>Посилання ведуть безпосередньо на чинні документи Верховної Ради України, державну систему Study in Ukraine та нормативні документи Академії.</p></div>
      <div className="international-source-groups">{legalGroups.map((group, groupIndex) => <details key={group.title} open={groupIndex === 0}>
        <summary><span>{String(groupIndex + 1).padStart(2, "0")}</span><b>{group.title}</b><i>+</i></summary>
        <div>{group.links.map(([title, href]) => <a href={href} target="_blank" rel="noreferrer" key={title}><span>{title}</span><b>Відкрити ↗</b></a>)}</div>
      </details>)}</div>
      <div className="official-portals">
        <a href="https://apply.studyinukraine.gov.ua/home" target="_blank" rel="noreferrer"><small>Офіційна подача</small><b>Кабінет іноземного вступника</b><span>apply.studyinukraine.gov.ua ↗</span></a>
        <a href="https://studyinukraine.gov.ua/" target="_blank" rel="noreferrer"><small>Державний портал</small><b>Study in Ukraine</b><span>Інструкції для вступників ↗</span></a>
        <Link href="/admissions#document-assistant"><small>Допомога на сайті</small><b>Запитати RAG-помічника</b><span>Пошук у документах АПСВТ →</span></Link>
      </div>
    </div></section>

    <section id="international-faq"><div className="wrap">
      <div className="sec-head"><div><div className="idx">06 / FAQ</div><h2>Запитання й відповіді</h2></div><p>Короткі пояснення перед поданням документів. У складній ситуації зверніться до міжнародного відділу.</p></div>
      <div className="faq-list international-faq-list">{faq.map(({ question, answer }, index) => <details key={question} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<b>+</b></summary><p>{answer}</p>{index === 1 && <a href="https://apply.studyinukraine.gov.ua/home" target="_blank" rel="noreferrer">Перейти до офіційного кабінету ↗</a>}</details>)}</div>
    </div></section>

    <section className="international-contact" id="international-contact"><div className="wrap international-contact-card">
      <div><div className="idx">07 / Міжнародний відділ</div><h2>Допоможемо пройти маршрут</h2><p>Перевіримо вашу ситуацію, підкажемо щодо документів, освітньої пропозиції та електронного запрошення.</p></div>
      <div className="international-contact-person"><small>Проректор з міжнародного співробітництва</small><h3>Н. М. Гончаренко</h3><a href="mailto:inz@sococvita.kiev.ua">inz@sococvita.kiev.ua</a><a href="tel:+380506073117">+380 50 607 31 17</a></div>
    </div></section>

    <PageDocuments pagePath="/international" />
    <SiteFooter />
  </main>;
}
