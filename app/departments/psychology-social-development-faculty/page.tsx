import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageDocuments } from "../../components/PageDocuments";
import { DepartmentEditorialContent } from "../../components/DepartmentEditorialContent";
import { getDepartmentEntries } from "@/lib/department-content";
import { SectionHub, type SectionHubItem } from "../../components/SectionHub";
import { AcademicNews } from "../../components/AcademicNews";
import { psychologyCollectiveMeetingNewsSlug } from "@/lib/data";
import { PsychologyFacultyTeam } from "./PsychologyFacultyTeam";
import { AcademicProfileCard } from "../../components/AcademicProfileCard";
import { psychologyFacultyTeam } from "@/lib/psychology-faculty-team";
import { PsychologyFacultyLaboratory, PsychologyFacultyPractice, PsychologyFacultyScience } from "./PsychologyFacultyDetails";
import { officialProgrammeFileBase } from "@/lib/programme-documents";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Факультет психології та соціального розвитку",
  description: "Факультет психології та соціального розвитку АПСВТ: кафедри, освітні програми, наука, практика та якість освіти.",
};

const departments = [
  ["01", "Кафедра клінічної психології та психотерапії", "Психічне здоров’я, психодіагностика, консультування, реабілітація та психотерапевтичні підходи.", "/departments/psychology-social-development-faculty/clinical-psychology", "C4"],
  ["02", "Кафедра психології бізнесу та управління", "Організаційна психологія, професійний розвиток, команди, лідерство та управління змінами.", "/departments/psychology-social-development-faculty/business-psychology", "C4"],
  ["03", "Кафедра соціально-трудових відносин та соціальної роботи", "Соціальна політика, підтримка людей і громад, консультування, кейс-менеджмент та реабілітація.", "/departments/psychology-social-development-faculty/social-work", "I10"],
] as const;

const programmes = [
  { code: "C4", title: "ОПП C4 «Психологія»", level: "Бакалавр", documents: [{ title: "Освітньо-професійна програма · PDF", href: `${officialProgrammeFileBase}/c4-psychology-bachelor-2024-2025.pdf` }] },
  { code: "C4", title: "ОПП «Клінічна психологія»", level: "Магістр", documents: [] },
  { code: "C4", title: "ОПП «Психологія бізнесу та управління»", level: "Магістр", documents: [{ title: "Освітньо-професійна програма · PDF", href: `${officialProgrammeFileBase}/c4-psychology-business-management-master-2024-2025.pdf` }] },
  { code: "C4", title: "ОНП C4 «Психологія»", level: "Доктор філософії", documents: [{ title: "Освітньо-наукова програма · PDF", href: "/documents/programmes/phd/2025/c4-psychology.pdf" }] },
] as const;

const discussionProgrammes = [
  "Освітньо-професійна програма «Психологія» · перший (бакалаврський) рівень вищої освіти",
  "Освітня програма «Клінічна психологія» · другий (магістерський) рівень вищої освіти",
  "Освітня програма «Психологія бізнесу та управління» · другий (магістерський) рівень вищої освіти",
  "Освітньо-наукова програма «Психологія» · третій (доктор філософії) рівень вищої освіти",
] as const;

const facultyCouncil = [
  "Бегеза Людмила, доктор психологічних наук, професор, завідувач кафедри психології бізнесу та управління (тимчасово головуючий).",
  "Пріб Альберт, доктор філософії з підприємництва, торгівлі та біржової діяльності, доцент кафедри соціально-трудових відносин та соціальної роботи (секретар).",
  "Балашова Наталія, кандидат економічних наук, доцент, завідувач кафедри соціально-трудових відносин та соціальної роботи.",
  "Білоус Володимир, кандидат медичних наук, завідувач кафедри клінічної психології та психотерапії.",
  "Абдряхімов Ростислав, доктор медичних наук, професор, професор кафедри клінічної психології та психотерапії.",
  "Карагодіна Олена, доктор медичних наук, професор, професор кафедри клінічної психології та психотерапії.",
  "Мілютіна Катерина, доктор психологічних наук, професор, професор кафедри психології бізнесу та управління.",
  "Борець Олеся, доктор філософії у галузі психології, доцент кафедри психології бізнесу та управління.",
  "Житниська Марія, кандидат педагогічних наук, доцент, доцент кафедри психології бізнесу та управління.",
  "Тесленко Валентин, доктор педагогічних наук, професор, професор кафедри соціально-трудових відносин та соціальної роботи.",
  "Судаков Микола, кандидат соціологічних наук, доцент, доцент кафедри соціально-трудових відносин та соціальної роботи.",
  "Пріб Гліб, доктор медичних наук, професор, проректор з наукової роботи.",
  "Яковенко Ольга, лаборант кафедри психології бізнесу та управління.",
  "Зубченко Катерина, здобувач 3 курсу, першого бакалаврського рівня вищої освіти за спеціальністю С4 Психологія.",
  "Єфімчук Максим, здобувач першого курсу другого (магістерського) рівня вищої освіти спеціальності І10 Соціальна робота та консультування",
] as const;

