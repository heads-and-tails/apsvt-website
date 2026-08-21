import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageDocuments } from "../../components/PageDocuments";
import { DepartmentEditorialContent } from "../../components/DepartmentEditorialContent";
import { getDepartmentEntries } from "@/lib/department-content";
import { SectionHub, type SectionHubItem } from "../../components/SectionHub";

export const metadata: Metadata = {
  title: "Факультет психології та соціального розвитку",
  description: "Факультет психології та соціального розвитку АПСВТ: кафедри, освітні програми, наука, практика та якість освіти.",
};

const departments = [
  ["01", "Кафедра клінічної психології та психотерапії", "Психічне здоров’я, психодіагностика, консультування, реабілітація та психотерапевтичні підходи.", "/programs/psychology#department", "C4"],
  ["02", "Кафедра психології бізнесу та управління", "Організаційна психологія, професійний розвиток, команди, лідерство та управління змінами.", "/programs/psychology#department", "C4"],
  ["03", "Кафедра соціально-трудових відносин та соціальної роботи", "Соціальна політика, підтримка людей і громад, консультування, кейс-менеджмент та реабілітація.", "/programs/social-work#department", "I10"],
];

const programmes = [
  ["C4", "Психологія", "Бакалаврський, магістерський і третій рівень освіти; клінічна та організаційна траєкторії.", "/programs/psychology"],
  ["I10", "Соціальна робота та консультування", "Бакалаврський і магістерський рівні; підтримка людей, громад і соціальних інституцій.", "/programs/social-work"],
];

const facultySections: readonly SectionHubItem[] = [
  { id: "faculty-about", index: "01", title: "Про факультет", description: "Місія, напрями підготовки та рівні освіти.", icon: "F" },
  { id: "departments", index: "02", title: "Кафедри", description: "Три кафедри психологічного й соціального напрямів.", icon: "3" },
  { id: "faculty-programmes", index: "03", title: "Освітні програми", description: "C4 «Психологія» та I10 «Соціальна робота».", icon: "OP" },
  { id: "faculty-organization", index: "04", title: "Організаційна діяльність", description: "Координація факультету та студентське представництво.", icon: "ORG" },
  { id: "faculty-science", index: "05", title: "Наукова діяльність", description: "Кафедральні дослідження, гуртки та студентські проєкти.", icon: "SCI" },
  { id: "faculty-practice", index: "06", title: "Практика й партнери", description: "Лабораторні формати, центр ментального здоров’я та професійні кейси.", icon: "LAB" },
  { id: "faculty-quality", index: "07", title: "Якість освіти", description: "Обговорення, анкети, оцінювання та офіційні документи.", icon: "✓" },
  { id: "department-news", index: "08", title: "Новини факультету", description: "Актуальні матеріали й події кафедр.", icon: "NEWS" },
];

