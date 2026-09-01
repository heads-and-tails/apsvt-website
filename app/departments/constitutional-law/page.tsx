import type { Metadata } from "next";
import Link from "next/link";
import { AcademicNews } from "../../components/AcademicNews";
import { AcademicProfileCard } from "../../components/AcademicProfileCard";
import { DepartmentEditorialContent } from "../../components/DepartmentEditorialContent";
import { EducationQualitySection } from "../../components/EducationQualitySection";
import { PageDocuments } from "../../components/PageDocuments";
import { SectionHub, type SectionHubItem } from "../../components/SectionHub";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { getDepartmentEntries } from "@/lib/department-content";
import { getProgrammeProfile } from "@/lib/programme-profiles";
import "../criminal-law/criminal-law.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Кафедра конституційного, адміністративного та фінансового права",
  description: "Окрема сторінка кафедри юридичного факультету: команда, освіта, наука, гуртки, врядування, репозитарій, обговорення та документи.",
};

const pagePath = "/departments/constitutional-law";

const sections: readonly SectionHubItem[] = [
  { id: "department-about", index: "01", title: "Про кафедру", description: "Загальна інформація та напрями роботи.", icon: "DEP" },
  { id: "department-history", index: "02", title: "Історія кафедри", description: "Розвиток кафедри від заснування Академії.", icon: "1993" },
  { id: "department-head", index: "03", title: "Завідувач кафедри", description: "Профіль і наукові інтереси керівниці.", icon: "HEAD" },
  { id: "department-team", index: "04", title: "Склад кафедри", description: "Викладачі, науковці та практики.", icon: "TEAM" },
  { id: "department-education", index: "05", title: "Освітня діяльність", description: "Дисципліни, програма D8 та навчальні матеріали.", icon: "EDU" },
  { id: "department-science", index: "06", title: "Наукова діяльність", description: "Дослідження, публікації, конференції та проєкти.", icon: "SCI" },
  { id: "student-science", index: "07", title: "Студентська наукова діяльність", description: "Дослідження, конкурси та студентські проєкти.", icon: "STU" },
  { id: "science-clubs", index: "08", title: "Наукові гуртки", description: "Гурток «Фенікс» та інші студентські формати.", icon: "CLUB" },
  { id: "academic-council", index: "09", title: "Вчена рада", description: "Склад, плани, засідання, рішення та протоколи.", icon: "RAD" },
  { id: "local-government", index: "10", title: "Місцеве самоврядування", description: "Наукова школа, дослідження й практичні ініціативи.", icon: "MS" },
  { id: "repository", index: "11", title: "Репозитарій", description: "Кваліфікаційні роботи та відкриті наукові матеріали.", icon: "REP" },
  { id: "programme-discussion", index: "12", title: "Обговорення", description: "Проєкти освітніх програм і пропозиції стейкголдерів.", icon: "DIA" },
  { id: "department-news", index: "13", title: "Новини кафедри", description: "Події, оголошення та публікації кафедри.", icon: "NEWS" },
  { id: "department-documents", index: "14", title: "Документи", description: "Положення, плани, звіти та офіційні матеріали.", icon: "PDF" },
  { id: "department-contacts", index: "15", title: "Контакти", description: "Як зв’язатися з кафедрою та факультетом.", icon: "@" },
  { id: "quality", index: "16", title: "Якість освіти", description: "Моніторинг, обговорення змін і оцінювання НПП.", icon: "✓" },
];

const focusAreas = [
  "Конституційне право",
  "Адміністративне право",
  "Фінансове право",
  "Муніципальне право",
  "Захист прав людини",
  "Місцеве самоврядування",
];

