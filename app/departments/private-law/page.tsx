import type { Metadata } from "next";
import Link from "next/link";
import { AcademicNews } from "../../components/AcademicNews";
import { AcademicPartners } from "../../components/AcademicPartners";
import { DepartmentEditorialContent } from "../../components/DepartmentEditorialContent";
import { EducationQualitySection } from "../../components/EducationQualitySection";
import { PageDocuments } from "../../components/PageDocuments";
import { SectionHub, type SectionHubItem } from "../../components/SectionHub";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { getDepartmentEntries } from "@/lib/department-content";
import "../criminal-law/criminal-law.css";

export const metadata: Metadata = {
  title: "Кафедра цивільного, трудового та господарського права",
  description: "Освітня, наукова й організаційна діяльність кафедри цивільного, трудового та господарського права АПСВТ.",
};

const pagePath = "/departments/private-law";

const sections: readonly SectionHubItem[] = [
  { id: "department-about", index: "01", title: "Про кафедру", description: "Напрями роботи й професійний фокус.", icon: "DEP" },
  { id: "department-education", index: "02", title: "Спеціальність і програма", description: "D8 «Право», навчальні плани та дисципліни.", icon: "DOC" },
  { id: "team", index: "03", title: "Склад кафедри", description: "Викладачі та їхні навчальні напрями.", icon: "TEAM" },
  { id: "science", index: "04", title: "Наукова діяльність", description: "Дослідження приватного, трудового й господарського права.", icon: "SCI" },
  { id: "practice", index: "05", title: "Практика й партнери", description: "Професійні навички та юридична практика.", icon: "CASE" },
  { id: "quality", index: "06", title: "Якість освіти", description: "Моніторинг, обговорення програм і оцінювання.", icon: "✓" },
  { id: "department-news", index: "07", title: "Новини й матеріали", description: "Публікації, документи та оголошення кафедри.", icon: "NEWS" },
];

const team = [
  { name: "Василь Бонтлаб", role: "Завідувач кафедри, доктор юридичних наук", focus: "Цивільний процес і сучасні тенденції розвитку цивільного права та процесу." },
  { name: "Катерина Біда", role: "Кандидатка юридичних наук, доцентка", focus: "Господарське право, міжнародний комерційний арбітраж і цивільно-процесуальні документи." },
  { name: "Наталія Циганчук", role: "Кандидатка юридичних наук, доцентка", focus: "Трудове право, трудові спори та методика адвокатської діяльності." },
  { name: "Сергій Потапенко", role: "Доктор філософії в галузі права, доцент", focus: "Земельне, житлове й екологічне право, філософія права та цивільно-правові делікти." },
  { name: "Оксана Мельник", role: "Кандидатка юридичних наук, доцентка", focus: "Цивільне право, медіація, право соціального забезпечення та охорона праці." },
];

