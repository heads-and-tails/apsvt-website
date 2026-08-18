import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { OfficialLinks } from "../components/OfficialLinks";
import { PageDocuments } from "../components/PageDocuments";
import { AcademyStructure } from "./AcademyStructure";

export const metadata: Metadata = {
  title: "Про Академію",
  description: "Історія, місія, інтерактивна структура та цінності АПСВТ від 1993 року.",
};
export const dynamic = "force-dynamic";

const values = [
  ["01", "Людяність", "Бачимо за системами людей і поважаємо унікальну траєкторію кожного."],
  ["02", "Практика", "Перетворюємо знання на проєкти, рішення та професійний досвід."],
  ["03", "Відкритість", "Працюємо між дисциплінами, країнами, інституціями та громадами."],
  ["04", "Відповідальність", "Навчаємо розуміти наслідки рішень і діяти етично."],
];

const history = [
  ["1993", "Заснування Академії", "Академію створено на базі Українського учбово-методичного центру Федерації профспілок України як заклад вищої освіти для підготовки фахівців соціально-трудової сфери."],
  ["1999", "Перше загальноукраїнське визнання", "Академія стала лауреатом рейтингу «Золота фортуна — 99» і отримала відзнаку «Софія Київська» серед профспілкових закладів освіти."],
  ["2002", "Нові освітні технології", "У рейтингу «Софія Київська» Академію відзначили за впровадження нових освітніх технологій у підготовку кадрів соціально-трудової сфери."],
  ["2007", "Лідер серед недержавних ЗВО", "За історичною довідкою Академії, у рейтингу недержавних закладів вищої освіти Міністерства освіти і науки вона посіла перше місце."],
  ["2012–2015", "Об’єднання і нова назва", "Після рішення про об’єднання закладів освіти ФПУ Академія отримала сучасну назву, а студенти Інституту туризму приєдналися до її академічної спільноти."],
  ["2016", "«Вибір України»", "Академію відзначено у національній номінації «Вибір України 2016 року» за показниками діяльності."],
  ["2023–2026", "GreenFinEDU та європейський горизонт", "Модуль Жан Моне Erasmus+ GreenFinEDU інтегрує європейську зелену політику й сталі фінанси у курси, літні школи та відкриті освітні події."],
  ["2025", "Нові програми доктора філософії", "Затверджено освітньо-наукові програми A5, C1, C4 і D4, що поєднують освітню складову з індивідуальним науковим дослідженням."],
];

export default function Page() {
  return <main id="top"><SiteHeader />
    <section className="phero img"><div className="bgi"><img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1800&q=92&auto=format&fit=crop" alt="Університетський кампус" /></div><div className="wrap"><div className="crumb">Головна / Про Академію</div><h1>Академія з<br />людським виміром</h1><p className="lead">Вища освіта, що поєднує професійну якість, соціальну відповідальність і повагу до людини.</p></div></section><div className="phero-rule" />

    <section className="about-identity"><div className="wrap split"><div className="copy"><div className="idx">01 / Хто ми</div><h2>Вчимо змінювати світ відповідально</h2><p className="lead">Академія працює з 1993 року й розвиває освіту у сфері права, економіки, соціальних відносин, управління, психології та туризму.</p><p>Заклад виник у системі профспілкової освіти України. Цей досвід сформував його особливий фокус: гідна праця, права людини, соціальна відповідальність і практична користь знань.</p><p>Сьогодні навчання поєднує реальні професійні сценарії, дослідження суспільних викликів, практику в організаціях і громадах та міжнародні освітні проєкти.</p><figure className="about-official-signature"><div><img src="/brand/apsvt-official-logo.png" alt="Офіційна емблема АПСВТ" /></div><figcaption><small>Офіційна емблема</small><b>Академія праці,<br />соціальних відносин і туризму</b><span>Київ · засновано 1993 року</span></figcaption></figure><div className="about-statute-link"><span>Установчий документ</span><a href="/documents/academy/statute-2017.pdf" target="_blank" rel="noreferrer">Статут Академії · PDF ↗</a></div></div><div className="ph tall"><img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=90&auto=format&fit=crop" alt="Лекція в Академії" /></div></div></section>

    <AcademyStructure />

    <section className="deep-content"><div className="wrap"><div className="deep-intro"><h2>Наші принципи</h2><p>Чотири опори визначають, як ми навчаємо, співпрацюємо та приймаємо рішення.</p></div><div className="deep-grid">{values.map(([number, title, description]) => <article className="deep-card" data-n={number} key={title}><span className="mono">Принцип</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>

    <section className="academy-history" id="history"><div className="wrap">
      <div className="academy-history-head"><div><div className="idx">04 / Історія</div><h2>Від соціально-трудової освіти до міждисциплінарної Академії</h2></div><p>Ключові етапи подано за офіційною історичною довідкою Академії та документами освітніх програм.</p></div>
      <div className="academy-history-summary"><b>33+</b><span>роки розвитку</span><b>25 000</b><span>підготовлених фахівців*</span><b>15 000</b><span>слухачів підвищення кваліфікації*</span></div>
      <div className="academy-history-timeline">{history.map(([year, title, description], index) => <article key={year}><span>{String(index + 1).padStart(2, "0")}</span><time>{year}</time><div><h3>{title}</h3><p>{description}</p></div></article>)}</div>
      <p className="academy-history-note">* Історичні накопичувальні показники, оприлюднені Академією у довідці про її розвиток.</p>
    </div></section>

    <OfficialLinks index="05 / Докладніше" title="Документи й офіційні матеріали" items={[
      { title: "Ліцензії та акредитація", description: "Ліцензія на освітню діяльність, сертифікати програм і державні реєстри.", href: "/about/licenses" },
      { title: "Статут Академії", description: "Повний текст нової редакції Статуту, затвердженої у 2017 році.", href: "/documents/academy/statute-2017.pdf" },
      { title: "Освітньо-наукові програми", description: "Підготовка докторів філософії за спеціальностями A5, C1, C4 і D4.", href: "/programs#doctoral-programmes" },
    ]} />
    <PageDocuments pagePath="/about" />
    <section className="bigcta"><div className="wrap"><div className="mono">Наступний крок</div><h2>Станьте частиною<br />спільноти АПСВТ.</h2><Link className="cta" href="/admissions"><span>Дізнатися про вступ</span></Link></div></section>
    <SiteFooter />
  </main>;
}
