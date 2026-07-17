import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = { title: "План навчального року", description: "Орієнтовний календар навчального року АПСВТ 2026/27." };
const periods = [
  ["01 вересня", "Початок осіннього семестру", "Організаційні зустрічі, вибіркові дисципліни та старт навчання."],
  ["12–24 жовтня", "Перший модульний контроль", "Проміжні роботи, зворотний зв’язок і коригування індивідуального плану."],
  ["14–30 грудня", "Зимова сесія", "Підсумкові контролі та екзамени за графіком факультетів."],
  ["31 грудня–17 січня", "Зимові канікули", "Період без планових аудиторних занять."],
  ["18 січня", "Початок весняного семестру", "Навчальні дисципліни, практичні проєкти та вибіркові курси."],
  ["15–28 березня", "Другий модульний контроль", "Проміжне оцінювання й підготовка до практики."],
  ["17 травня–11 червня", "Літня сесія", "Заліки, екзамени та атестація випускних курсів."],
  ["14 червня–16 липня", "Практика", "Виробнича, навчальна або переддипломна практика залежно від програми."],
];

export default function Page() { return <main id="top"><SiteHeader /><section className="phero calendar-hero"><div className="wrap"><div className="crumb">Головна / Студенту / Навчальний рік</div><h1>Навчальний рік<br />2026 / 27</h1><p className="lead">Орієнтовна річна рамка для планування навчання, сесій, практики й відпочинку.</p></div></section><div className="phero-rule" /><section><div className="wrap"><div className="schedule-note"><span>Проєктний календар</span><p>Це робочий план, створений через відсутність опублікованого повного календаря 2026/27. Остаточні дати затверджуються наказом Академії та можуть відрізнятися за програмами.</p></div><div className="year-timeline">{periods.map(([date, title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><time>{date}</time><div><h2>{title}</h2><p>{copy}</p></div></article>)}</div></div></section><section className="bigcta"><div className="wrap"><div className="mono">Навчальні графіки</div><h2>Знайдіть пару<br />або іспит.</h2><div className="calendar-actions"><Link className="cta" href="/schedule"><span>Розклад занять</span></Link><Link className="cta" href="/exam-schedule"><span>Графік сесії</span></Link></div></div></section><SiteFooter /></main> }
