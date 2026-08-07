import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageDocuments } from "../../components/PageDocuments";
import { DepartmentEditorialContent } from "../../components/DepartmentEditorialContent";
import { getDepartmentEntries } from "@/lib/department-content";

export const metadata: Metadata = {
  title: "Факультет економіки, соціальних технологій і туризму",
  description: "ФЕСТТ АПСВТ: кафедри, освітні програми, практика, міжнародні можливості та документи факультету.",
};

const departments = [
  ["01", "Психологія", "Консультування, психічне здоров’я, організаційна психологія та дослідження.", "/programs/psychology", "C4"],
  ["02", "Фінанси", "Фінансовий аналіз, банківська справа, страхування та сталі фінанси.", "/programs/finance", "D2"],
  ["03", "Економіка і менеджмент", "Управління організаціями, підприємництво, торгівля й бізнес-аналітика.", "/programs/management", "D3 · D7"],
  ["04", "Маркетинг", "Ринкова аналітика, бренди, digital-комунікації та поведінка споживачів.", "/programs/marketing", "D5"],
  ["05", "Соціальна робота", "Соціальна політика, підтримка людей і громад, консультування та реабілітація.", "/programs/social-work", "I10"],
  ["06", "Туризм", "Туристичні продукти, гостинність, рекреація, події та екскурсійна діяльність.", "/programs/tourism", "J3"],
  ["07", "Цифрові технології", "Інтелектуальні системи, цифрова освіта та управління інформаційною безпекою.", "/programs#doctoral-programmes", "A5"],
  ["08", "Енотехнології і сервіс", "Еногастрономічна культура, готельно-ресторанний сервіс і практичні лабораторії.", "/news/hospitality-management-lab", "HoReCa"],
];

const programmes = [
  ["D2", "Фінанси, банківська справа, страхування та фондовий ринок", "/programs/finance"],
  ["D3", "Менеджмент", "/programs/management"],
  ["D5", "Маркетинг", "/programs/marketing"],
  ["D7", "Торгівля", "/programs/trade"],
  ["C4", "Психологія", "/programs/psychology"],
  ["I10", "Соціальна робота та консультування", "/programs/social-work"],
  ["J3", "Туризм та рекреація", "/programs/tourism"],
  ["A5", "Професійна освіта", "/programs#doctoral-programmes"],
];

export default async function Page() {
  const departmentEntries = await getDepartmentEntries("/departments/economics-social-tourism-faculty");
  return <main id="top"><SiteHeader />
    <section className="law-faculty-hero festt-hero"><div className="law-faculty-hero-image"><img src="/apsvt-students-real.jpg" alt="Студенти Академії під час навчання" /></div><div className="wrap law-faculty-hero-copy"><Link href="/departments">← Усі кафедри</Link><span>ФЕСТТ · міждисциплінарний факультет</span><h1>Економіка.<br /><em>Людина. Подорож.</em></h1><p>Факультет поєднує бізнес, соціальні науки, цифрові технології, психологію, туризм і гостинність — від фундаментальної підготовки до практики з роботодавцями.</p><div><b>8</b><span>кафедр і напрямів</span><b>8</b><span>освітніх траєкторій</span></div></div></section><div className="hero-rule" />

    <section className="law-faculty-intro festt-intro"><div className="wrap law-faculty-intro-grid"><div><div className="idx">01 / Про факультет</div><h2>Освіта на перетині<br />економіки й суспільства</h2></div><div><p className="program-lede">Факультет готує фахівців для бізнесу, державних і громадських організацій, фінансового сектору, соціальної сфери, туристичної та готельно-ресторанної індустрії.</p><p>Освітні програми поєднують аналітичну підготовку, роботу з реальними кейсами, дослідження та практику. Студент може будувати індивідуальну траєкторію між суміжними професійними сферами.</p><div className="law-faculty-milestones"><span><b>8</b>предметних напрямів</span><span><b>3</b>рівні вищої освіти</span><span><b>1</b>спільна професійна екосистема</span></div></div></div></section>

    <section className="law-faculty-departments festt-departments" id="departments"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Академічна структура</div><h2>Вісім напрямів —<br />один факультет</h2></div><p>Оберіть кафедру або напрям, щоб відкрити програму, команду викладачів, партнерів практики та актуальні документи.</p></div><div className="law-department-grid festt-department-grid">{departments.map(([number, title, text, href, code]) => <Link href={href} key={number}><span>{number}</span><small>{code}</small><h3>{title}</h3><p>{text}</p><b>Відкрити напрям →</b></Link>)}</div></div></section>

    <section className="law-practice-showcase festt-practice"><div className="wrap"><div className="law-practice-head"><div><div className="idx">03 / Практичне навчання</div><h2>Від аудиторії —<br />до професійного середовища</h2></div><p>Практика вбудована в освітню траєкторію: лабораторні формати, партнерські кейси, дослідження та стажування.</p></div><div className="law-practice-grid"><Link href="/materials/tourism-lab-533745080.html"><span>01</span><small>Навчальна лабораторія</small><h3>«Академія<br />подорожей»</h3><p>Студенти проєктують маршрути, розраховують туристичний продукт і моделюють роботу підприємства.</p><b>Відкрити лабораторію →</b></Link><Link href="/programs/finance#practice"><span>02</span><small>Партнерські кейси</small><h3>Фінанси<br />та бізнес</h3><p>Аналітичні завдання, професійні стандарти й практика у фінансових та комерційних організаціях.</p><b>Дивитися партнерів →</b></Link><Link href="/news/hospitality-management-lab"><span>03</span><small>Сервіс і гостинність</small><h3>HoReCa<br />лабораторія</h3><p>Практична підготовка у сфері сервісу, еногастрономічної культури та управління гостинністю.</p><b>Перейти до проєкту →</b></Link></div></div></section>

    <section className="faculty-programmes"><div className="wrap"><div className="sec-head"><div><div className="idx">04 / Освітні траєкторії</div><h2>Оберіть свою<br />програму</h2></div><p>Кожна сторінка містить опис навчання, кафедру, практику, партнерів, викладачів і документи програми.</p></div><div className="faculty-programme-grid">{programmes.map(([code, title, href], index) => <Link href={href} key={code}><span>{String(index + 1).padStart(2, "0")}</span><b>{code}</b><h3>{title}</h3><i>→</i></Link>)}</div></div></section>

    <section className="programme-documents"><div className="wrap"><div className="programme-documents-head"><div><div className="idx">05 / Якість і документи</div><h2>Головне —<br />у зрозумілих розділах</h2></div><Link href="/documents#quality">Документи з якості →</Link></div><div className="programme-document-list"><Link href="/programs"><span>01</span><div><small>Каталог</small><h3>Освітні програми факультету</h3></div><b>↗</b></Link><Link href="/documents#quality"><span>02</span><div><small>Якість освіти</small><h3>Акредитації, опитування та внутрішні положення</h3></div><b>↗</b></Link><Link href="/admissions#exam-programs"><span>03</span><div><small>Вступ 2026</small><h3>Програми вступних випробувань</h3></div><b>↗</b></Link></div><div className="law-faculty-source"><span>Зміст упорядковано на основі офіційних матеріалів факультету</span><Link href="/materials">Відновлений каталог матеріалів →</Link></div></div></section>
    <DepartmentEditorialContent entries={departmentEntries} />
    <PageDocuments pagePath="/departments/economics-social-tourism-faculty" />
    <SiteFooter />
  </main>;
}
