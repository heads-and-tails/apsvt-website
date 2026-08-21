import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { LawFacultyTeam } from "../../components/LawFacultyTeam";
import { PageDocuments } from "../../components/PageDocuments";
import { DepartmentEditorialContent } from "../../components/DepartmentEditorialContent";
import { getDepartmentEntries } from "@/lib/department-content";
import { SectionHub, type SectionHubItem } from "../../components/SectionHub";

export const metadata: Metadata = {
  title: "Юридичний факультет",
  description: "Юридичний факультет АПСВТ: кафедри, команда, практичні лабораторії, наукові проєкти та освітні програми.",
};

const departments = [
  ["01", "Кафедра конституційного, адміністративного та фінансового права", "Конституційне, адміністративне, фінансове й муніципальне право.", "/programs/law#department"],
  ["02", "Кафедра публічного управління та адміністрування", "Публічна політика, служба, розвиток громад і соціальний діалог.", "/programs/public-administration"],
  ["03", "Кафедра цивільного, трудового та господарського права", "Цивільне, господарське, трудове право та судовий захист.", "/programs/law#department"],
  ["04", "Кафедра кримінального права, процесу та криміналістики", "Кримінальне право, процес, захист прав людини та криміналістика.", "/departments/criminal-law"],
];

const facultySections: readonly SectionHubItem[] = [
  { id: "faculty-about", index: "01", title: "Про факультет", description: "Історія, місія та рівні правничої освіти.", icon: "F" },
  { id: "departments", index: "02", title: "Кафедри", description: "Чотири правничі й управлінські академічні напрями.", icon: "4" },
  { id: "faculty-programmes", index: "03", title: "Освітні програми", description: "D8 «Право» та D4 «Публічне управління».", icon: "OP" },
  { id: "law-teachers", index: "04", title: "Склад факультету", description: "Викладачі, науковці та юристи-практики.", icon: "TEAM" },
  { id: "faculty-science", index: "05", title: "Наукова діяльність", description: "Правничі дослідження, гуртки та студентські проєкти.", icon: "SCI" },
  { id: "faculty-practice", index: "06", title: "Практика й партнери", description: "Юридична клініка, лабораторія та професійні установи.", icon: "LAB" },
  { id: "faculty-quality", index: "07", title: "Якість освіти", description: "Обговорення програм, опитування та офіційні документи.", icon: "✓" },
  { id: "department-news", index: "08", title: "Новини факультету", description: "Актуальні матеріали та події кафедр.", icon: "NEWS" },
];

