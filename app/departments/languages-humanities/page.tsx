import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageDocuments } from "../../components/PageDocuments";
import { AcademicProfileCard } from "../../components/AcademicProfileCard";
import { DepartmentEditorialContent } from "../../components/DepartmentEditorialContent";
import { getDepartmentEntries } from "@/lib/department-content";

export const metadata: Metadata = {
  title: "Кафедра іноземних мов та гуманітарних дисциплін",
  description: "Мовна, гуманітарна та міжкультурна підготовка студентів АПСВТ.",
};

export default async function Page() {
  const departmentEntries = await getDepartmentEntries("/departments/languages-humanities");
  return <main id="top"><SiteHeader />
    <section className="detail-hero image"><div className="detail-hero-bg"><img src="/news-international-workshop.jpg" alt="Міжкультурна навчальна дискусія студентів" /></div><div className="wrap"><div className="crumb">Головна / Кафедри / Іноземні мови та гуманітарні дисципліни</div><span className="detail-kicker">Освітній підрозділ АПСВТ</span><h1>Мова для професії.<br />Гуманітарний погляд.</h1><p className="detail-deck">Кафедра розвиває професійну комунікацію, міжкультурну компетентність, критичне мислення та гуманітарну основу освіти.</p></div></section><div className="hero-rule" />

    <section><div className="wrap program-intro"><div><div className="idx">01 / Про кафедру</div><h2>Комунікація у глобальному середовищі</h2><p className="program-lede">Європейська інтеграція та сучасний ринок праці потребують впевненого володіння мовами, здатності працювати з інформацією та вести професійний діалог у міжнародному середовищі.</p><div className="focus-list"><div><span>01</span><b>Іноземні мови для професійної діяльності</b></div><div><span>02</span><b>Українська мова для іноземних студентів</b></div><div><span>03</span><b>Гуманітарні та суспільні дисципліни</b></div><div><span>04</span><b>Міжкультурна й цифрова комунікація</b></div></div></div>
      <aside className="programme-lead-card"><AcademicProfileCard badge="Завідувачка кафедри" person={{ name: "Світлана Бондар", role: "Освітня й організаційна робота кафедри", summary: "Кафедра забезпечує мовну та гуманітарну підготовку студентів усіх освітніх програм Академії." }} /></aside>
    </div></section>

    <section className="soft"><div className="wrap split"><div className="copy"><div className="idx">02 / Для студентів</div><h2>Навички, що працюють у кожній професії</h2><p className="lead">Курси кафедри допомагають читати фахові джерела, презентувати ідеї, працювати в міжнародних командах і відповідально комунікувати у публічному просторі.</p></div><div className="panel"><h3>Основні напрями</h3><ul><li><span className="y">01</span>Англійська мова за професійним спрямуванням</li><li><span className="y">02</span>Українська ділова комунікація</li><li><span className="y">03</span>Філософія та критичне мислення</li><li><span className="y">04</span>Міжкультурний діалог і громадянська культура</li></ul></div></div></section>
    <DepartmentEditorialContent entries={departmentEntries} />
    <PageDocuments pagePath="/departments/languages-humanities" />
    <SiteFooter />
  </main>;
}