export default async function Page() {
  const departmentEntries = await getDepartmentEntries(pagePath);
  return <main id="top" className="criminal-department"><SiteHeader />
    <section className="criminal-department-hero"><div className="wrap criminal-department-hero-grid">
      <div className="criminal-department-hero-copy">
        <div className="crumb"><Link href="/">Головна</Link> / <Link href="/departments/law-faculty">Юридичний факультет</Link> / Кафедра</div>
        <span>Юридичний факультет · D8 «Право»</span>
        <h1 style={{ fontSize: "clamp(40px, 5.4vw, 82px)" }}><em>Цивільне</em>, трудове та господарське право</h1>
        <p>Кафедра формує цілісне розуміння приватно-правових відносин, судового захисту, трудових прав, підприємництва та соціального діалогу.</p>
        <div className="criminal-department-hero-actions"><a href="#team">Склад кафедри ↓</a><Link href="/programs/law">Освітня програма D8 ↗</Link></div>
      </div>
      <figure className="criminal-department-hero-portrait"><img src="/brand/apsvt-official-logo.png" alt="Офіційна емблема АПСВТ" style={{ objectFit: "contain", padding: "clamp(34px, 5vw, 72px)", background: "#f2f0ea" }} /><figcaption><small>Навчальний підрозділ</small><strong>Приватне право</strong><span>Освіта · наука · юридична практика</span></figcaption></figure>
    </div></section>
    <div className="hero-rule" />

    <SectionHub sections={sections} eyebrow="Навігатор кафедри" description="Спочатку спеціальність і програма, далі команда, наука, практика, якість освіти та актуальні матеріали.">
      <section className="criminal-department-about" id="department-about"><div className="wrap criminal-department-about-grid">
        <div><div className="idx">01 / Про кафедру</div><h2>Право для людини, праці та бізнесу</h2></div>
        <div><p className="program-lede">Кафедра відповідає за навчальні компоненти цивільного, трудового, господарського та суміжних галузей права в межах спеціальності D8 «Право».</p><p>Навчання поєднує матеріальне й процесуальне право, роботу з юридичними документами, аналіз судової практики та розвиток навичок правничої аргументації.</p><div className="criminal-department-pillars"><article><span>01</span><h3>Цивільне право і процес</h3><p>Приватні правовідносини, судовий захист, процесуальні документи та медіація.</p></article><article><span>02</span><h3>Трудове право</h3><p>Трудові договори, соціальний діалог, трудові спори й право соціального забезпечення.</p></article><article><span>03</span><h3>Господарське право</h3><p>Підприємництво, комерційні спори, арбітраж і правові засади господарської діяльності.</p></article></div></div>
      </div></section>

      <section className="programme-documents" id="department-education"><div className="wrap"><div className="programme-documents-head"><div><div className="idx">02 / Спеціальність і освітня програма</div><h2>D8 «Право»: навчальна траєкторія</h2></div><Link href="/programs/law">Відкрити сторінку програми →</Link></div><div className="programme-document-list"><Link href="/programs/law"><span>01</span><div><small>Бакалавр · магістр · PhD</small><h3>Освітня програма D8 «Право»</h3></div><b>→</b></Link><Link href="/programs/law#curriculum"><span>02</span><div><small>Структура навчання</small><h3>Навчальні плани й робочі програми дисциплін</h3></div><b>→</b></Link><Link href="/programs/law#electives"><span>03</span><div><small>Індивідуальна траєкторія</small><h3>Вибіркові дисципліни</h3></div><b>→</b></Link></div></div></section>

      <section className="criminal-department-research" id="team"><div className="wrap">
        <div className="sec-head"><div><div className="idx">03 / Склад кафедри</div><h2>Викладачі за напрямами</h2></div><p>Склад і дисципліни відновлено з матеріалів архівної версії сайту. Редакція кафедри може доповнювати профілі та наукові посилання через панель.</p></div>
        <div className="criminal-department-themes">{team.map((person, index) => <article key={person.name}><span>{String(index + 1).padStart(2, "0")}</span><h3>{person.name}</h3><p><b>{person.role}</b><br />{person.focus}</p></article>)}</div>
      </div></section>

      <section className="criminal-department-about" id="science"><div className="wrap criminal-department-about-grid"><div><div className="idx">04 / Наукова діяльність</div><h2>Приватне право в сучасних умовах</h2></div><div><p className="program-lede">Дослідження кафедри охоплюють розвиток цивільного права і процесу, захист трудових прав, медіацію, комерційний арбітраж та правове регулювання господарської діяльності.</p><p>Окрему увагу приділено судовій практиці, європейським стандартам захисту прав і підготовці студентів до власних наукових досліджень.</p></div></div></section>

      <section className="criminal-department-practice" id="practice"><div className="wrap criminal-department-practice-grid"><div><div className="idx">05 / Практика й партнери</div><h2>Від норми права до юридичного рішення</h2><p>Практичні завдання охоплюють складання процесуальних документів, аналіз договорів і судових позицій, моделювання переговорів, медіації та представництва інтересів.</p><Link href="/programs/law/legal-clinic">Юридична клініка →</Link></div><div className="criminal-department-practice-list"><span><b>01</b>Цивільно-процесуальні документи</span><span><b>02</b>Комерційні договори й арбітраж</span><span><b>03</b>Трудові спори та соціальний діалог</span><span><b>04</b>Медіація й правнича аргументація</span></div></div><AcademicPartners slugs={["law"]} title="Професійне середовище програми" /></section>

      <EducationQualitySection entries={departmentEntries} pagePath={pagePath} index="06" />

      <div id="department-news"><AcademicNews slugs={["law"]} title="Новини кафедри та юридичного факультету" /><section className="criminal-department-links"><div className="wrap"><Link href="/departments/law-faculty"><span>Юридичний факультет</span><b>Усі кафедри факультету →</b></Link><Link href="/programs/law"><span>Освітня програма</span><b>D8 «Право» →</b></Link><a href="/materials/academic-db27db48e.html"><span>Архівна основа</span><b>Склад кафедри →</b></a></div></section><DepartmentEditorialContent entries={departmentEntries} /></div>
    </SectionHub>
    <PageDocuments pagePath={pagePath} />
    <SiteFooter />
  </main>;
}
