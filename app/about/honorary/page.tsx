import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { honoraryDoctors, honoraryProfessors } from "@/lib/honorary-academy";

export const metadata: Metadata = {
  title: "Почесні професори та доктори Академії",
  description: "Почесні професори і почесні доктори Академії праці, соціальних відносин і туризму.",
};

function HonoraryList({ people }: { people: readonly { name: string; description?: string }[] }) {
  return <div className="rows">{people.map((person, index) =>
    <article className="row" key={person.name}>
      <span className="rnum" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <div><h3>{person.name}</h3>{person.description && <p>{person.description}</p>}</div>
    </article>
  )}</div>;
}

export default function HonoraryAcademyPage() {
  return <main id="top"><SiteHeader englishHref="/en/about" />
    <section className="detail-hero"><div className="wrap">
      <div className="crumb">Головна / Про Академію / Почесні професори та доктори</div>
      <h1>Почесні професори та доктори</h1>
      <p className="detail-deck">Люди, яких Академія відзначила почесними званнями за внесок в освіту, науку й суспільне життя.</p>
    </div></section>
    <section className="deep-content"><div className="wrap">
      <div className="deep-intro"><h2>Історія відзнаки</h2><div>
        <p>У жовтні 2002 року вчена рада Академії затвердила положення про Інститут почесних професорів.</p>
        <p>Перелік містить відомості з архівної сторінки Академії. Посади й звання в архівних описах відображають час її публікації, а не обов’язково нинішній стан.</p>
        <a className="back-link" href="https://www.socosvita.kiev.ua/en/node/51" target="_blank" rel="noopener noreferrer">Архівне джерело ↗</a>
      </div></div>
    </div></section>
    <section className="soft" id="professors"><div className="wrap">
      <div className="idx">01 / Почесне звання</div><h2>Почесні професори Академії</h2>
      <HonoraryList people={honoraryProfessors} />
    </div></section>
    <section className="soft" id="doctors"><div className="wrap">
      <div className="idx">02 / Почесне звання</div><h2>Почесні доктори Академії</h2>
      <HonoraryList people={honoraryDoctors} />
    </div></section>
    <section className="soft"><div className="wrap"><Link className="back-link" href="/about">← Про Академію</Link></div></section>
    <SiteFooter />
  </main>;
}