const discussionSheetUrl = "https://docs.google.com/spreadsheets/d/1LvXqlDlwumX9ySv6mYPD2oMNCP__62YDhhQXANhQBAQ/edit?gid=357331125#gid=357331125";
const discussionFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdy9q5cWFUT5B37z0T-BYHesOkzVPwga7s0HW0a1K5PML2feg/viewform?usp=header";

const facultySections: readonly SectionHubItem[] = [
  { id: "faculty-about", index: "01", title: "Про факультет", description: "Місія, напрями підготовки та рівні освіти.", icon: "F" },
  { id: "faculty-leadership", index: "02", title: "Керівництво та деканат", description: "Координація факультету та підтримка студентів і викладачів.", icon: "DEC" },
  { id: "faculty-council", index: "03", title: "Вчена рада факультету", description: "Склад Вченої ради факультету.", icon: "RAD" },
  { id: "departments", index: "04", title: "Кафедри", description: "Три окремі кафедри з повною структурою сторінок.", icon: "3" },
  { id: "faculty-laboratory", index: "05", title: "Навчально-дослідна лабораторія", description: "Дослідницькі методики, інструменти та практична робота.", icon: "LAB" },
  { id: "faculty-team", index: "06", title: "Науково-педагогічний склад", description: "Профілі викладачів і наукові інтереси факультету.", icon: "NPP" },
  { id: "faculty-science", index: "07", title: "Дослідження факультету та студентські проєкти", description: "Наукова тема, методи, завдання та студентський гурток.", icon: "SCI" },
  { id: "faculty-student-government", index: "08", title: "Студентське самоврядування", description: "Студентська рада, ініціативи, події та контакти.", icon: "STU" },
  { id: "faculty-proposals", index: "10", title: "Проєкти, пропозиції та результати розгляду", description: "Матеріали консультацій зі стейкголдерами й рішення.", icon: "OP" },
  { id: "faculty-accreditation", index: "11", title: "Матеріали акредитаційних справ", description: "Папка матеріалів акредитації спеціальності C4 «Психологія».", icon: "C4" },
  { id: "faculty-repository", index: "12", title: "Репозитарій", description: "Кваліфікаційні роботи та відкриті наукові матеріали.", icon: "REP" },
  { id: "faculty-programmes", index: "13", title: "Освітні програми", description: "Чотири освітні програми C4 «Психологія» за рівнями вищої освіти.", icon: "C4" },
  { id: "faculty-practice", index: "14", title: "Практика й партнери", description: "Професійне середовище, практика та партнерські кейси.", icon: "PR" },
  { id: "department-news", index: "16", title: "Новини факультету", description: "Актуальні матеріали й події кафедр.", icon: "NEWS" },
];

