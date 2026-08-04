import { marketingTeam } from "@/lib/marketing-team";
import { AcademicProfileCard } from "@/app/components/AcademicProfileCard";

export function MarketingTeam() {
  return <section className="marketing-team-section" id="department-team"><div className="wrap">
    <div className="sec-head marketing-team-head"><div><div className="idx">04 / Кафедра маркетингу</div><h2>Команда кафедри</h2></div><p>Викладачі поєднують академічні дослідження, практичний маркетинг, цифрові технології та міжнародні проєкти.</p></div>
    <div className="academic-profile-grid">{marketingTeam.map((member, index) => <AcademicProfileCard
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
