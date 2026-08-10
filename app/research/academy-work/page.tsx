import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Наукова робота Академії",
  description: "Звіти про наукову діяльність АПСВТ та науково-дослідні теми Академії.",
};

const reports = [
  ["Інформація про наукову діяльність за 2025 рік", "/documents/research/academy-work/scientific-activity-2025.pdf", "PDF · 9 сторінок"],
  ["Інформація про наукову діяльність за 2024 рік", "/documents/research/academy-work/scientific-activity-2024.pdf", "PDF · 5 сторінок"],
] as const;

export default function Page() {
  return <main id="top"><SiteHeader />
    <section className="phero"><div className="wrap"><div className="crumb">Наука / Наукова робота Академії</div><h1>Дослідження,<br />що працюють</h1><p className="lead">Офіційні звіти про наукову діяльність і документи ключових науково-дослідних тем Академії.</p></div></section><div className="phero-rule" />
    <section><div className="wrap"><div className="sec-head"><div><div className="idx">01 / Щорічні звіти</div><h2>Наукова діяльність</h2></div><p>Актуальні звіти Академії за 2024 та 2025 роки.</p></div><div className="official-materials research-official-materials">{reports.map(([title, href, meta], index) => <a href={href} target="_blank" rel="noreferrer" key={href}><span>{String(index + 1).padStart(2, "0")} · {meta}</span><b>{title}</b><strong>↗</strong></a>)}</div></div></section>
    <section className="soft"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Науково-дослідні теми</div><h2>Ринок праці і розвиток профспілкового руху</h2></div><p>Прикладна науково-дослідна робота АПСВТ на період із грудня 2021 до грудня 2026 року.</p></div><div className="research-topic-layout"><a className="research-topic-scan" href="/documents/research/academy-work/labour-market-trade-union-research-2021-2026.jpg" target="_blank" rel="noreferrer"><img src="/documents/research/academy-work/labour-market-trade-union-research-2021-2026.jpg" alt="Витяг із протоколу Вченої ради про затвердження науково-дослідної роботи" /><span>Скан рішення Вченої ради ↗</span></a><div><div className="idx">Документація НДР</div><h3>Технічне завдання на науково-дослідну роботу</h3><p>Документ визначає назву, підстави, виконавців, напрями, етапи та очікувані результати дослідження «Ринок праці і розвиток профспілкового руху».</p><a className="cta dark" href="/documents/research/academy-work/research-technical-specification-2021-2026.pdf" target="_blank" rel="noreferrer"><span>Відкрити PDF · 13 сторінок</span></a></div></div></div></section>
    <SiteFooter />
  </main>;
}
