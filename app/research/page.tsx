import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PublicationSearch } from "./PublicationSearch";
import Link from "next/link";

export const metadata: Metadata = { title:"Наука і публікації", description:"Пошук наукових публікацій викладачів АПСВТ, профілі Google Scholar та архів Вісника." };

export default function Page(){return <main id="top"><SiteHeader />
  <section className="phero"><div className="wrap"><div className="crumb">Головна / Наука</div><h1>Наука й<br />публікації</h1><p className="lead">Єдиний пошук за авторами, темами та роками: профілі Google Scholar, статті викладачів і науковий архів Академії.</p></div></section><div className="phero-rule" />
  <PublicationSearch />
  <section className="research-portals"><div className="wrap portal-grid"><Link href="/research/journals"><span>01</span><div><small>Видавнича діяльність</small><h2>Наукові журнали</h2><p>Вісник АПСВТ, тематичні серії, архів номерів і правила для авторів.</p></div><b>→</b></Link><Link href="/research/conferences"><span>02</span><div><small>Наукові події</small><h2>Конференції</h2><p>Календар, напрями роботи, реєстрація та збірники матеріалів Академії.</p></div><b>→</b></Link></div></section>
  <SiteFooter /></main>}
