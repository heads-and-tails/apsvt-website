import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { EventRegistrationForm } from "./EventRegistrationForm";
import { getPublicContent as getContentItems } from "@/lib/content";

export const metadata: Metadata = { title:"Події", description:"Події, зустрічі, конференції та реєстрація на заходи АПСВТ." };
export const dynamic = "force-dynamic";
const monthNames=["СІЧ","ЛЮТ","БЕР","КВІ","ТРА","ЧЕР","ЛИП","СЕР","ВЕР","ЖОВ","ЛИС","ГРУ"];

export default async function Page(){const items=await getContentItems("event");const events=items.map(({payload})=>{const parsed=new Date(`${payload.date}T12:00:00`);return{date:new Intl.DateTimeFormat("uk-UA",{day:"numeric",month:"long",year:"numeric"}).format(parsed),day:String(parsed.getDate()).padStart(2,"0"),month:monthNames[parsed.getMonth()]||"—",title:payload.title,place:`${payload.place} · ${payload.time}`,desc:payload.description}});return <main id="top"><SiteHeader />
  <section className="phero"><div className="wrap"><div className="crumb">Головна / Події</div><h1>Календар<br />Академії</h1><p className="lead">Відкриті лекції, зустрічі, конференції, дні вступника та події студентської спільноти.</p></div></section><div className="phero-rule" />
  <section><div className="wrap"><div className="sec-head"><div><div className="idx">01 / Найближчі події</div><h2>Зустрінемося наживо</h2></div><p>Календар підтримує редакція Академії: нові події одразу з’являються у списку й формі реєстрації.</p></div><div className="events-list">{events.map(event=><article className="evt" key={`${event.date}-${event.title}`}><div className="d"><b>{event.day}</b><span>{event.month}</span></div><div><h3>{event.title}</h3><p>{event.desc}</p><span>{event.place}</span></div><a href="#registration">Реєстрація →</a></article>)}</div></div></section>
  <EventRegistrationForm events={events.map(e=>e.title)} />
  <SiteFooter /></main>}
