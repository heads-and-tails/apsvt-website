import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageDocuments } from "../../components/PageDocuments";
import { DepartmentEditorialContent } from "../../components/DepartmentEditorialContent";
import { getDepartmentEntries } from "@/lib/department-content";
import { AcademicPageMap } from "../../components/AcademicPageMap";
import "./criminal-law.css";

export const metadata: Metadata = {
  title: "Кафедра кримінального права, процесу та криміналістики",
  description: "Команда, дисципліни, дослідження та практична підготовка кафедри кримінального права, процесу та криміналістики АПСВТ.",
};

const faculty = [
  {
    name: "Ірина Завидняк",
    fullName: "Завидняк Ірина Олександрівна",
    role: "Завідувачка кафедри",
    degree: "кандидатка юридичних наук, доцентка",
    image: "/people/law/criminal/iryna-zavydniak.jpg",
    position: "50% 22%",
    disciplines: ["Кримінально-правова кваліфікація злочинів", "Протидія та запобігання корупції в Україні", "Судові та правоохоронні органи", "Юридична психологія", "Сучасні тенденції розвитку кримінального права і процесу", "Міжнародне співробітництво у сфері запобігання злочинності"],
    bio: "Магістр права, у 2016 році захистила дисертацію про адміністративно-правовий статус благодійних організацій в Україні. Має практичний досвід служби у податковій міліції, викладає та проводить дослідження у сфері кримінального права і процесу. Авторка понад 100 наукових і навчально-методичних праць. Очолює кафедру з вересня 2023 року.",
    orcid: "https://orcid.org/0000-0003-1816-7426",
    scholar: "https://scholar.google.com.ua/citations?hl=uk&user=LaBtTboAAAAJ",
  },
  {
    name: "Володимир Ліпкан",
    fullName: "Ліпкан Володимир Анатолійович",
    role: "Професор кафедри",
    degree: "доктор юридичних наук, доктор політичних наук, професор",
    image: "/people/law/criminal/volodymyr-lipkan.jpg",
    position: "50% 42%",
    disciplines: ["Кримінально-виконавче право", "Судові та правоохоронні органи", "Міжнародно-правова відповідальність", "Криміналістика", "Сучасні тенденції розвитку кримінального права і процесу"],
    bio: "Дослідник проблем безпеки, стратегічних комунікацій, інформаційної та кібербезпекової політики, інформаційного права і правового регулювання штучного інтелекту. Автор понад 350 наукових праць, монографій, підручників і навчальних посібників.",
    orcid: "https://orcid.org/0000-0002-7411-2086",
    scholar: "https://scholar.google.com/citations?user=mmE8GhkAAAAJ",
  },
  {
    name: "Микола Маломуж",
    fullName: "Маломуж Микола Григорович",
    role: "Професор кафедри",
    degree: "фахівець із національної безпеки та розвідки",
    image: "/people/law/criminal/mykola-malomuzh.jpg",
    position: "50% 28%",
    disciplines: ["Основи національної безпеки України", "Національна безпека України"],
    bio: "Юрист за освітою. Пройшов шлях від оперативної та керівної роботи у сфері державної безпеки до керівника Служби зовнішньої розвідки України та радника Президента України. З 2023 року працює професором кафедри.",
  },
  {
    name: "Андрій Бегма",
    fullName: "Бегма Андрій Петрович",
    role: "Доцент кафедри",
    degree: "кандидат юридичних наук, доцент",
    image: "/people/law/criminal/andrii-behma.jpg",
    position: "50% 30%",
    disciplines: ["Кримінальний процес", "Методика підтримання прокурором публічного обвинувачення", "Кримінально-процесуальні документи", "Виконавчий процес", "Криміналістика"],
    bio: "Випускник Національної академії внутрішніх справ, працював слідчим. У 2011 році захистив дисертацію «Прокурор як суб’єкт кримінально-процесуальної діяльності». В Академії працює з 2013 року, поєднує викладання з юридичною практикою.",
    orcid: "https://orcid.org/0000-0003-3009-2850",
  },
  {
    name: "Роман Лев",
    fullName: "Лев Роман Васильович",
    role: "Доцент кафедри",
    degree: "доктор філософії в галузі права, доцент",
    image: "/people/law/criminal/roman-lev.jpg",
    position: "50% 26%",
    disciplines: ["Кримінальне право", "Кримінологія", "Кіберполіція в Україні", "Виявлення та розслідування кіберзлочинів"],
    bio: "Юрист і адвокат. Захистив дисертацію, присвячену розслідуванню злочинів, учинених службовими особами юридичних осіб публічного права. Керує адвокатським бюро та з січня 2025 року працює доцентом кафедри.",
    orcid: "https://orcid.org/0009-0005-7316-9012",
  },
  {
    name: "Олександр Ярмоленко",
    fullName: "Ярмоленко Олександр Сергійович",
    role: "Доцент кафедри",
    degree: "доктор юридичних наук",
    image: "/people/law/criminal/oleksandr-yarmolenko.jpg",
    position: "50% 36%",
    disciplines: ["Міжнародно-правова відповідальність", "Прокуратура в Україні", "Кримінально-виконавче право"],
    bio: "Випускник Національної академії державної податкової служби України. Має багаторічний досвід у податковій міліції, органах внутрішніх справ і Державній податковій службі. З 2023 року здійснює адвокатську діяльність. Автор понад 50 наукових і навчально-методичних праць.",
    orcid: "https://orcid.org/0000-0003-1414-5991",
  },
];