export default async function Page() {
  const departmentEntries = await getDepartmentEntries("/departments/law-faculty");
  return <main id="top"><SiteHeader />
    <section className="law-faculty-hero"><div className="law-faculty-hero-image"><img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1800&q=92&auto=format&fit=crop" alt="Правнича освіта" /></div><div className="wrap law-faculty-hero-copy"><Link href="/departments">← Усі кафедри</Link><span>ЮФ · з 1994 року</span><h1>Юридичний<br /><em>факультет</em></h1><p>Фундаментальна правнича освіта, клінічна практика, криміналістична лабораторія та дослідження, що працюють для людини й держави.</p><div><b>4</b><span>кафедри</span><b>2</b><span>практичні осередки</span></div></div></section><div className="hero-rule" />

    <SectionHub sections={facultySections} eyebrow="Навігатор факультету" description="Оберіть кафедри, команду, програми, практику або документи — відкриється тільки потрібний розділ.">

    <section className="law-faculty-intro" id="faculty-about"><div className="wrap law-faculty-intro-grid"><div><div className="idx">01 / Про факультет</div><h2>Від першого набору до правничої екосистеми</h2></div><div><p className="program-lede">Становлення факультету розпочалося з першого набору студентів у 1994 році. Сьогодні він готує практиків для судових, правозахисних і правоохоронних установ, органів влади, місцевого самоврядування та юридичного бізнесу.</p><p>До викладання залучені науковці та юристи-практики. Виїзні заняття, гостьові лекції, клінічна робота й лабораторні симуляції перетворюють теорію на професійну дію.</p><div className="law-faculty-milestones"><span><b>1994</b>перший набір студентів</span><span><b>2014</b>відкриття клініки «Феміда»</span><span><b>3</b>рівні вищої освіти</span></div></div></div></section>

    <section className="law-faculty-departments" id="departments"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Академічна структура</div><h2>Чотири кафедри — єдина траєкторія</h2></div><p>Оберіть академічний напрям, щоб перейти до програми, практики та документів.</p></div><div className="law-department-grid">{departments.map(([number, title, text, href]) => <Link href={href} key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p><b>Перейти →</b></Link>)}</div></div></section>

    <section className="faculty-programmes" id="faculty-programmes"><div className="wrap"><div className="sec-head"><div><div className="idx">03 / Спеціальності й програми</div><h2>Освітні траєкторії факультету</h2></div><p>Відкрийте програму, щоб побачити рівні освіти, навчальний план, робочі програми дисциплін, вибіркові компоненти та обговорення змін.</p></div><div className="faculty-programme-grid"><Link href="/programs/law"><span>01</span><b>D8</b><h3>Право</h3><i>→</i></Link><Link href="/programs/public-administration"><span>02</span><b>D4</b><h3>Публічне управління та адміністрування</h3><i>→</i></Link></div></div></section>

    <LawFacultyTeam />

    <section className="programme-science" id="faculty-science"><div className="wrap programme-science-grid"><div><div className="idx">04 / Наукова діяльність</div><h2>Правничі дослідження та студентські гуртки</h2></div><div><p>Кафедри досліджують публічне й приватне право, кримінальну юстицію, права людини, місцеве самоврядування та публічне управління. Працюють студентські наукові формати, зокрема історико-правовий гурток «Фенікс».</p><Link href="/research">Наука в Академії →</Link></div></div></section>

    <section className="law-practice-showcase" id="faculty-practice"><div className="wrap"><div className="law-practice-head"><div><div className="idx">05 / Практика й партнери</div><h2>Навчальні ситуації, наближені до реальних</h2></div><p>Студент проходить шлях від аналізу фактичної ситуації до аргументованої й етичної правової позиції.</p></div><div className="law-practice-grid"><Link href="/programs/law/legal-clinic"><span>01</span><small>Правова допомога</small><h3>Юридична клініка «Феміда»</h3><p>Інтерв’ювання клієнта, правовий аналіз, підготовка відповіді й супервізія викладача.</p><b>Відкрити сторінку →</b></Link><Link href="/programs/law/forensic-laboratory"><span>02</span><small>Навчальна лабораторія</small><h3>Лабораторія криміналістики</h3><p>Технічна фотолабораторія, кабінет слідчого, фіксація слідів і моделювання процесуальних дій.</p><b>Відкрити лабораторію →</b></Link><article><span>03</span><small>Професійне середовище</small><h3>Суди, адвокатура та публічні установи</h3><p>Зовнішні бази практики кафедра підтверджує перед направленням відповідно до програми й навчального року.</p><b>За погодженням факультету</b></article></div></div></section>

    <section className="programme-documents" id="faculty-quality"><div className="wrap"><div className="programme-documents-head"><div><div className="idx">07 / Якість освіти й документи</div><h2>Програми, обговорення та оцінювання</h2></div><Link href="/documents#education">Усі документи →</Link></div><div className="programme-document-list"><a href="/documents/archive/may-2026/law-faculty-regulation-2023.pdf" target="_blank" rel="noreferrer"><span>01</span><div><small>PDF · архів травня 2026</small><h3>Положення про юридичний факультет</h3></div><b>↗</b></a><a href="/documents/archive/may-2026/public-law-department-2023.pdf" target="_blank" rel="noreferrer"><span>02</span><div><small>PDF · архів травня 2026</small><h3>Положення про кафедру публічного права</h3></div><b>↗</b></a><a href="/documents/archive/may-2026/private-law-department.pdf" target="_blank" rel="noreferrer"><span>03</span><div><small>PDF · архів травня 2026</small><h3>Положення про кафедру приватного права</h3></div><b>↗</b></a><a href="/documents/archive/may-2026/criminal-law-department-2023.pdf" target="_blank" rel="noreferrer"><span>04</span><div><small>PDF · архів травня 2026</small><h3>Положення про кафедру кримінального права</h3></div><b>↗</b></a><a href="/documents/archive/may-2026/quality-system.pdf" target="_blank" rel="noreferrer"><span>05</span><div><small>PDF · якість освіти</small><h3>Система забезпечення якості вищої освіти</h3></div><b>↗</b></a><a href="/documents/archive/may-2026/student-survey-questionnaires.pdf" target="_blank" rel="noreferrer"><span>06</span><div><small>PDF · опитування</small><h3>Анкети для оцінювання якості навчання</h3></div><b>↗</b></a></div><div className="law-faculty-source"><span>Матеріали відновлено з офіційної версії сайту за травень 2026 року</span><Link href="/materials">Відновлений каталог матеріалів →</Link></div></div></section>
    <div id="department-news"><DepartmentEditorialContent entries={departmentEntries} /></div>
    </SectionHub>
    <PageDocuments pagePath="/departments/law-faculty" />
    <SiteFooter />
  </main>;
}
