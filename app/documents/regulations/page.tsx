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
    year: "2019",
    title: "Індивідуальний навчальний план студента",
    description: "Що визначає індивідуальну траєкторію, як формується план і де студент бачить перелік дисциплін.",
    href: "/documents/regulations/individual-study-plan",
    pages: "9 сторінок",
  },
  {
    year: "2018",
    title: "Конкурс «Викладач року Академії»",
    description: "Мета конкурсу, принципи оцінювання професійної майстерності та організація підбиття підсумків.",
    href: "/documents/regulations/teacher-of-year",
    pages: "10 сторінок",
  },
];

export default function Page() {
  return <main id="top"><SiteHeader />
    <section className="resource-hero regulations-hero"><div className="wrap"><div className="crumb">Головна / Документи / Положення</div><div className="resource-hero-grid"><div><span className="resource-kicker">Офіційні матеріали</span><h1>Положення<br />Академії</h1><p>Кожний документ має окрему зрозумілу сторінку: короткий зміст, статус редакції та посилання на повний текст.</p></div><aside><span>У розділі</span><b>02</b><p>окремі тематичні сторінки</p><Link href="/documents">Усі документи →</Link></aside></div></div></section><div className="phero-rule" />
    <section className="regulations-list"><div className="wrap"><div className="resource-section-head"><div><div className="idx">01 / Добірка</div><h2>Оберіть положення</h2></div><p>Документи мають довідковий статус; на сторінках це позначено окремо.</p></div><div className="regulations-grid">{regulations.map((item, index) => <Link href={item.href} key={item.href}><span>{String(index + 1).padStart(2, "0")}</span><small>{item.year} · {item.pages}</small><h3>{item.title}</h3><p>{item.description}</p><b>Перейти на сторінку →</b></Link>)}</div></div></section>
    <section className="resource-context"><div className="wrap"><div><span>Повний каталог</span><h2>Потрібен інший документ?</h2></div><div><p>У загальному каталозі зібрані чинні положення про освітній процес, вступ, доброчесність, студентське самоврядування та інші напрями роботи Академії.</p><Link className="cta dark" href="/documents#catalogue"><span>Відкрити каталог</span></Link></div></div></section>
    <SiteFooter />
  </main>;
}
