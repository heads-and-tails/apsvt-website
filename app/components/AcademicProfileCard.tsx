import type { DepartmentEntry } from "@/lib/department-content";
import { departmentImages, departmentAttachments, type DepartmentImage } from "@/lib/department-media";
import { departmentImageStyle } from "./DepartmentMedia";
import { TeacherResumeText } from "./TeacherResume";

export type AcademicProfileLink = {
  label: string;
  href: string;
};

export type AcademicProfileCardData = {
  name: string;
  role: string;
  summary: string;
  image?: string;
  imageSettings?: DepartmentImage;
  imageFit?: "cover" | "contain";
  sourceName?: string;
  managedId?: string;
  sortOrder?: number;
  imageCrop?: "caption";
  tags?: string[];
  details?: string;
  links?: AcademicProfileLink[];
};

export function departmentTeacherProfile(entry: DepartmentEntry, source?: AcademicProfileCardData): AcademicProfileCardData {
  return {
    name: entry.title,
    sourceName: entry.teacherSourceName || source?.name,
    managedId: entry.id,
    sortOrder: entry.sortOrder,
    tags: entry.teacherTags ?? source?.tags,
    role: [entry.role, entry.teacherDegree, entry.teacherAcademicTitle].filter(Boolean).join(", "),
    summary: entry.summary,
    details: entry.body || undefined,
    image: departmentImages(entry)[0]?.url,
    imageSettings: departmentImages(entry)[0],
    links: [
      ...(entry.profileLinks ?? source?.links ?? []),
      ...(entry.profileUrl ? [{ label: "Науковий профіль", href: entry.profileUrl }] : []),
      ...(entry.email ? [{ label: entry.email, href: `mailto:${entry.email}` }] : []),
      ...departmentAttachments(entry).map((file) => ({ label: file.label, href: file.url })),
    ].filter((link, index, links) => links.findIndex((item) => item.href === link.href) === index),
  };
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 3);
}

export function AcademicProfileCard({
  person,
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

  return <article className="academic-profile-card" data-academic-profile={JSON.stringify(person)} data-editorial-rendered={person.managedId ? "true" : undefined}>
    <div className={`academic-profile-photo faculty-portrait-surface${person.imageCrop === "caption" ? " academic-profile-photo--caption" : ""}`}>
      {person.image
        ? <img src={person.image} alt={person.imageSettings?.alt || person.name} style={{ ...departmentImageStyle(person.imageSettings || { url: person.image, alt: person.name, fit: person.imageFit || "contain" }), ...((person.imageSettings?.fit || person.imageFit || "contain") === "contain" ? { transform: "none" } : {}) }} />
        : <span aria-label={`Фото ${person.name} готується до публікації`}>{initials(person.name)}</span>}
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
        {person.details && <TeacherResumeText text={person.details} />}
        {links.length > 0 && <div className="academic-profile-links">
          {links.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label} ↗</a>)}
        </div>}
      </details>}
    </div>
  </article>;
}
