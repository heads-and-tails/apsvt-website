import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageDocuments } from "../../components/PageDocuments";
import { AcademicProfileCard } from "../../components/AcademicProfileCard";
import { DepartmentEditorialContent } from "../../components/DepartmentEditorialContent";
import { getDepartmentEntries } from "@/lib/department-content";
import { SectionHub, type SectionHubItem } from "../../components/SectionHub";
import { EducationQualitySection } from "../../components/EducationQualitySection";

export const metadata: Metadata = {
  title: "Кафедра іноземних мов та гуманітарних дисциплін",
  description: "Мовна, гуманітарна та міжкультурна підготовка студентів АПСВТ.",
};

const departmentSections: readonly SectionHubItem[] = [
  { id: "department-about", index: "01", title: "Про кафедру та команда", description: "Роль кафедри, основні напрями й професійний профіль завідувачки.", icon: "DEP", aliases: ["team"] },
  { id: "department-education", index: "02", title: "Освітні компоненти", description: "Мовні та гуманітарні дисципліни для всіх спеціальностей.", icon: "EDU" },
  { id: "department-documents", index: "03", title: "Робочі програми", description: "Навчальні матеріали, силабуси й вибіркові дисципліни.", icon: "DOC" },
  { id: "science", index: "04", title: "Наукова діяльність", description: "Дослідження, академічне письмо та студентські формати.", icon: "SCI" },
  { id: "practice", index: "05", title: "Міжнародне середовище", description: "Мовна практика, мобільність і партнерські події.", icon: "INT" },
  { id: "quality", index: "06", title: "Якість освіти", description: "Опитування, оцінювання та пропозиції до навчання.", icon: "✓" },
  { id: "department-news", index: "07", title: "Новини кафедри", description: "Події та актуальні матеріали кафедри.", icon: "NEWS" },
];

export default async function Page() {
  const departmentEntries = await getDepartmentEntries("/departments/languages-humanities");
  return <main id="top"><SiteHeader />
    <section className="detail-hero image"><div className="detail-hero-bg"><img src="/news-international-workshop.jpg" alt="Міжкультурна навчальна дискусія студентів" /></div><div className="wrap"><div className="crumb">Головна / Кафедри / Іноземні мови та гуманітарні дисципліни</div><span className="detail-kicker">Освітній підрозділ АПСВТ</span><h1>Мова для професії. Гуманітарний погляд.</h1><p className="detail-deck">Кафедра розвиває професійну комунікацію, міжкультурну компетентність, критичне мислення та гуманітарну основу освіти.</p></div></section><div className="hero-rule" />

    <SectionHub sections={departmentSections} eyebrow="Навігатор кафедри" description="Оберіть інформацію про кафедру, дисципліни, матеріали, науку або новини — відкриється тільки потрібний розділ.">

    <section id="department-about"><div className="wrap program-intro"><div><div className="idx">01 / Про кафедру</div><h2>Комунікація у глобальному середовищі</h2><p className="program-lede">Європейська інтеграція та сучасний ринок праці потребують впевненого володіння мовами, здатності працювати з інформацією та вести професійний діалог у міжнародному середовищі.</p><div className="focus-list"><div><span>01</span><b>Іноземні мови для професійної діяльності</b></div><div><span>02</span><b>Українська мова для іноземних студентів</b></div><div><span>03</span><b>Гуманітарні та суспільні дисципліни</b></div><div><span>04</span><b>Міжкультурна й цифрова комунікація</b></div></div></div>
      <aside className="programme-lead-card" id="team"><AcademicProfileCard badge="Завідувачка кафедри" person={{ name: "Світлана Бондар", role: "Освітня й організаційна робота кафедри", summary: "Кафедра забезпечує мовну та гуманітарну підготовку студентів усіх освітніх програм Академії." }} /></aside>
    </div></section>

    <section className="soft" id="department-education"><div className="wrap split"><div className="copy"><div className="idx">02 / Освітні компоненти</div><h2>Навички, що працюють у кожній професії</h2><p className="lead">Курси кафедри допомагають читати фахові джерела, презентувати ідеї, працювати в міжнародних командах і відповідально комунікувати у публічному просторі.</p></div><div className="panel"><h3>Основні напрями</h3><ul><li><span className="y">01</span>Англійська мова за професійним спрямуванням</li><li><span className="y">02</span>Українська ділова комунікація</li><li><span className="y">03</span>Філософія та критичне мислення</li><li><span className="y">04</span>Міжкультурний діалог і громадянська культура</li></ul></div></div></section>

    <section className="programme-documents" id="department-documents"><div className="wrap"><div className="programme-documents-head"><div><div className="idx">03 / Навчальні матеріали</div><h2>Робочі програми та вибіркові дисципліни</h2></div><Link href="/materials">Усі матеріали →</Link></div><div className="programme-document-list"><Link href="/materials"><span>01</span><div><small>Каталог Академії</small><h3>Робочі програми навчальних дисциплін</h3></div><b>→</b></Link><Link href="/documents#education"><span>02</span><div><small>Освітня документація</small><h3>Навчальні плани й силабуси</h3></div><b>→</b></Link><Link href="/programs"><span>03</span><div><small>Усі спеціальності</small><h3>Місце дисциплін у програмах Академії</h3></div><b>→</b></Link></div></div></section>

    <section className="programme-science" id="science"><div className="wrap programme-science-grid"><div><div className="idx">04 / Наукова діяльність</div><h2>Мова, суспільство та міжкультурна комунікація</h2></div><div><p>Дослідницькі й студентські формати кафедри охоплюють професійну комунікацію, гуманітарні студії, академічне письмо та міжкультурний діалог.</p><Link href="/research">Наука в Академії →</Link></div></div></section>

    <section className="faculty-activity" id="practice"><div className="wrap faculty-activity-grid"><div><div className="idx">05 / Міжнародне середовище</div><h2>Мовна практика у партнерських подіях</h2><p>Кафедра підтримує підготовку студентів до міжнародних програм, академічної мобільності, конференцій і професійної комунікації.</p></div><nav><Link href="/international">Міжнародні можливості →</Link><Link href="/events">Події Академії →</Link></nav></div></section>

    <EducationQualitySection entries={departmentEntries} pagePath="/departments/languages-humanities" index="06" />
    <div id="department-news"><DepartmentEditorialContent entries={departmentEntries} /></div>
    </SectionHub>
    <PageDocuments pagePath="/departments/languages-humanities" />
    <SiteFooter />
  </main>;
}
