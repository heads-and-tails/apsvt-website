import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { EventRegistrationForm } from "./EventRegistrationForm";

export const metadata: Metadata = { title:"Події", description:"Події, зустрічі, конференції та реєстрація на заходи АПСВТ." };
export const events=[
  {date:"22 серпня 2026",day:"22",month:"СЕР",title:"День відкритих дверей",place:"Кампус · 11:00",desc:"Знайомство з програмами, викладачами, кампусом і маршрутом вступу."},
  {date:"4 вересня 2026",day:"04",month:"ВЕР",title:"Відкрита лекція: право і суспільні зміни",place:"Актова зала · 15:00",desc:"Розмова з практиками про нову роль юриста та роботу правничої спільноти."},
  {date:"12 вересня 2026",day:"12",month:"ВЕР",title:"Кар’єрна лабораторія",place:"Онлайн · 17:30",desc:"Як перетворити навчальний проєкт на перший професійний кейс."},
  {date:"25 вересня 2026",day:"25",month:"ВЕР",title:"Міжнародний день Академії",place:"Кампус · 12:00",desc:"Мобільність, Erasmus+, подвійний диплом і студентські історії."},
];

export default function Page(){return <main id="top"><SiteHeader />
  <section className="phero"><div className="wrap"><div className="crumb">Головна / Події</div><h1>Календар<br />Академії</h1><p className="lead">Відкриті лекції, зустрічі, конференції, дні вступника та події студентської спільноти.</p></div></section><div className="phero-rule" />
  <section><div className="wrap"><div className="sec-head"><div><div className="idx">01 / Найближчі події</div><h2>Зустрінемося наживо</h2></div></div><div className="events-list">{events.map(event=><article className="evt" key={event.title}><div className="d"><b>{event.day}</b><span>{event.month}</span></div><div><h3>{event.title}</h3><p>{event.desc}</p><span>{event.place}</span></div><a href="#registration">Реєстрація →</a></article>)}</div></div></section>
  <EventRegistrationForm events={events.map(e=>e.title)} />
  <SiteFooter /></main>}
