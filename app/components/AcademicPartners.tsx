import { getProgrammeProfile, type ProgrammePartner } from "@/lib/programme-profiles";

export function AcademicPartnerCard({ partner }: { partner: ProgrammePartner }) {
  const content = <>
    <div
      className={`programme-partner-mark ${partner.tone || "cream"} ${partner.logo ? "has-logo" : "is-format"}`}
      role="img"
      aria-label={partner.logoAlt || `Логотип або фірмовий знак ${partner.name}`}
    >
      {partner.logo
        ? <img src={partner.logo} alt={partner.logoAlt || `Логотип ${partner.name}`} />
        : <><span aria-hidden="true">{partner.mark}</span><small aria-hidden="true">партнер</small></>}
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

export function AcademicPartners({
  slugs,
  title = "Партнери й професійне середовище",
  eyebrow = "Партнерська мережа",
}: {
  slugs: string[];
  title?: string;
  eyebrow?: string;
}) {
  const partners = slugs.flatMap((slug) => getProgrammeProfile(slug)?.partners || []);
  const unique = partners.filter((partner, index, all) => all.findIndex((item) => item.name === partner.name) === index).slice(0, 6);
  if (!unique.length) return null;
  return <div className="wrap academic-community-block">
    <div className="sec-head academic-community-head"><div><div className="idx">{eyebrow}</div><h2>{title}</h2></div><p>Логотипи й фірмові знаки допомагають швидко розпізнати організації, професійні платформи та практичні осередки, з якими пов’язане навчання.</p></div>
    <div className="programme-partners">{unique.map((partner) => <AcademicPartnerCard partner={partner} key={partner.name} />)}</div>
  </div>;
}
