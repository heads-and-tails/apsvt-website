import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PublicationSearch } from "./PublicationSearch";
import Link from "next/link";
import { getPublicContent as getContentItems } from "@/lib/content";

export const metadata: Metadata = { title:"Наука і публікації", description:"Пошук наукових публікацій викладачів АПСВТ, профілі Google Scholar та архів Вісника." };
export const dynamic = "force-dynamic";

export default async function Page(){const resources=await getContentItems("research_resource");return <main id="top"><SiteHeader />
  <section className="phero"><div className="wrap"><div className="crumb">Головна / Наука</div><h1>Наука й<br />публікації</h1><p className="lead">Єдиний пошук за авторами, темами та роками: профілі Google Scholar, статті викладачів і науковий архів Академії.</p></div></section><div className="phero-rule" />
  <PublicationSearch />
  <section className="soft research-resources"><div className="wrap"><div className="sec-head"><div><div className="idx">03 / Ресурси Академії</div><h2>Для дослідження</h2></div><p>Журнали, репозитарії та академічні бази для навчання, викладання й дослідницької роботи.</p></div><div className="research-resource-grid">{resources.map(({id,payload})=><a href={payload.url} target={payload.url.startsWith("http")?"_blank":undefined} rel={payload.url.startsWith("http")?"noreferrer":undefined} key={id}><span>{payload.year}</span><small>{payload.category}</small><h3>{payload.title}</h3><p>{payload.description}</p><b>↗</b></a>)}</div></div></section>
  <section className="research-portals"><div className="wrap portal-grid"><Link href="/research/journals"><span>01</span><div><small>Видавнича діяльність</small><h2>Наукові видання</h2><p>Науковий вісник АПСВТ, тематичні серії, архів номерів і правила для авторів.</p></div><b>→</b></Link><Link href="/research/conferences"><span>02</span><div><small>Наукові події</small><h2>Конференції</h2><p>Календар, напрями роботи, реєстрація та збірники матеріалів Академії.</p></div><b>→</b></Link></div></section>
  <SiteFooter /></main>}
