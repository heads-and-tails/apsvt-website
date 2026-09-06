import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageDocuments } from "../../components/PageDocuments";
import { DepartmentEditorialContent } from "../../components/DepartmentEditorialContent";
import { getDepartmentEntries } from "@/lib/department-content";
import { SectionHub, type SectionHubItem } from "../../components/SectionHub";
import { EducationQualitySection } from "../../components/EducationQualitySection";
import { AcademicPartners } from "../../components/AcademicPartners";
import { AcademicNews } from "../../components/AcademicNews";
import { PsychologyFacultyTeam } from "./PsychologyFacultyTeam";
import { AcademicProfileCard } from "../../components/AcademicProfileCard";
import { psychologyFacultyTeam } from "@/lib/psychology-faculty-team";

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
  ["C4", "Психологія", "Бакалаврський, магістерський і третій рівень освіти; клінічна та організаційна траєкторії.", "/programs/psychology"],
  ["I10", "Соціальна робота та консультування", "Бакалаврський і магістерський рівні; підтримка людей, громад і соціальних інституцій.", "/programs/social-work"],
];

const facultySections: readonly SectionHubItem[] = [
  { id: "faculty-about", index: "01", title: "Про факультет", description: "Місія, напрями підготовки та рівні освіти.", icon: "F" },
  { id: "faculty-leadership", index: "02", title: "Керівництво та деканат", description: "Координація факультету та підтримка студентів і викладачів.", icon: "DEC" },
  { id: "faculty-council", index: "03", title: "Вчена рада", description: "Колегіальні рішення, документи й матеріали засідань.", icon: "RAD" },
  { id: "departments", index: "04", title: "Кафедри", description: "Три окремі кафедри з повною структурою сторінок.", icon: "3" },
  { id: "faculty-laboratory", index: "05", title: "Навчально-дослідна лабораторія", description: "Дослідницькі методики, інструменти та практична робота.", icon: "LAB" },
  { id: "faculty-team", index: "06", title: "Науково-педагогічний склад", description: "Профілі викладачів і наукові інтереси факультету.", icon: "NPP" },
  { id: "faculty-science", index: "07", title: "Наукова діяльність", description: "Дослідження, гуртки, конференції та студентські проєкти.", icon: "SCI" },
  { id: "faculty-student-government", index: "08", title: "Студентське самоврядування", description: "Студентська рада, ініціативи, події та контакти.", icon: "STU" },
  { id: "faculty-discussion", index: "09", title: "Громадське обговорення освітніх програм", description: "Бакалаврат, клінічна психологія та психологія бізнесу.", icon: "DIA" },
  { id: "faculty-proposals", index: "10", title: "Проєкти, пропозиції та результати розгляду", description: "Матеріали консультацій зі стейкголдерами й рішення.", icon: "OP" },
  { id: "faculty-accreditation", index: "11", title: "Матеріали акредитаційних справ", description: "Архів матеріалів акредитації спеціальності C4 «Психологія».", icon: "ZIP" },
  { id: "faculty-repository", index: "12", title: "Репозитарій", description: "Кваліфікаційні роботи та відкриті наукові матеріали.", icon: "REP" },
  { id: "faculty-programmes", index: "13", title: "Освітні програми", description: "C4 «Психологія» та I10 «Соціальна робота».", icon: "C4" },
  { id: "faculty-practice", index: "14", title: "Практика й партнери", description: "Професійне середовище, практика та партнерські кейси.", icon: "PR" },
  { id: "faculty-quality", index: "15", title: "Якість освіти", description: "Моніторинг, обговорення змін та оцінювання НПП.", icon: "✓" },
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

    <section className="faculty-structure-section faculty-governance" id="faculty-council"><div className="wrap"><div className="sec-head"><div><div className="idx">03 / Вчена рада</div><h2>Колегіальні рішення факультету</h2></div><p>Склад, плани роботи, засідання, рішення та протоколи публікуються в окремому розділі.</p></div><div className="faculty-link-grid"><Link className="faculty-link-card faculty-link-card-dark" href="/documents#governance"><span>01 / Документи</span><h3>Матеріали Вченої ради</h3><p>Офіційні документи колегіального органу та архів за роками.</p><b>Перейти до документів →</b></Link></div></div></section>

    <section className="law-faculty-departments festt-departments" id="departments"><div className="wrap"><div className="sec-head"><div><div className="idx">04 / Академічна структура</div><h2>Три кафедри — один факультет</h2></div><p>Кожна картка відкриває окрему сторінку кафедри зі складом, освітою, наукою, гуртками, новинами, документами й контактами.</p></div><div className="law-department-grid">{departments.map(([number, title, text, href, code]) => <Link href={href} key={number}><span>{number}</span><small>{code}</small><h3>{title}</h3><p>{text}</p><b>Відкрити кафедру →</b></Link>)}</div></div></section>

    <section className="law-practice-showcase festt-practice" id="faculty-laboratory"><div className="wrap"><div className="law-practice-head"><div><div className="idx">05 / Навчально-дослідна лабораторія</div><h2>Дослідження та практичний інструментарій</h2></div><p>Окремий простір для методик, дослідницьких проєктів і практичної підготовки студентів.</p></div><div className="law-practice-grid"><Link href="/programs/psychology#science"><span>01</span><small>Дослідницька робота</small><h3>Психологічно-соціальний інструментарій</h3><p>Матеріали лабораторії, методики та результати досліджень.</p><b>Відкрити матеріали →</b></Link></div></div></section>

    <PsychologyFacultyTeam />

    <section className="programme-science" id="faculty-science"><div className="wrap programme-science-grid"><div><div className="idx">07 / Наукова діяльність</div><h2>Кафедральні дослідження та студентські проєкти</h2></div><div><p>Факультет поєднує психологічні та соціальні дослідження. Теми наукових гуртків, конференцій і студентських проєктів публікуються на сторінках відповідних кафедр та в науковому розділі Академії.</p><Link href="/research">Наука в Академії →</Link></div></div></section>

    <section className="faculty-structure-section faculty-governance" id="faculty-student-government"><div className="wrap"><div className="sec-head"><div><div className="idx">08 / Студентське самоврядування</div><h2>Участь студентів у житті факультету</h2></div><p>Студентська рада, ініціативи, події, представництво й контакти відкриваються окремо.</p></div><div className="faculty-link-grid"><Link className="faculty-link-card faculty-link-card-gold" href="/students/council"><span>01 / Студенти</span><h3>Студентська рада</h3><p>Команда, проєкти, ініціативи, події та контакти.</p><b>Відкрити студентську раду →</b></Link></div></div></section>

    <section className="faculty-structure-section faculty-repository" id="faculty-discussion"><div className="wrap"><div className="sec-head"><div><div className="idx">09 / Громадське обговорення освітніх програм</div><h2>Долучіться до оновлення програм C4</h2></div><p>Форма приймає пропозиції до бакалаврської програми, клінічної психології та психології бізнесу й управління.</p></div><div className="faculty-link-grid">{["Бакалавр", "Клінічна психологія", "Психологія бізнесу та управління"].map((title, index) => <a className={index === 0 ? "faculty-link-card faculty-link-card-blue" : "faculty-link-card"} href="https://docs.google.com/forms/d/e/1FAIpQLSdy9q5cWFUT5B37z0T-BYHesOkzVPwga7s0HW0a1K5PML2feg/viewform?usp=header" target="_blank" rel="noreferrer" key={title}><span>{String(index + 1).padStart(2, "0")} / C4</span><h3>{title}</h3><p>Надіслати пропозицію до освітньої програми через офіційну форму.</p><b>Відкрити форму ↗</b></a>)}</div></div></section>

    <section className="faculty-structure-section faculty-repository" id="faculty-proposals"><div className="wrap"><div className="sec-head"><div><div className="idx">10 / Проєкти, пропозиції та результати розгляду</div><h2>Від пропозиції — до рішення</h2></div><p>Проєкти освітніх програм, отримані пропозиції стейкголдерів і результати їх розгляду публікуються окремо.</p></div><div className="faculty-link-grid"><Link className="faculty-link-card" href="/programs/psychology#quality"><span>01 / C4</span><h3>Психологія</h3><p>Матеріали обговорення та оновлення освітніх програм.</p><b>Перейти до якості програми →</b></Link><Link className="faculty-link-card" href="/programs/social-work#quality"><span>02 / I10</span><h3>Соціальна робота та консультування</h3><p>Проєкти, пропозиції й результати розгляду.</p><b>Перейти до якості програми →</b></Link></div></div></section>

    <section className="faculty-structure-section faculty-repository" id="faculty-accreditation"><div className="wrap"><div className="sec-head"><div><div className="idx">11 / Матеріали акредитаційних справ</div><h2>Архів спеціальності C4 «Психологія»</h2></div><p>Переданий факультетом архів зібрано в одному місці. Формат файлу — RAR.</p></div><div className="faculty-link-grid"><a className="faculty-link-card faculty-link-card-dark" href="https://drive.google.com/file/d/1C1iWNznxJvdSZhtTcVyo8B0xg6uhskHp/view" target="_blank" rel="noreferrer"><span>01 / RAR</span><h3>Матеріали акредитаційних справ</h3><p>Архів офіційних матеріалів факультету для перегляду й завантаження.</p><b>Відкрити архів ↗</b></a></div><PageDocuments pagePath={pagePath} /></div></section>

    <section className="faculty-structure-section faculty-repository" id="faculty-repository"><div className="wrap"><div className="sec-head"><div><div className="idx">12 / Репозитарій</div><h2>Кваліфікаційні роботи та наукові матеріали</h2></div><p>Каталог можна переглядати за програмою, роком, автором і науковим керівником.</p></div><div className="faculty-link-grid"><Link className="faculty-link-card faculty-link-card-blue" href="/research/theses"><span>01 / C4</span><h3>Психологія</h3><p>Бакалаврські, магістерські й дослідницькі роботи.</p><b>Відкрити репозитарій →</b></Link><Link className="faculty-link-card" href="/research/theses"><span>02 / I10</span><h3>Соціальна робота та консультування</h3><p>Кваліфікаційні роботи соціального напряму.</p><b>Відкрити репозитарій →</b></Link></div></div></section>

    <section className="faculty-programmes" id="faculty-programmes"><div className="wrap"><div className="sec-head"><div><div className="idx">13 / Спеціальності й освітні програми</div><h2>Два напрями — зрозумілі траєкторії</h2></div><p>На сторінці кожної програми зібрані рівні освіти, навчальні плани, вибіркові компоненти, склад кафедри та обговорення змін.</p></div><div className="faculty-programme-grid">{programmes.map(([code, title, description, href], index) => <Link href={href} key={`${code}-${title}`}><span>{String(index + 1).padStart(2, "0")}</span><b>{code}</b><h3>{title}</h3><p>{description}</p><i>→</i></Link>)}</div></div></section>

    <section className="law-practice-showcase festt-practice" id="faculty-practice"><div className="wrap"><div className="law-practice-head"><div><div className="idx">14 / Практика й партнери</div><h2>Від аудиторії — до професійного середовища</h2></div><p>Практика вбудована в освітню траєкторію: дослідницькі завдання, підтримка психічного здоров’я, партнерські кейси та стажування.</p></div><div className="law-practice-grid"><Link href="/programs/psychology#practice"><span>01</span><small>Психологічна підтримка</small><h3>Центр ментального здоров’я</h3><p>Простір підтримки психічного здоров’я та супроводу особистісного зростання здобувачів і співробітників.</p><b>Відкрити напрям →</b></Link><Link href="/programs/social-work#practice"><span>02</span><small>Професійне середовище</small><h3>Партнерські кейси</h3><p>Стейкголдерська підтримка навчання, розвиток практичних навичок і професійних компетентностей.</p><b>Дивитися партнерів →</b></Link></div></div><AcademicPartners slugs={["psychology", "social-work"]} /></section>

    <EducationQualitySection entries={departmentEntries} pagePath="/departments/psychology-social-development-faculty" index="15" id="faculty-quality" discussionEmail="k.psychology22@gmail.com" />

    <div id="department-news"><AcademicNews slugs={["psychology", "social-work"]} title="Новини факультету й кафедр" /><DepartmentEditorialContent entries={departmentEntries} /></div>
    </SectionHub>
    <SiteFooter />
  </main>;
}
