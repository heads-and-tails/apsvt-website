import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageDocuments } from "../../components/PageDocuments";
import { DepartmentEditorialContent } from "../../components/DepartmentEditorialContent";
import { getDepartmentEntries } from "@/lib/department-content";
import { SectionHub, type SectionHubItem } from "../../components/SectionHub";
import { EducationQualitySection } from "../../components/EducationQualitySection";

export const metadata: Metadata = {
  title: "Факультет економіки, соціальних технологій і туризму",
  description: "ФЕСТТ АПСВТ: кафедри, освітні програми, практика, міжнародні можливості та документи факультету.",
};

const departments = [
  ["01", "Фінанси", "Фінансовий аналіз, банківська справа, страхування та сталі фінанси.", "/programs/finance", "D2"],
  ["02", "Економіка і менеджмент", "Управління організаціями, підприємництво, торгівля й бізнес-аналітика.", "/programs/management", "D3 · D7"],
  ["03", "Маркетинг", "Ринкова аналітика, бренди, digital-комунікації та поведінка споживачів.", "/programs/marketing", "D5"],
  ["04", "Туристичні дисципліни", "Туристичні продукти, гостинність, рекреація, події та екскурсійна діяльність.", "/departments#tourism", "Кафедра"],
  ["05", "Цифрові технології", "Інтелектуальні системи, цифрова освіта та управління інформаційною безпекою.", "/programs#doctoral-programmes", "A5"],
  ["06", "Енотехнології і сервіс", "Еногастрономічна культура, готельно-ресторанний сервіс і практичні лабораторії.", "/news/hospitality-management-lab", "HoReCa"],
];

const programmes = [
  ["D2", "Фінанси, банківська справа, страхування та фондовий ринок", "/programs/finance"],
  ["D3", "Менеджмент", "/programs/management"],
  ["D5", "Маркетинг", "/programs/marketing"],
  ["D7", "Торгівля", "/programs/trade"],
  ["A5", "Професійна освіта", "/programs#doctoral-programmes"],
];

const facultySections: readonly SectionHubItem[] = [
  { id: "faculty-about", index: "01", title: "Про факультет", description: "Місія, напрями підготовки та рівні освіти.", icon: "F" },
  { id: "departments", index: "02", title: "Кафедри й напрями", description: "Шість академічних напрямів факультету.", icon: "6" },
  { id: "faculty-programmes", index: "03", title: "Освітні програми", description: "Спеціальності та переходи до навчальних планів.", icon: "OP" },
  { id: "faculty-organization", index: "04", title: "Організація факультету", description: "Деканат, вчена рада і студентське представництво.", icon: "ORG" },
  { id: "faculty-science", index: "05", title: "Наукова діяльність", description: "Дослідження, студентські гуртки та проєкти.", icon: "SCI" },
  { id: "faculty-practice", index: "06", title: "Практика й партнери", description: "Лабораторії, стажування та професійні кейси.", icon: "LAB" },
  { id: "faculty-quality", index: "07", title: "Якість освіти", description: "Обговорення, анкети, оцінювання та документи.", icon: "✓" },
  { id: "department-news", index: "08", title: "Новини факультету", description: "Актуальні матеріали та події підрозділів.", icon: "NEWS" },
];

