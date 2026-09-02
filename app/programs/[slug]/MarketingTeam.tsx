import { marketingTeam } from "@/lib/marketing-team";
import { AcademicProfileCard } from "@/app/components/AcademicProfileCard";
import type { DepartmentEntry } from "@/lib/department-content";

function normalizeName(value: string) {
  return value.toLocaleLowerCase("uk-UA").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function MarketingTeam({ entries = [] }: { entries?: DepartmentEntry[] }) {
  const team = [
    ...marketingTeam.map((member) => {
      const override = entries.find((entry) => normalizeName(entry.title) === normalizeName(member.name));
      return override ? {
        ...member,
        name: override.title || member.name,
        role: override.role || member.role,
        summary: override.summary || member.summary,
        image: override.imageUrl || member.image,
        profiles: override.profileUrl ? [{ label: "Науковий профіль", href: override.profileUrl }] : member.profiles,
      } : member;
    }),
    ...entries
      .filter((entry) => !marketingTeam.some((member) => normalizeName(member.name) === normalizeName(entry.title)))
      .map((entry) => ({
        name: entry.title,
        role: entry.role,
        image: entry.imageUrl,
        summary: entry.summary,
        education: entry.body,
        interests: [],
        profiles: entry.profileUrl ? [{ label: "Науковий профіль", href: entry.profileUrl }] : [],
        lead: false,
      })),
  ];
  return <section className="marketing-team-section" id="department-team"><div className="wrap">
    <div className="sec-head marketing-team-head"><div><div className="idx">04 / Кафедра маркетингу</div><h2>Команда кафедри</h2></div><p>Викладачі поєднують академічні дослідження, практичний маркетинг, цифрові технології та міжнародні проєкти.</p></div>
    <aside className="marketing-membership-callout" aria-label="Професійне членство викладачів кафедри">
      <span>Професійна спільнота</span>
      <p>Викладачі кафедри є членами ГО «<a href="https://uam.in.ua/" target="_blank" rel="noreferrer">Українська Асоціація Маркетингу</a>» та користуються доступом до професійного обміну знаннями, експертних матеріалів, галузевих перекладів міжнародних документів і актуальних досліджень, які поширює УАМ.</p>
      <a className="marketing-membership-link" href="https://uam.in.ua/" target="_blank" rel="noreferrer">Відкрити сайт УАМ ↗</a>
    </aside>
    <div className="academic-profile-grid">{team.map((member, index) => <AcademicProfileCard
      key={member.name}
      index={index}
      badge={member.lead ? "Завідувачка кафедри" : undefined}
      detailsLabel="Освіта та наукові профілі"
      person={{
        name: member.name,
        role: member.role,
        summary: member.summary,
        image: member.image,
        tags: member.interests,
        details: member.education,
        links: member.profiles,
      }}
    />)}</div>
  </div></section>;
}
