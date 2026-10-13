import type { AcademicProfileCardData } from "@/app/components/AcademicProfileCard";
import type { DepartmentEntry } from "./department-content";
import { departmentImages } from "./department-media";

export function legacyFacultyProfiles(source: AcademicProfileCardData[], entries: DepartmentEntry[], section: "law-teachers" | "faculty-leadership") {
  const profiles = source.map((person) => ({ ...person, sourceName: person.sourceName || person.name }));
  const sectionIndex = section === "law-teachers" ? 11 : 2;
  const prefix = `main > section:nth-of-type(2) > section:nth-of-type(${sectionIndex}) > `;
  const overrides = entries.filter((entry) => entry.entryType === "override" && entry.sectionId === section)
    .sort((a, b) => (Date.parse(a.updatedAt || a.createdAt) || 0) - (Date.parse(b.updatedAt || b.createdAt) || 0));

  for (const entry of overrides) {
    if (entry.role === "image") {
      const name = entry.title.trim().toLocaleLowerCase("uk-UA");
      const person = profiles.find((profile) => [profile.sourceName, profile.name].some((value) => value.toLocaleLowerCase("uk-UA") === name));
      const image = departmentImages(entry)[0];
      if (person && image) { person.image = image.url; person.imageSettings = image; }
      continue;
    }
    if (entry.role !== "text" || !entry.body.startsWith(prefix)) continue;
    const field = entry.body.match(/ > article:nth-of-type\((\d+)\) > div:nth-of-type\(2\) > (h3|p|small)$/);
    if (!field) continue;
    const person = profiles[Number(field[1]) - 1];
    if (!person) continue;
    if (field[2] === "h3") { if (entry.summary.trim()) person.name = entry.summary; }
    else if (field[2] === "small") person.role = entry.summary;
    else person.summary = entry.summary;
  }
  return profiles;
}
