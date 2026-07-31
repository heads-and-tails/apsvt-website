import Link from "next/link";
import { getProgrammeProfile, type ProgrammePartner } from "@/lib/programme-profiles";
import { MarketingTeam } from "./MarketingTeam";

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
  if (!profile) return null;

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

    <section className="programme-practice" id="practice"><div className="wrap">
      <div className="sec-head programme-practice-head"><div><div className="idx">05 / Практика і професійне середовище</div><h2>Де знання стають досвідом</h2></div><div><p>{profile.practiceNote}</p><a href={profile.practiceSourceHref} target={profile.practiceSourceHref.startsWith("/") ? undefined : "_blank"} rel={profile.practiceSourceHref.startsWith("/") ? undefined : "noreferrer"}>{profile.practiceSource} ↗</a></div></div>
      <div className="programme-partners">{profile.partners.map((partner) => <PartnerCard partner={partner} key={partner.name} />)}</div>
      <p className="programme-practice-disclaimer">Місця практики й стажування залежать від навчального року, наявності договору та індивідуальної траєкторії. Актуальне направлення підтверджує кафедра.</p>
    </div></section>

    {profile.team.length > 0 && <section className="programme-team" id="team"><div className="wrap">
      <div className="sec-head programme-team-head"><div><div className="idx">06 / Люди програми</div><h2>Викладачі й практики</h2></div><p>Короткі професійні профілі команди, яка формує зміст навчання, супроводжує практику та студентські дослідження.</p></div>
      <div className="programme-team-grid">{profile.team.map((person, index) => <article key={person.name}>
        <div className="programme-person-visual">
          {person.image ? <img src={person.image} alt={person.name} /> : <span aria-label={`Фото ${person.name} готується до публікації`}>{person.name.split(" ").map((part) => part[0]).join("")}</span>}
          <b>{String(index + 1).padStart(2, "0")}</b>
        </div>
        <div className="programme-person-copy"><h3>{person.name}</h3><strong>{person.role}</strong><p>{person.summary}</p><div>{person.interests.map((interest) => <span key={interest}>{interest}</span>)}</div>{person.href && <a href={person.href} target="_blank" rel="noreferrer">Науковий профіль ↗</a>}</div>
      </article>)}</div>
    </div></section>}

    {slug === "marketing" && <MarketingTeam />}

    <section className="programme-documents" id="programme-documents"><div className="wrap">
      <div className="programme-documents-head"><div><div className="idx">{profile.team.length > 0 ? "07" : "06"} / Документи програми</div><h2>Програми, положення<br />та навчальні матеріали</h2></div><Link href="/documents">Увесь каталог документів →</Link></div>
      <div className="programme-document-list">{profile.documents.map((document, index) => {
        const external = document.href.startsWith("http");
        return <a href={document.href} target={external || !document.href.endsWith(".html") ? "_blank" : undefined} rel={external || !document.href.endsWith(".html") ? "noreferrer" : undefined} key={document.title}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{document.meta}</small><h3>{document.title}</h3></div><b>{document.href.endsWith(".html") ? "→" : "↗"}</b></a>;
      })}</div>
    </div></section>
  </>;
}
