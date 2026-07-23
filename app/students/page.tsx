import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PageDocuments } from "../components/PageDocuments";

export const metadata: Metadata = { title: "Студентам", description: "Розклад, навчальний календар, кампус і студентські сервіси АПСВТ." };
export const dynamic = "force-dynamic";
const services = [
  ["Мобільний розклад — демо", "Інтерактивний перегляд застосунку, нагадування та онлайн-посилання.", "/student-app"],
  ["Розклад занять", "Актуальний тиждень, аудиторії та формат пар.", "/schedule"],
  ["Графік сесії", "Іспити, заліки, консультації, аудиторії та викладачі.", "/schedule#session"],
  ["Навчальний рік", "Семестри, сесії, практика та канікули.", "/academic-calendar"],
  ["Кампус і сервіси", "Бібліотека, гуртожиток і навчальні простори.", "/facilities"],
  ["Наука", "Публікації, Google Scholar, наукові видання та конференції.", "/research"],
  ["Міжнародні можливості", "Мобільність, партнерські програми й подвійні дипломи.", "/international"],
];
export default function Page() { return <main id="top"><SiteHeader /><section className="phero img"><div className="bgi"><img src="/apsvt-students-real.jpg" alt="Студенти Академії" /></div><div className="wrap"><div className="crumb">Головна / Студенту</div><h1>Студентський<br />простір</h1><p className="lead">Навчання, розклад, кампус, можливості та підтримка — в одному зрозумілому маршруті.</p></div></section><div className="phero-rule" /><section id="services"><div className="wrap"><div className="sec-head"><div><div className="idx">01 / Сервіси</div><h2>Усе для навчання</h2></div></div><div className="icards service-grid">{services.map(([title, description, href]) => <Link className="icard" href={href} key={title}><b>{title}</b><span>{description}</span></Link>)}</div></div></section><section className="stats"><div className="wrap stat-grid"><div className="stat"><b>24/7</b><span>доступ до цифрових сервісів</span></div><div className="stat"><b>1</b><span>індивідуальна траєкторія</span></div><div className="stat"><b>9</b><span>освітніх напрямів</span></div><div className="stat"><b>3</b><span>кампусні маршрути</span></div></div></section><PageDocuments pagePath="/students" /><SiteFooter /></main> }