export default async function Page() {
  const departmentEntries = await getDepartmentEntries("/departments/economics-social-tourism-faculty");
  return <main id="top"><SiteHeader />
    <section className="law-faculty-hero festt-hero"><div className="law-faculty-hero-image"><img src="/apsvt-students-real.jpg" alt="Студенти Академії під час навчання" /></div><div className="wrap law-faculty-hero-copy"><Link href="/departments">← Усі кафедри</Link><span>ФЕСТТ · міждисциплінарний факультет</span><h1>Економіка.<br /><em>Технології. Подорож.</em></h1><p>Факультет поєднує бізнес, фінанси, цифрові технології, туризм і гостинність — від фундаментальної підготовки до практики з роботодавцями.</p><div><b>6</b><span>кафедр і напрямів</span><b>5</b><span>освітніх траєкторій</span></div></div></section><div className="hero-rule" />

    <SectionHub sections={facultySections} eyebrow="Навігатор факультету" description="Оберіть кафедри, програми, практику, документи або новини — відкриється тільки потрібний розділ.">

    <section className="law-faculty-intro festt-intro" id="faculty-about"><div className="wrap law-faculty-intro-grid"><div><div className="idx">01 / Про факультет</div><h2>Освіта на перетині економіки й технологій</h2></div><div><p className="program-lede">Факультет готує фахівців для бізнесу, державних і громадських організацій, фінансового сектору, цифрової освіти, туристичної та готельно-ресторанної індустрії.</p><p>Освітні програми поєднують аналітичну підготовку, роботу з реальними кейсами, дослідження та практику. Студент може будувати індивідуальну траєкторію між суміжними професійними сферами.</p><div className="law-faculty-milestones"><span><b>6</b>предметних напрямів</span><span><b>3</b>рівні вищої освіти</span><span><b>1</b>спільна професійна екосистема</span></div></div></div></section>

    <section className="law-faculty-departments festt-departments" id="departments"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Академічна структура</div><h2>Шість напрямів — один факультет</h2></div><p>Оберіть кафедру або напрям, щоб відкрити програму, команду викладачів, партнерів практики та актуальні документи.</p></div><div className="law-department-grid festt-department-grid">{departments.map(([number, title, text, href, code]) => <Link href={href} key={number}><span>{number}</span><small>{code}</small><h3>{title}</h3><p>{text}</p><b>Відкрити напрям →</b></Link>)}</div></div></section>

    <section className="faculty-programmes" id="faculty-programmes"><div className="wrap"><div className="sec-head"><div><div className="idx">03 / Освітні траєкторії</div><h2>Спеціальності й освітні програми</h2></div><p>У кожній програмі однаково розташовані рівні освіти, навчальні плани, вибіркові дисципліни, склад кафедри, наука, партнери та якість.</p></div><div className="faculty-programme-grid">{programmes.map(([code, title, href], index) => <Link href={href} key={code}><span>{String(index + 1).padStart(2, "0")}</span><b>{code}</b><h3>{title}</h3><i>→</i></Link>)}</div></div></section>

    <section className="faculty-activity" id="faculty-organization"><div className="wrap faculty-activity-grid"><div><div className="idx">04 / Організаційна діяльність</div><h2>Деканат, рада і студентське представництво</h2><p>Організаційні рішення факультету координують деканат і вчена рада; студентський старостат представляє здобувачів у питаннях навчання та середовища.</p></div><nav><a href="https://web.archive.org/web/20260527201600/https://www.socosvita.kiev.ua/node/2861" target="_blank" rel="noreferrer">Деканат факультету ↗</a><a href="https://web.archive.org/web/20260527201600/https://www.socosvita.kiev.ua/node/2869" target="_blank" rel="noreferrer">Вчена рада ↗</a><a href="https://web.archive.org/web/20260527201600/https://www.socosvita.kiev.ua/node/2862" target="_blank" rel="noreferrer">Студентський старостат ↗</a></nav></div></section>

    <section className="programme-science" id="faculty-science"><div className="wrap programme-science-grid"><div><div className="idx">05 / Наукова діяльність</div><h2>Кафедральні дослідження та студентські проєкти</h2></div><div><p>Факультет поєднує економічні, управлінські, цифрові й туристичні дослідження. Теми гуртків, конференцій та проєктів зібрані на сторінках відповідних кафедр.</p><Link href="/research">Наука в Академії →</Link></div></div></section>

    <section className="law-practice-showcase festt-practice" id="faculty-practice"><div className="wrap"><div className="law-practice-head"><div><div className="idx">06 / Практика й партнери</div><h2>Від аудиторії — до професійного середовища</h2></div><p>Практика вбудована в освітню траєкторію: лабораторні формати, партнерські кейси, дослідження та стажування.</p></div><div className="law-practice-grid"><Link href="/materials/tourism-lab-533745080.html"><span>01</span><small>Навчальна лабораторія</small><h3>«Академія подорожей»</h3><p>Студенти проєктують маршрути, розраховують туристичний продукт і моделюють роботу підприємства.</p><b>Відкрити лабораторію →</b></Link><Link href="/programs/finance#practice"><span>02</span><small>Партнерські кейси</small><h3>Фінанси та бізнес</h3><p>Аналітичні завдання, професійні стандарти й практика у фінансових та комерційних організаціях.</p><b>Дивитися партнерів →</b></Link><Link href="/news/hospitality-management-lab"><span>03</span><small>Сервіс і гостинність</small><h3>HoReCa лабораторія</h3><p>Практична підготовка у сфері сервісу, еногастрономічної культури та управління гостинністю.</p><b>Перейти до проєкту →</b></Link></div></div></section>

    <EducationQualitySection entries={departmentEntries} pagePath="/departments/economics-social-tourism-faculty" index="07" id="faculty-quality" />
    <div id="department-news"><DepartmentEditorialContent entries={departmentEntries} /></div>
    </SectionHub>
    <PageDocuments pagePath="/departments/economics-social-tourism-faculty" />
    <SiteFooter />
  </main>;
}
