import { AcademicProfileCard } from "@/app/components/AcademicProfileCard";
import { getProgrammeProfile } from "@/lib/programme-profiles";

export function AcademicPeople({
  slugs,
  title = "Люди факультету",
  eyebrow = "Академічна команда",
}: {
  slugs: string[];
  title?: string;
  eyebrow?: string;
}) {
  const people = slugs.flatMap((slug) => getProgrammeProfile(slug)?.team || []);
  const unique = people.filter((person, index, all) => all.findIndex((item) => item.name === person.name) === index).slice(0, 6);
  if (!unique.length) return null;
  return <div className="wrap academic-community-block">
    <div className="sec-head academic-community-head"><div><div className="idx">{eyebrow}</div><h2>{title}</h2></div><p>Керівники програм, науковці та практики, які відповідають за зміст навчання, дослідження і зв’язок із професійним середовищем.</p></div>
    <div className="academic-profile-grid">{unique.map((person, index) => <AcademicProfileCard
      key={person.name}
      index={index}
      badge={person.role.toLocaleLowerCase("uk-UA").includes("завідувач") ? "Керівник кафедри" : undefined}
      person={{
        name: person.name,
        role: person.role,
        summary: person.summary,
        image: person.image,
        tags: person.interests,
        links: person.href ? [{ label: "Науковий профіль", href: person.href }] : [],
      }}
    />)}</div>
  </div>;
}
