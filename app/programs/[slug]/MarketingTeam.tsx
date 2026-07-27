import { marketingTeam } from "@/lib/marketing-team";

function ProfileLinks({ profiles }: { profiles: (typeof marketingTeam)[number]["profiles"] }) {
  if (!profiles.length) return null;
  return <div className="marketing-profile-links">{profiles.map((profile) =>
    <a href={profile.href} target="_blank" rel="noreferrer" key={profile.label}>{profile.label} ↗</a>
  )}</div>;
}

export function MarketingTeam() {
  const lead = marketingTeam.find((member) => member.lead);
  const lecturers = marketingTeam.filter((member) => !member.lead);
  if (!lead) return null;

  return <section className="marketing-team-section" id="department-team"><div className="wrap">
    <div className="sec-head marketing-team-head"><div><div className="idx">04 / Кафедра маркетингу</div><h2>Команда кафедри</h2></div><p>Викладачі поєднують академічні дослідження, практичний маркетинг, цифрові технології та міжнародні проєкти.</p></div>

    <article className="marketing-lead">
      <div className="marketing-lead-photo"><img src={lead.image} alt={`Надія Писаренко — ${lead.role}`} /></div>
      <div className="marketing-lead-copy">
        <span>Завідувачка кафедри</span>
        <h3>{lead.name}</h3>
        <strong>{lead.role}</strong>
        <p>{lead.summary}</p>
        <div className="marketing-interest-list">{lead.interests.map((interest) => <b key={interest}>{interest}</b>)}</div>
        <details><summary>Освіта та професійний профіль <i>+</i></summary><p>{lead.education}</p><ProfileLinks profiles={lead.profiles} /></details>
      </div>
    </article>

    <div className="marketing-team-grid">{lecturers.map((member, index) => <article className="marketing-person" key={member.name}>
      <div className="marketing-person-photo"><img src={member.image} alt={`${member.name} — ${member.role}`} /><span>{String(index + 1).padStart(2, "0")}</span></div>
      <div className="marketing-person-copy">
        <h3>{member.name}</h3>
        <strong>{member.role}</strong>
        <p>{member.summary}</p>
        <div className="marketing-interest-list">{member.interests.map((interest) => <b key={interest}>{interest}</b>)}</div>
        <details><summary>Досвід і наукові профілі <i>+</i></summary><p>{member.education}</p><ProfileLinks profiles={member.profiles} /></details>
      </div>
    </article>)}</div>
  </div></section>;
}
