import Link from "next/link";
import { getProgrammeProfile, type ProgrammePartner } from "@/lib/programme-profiles";
import { AcademicProfileCard } from "@/app/components/AcademicProfileCard";
import { MarketingTeam } from "./MarketingTeam";
import { getProgram } from "@/lib/programs";

function PartnerCard({ partner }: { partner: ProgrammePartner }) {
  const content = <>
    <div className={`programme-partner-mark ${partner.tone || "cream"} ${partner.logo ? "has-logo" : "is-format"}`}>
      {partner.logo ? <img src={partner.logo} alt={partner.logoAlt || `Логотип ${partner.name}`} /> : <><span aria-hidden="true">{partner.mark}</span><small>формат практики</small></>}
    </div>
    <small>{partner.kind}</small>
    <h3>{partner.name}</h3>
    <p>{partner.note}</p>
    {partner.href && <b>{partner.href.startsWith("/") ? "Докладніше →" : "Відкрити сайт ↗"}</b>}
  </>;

  return partner.href
    ? <a className="programme-partner" href={partner.href} target={partner.href.startsWith("/") ? undefined : "_blank"} rel={partner.href.startsWith("/") ? undefined : "noreferrer"}>{content}</a>
    : <article className="programme-partner">{content}</article>;
}

export function ProgrammeEcosystem({ slug }: { slug: string }) {
  const profile = getProgrammeProfile(slug);
  const program = getProgram(slug);
  const officialProgrammeDocuments = program?.materials.map((material) => ({
    title: material.label,
    meta: material.href.endsWith(".pdf") ? "PDF · офіційна освітня програма" : "Офіційний матеріал Академії",
    href: material.href,
  })) || [];
  if (!profile && !program) return null;

  if (!profile && program) return <>
    <section className="programme-department" id="department"><div className="wrap programme-department-grid">
      <div><div className="idx">04 / Кафедра</div><h2>{program.faculty}</h2><p className="programme-department-faculty">Освітня програма {program.code} «{program.title}»</p></div>
      <div className="programme-department-copy"><p>Кафедра координує зміст програми, практичну підготовку, консультації, оновлення компонентів і взаємодію зі стейкголдерами.</p><Link href="/departments">Кафедра у структурі Академії →</Link></div>
    </div></section>
    <section className="programme-documents" id="programme-documents"><div className="wrap">
      <div className="programme-documents-head"><div><div className="idx">05 / Документи програми</div><h2>Програма, плани та дисципліни</h2></div><Link href="/documents#education">Усі документи →</Link></div>
      <div className="programme-document-list"><a href="#curriculum"><span>01</span><div><small>Структура програми</small><h3>Навчальний план і вибіркові дисципліни</h3></div><b>↓</b></a>{program.materials.map((material, index) => <a href={material.href} key={material.href}><span>{String(index + 2).padStart(2, "0")}</span><div><small>Офіційний матеріал</small><h3>{material.label}</h3></div><b>→</b></a>)}</div>
    </div></section>
    <section className="programme-team" id="team"><div className="wrap"><div className="sec-head programme-team-head"><div><div className="idx">06 / Склад кафедри</div><h2>Команда програми</h2></div><p>Профілі гаранта, викладачів і практиків публікуються на сторінці кафедри та доповнюються редактором підрозділу.</p></div><Link className="academic-inline-link" href="/departments">Перейти до кафедр →</Link></div></section>
    <section className="programme-science" id="science"><div className="wrap programme-science-grid"><div><div className="idx">07 / Наукова діяльність</div><h2>Дослідження, гуртки та проєкти</h2></div><div><p>Студентські дослідження пов’язуються з тематикою програми, конференціями Академії та науковою роботою кафедри. Актуальний склад гуртків і календар подій оголошує кафедра.</p><Link href="/research">Наука в Академії →</Link></div></div></section>
    <section className="programme-practice" id="practice"><div className="wrap"><div className="sec-head programme-practice-head"><div><div className="idx">08 / Партнери й практика</div><h2>Професійне середовище</h2></div><div><p>Базу практики та партнера кафедра підтверджує для конкретного навчального року й індивідуальної траєкторії.</p></div></div></div></section>
  </>;

  return <>
    <section className="programme-department" id="department"><div className="wrap programme-department-grid">
      <div>
        <div className="idx">04 / Кафедра і академічне середовище</div>
        <h2>{profile.department}</h2>
        <p className="programme-department-faculty">{profile.faculty}</p>
      </div>
      <div className="programme-department-copy">
        <p>{profile.departmentSummary}</p>
        <div className="programme-department-focus">{profile.departmentFocus.map((focus) => <span key={focus}>{focus}</span>)}</div>
        <Link href={profile.departmentHref}>Кафедра у структурі Академії →</Link>
      </div>
    </div></section>

    <section className="programme-documents" id="programme-documents"><div className="wrap">
      <div className="programme-documents-head"><div><div className="idx">05 / Документи програми</div><h2>Програма, плани та дисципліни</h2></div><Link href="/documents">Увесь каталог документів →</Link></div>
      <div className="programme-resource-strip" aria-label="Типи матеріалів програми"><a href="#curriculum"><b>01</b><span>Навчальний план</span></a><a href="#electives"><b>02</b><span>Вибіркові дисципліни</span></a><Link href="/materials"><b>03</b><span>Робочі програми дисциплін</span></Link><a href="#quality"><b>04</b><span>Обговорення змін до ОП</span></a></div>
      <div className="programme-document-list">{[...officialProgrammeDocuments, ...profile.documents].filter((document, index, documents) => documents.findIndex((item) => item.href === document.href) === index).map((document, index) => {
        const external = document.href.startsWith("http");
        return <a href={document.href} target={external || !document.href.endsWith(".html") ? "_blank" : undefined} rel={external || !document.href.endsWith(".html") ? "noreferrer" : undefined} key={document.title}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{document.meta}</small><h3>{document.title}</h3></div><b>{document.href.endsWith(".html") ? "→" : "↗"}</b></a>;
      })}</div>
    </div></section>

    {profile.team.length > 0 && <section className="programme-team" id="team"><div className="wrap">
      <div className="sec-head programme-team-head"><div><div className="idx">06 / Склад кафедри</div><h2>Викладачі й практики</h2></div><p>Короткі професійні профілі команди, яка формує зміст навчання, супроводжує практику та студентські дослідження.</p></div>
      <div className="academic-profile-grid">{profile.team.map((person, index) => <AcademicProfileCard
        key={person.name}
        index={index}
        badge={person.role.toLowerCase().includes("завідувач") ? "Керівник кафедри" : undefined}
        person={{
          name: person.name,
          role: person.role,
          summary: person.summary,
          image: person.image,
          tags: person.interests,
          links: person.href ? [{ label: "Науковий профіль", href: person.href }] : [],
        }}
      />)}</div>
    </div></section>}

    {slug === "marketing" && <MarketingTeam />}

    <section className="programme-science" id="science"><div className="wrap programme-science-grid"><div><div className="idx">07 / Наукова діяльність кафедри</div><h2>Дослідження, гуртки та проєкти</h2></div><div><p>Наукова робота розвиває напрями кафедри: {profile.departmentFocus.join(", ")}. Актуальні студентські гуртки, конференції й теми досліджень кафедра оголошує на початку навчального року.</p><Link href="/research">Наука в Академії →</Link></div></div></section>

    <section className="programme-practice" id="practice"><div className="wrap">
      <div className="sec-head programme-practice-head"><div><div className="idx">08 / Практика і професійне середовище</div><h2>Партнери: де знання стають досвідом</h2></div><div><p>{profile.practiceNote}</p><a href={profile.practiceSourceHref} target={profile.practiceSourceHref.startsWith("/") ? undefined : "_blank"} rel={profile.practiceSourceHref.startsWith("/") ? undefined : "noreferrer"}>{profile.practiceSource} ↗</a></div></div>
      <div className="programme-partners">{profile.partners.map((partner) => <PartnerCard partner={partner} key={partner.name} />)}</div>
      <p className="programme-practice-disclaimer">Місця практики й стажування залежать від навчального року, наявності договору та індивідуальної траєкторії. Актуальне направлення підтверджує кафедра.</p>
    </div></section>

  </>;
}
