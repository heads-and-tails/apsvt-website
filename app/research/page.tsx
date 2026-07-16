import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PublicationSearch } from "./PublicationSearch";

export const metadata: Metadata = { title:"Наука і публікації", description:"Пошук наукових публікацій викладачів АПСВТ, профілі Google Scholar та архів Вісника." };

export default function Page(){return <main id="top"><SiteHeader />
  <section className="phero"><div className="wrap"><div className="crumb">Головна / Наука</div><h1>Наука й<br />публікації</h1><p className="lead">Єдиний пошук за авторами, темами та роками: профілі Google Scholar, статті викладачів і науковий архів Академії.</p></div></section><div className="phero-rule" />
  <PublicationSearch />
  <section className="stats"><div className="wrap stat-grid"><div className="stat"><b>200<i>+</i></b><span>праць у профілі Гліба Пріба</span></div><div className="stat"><b>3</b><span>перевірені Scholar-профілі</span></div><div className="stat"><b>9</b><span>випусків Вісника в архіві</span></div><div className="stat"><b>30<i>+</i></b><span>років академічної науки</span></div></div></section>
  <SiteFooter /></main>}
