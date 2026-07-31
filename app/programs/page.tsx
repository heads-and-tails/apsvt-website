import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ProgramFinder } from "./ProgramFinder";
import { programs } from "@/lib/programs";
import { doctoralFacilities, doctoralProgrammes } from "@/lib/academy-resources";
import { PageDocuments } from "../components/PageDocuments";

export const metadata: Metadata = { title: "Освітні програми", description: "Програми АПСВТ: навчальні плани, вартість, викладачі та кар’єрні можливості." };

export default function Page() {
  return <main id="top"><SiteHeader />
    <section className="phero"><div className="wrap"><div className="crumb">Головна / Програми</div><h1>Освітні<br />програми</h1><p className="lead">Порівняйте зміст, реальну вартість 2026/27, навчальний план, команду та кар’єрні сценарії кожної програми.</p></div></section><div className="phero-rule" />
    <section><div className="wrap"><div className="sec-head"><div><div className="idx">01 / Каталог</div><h2>Оберіть напрям</h2></div><a className="sec-link" href="#test">Не впевнені? Пройдіть тест →</a></div>
      <div className="pcards">{programs.map((p)=><Link className="pcard" data-program={p.slug} href={`/programs/${p.slug}`} key={p.slug}><img src={p.image} alt="" /><span className="lvl">{p.levels}</span><div className="in"><span className="pnum">{p.number} / {p.code}</span><h3>{p.title}</h3><p>{p.short}</p><small>{p.price}</small></div><div className="bar" /></Link>)}</div>
    </div></section>
    <section className="doctoral-programmes" id="doctoral-programmes"><div className="wrap">
      <div className="doctoral-programmes-head"><div><div className="idx">02 / Третій рівень освіти</div><h2>Освітньо-наукові програми</h2></div><p>Офіційні програми підготовки докторів філософії, затверджені у 2025 році. Кожен файл можна відкрити або завантажити без переходу на сторонній сервіс.</p></div>
      <div className="doctoral-programme-grid">{doctoralProgrammes.map((programme) => <a href={programme.href} target="_blank" rel="noreferrer" key={programme.code}>
        <span>{programme.code}</span><small>Доктор філософії · PDF · {programme.pages} сторінок</small><h3>{programme.title}</h3><p>{programme.department}</p><b>Відкрити програму ↗</b>
      </a>)}</div>
      <a className="doctoral-facilities-card" href={doctoralFacilities.href} target="_blank" rel="noreferrer"><span>Забезпечення програм</span><div><h3>{doctoralFacilities.title}</h3><p>{doctoralFacilities.description}</p></div><b>PDF · {doctoralFacilities.pages} сторінок ↗</b></a>
    </div></section>
    <ProgramFinder index="03 / Тест на програму" />
    <section className="soft"><div className="wrap split"><div className="copy"><div className="idx">04 / Умови навчання</div><h2>Прозоро до подання заяви</h2><p className="lead">На сторінці кожної програми вже зібрані навчальний план, денна й заочна вартість, викладачі, міжнародні можливості та професії після випуску.</p><p>Вартість взято з офіційного наказу АПСВТ для вступників 2026 року. На окремій сторінці доступні суми за рік, семестр і місяць, безпечний помічник оплати та договори.</p><Link className="cta dark" href="/tuition"><span>Вартість та оплата</span></Link></div><div className="panel"><h3>До кожної програми входить</h3><ul><li><span className="y">01</span>Практика та проєктна робота</li><li><span className="y">02</span>Вибіркові курси</li><li><span className="y">03</span>Міжнародні можливості</li><li><span className="y">04</span>Кар’єрні сценарії</li><li><span className="y">05</span>Академічний супровід</li></ul></div></div></section>
    <PageDocuments pagePath="/programs" />
    <SiteFooter /></main>;
}
