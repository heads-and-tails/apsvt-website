import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Положення Академії",
  description: "Окремі сторінки ключових положень АПСВТ із коротким поясненням і посиланнями на повні документи.",
};

const regulations = [
  {
    year: "2025",
    title: "Індивідуальний навчальний план здобувача",
    description: "Актуальний порядок формування, затвердження та виконання індивідуального навчального плану.",
    href: "/documents/regulations/individual-study-plan-current.pdf",
    pages: "6 сторінок",
    direct: true,
  },
  {
    year: "2026",
    title: "Дії у разі позапланового припинення освітньої діяльності",
    description: "Порядок захисту прав здобувачів і організаційних дій Академії.",
    href: "/documents/regulations/unplanned-termination-educational-activity.pdf",
    pages: "7 сторінок",
    direct: true,
  },
  {
    year: "2020",
    title: "Практика здобувачів вищої освіти",
    description: "Організація, проведення та підбиття підсумків практичної підготовки.",
    href: "/documents/regulations/student-practice-2020.pdf",
    pages: "14 сторінок",
    direct: true,
  },
  {
    year: "2013",
    title: "Підготовка кваліфікаційних робіт та державна атестація студентів",
    description: "Організація підготовки кваліфікаційних робіт, проведення атестації та оформлення її результатів.",
    href: "/documents/regulations/state-examination-commission.pdf",
    pages: "25 сторінок",
    direct: true,
  },
  {
    year: "2019",
    title: "Індивідуальний навчальний план студента",
    description: "Що визначає індивідуальну траєкторію, як формується план і де студент бачить перелік дисциплін.",
    href: "/documents/regulations/individual-study-plan",
    pages: "9 сторінок",
    direct: false,
  },
  {
    year: "2018",
    title: "Конкурс «Викладач року Академії»",
    description: "Мета конкурсу, принципи оцінювання професійної майстерності та організація підбиття підсумків.",
    href: "/documents/regulations/teacher-of-year",
    pages: "10 сторінок",
    direct: false,
  },
];

export default function Page() {
  return <main id="top"><SiteHeader />
    <section className="resource-hero regulations-hero"><div className="wrap"><div className="crumb">Головна / Документи / Положення</div><div className="resource-hero-grid"><div><span className="resource-kicker">Офіційні матеріали</span><h1>Положення<br />Академії</h1><p>Актуальні положення та архівні тематичні сторінки з посиланнями на повні офіційні тексти.</p></div><aside><span>У розділі</span><b>{String(regulations.length).padStart(2, "0")}</b><p>документів і тематичних сторінок</p><Link href="/documents">Усі документи →</Link></aside></div></div></section><div className="phero-rule" />
    <section className="regulations-list"><div className="wrap"><div className="resource-section-head"><div><div className="idx">01 / Добірка</div><h2>Оберіть положення</h2></div><p>Нові чинні документи відкриваються у PDF; архівні положення мають окремі пояснювальні сторінки.</p></div><div className="regulations-grid">{regulations.map((item, index) => item.direct ? <a href={item.href} target="_blank" rel="noreferrer" key={item.href}><span>{String(index + 1).padStart(2, "0")}</span><small>{item.year} · {item.pages}</small><h3>{item.title}</h3><p>{item.description}</p><b>Відкрити PDF ↗</b></a> : <Link href={item.href} key={item.href}><span>{String(index + 1).padStart(2, "0")}</span><small>{item.year} · {item.pages}</small><h3>{item.title}</h3><p>{item.description}</p><b>Перейти на сторінку →</b></Link>)}</div></div></section>
    <section className="resource-context"><div className="wrap"><div><span>Повний каталог</span><h2>Потрібен інший документ?</h2></div><div><p>У загальному каталозі зібрані чинні положення про освітній процес, вступ, доброчесність, студентське самоврядування та інші напрями роботи Академії.</p><Link className="cta dark" href="/documents#catalogue"><span>Відкрити каталог</span></Link></div></div></section>
    <SiteFooter />
  </main>;
}