const departmentPageMap = [
  { label: "Про кафедру", note: "історія та професійні напрями", href: "#department-about" },
  { label: "Спеціальність і програми", note: "D8 Право та дисципліни кафедри", href: "#department-education" },
  { label: "Освітні матеріали", note: "плани, робочі програми й вибір", href: "#department-education" },
  { label: "Склад кафедри", note: "науковці та юристи-практики", href: "#team" },
  { label: "Наукова діяльність", note: "дослідження, публікації та гуртки", href: "#science" },
  { label: "Практика й партнери", note: "лабораторія та професійні бази", href: "#practice" },
  { label: "Якість освіти", note: "обговорення, анкети та оцінювання", href: "#quality" },
  { label: "Новини кафедри", note: "події й актуальні матеріали", href: "#department-news" },
];

export default async function Page() {
  const departmentEntries = await getDepartmentEntries("/departments/criminal-law");
  return <main id="top" className="criminal-department"><SiteHeader />
    <section className="criminal-department-hero">
      <div className="wrap criminal-department-hero-grid">
        <div className="criminal-department-hero-copy">
          <div className="crumb"><Link href="/">Головна</Link> / <Link href="/departments/law-faculty">Юридичний факультет</Link> / Кафедра</div>
          <span>Юридичний факультет · з 1996 року</span>
          <h1>Кримінальне право, <em>процес і криміналістика</em></h1>
          <p>Кафедра поєднує фундаментальну правничу підготовку, реальні професійні сценарії та практику в лабораторії криміналістики.</p>
          <div className="criminal-department-hero-actions"><a href="#team">Команда кафедри ↓</a><Link href="/programs/law/forensic-laboratory">Лабораторія криміналістики ↗</Link></div>
        </div>
        <figure className="criminal-department-hero-portrait"><img src="/people/law/criminal/iryna-zavydniak.jpg" alt="Ірина Завидняк, завідувачка кафедри" /><figcaption><small>Завідувачка кафедри</small><strong>Ірина Завидняк</strong><span>кандидатка юридичних наук, доцентка</span></figcaption></figure>
      </div>
    </section>
    <div className="hero-rule" />

    <AcademicPageMap kind="кафедра" title="Кафедра → програма → матеріали" items={departmentPageMap} />

    <section className="criminal-department-about" id="department-about"><div className="wrap criminal-department-about-grid">
      <div><div className="idx">01 / Про кафедру</div><h2>Три напрями. Одна професійна логіка.</h2></div>
      <div><p className="program-lede">Кафедру створено у вересні 1996 року. Її першим завідувачем був доктор юридичних наук, професор Ігор Лановенко.</p><p>У різні роки кафедру очолювали Володимир Василевич, Євген Невмержицький, Володимир Грязін, Ігор Лановенко, Олексій Ховпун та Ігор Діордіца. З вересня 2023 року кафедру очолює Ірина Завидняк.</p><div className="criminal-department-pillars"><article><span>01</span><h3>Кримінальне право</h3><p>Кваліфікація правопорушень, кримінальна відповідальність, кримінологія та запобігання злочинності.</p></article><article><span>02</span><h3>Кримінальний процес</h3><p>Процесуальні документи, прокуратура, судові та правоохоронні органи, захист прав людини.</p></article><article><span>03</span><h3>Криміналістика</h3><p>Фіксація слідів, аналіз документів, моделювання слідчих дій і сучасні методи розслідування.</p></article></div></div>
    </div></section>

    <section className="programme-documents" id="department-education"><div className="wrap"><div className="programme-documents-head"><div><div className="idx">02 / Спеціальність і освітні матеріали</div><h2>D8 «Право»: програма та дисципліни</h2></div><Link href="/programs/law#curriculum">Відкрити навчальний план →</Link></div><div className="programme-document-list"><Link href="/programs/law"><span>01</span><div><small>Бакалавр · магістр · PhD</small><h3>Освітня програма D8 «Право»</h3></div><b>→</b></Link><Link href="/programs/law#electives"><span>02</span><div><small>Індивідуальна траєкторія</small><h3>Вибіркові дисципліни</h3></div><b>→</b></Link><a href="/documents/archive/may-2026/criminal-law-department-2023.pdf" target="_blank" rel="noreferrer"><span>03</span><div><small>PDF · архів травня 2026</small><h3>Положення про кафедру</h3></div><b>↗</b></a></div></div></section>

    <section className="criminal-department-team" id="team"><div className="wrap">
      <div className="sec-head"><div><div className="idx">03 / Склад кафедри</div><h2>Науковці та юристи-практики</h2></div><p>Однаковий формат карток допомагає швидко побачити роль, науковий ступінь, дисципліни та професійний досвід кожного викладача.</p></div>
      <div className="criminal-department-team-grid">{faculty.map((person, index) => <article className={index === 0 ? "is-head" : ""} key={person.fullName}>
        <div className="criminal-department-person-image"><img src={person.image} alt={person.fullName} style={{ objectPosition: person.position }} /><span>{String(index + 1).padStart(2, "0")}</span></div>
        <div className="criminal-department-person-copy"><small>{person.role}</small><h3>{person.name}</h3><p className="criminal-department-degree">{person.degree}</p><details><summary>Дисципліни й біографія <span>+</span></summary><div><h4>Викладає</h4><ul>{person.disciplines.map((discipline) => <li key={discipline}>{discipline}</li>)}</ul><h4>Професійний профіль</h4><p>{person.bio}</p>{(person.orcid || person.scholar) && <nav>{person.orcid && <a href={person.orcid} target="_blank" rel="noreferrer">ORCID ↗</a>}{person.scholar && <a href={person.scholar} target="_blank" rel="noreferrer">Google Scholar ↗</a>}</nav>}</div></details></div>
      </article>)}</div>
    </div></section>

    <section className="criminal-department-research" id="science"><div className="wrap">
      <div className="sec-head"><div><div className="idx">04 / Наукова діяльність</div><h2>Дослідження, що відповідають практиці</h2></div><p>Кафедра досліджує протидію злочинності й корупції, кримінальну відповідальність у сфері трудового законодавства та сучасні виклики безпеці. Студентські наукові формати й теми гуртків кафедра актуалізує протягом навчального року.</p></div>
      <div className="criminal-department-research-grid"><div className="criminal-department-themes"><article><span>01</span><h3>Боротьба зі злочинністю та корупцією</h3><p>Як складова соціальної політики України на шляху розвитку громадянського суспільства.</p></article><article><span>02</span><h3>Кримінальна відповідальність у сфері праці</h3><p>Дотримання трудового законодавства й правові механізми відповідальності.</p></article></div><div className="criminal-department-metrics"><span><b>10</b>монографій</span><span><b>4</b>підручники</span><span><b>24</b>навчальні посібники</span><span><b>100+</b>наукових статей</span><span><b>50+</b>тез конференцій</span><small>Результати наукової роботи кафедри за останні п’ять років за наданими матеріалами.</small></div></div>
    </div></section>

    <section className="criminal-department-practice" id="practice"><div className="wrap criminal-department-practice-grid"><div><div className="idx">05 / Практика й партнери</div><h2>Від матеріалів справи до процесуальної дії</h2><p>Студенти працюють із професійними сценаріями, беруть участь у тренінгах і судових симуляціях, проходять практику в правоохоронних органах, судах, адвокатських об’єднаннях та нотаріаті.</p><Link href="/programs/law/forensic-laboratory">Відкрити лабораторію криміналістики →</Link></div><div className="criminal-department-practice-list"><span><b>01</b>Дактилоскопічні дослідження</span><span><b>02</b>Фіксація слідів і робота з доказами</span><span><b>03</b>Криміналістичний аналіз документів</span><span><b>04</b>Моделювання слідчих дій</span></div></div></section>

    <section className="programme-quality" id="quality"><div className="wrap programme-quality-grid"><div><div className="idx">06 / Якість освіти</div><h2>Обговорення, опитування та оцінювання</h2><p>Пропозиції до програми, результати опитувань здобувачів і оцінювання викладачів зібрані в єдиному контурі якості Академії.</p></div><nav><a href="/documents/archive/may-2026/quality-system.pdf" target="_blank" rel="noreferrer">Система забезпечення якості ↗</a><a href="/documents/archive/may-2026/student-survey-questionnaires.pdf" target="_blank" rel="noreferrer">Анкети здобувачів ↗</a><Link href="/contacts">Надіслати пропозицію до програми →</Link></nav></div></section>

    <section className="criminal-department-links"><div className="wrap"><Link href="/departments/law-faculty"><span>Юридичний факультет</span><b>Усі кафедри факультету →</b></Link><Link href="/programs/law"><span>Освітня програма</span><b>D8 «Право» →</b></Link><Link href="/programs/law/forensic-laboratory"><span>Практичний осередок</span><b>Лабораторія криміналістики →</b></Link></div></section>
    <div id="department-news"><DepartmentEditorialContent entries={departmentEntries} /></div>
    <PageDocuments pagePath="/departments/criminal-law" />
    <SiteFooter />
  </main>;
}