export default async function Page() {
  const pagePath = "/departments/psychology-social-development-faculty";
  const departmentEntries = await getDepartmentEntries(pagePath);
  const dean = psychologyFacultyTeam.find((person) => person.id === "liudmyla-beheza");

  return <main id="top"><SiteHeader />
    <section className="law-faculty-hero festt-hero"><div className="law-faculty-hero-image"><img src="/program-psychology.jpg" alt="Психологічна освіта та робота з людьми" /></div><div className="wrap law-faculty-hero-copy"><Link href="/departments">← Усі факультети й кафедри</Link><span>ФПСР · факультет психології та соціального розвитку</span><h1>Психологія.<br /><em>Соціальний розвиток.</em></h1><p>Формуємо фахівців у сфері психічного здоров’я та соціального благополуччя, які підтримують людину, її професійне зростання і активну участь у суспільстві.</p><div><b>3</b><span>кафедри</span><b>7</b><span>освітніх траєкторій</span></div></div></section><div className="hero-rule" />

    <SectionHub sections={facultySections} eyebrow="Навігатор факультету" description="Оберіть кафедри, програми, науку, практику, документи або новини — відкриється тільки потрібний розділ.">

    <section className="law-faculty-intro festt-intro" id="faculty-about"><div className="wrap law-faculty-intro-grid"><div><div className="idx">01 / Про факультет</div><h2>Пізнаємо особистість та зміцнюємо суспільство</h2></div><div><p className="program-lede">Факультет готує компетентних фахівців у сфері психології та соціальної роботи задля психологічного благополуччя, професійного розвитку й соціальної взаємодії особистості у суспільстві.</p><p>Освітні програми поєднують аналітичну підготовку, роботу з реальними кейсами, дослідження та практику. Студент може будувати індивідуальну траєкторію між суміжними професійними сферами.</p><div className="law-faculty-milestones"><span><b>2</b>предметні напрями</span><span><b>3</b>рівні вищої освіти</span><span><b>1</b>спільна професійна екосистема</span></div></div></div></section>

    <section className="faculty-structure-section faculty-leadership" id="faculty-leadership"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Керівництво та деканат</div><h2>Команда, що координує факультет</h2></div><p>Організаційна, методична та комунікаційна підтримка студентів, викладачів і кафедр.</p></div><div className="faculty-leadership-grid">{dean && <AcademicProfileCard person={{ name: dean.name, role: dean.role, summary: dean.summary, image: dean.image, tags: dean.interests, links: dean.profiles }} />}<AcademicProfileCard badge="Методистка деканату" person={{ name: "Лариса Ламанова", role: "методистка деканату факультету", summary: "Супроводжує методичну та комунікаційну роботу факультету.", image: "/people/psychology-faculty/larysa-lamanova.jpeg", tags: ["методична робота", "комунікація з кафедрами"] }} /><aside className="faculty-office-card"><span>Деканат</span><h3>Організаційна підтримка студентів і викладачів</h3><ul><li>організація освітнього процесу;</li><li>комунікація з кафедрами;</li><li>практична підготовка;</li><li>студентські звернення;</li><li>документообіг факультету.</li></ul><a href="mailto:k.psychology22@gmail.com">Контакти деканату →</a></aside></div></div></section>

    <section className="faculty-structure-section faculty-governance" id="faculty-council"><div className="wrap"><div className="sec-head"><div><div className="idx">03 / Вчена рада факультету</div><h2>Склад вченої ради факультету</h2></div></div><ol className="faculty-council-list">{facultyCouncil.map((member) => <li key={member}>{member}</li>)}</ol></div></section>

    <section className="law-faculty-departments festt-departments" id="departments"><div className="wrap"><div className="sec-head"><div><div className="idx">04 / Академічна структура</div><h2>Три кафедри — один факультет</h2></div><p>Кожна картка відкриває окрему сторінку кафедри зі складом, освітою, наукою, гуртками, новинами, документами й контактами.</p></div><div className="law-department-grid">{departments.map(([number, title, text, href, code]) => <Link href={href} key={number}><span>{number}</span><small>{code}</small><h3>{title}</h3><p>{text}</p><b>Відкрити кафедру →</b></Link>)}</div></div></section>

    <PsychologyFacultyLaboratory />

    <PsychologyFacultyTeam />

    <PsychologyFacultyScience />

    <section className="faculty-structure-section faculty-governance" id="faculty-student-government"><div className="wrap"><div className="sec-head"><div><div className="idx">08 / Студентське самоврядування</div><h2>Участь студентів у житті факультету</h2></div><p>Студентська рада, ініціативи, події, представництво й контакти відкриваються окремо.</p></div><div className="faculty-link-grid"><Link className="faculty-link-card faculty-link-card-gold" href="/students/council"><span>01 / Студенти</span><h3>Студентська рада</h3><p>Команда, проєкти, ініціативи, події та контакти.</p><b>Відкрити студентську раду →</b></Link></div></div></section>

    <section className="faculty-structure-section faculty-repository" id="faculty-proposals"><div className="wrap"><div className="sec-head"><div><div className="idx">10 / Проєкти, пропозиції та результати розгляду</div><h2>Від пропозиції — до рішення</h2></div><p>Проєкти освітніх програм, отримані пропозиції стейкголдерів і результати їх розгляду публікуються окремо.</p></div><div id="faculty-discussion"><h3>Психологія · Обговорення змін до ОП</h3><div className="faculty-link-grid">{discussionProgrammes.map((title, index) => <article className={index === 0 ? "faculty-link-card faculty-link-card-blue" : "faculty-link-card"} key={title}><span>{String(index + 1).padStart(2, "0")} / C4</span><h3>{title}</h3><p><a href={discussionFormUrl} target="_blank" rel="noreferrer">Форма для пропозицій ↗</a></p><p><a href={discussionSheetUrl} target="_blank" rel="noreferrer">Таблиця з пропозиціями ↗</a></p></article>)}</div></div><div className="faculty-link-grid"><Link className="faculty-link-card" href="/programs/social-work#quality"><span>02 / I10</span><h3>Соціальна робота та консультування</h3><p>Проєкти, пропозиції й результати розгляду.</p><b>Перейти до якості програми →</b></Link></div></div></section>

    <section className="faculty-structure-section faculty-repository" id="faculty-accreditation"><div className="wrap"><div className="sec-head"><div><div className="idx">11 / Матеріали акредитаційних справ</div><h2>Матеріали спеціальності C4 «Психологія»</h2></div><p>Документи зібрано у спільній папці факультету — без окремого архіву.</p></div><div className="faculty-link-grid"><a className="faculty-link-card faculty-link-card-dark" href="https://drive.google.com/drive/folders/11TgK4XqA1qKd2V8dy6A7c9an0oX0A49r?usp=sharing" target="_blank" rel="noreferrer"><span>01 / Google Drive</span><h3>Папка матеріалів акредитаційних справ</h3><p>Перегляд актуальних матеріалів факультету в одному місці.</p><b>Відкрити папку ↗</b></a></div><PageDocuments pagePath={pagePath} /></div></section>

    <section className="faculty-structure-section faculty-repository" id="faculty-repository"><div className="wrap"><div className="sec-head"><div><div className="idx">12 / Репозитарій</div><h2>Кваліфікаційні роботи та наукові матеріали</h2></div><p>Каталог можна переглядати за програмою, роком, автором і науковим керівником.</p></div><div className="faculty-link-grid"><Link className="faculty-link-card faculty-link-card-blue" href="/research/theses"><span>01 / C4</span><h3>Психологія</h3><p>Бакалаврські, магістерські й дослідницькі роботи.</p><b>Відкрити репозитарій →</b></Link><Link className="faculty-link-card" href="/research/theses"><span>02 / I10</span><h3>Соціальна робота та консультування</h3><p>Кваліфікаційні роботи соціального напряму.</p><b>Відкрити репозитарій →</b></Link></div></div></section>

    <section className="faculty-programmes" id="faculty-programmes"><div className="wrap"><div className="sec-head"><div><div className="idx">13 / Освітні програми</div><h2>Освітні програми факультету</h2></div></div><div className="faculty-programme-grid">{programmes.map((programme, index) => <article key={programme.title}><span>{String(index + 1).padStart(2, "0")}</span><b>{programme.code} · {programme.level}</b><h3>{programme.title}</h3><div className="faculty-programme-documents">{programme.documents.map((document) => <a href={document.href} target="_blank" rel="noreferrer" key={document.href}>{document.title} ↗</a>)}{programme.documents.length === 0 && <p>ОПП у PDF буде додано після надання факультетом.</p>}<p>Навчальний план у PDF буде додано після надання факультетом.</p></div></article>)}</div></div></section>

    <PsychologyFacultyPractice />

    <div id="department-news"><AcademicNews slugs={["psychology", "social-work"]} title="Новини факультету й кафедр" limit={5} prioritySlugs={[psychologyCollectiveMeetingNewsSlug]} /><DepartmentEditorialContent entries={departmentEntries} /></div>
    </SectionHub>
    <SiteFooter />
  </main>;
}