export default async function Page() {
  const profile = getProgrammeProfile("law");
  const entries = await getDepartmentEntries(pagePath);
  const entriesFor = (sectionId: string) => entries.filter((entry) => entry.sectionId === sectionId && !["hero", "teacher", "partner", "quality"].includes(entry.entryType));
  const team = profile?.team || [];
  const head = team[0];

  return <main id="top" className="criminal-department" data-page-materials-server="true"><SiteHeader />
    <section className="criminal-department-hero"><div className="wrap criminal-department-hero-grid">
      <div className="criminal-department-hero-copy"><div className="crumb"><Link href="/">Головна</Link> / <Link href="/departments/law-faculty">Юридичний факультет</Link> / Кафедра</div><span>Юридичний факультет · з 1993 року</span><h1>Конституційне, адміністративне та <em>фінансове право</em></h1><p>Окрема сторінка кафедри з повною структурою: освіта, наука, студентські гуртки, врядування, репозитарій, обговорення, документи й контакти.</p><div className="criminal-department-hero-actions"><a href="#department-team">Склад кафедри ↓</a><Link href="/programs/law">Освітня траєкторія D8 →</Link></div></div>
      <figure className="criminal-department-hero-portrait"><div className="criminal-department-hero-photo faculty-portrait-surface"><img src={head?.image || "/people/law/tetiana-lebid.webp"} alt="Тетяна Лебідь, завідувачка кафедри" /></div><figcaption><small>Завідувачка кафедри</small><strong>{head?.name || "Тетяна Лебідь"}</strong><span>{head?.role || "доцентка"}</span></figcaption></figure>
    </div></section><div className="hero-rule" />

    <SectionHub sections={sections} eyebrow="Структура кафедри" description="Розділи не об’єднані. Оберіть потрібну картку — відкриється лише відповідний блок кафедри.">
      <section className="criminal-department-about" id="department-about"><div className="wrap criminal-department-about-grid"><div><div className="idx">01 / Про кафедру</div><h2>Право публічної влади та людини</h2></div><div><p className="program-lede">Кафедра забезпечує фундаментальну й практичну підготовку з конституційного, адміністративного, фінансового та муніципального права.</p><div className="criminal-department-pillars">{focusAreas.slice(0, 3).map((area, index) => <article key={area}><span>{String(index + 1).padStart(2, "0")}</span><h3>{area}</h3><p>Правові принципи, актуальна практика, аналіз рішень і професійна аргументація.</p></article>)}</div><DepartmentEditorialContent entries={entriesFor("department-about")} /></div></div></section>

      <section className="criminal-department-about" id="department-history"><div className="wrap criminal-department-about-grid"><div><div className="idx">02 / Історія кафедри</div><h2>Від заснування Академії</h2></div><div><p className="program-lede">Кафедра працює з часу заснування Академії у 1993 році та розвиває правничу освіту, поєднуючи академічну школу з практикою публічного врядування.</p><p>Її освітні й наукові напрями охоплюють конституційний лад, права людини, адміністративні процедури, публічні фінанси, децентралізацію та місцеве самоврядування.</p><DepartmentEditorialContent entries={entriesFor("department-history")} /></div></div></section>

      <section className="criminal-department-team" id="department-head"><div className="wrap"><div className="sec-head"><div><div className="idx">03 / Завідувач кафедри</div><h2>Академічне керівництво</h2></div><p>Профіль керівниці кафедри подано окремо від загального складу.</p></div>{head && <div className="academic-profile-grid"><AcademicProfileCard badge="Завідувачка кафедри" person={{ name: head.name, role: head.role, summary: head.summary, image: head.image, tags: head.interests, links: head.href ? [{ label: "Науковий профіль", href: head.href }] : [] }} /></div>}<DepartmentEditorialContent entries={entriesFor("department-head")} /></div></section>

      <section className="criminal-department-team" id="department-team"><div className="wrap"><div className="sec-head"><div><div className="idx">04 / Склад кафедри</div><h2>Викладачі, науковці та практики</h2></div><p>Профілі команди можна доповнювати й оновлювати через редакційну панель.</p></div><div className="academic-profile-grid">{team.slice(1).map((person) => <AcademicProfileCard key={person.name} person={{ name: person.name, role: person.role, summary: person.summary, image: person.image, tags: person.interests, links: person.href ? [{ label: "Науковий профіль", href: person.href }] : [] }} />)}</div><DepartmentEditorialContent entries={[...entries.filter((entry) => entry.entryType === "teacher"), ...entriesFor("department-team")]} /></div></section>

      <section className="programme-documents" id="department-education"><div className="wrap"><div className="programme-documents-head"><div><div className="idx">05 / Освітня діяльність</div><h2>D8 «Право»: програми й дисципліни</h2></div><Link href="/programs/law">До освітньої траєкторії →</Link></div><div className="programme-document-list"><Link href="/programs/law"><span>01</span><div><small>Бакалавр · магістр · PhD</small><h3>Рівні освіти D8 «Право»</h3></div><b>→</b></Link><Link href="/programs/law#curriculum"><span>02</span><div><small>Навчальний план</small><h3>Обов’язкові та вибіркові компоненти</h3></div><b>→</b></Link><Link href="/programs/law#course-annotations"><span>03</span><div><small>Анотації</small><h3>Зміст навчальних дисциплін</h3></div><b>→</b></Link></div><DepartmentEditorialContent entries={entriesFor("department-education")} /></div></section>

      <section className="criminal-department-research" id="department-science"><div className="wrap"><div className="sec-head"><div><div className="idx">06 / Наукова діяльність</div><h2>Дослідження кафедри</h2></div><p>Окремий розділ для публікацій, конференцій, проєктів і результатів наукової роботи.</p></div><div className="criminal-department-themes">{focusAreas.map((area, index) => <article key={area}><span>{String(index + 1).padStart(2, "0")}</span><h3>{area}</h3><p>Дослідження законодавства, практики його застосування та перспектив розвитку.</p></article>)}</div><DepartmentEditorialContent entries={entriesFor("department-science")} /></div></section>

      <section className="criminal-department-about" id="student-science"><div className="wrap criminal-department-about-grid"><div><div className="idx">07 / Студентська наукова діяльність</div><h2>Від першої тези до кваліфікаційної роботи</h2></div><div><p className="program-lede">Студенти беруть участь у конференціях, конкурсах, дослідницьких проєктах і підготовці наукових публікацій.</p><Link className="academic-inline-link" href="/research/theses">Кваліфікаційні роботи →</Link><DepartmentEditorialContent entries={entriesFor("student-science")} /></div></div></section>

      <section className="criminal-department-about" id="science-clubs"><div className="wrap criminal-department-about-grid"><div><div className="idx">08 / Наукові гуртки</div><h2>Історико-правовий гурток «Фенікс»</h2></div><div><p className="program-lede">Окремий простір для зустрічей, планів роботи, тем досліджень, учасників і студентських ініціатив.</p><Link className="academic-inline-link" href="/research">Студентська наука Академії →</Link><DepartmentEditorialContent entries={entriesFor("science-clubs")} /></div></div></section>

      <section className="criminal-department-about" id="academic-council"><div className="wrap criminal-department-about-grid"><div><div className="idx">09 / Вчена рада</div><h2>Колегіальні рішення факультету</h2></div><div><div className="programme-document-list"><Link href="/documents#governance"><span>01</span><div><small>Вчена рада</small><h3>Склад, положення і план роботи</h3></div><b>→</b></Link><Link href="/documents#governance"><span>02</span><div><small>Засідання</small><h3>Рішення, протоколи та архів</h3></div><b>→</b></Link></div><DepartmentEditorialContent entries={entriesFor("academic-council")} /></div></div></section>

      <section className="criminal-department-about" id="local-government"><div className="wrap criminal-department-about-grid"><div><div className="idx">10 / Місцеве самоврядування</div><h2>Наукова школа муніципального права</h2></div><div><p className="program-lede">Напрям об’єднує дослідження децентралізації, муніципальної правотворчості, розвитку громад та участі громадян у прийнятті рішень.</p><DepartmentEditorialContent entries={entriesFor("local-government")} /></div></div></section>

      <section className="criminal-department-about" id="repository"><div className="wrap criminal-department-about-grid"><div><div className="idx">11 / Репозитарій</div><h2>Відкриті роботи та матеріали</h2></div><div><div className="programme-document-list"><Link href="/research/theses"><span>01</span><div><small>D8 «Право»</small><h3>Кваліфікаційні роботи студентів</h3></div><b>→</b></Link><Link href="/research/journals"><span>02</span><div><small>Наука і видання</small><h3>Публікації, збірники та монографії</h3></div><b>→</b></Link></div><DepartmentEditorialContent entries={entriesFor("repository")} /></div></div></section>

      <section className="criminal-department-about" id="programme-discussion"><div className="wrap criminal-department-about-grid"><div><div className="idx">12 / Обговорення</div><h2>Пропозиції до освітніх програм</h2></div><div><p className="program-lede">Проєкти освітніх програм, пропозиції стейкголдерів і результати їх розгляду публікуються окремо від репозитарію.</p><Link className="academic-inline-link" href="/programs/law#quality">Обговорення програми D8 →</Link><DepartmentEditorialContent entries={entriesFor("programme-discussion")} /></div></div></section>

      <div id="department-news"><AcademicNews slugs={["law"]} title="Новини кафедри" /><DepartmentEditorialContent entries={entriesFor("department-news")} /></div>

      <section className="criminal-department-about" id="department-documents"><div className="wrap criminal-department-about-grid"><div><div className="idx">14 / Документи</div><h2>Офіційні матеріали кафедри</h2></div><div><PageDocuments pagePath={pagePath} /><DepartmentEditorialContent entries={entriesFor("department-documents")} /></div></div></section>

      <section className="criminal-department-about" id="department-contacts"><div className="wrap criminal-department-about-grid"><div><div className="idx">15 / Контакти</div><h2>Зв’язок із кафедрою</h2></div><div><p className="program-lede">Київ, вул. Кільцева дорога, 3-А. Звернення щодо навчання, наукової роботи й матеріалів кафедри можна передати через деканат юридичного факультету.</p><Link className="academic-inline-link" href="/contacts">Усі контакти Академії →</Link><DepartmentEditorialContent entries={entriesFor("department-contacts")} /></div></div></section>

      <EducationQualitySection entries={entries} pagePath={pagePath} index="16" />
    </SectionHub>
    <SiteFooter />
  </main>;
}