export default async function Page() {
  const pagePath = "/departments/psychology-social-development-faculty";
  const departmentEntries = await getDepartmentEntries(pagePath);

  return <main id="top"><SiteHeader />
    <section className="law-faculty-hero festt-hero"><div className="law-faculty-hero-image"><img src="/program-psychology.jpg" alt="Психологічна освіта та робота з людьми" /></div><div className="wrap law-faculty-hero-copy"><Link href="/departments">← Усі факультети й кафедри</Link><span>ФПСР · факультет психології та соціального розвитку</span><h1>Психологія.<br /><em>Соціальний розвиток.</em></h1><p>Формуємо фахівців у сфері психічного здоров’я та соціального благополуччя, які підтримують людину, її професійне зростання і активну участь у суспільстві.</p><div><b>3</b><span>кафедри</span><b>7</b><span>освітніх траєкторій</span></div></div></section><div className="hero-rule" />

    <SectionHub sections={facultySections} eyebrow="Навігатор факультету" description="Оберіть кафедри, програми, науку, практику, документи або новини — відкриється тільки потрібний розділ.">

    <section className="law-faculty-intro festt-intro" id="faculty-about"><div className="wrap law-faculty-intro-grid"><div><div className="idx">01 / Про факультет</div><h2>Пізнаємо особистість та зміцнюємо суспільство</h2></div><div><p className="program-lede">Факультет готує компетентних фахівців у сфері психології та соціальної роботи задля психологічного благополуччя, професійного розвитку й соціальної взаємодії особистості у суспільстві.</p><p>Освітні програми поєднують аналітичну підготовку, роботу з реальними кейсами, дослідження та практику. Студент може будувати індивідуальну траєкторію між суміжними професійними сферами.</p><div className="law-faculty-milestones"><span><b>2</b>предметні напрями</span><span><b>3</b>рівні вищої освіти</span><span><b>1</b>спільна професійна екосистема</span></div></div></div></section>

    <section className="law-faculty-departments festt-departments" id="departments"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Академічна структура</div><h2>Три кафедри — один факультет</h2></div><p>Оберіть кафедру, щоб одразу перейти до програми, складу викладачів, наукової діяльності, партнерів і актуальних документів.</p></div><div className="law-department-grid">{departments.map(([number, title, text, href, code]) => <Link href={href} key={number}><span>{number}</span><small>{code}</small><h3>{title}</h3><p>{text}</p><b>Відкрити кафедру →</b></Link>)}</div></div></section>

    <section className="faculty-programmes" id="faculty-programmes"><div className="wrap"><div className="sec-head"><div><div className="idx">03 / Спеціальності й освітні програми</div><h2>Два напрями — зрозумілі траєкторії</h2></div><p>На сторінці кожної програми в одному порядку зібрані рівні освіти, навчальні плани, робочі програми дисциплін, вибіркові компоненти, склад кафедри та обговорення змін.</p></div><div className="faculty-programme-grid">{programmes.map(([code, title, description, href], index) => <Link href={href} key={`${code}-${title}`}><span>{String(index + 1).padStart(2, "0")}</span><b>{code}</b><h3>{title}</h3><p>{description}</p><i>→</i></Link>)}</div></div></section>

    <section className="faculty-activity" id="faculty-organization"><div className="wrap faculty-activity-grid"><div><div className="idx">04 / Організаційна діяльність</div><h2>Факультет, команда і студентське представництво</h2><p>Організаційні рішення узгоджують керівництво факультету й академічна команда, а студентське представництво допомагає здобувачам долучатися до розвитку навчання та середовища.</p></div><nav><Link href="/people">Керівництво та викладачі →</Link><Link href="/students/council">Студентська рада →</Link><a href="mailto:k.psychology22@gmail.com">Зв’язатися з факультетом ↗</a></nav></div></section>

    <section className="programme-science" id="faculty-science"><div className="wrap programme-science-grid"><div><div className="idx">05 / Наукова діяльність</div><h2>Кафедральні дослідження та студентські проєкти</h2></div><div><p>Факультет поєднує психологічні та соціальні дослідження. Теми наукових гуртків, конференцій і студентських проєктів публікуються на сторінках відповідних програм та в науковому розділі Академії.</p><Link href="/research">Наука в Академії →</Link></div></div></section>

    <section className="law-practice-showcase festt-practice" id="faculty-practice"><div className="wrap"><div className="law-practice-head"><div><div className="idx">06 / Практика й партнери</div><h2>Від аудиторії — до професійного середовища</h2></div><p>Практика вбудована в освітню траєкторію: дослідницькі завдання, підтримка психічного здоров’я, партнерські кейси та стажування.</p></div><div className="law-practice-grid"><Link href="/programs/psychology#science"><span>01</span><small>Навчально-дослідна лабораторія</small><h3>Психологічно-соціальний інструментарій</h3><p>Студенти проєктують, перевіряють і адаптують інструменти для дослідження, діагностики та підтримки.</p><b>Перейти до досліджень →</b></Link><Link href="/programs/psychology#practice"><span>02</span><small>Психологічна підтримка</small><h3>Центр ментального здоров’я</h3><p>Простір підтримки психічного здоров’я та супроводу особистісного зростання здобувачів і співробітників.</p><b>Відкрити напрям →</b></Link><Link href="/programs/social-work#practice"><span>03</span><small>Професійне середовище</small><h3>Партнерські кейси</h3><p>Стейкголдерська підтримка навчання, розвиток практичних навичок і професійних компетентностей.</p><b>Дивитися партнерів →</b></Link></div></div></section>

    <section className="programme-documents" id="faculty-quality"><div className="wrap"><div className="programme-documents-head"><div><div className="idx">07 / Якість освіти</div><h2>Обговорення, анкети й оцінювання</h2></div><Link href="/documents#quality">Усі документи з якості →</Link></div><div className="programme-document-list"><a href="/documents/archive/may-2026/quality-system.pdf" target="_blank" rel="noreferrer"><span>01</span><div><small>PDF · система якості</small><h3>Система забезпечення якості вищої освіти</h3></div><b>↗</b></a><a href="/documents/archive/may-2026/student-survey-questionnaires.pdf" target="_blank" rel="noreferrer"><span>02</span><div><small>PDF · опитування здобувачів</small><h3>Анкети для оцінювання якості навчання</h3></div><b>↗</b></a><a href="mailto:k.psychology22@gmail.com"><span>03</span><div><small>Обговорення освітніх програм</small><h3>Надіслати пропозицію або зауваження</h3></div><b>↗</b></a></div></div></section>

    <div id="department-news"><DepartmentEditorialContent entries={departmentEntries} /></div>
    </SectionHub>
    <PageDocuments pagePath={pagePath} />
    <SiteFooter />
  </main>;
}
