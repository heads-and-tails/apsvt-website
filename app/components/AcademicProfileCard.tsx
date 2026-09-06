export type AcademicProfileLink = {
  label: string;
  href: string;
};

export type AcademicProfileCardData = {
  name: string;
  role: string;
  summary: string;
  image?: string;
  imageCrop?: "caption";
  tags?: string[];
  details?: string;
  links?: AcademicProfileLink[];
};

function initials(name: string) {
  return name.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 3);
}

export function AcademicProfileCard({
  person,
  index = 0,
  badge,
  detailsLabel = "Докладніше",
}: {
  person: AcademicProfileCardData;
  index?: number;
  badge?: string;
  detailsLabel?: string;
}) {
  const links = person.links || [];
  const hasDetails = Boolean(person.details || links.length);

  return <article className="academic-profile-card">
    <div className={`academic-profile-photo faculty-portrait-surface${person.imageCrop === "caption" ? " academic-profile-photo--caption" : ""}`}>
      {person.image
        ? <img src={person.image} alt={person.name} />
        : <span aria-label={`Фото ${person.name} готується до публікації`}>{initials(person.name)}</span>}
      <b>{String(index + 1).padStart(2, "0")}</b>
    </div>
    <div className="academic-profile-copy">
      {badge && <em className="academic-profile-badge">{badge}</em>}
      <small>{person.role}</small>
      <h3>{person.name}</h3>
      <p>{person.summary}</p>
      {person.tags && person.tags.length > 0 && <div className="academic-profile-tags">
        {person.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>}
      {hasDetails && <details>
        <summary>{detailsLabel}<i>+</i></summary>
        {person.details && <p>{person.details}</p>}
        {links.length > 0 && <div className="academic-profile-links">
          {links.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label} ↗</a>)}
        </div>}
      </details>}
    </div>
  </article>;
}
