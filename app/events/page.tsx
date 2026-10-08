import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { EventRegistrationForm } from "./EventRegistrationForm";
import { getPublicContent as getContentItems } from "@/lib/content";
import { PageDocuments } from "../components/PageDocuments";
import { internationalAiTrainingTitle } from "@/lib/data";

export const metadata: Metadata = { title:"Події", description:"Події, зустрічі, конференції та реєстрація на заходи АПСВТ." };
export const dynamic = "force-dynamic";
const monthNames=["СІЧ","ЛЮТ","БЕР","КВІ","ТРА","ЧЕР","ЛИП","СЕР","ВЕР","ЖОВ","ЛИС","ГРУ"];

type Props = { searchParams: Promise<{ event?: string }> };

export default async function Page({searchParams}:Props){const items=await getContentItems("event");const editorialEvents=items.map(({payload})=>{const parsed=new Date(`${payload.date}T12:00:00`);return{date:new Intl.DateTimeFormat("uk-UA",{day:"numeric",month:"long",year:"numeric"}).format(parsed),day:String(parsed.getDate()).padStart(2,"0"),month:monthNames[parsed.getMonth()]||"—",title:payload.title,place:`${payload.place} · ${payload.time}`,desc:payload.description}});const featuredEvent={date:"13 жовтня 2026 р.",day:"13",month:"ЖОВ",title:internationalAiTrainingTitle,place:"Початок · 11:30",desc:"Оптимізація підготовки грантових заявок, комунікація з іноземними партнерами та мовний переклад за допомогою ШІ."};const events=[featuredEvent,...editorialEvents.filter(event=>event.title!==featuredEvent.title)];const requestedEvent=(await searchParams).event;const defaultEvent=events.some(event=>event.title===requestedEvent)?requestedEvent:featuredEvent.title;return <main id="top"><SiteHeader />
  <section className="phero"><div className="wrap"><div className="crumb">Головна / Події</div><h1>Календар<br />Академії</h1><p className="lead">Відкриті лекції, зустрічі, конференції, дні вступника та події студентської спільноти.</p></div></section><div className="phero-rule" />
  <section><div className="wrap"><div className="sec-head"><div><div className="idx">01 / Найближчі події</div><h2>Зустрінемося наживо</h2></div><p>Календар підтримує редакція Академії: нові події одразу з’являються у списку й формі реєстрації.</p></div><div className="events-list">{events.map(event=><article className="evt" key={`${event.date}-${event.title}`}><div className="d"><b>{event.day}</b><span>{event.month}</span></div><div><h3>{event.title}</h3><p>{event.desc}</p><span>{event.place}</span></div><a href="#registration">Реєстрація →</a></article>)}</div></div></section>
  <EventRegistrationForm events={events.map(e=>e.title)} defaultEvent={defaultEvent} />
  <PageDocuments pagePath="/events" />
  <SiteFooter /></main>}
