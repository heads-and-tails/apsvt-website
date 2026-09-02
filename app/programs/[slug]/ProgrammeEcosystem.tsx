import Link from "next/link";
import { getProgrammeProfile } from "@/lib/programme-profiles";
import { AcademicProfileCard } from "@/app/components/AcademicProfileCard";
import { AcademicPartnerCard } from "@/app/components/AcademicPartners";
import { MarketingTeam } from "./MarketingTeam";
import { getProgram } from "@/lib/programs";
import type { DepartmentEntry } from "@/lib/department-content";

function normalizeName(value: string) {
  return value.toLocaleLowerCase("uk-UA").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function ProgrammeEcosystem({ slug, entries = [] }: { slug: string; entries?: DepartmentEntry[] }) {
  const profile = getProgrammeProfile(slug);
  const program = getProgram(slug);
  const editorialTeachers = entries.filter((entry) => entry.entryType === "teacher");
  const editorialPartners = entries.filter((entry) => entry.entryType === "partner");
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

  const team = [
    ...profile.team.map((person) => {
      const override = editorialTeachers.find((entry) => normalizeName(entry.title) === normalizeName(person.name));
      return override ? {
        ...person,
        name: override.title || person.name,
        role: override.role || person.role,
        summary: override.summary || person.summary,
        image: override.imageUrl || person.image,
        href: override.profileUrl || person.href,
      } : person;
    }),
    ...editorialTeachers
      .filter((entry) => !profile.team.some((person) => normalizeName(person.name) === normalizeName(entry.title)))
      .map((entry) => ({ name: entry.title, role: entry.role, summary: entry.summary, image: entry.imageUrl, href: entry.profileUrl, interests: [] })),
  ];
  const partners = [
    ...profile.partners.map((partner) => {
      const override = editorialPartners.find((entry) => normalizeName(entry.title) === normalizeName(partner.name));
      return override ? {
        ...partner,
        name: override.title || partner.name,
        kind: override.role || partner.kind,
        note: override.summary || partner.note,
        logo: override.imageUrl || partner.logo,
        logoAlt: override.imageAlt || partner.logoAlt,
        href: override.profileUrl || partner.href,
      } : partner;
    }),
    ...editorialPartners
      .filter((entry) => !profile.partners.some((partner) => normalizeName(partner.name) === normalizeName(entry.title)))
      .map((entry) => ({ name: entry.title, mark: entry.title.slice(0, 3).toUpperCase(), kind: entry.role || "Партнер Академії", note: entry.summary, logo: entry.imageUrl || undefined, logoAlt: entry.imageAlt, href: entry.profileUrl || undefined, tone: "cream" as const })),
  ];

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

    {slug !== "marketing" && team.length > 0 && <section className="programme-team" id="team"><div className="wrap">
      <div className="sec-head programme-team-head"><div><div className="idx">06 / Склад кафедри</div><h2>Викладачі й практики</h2></div><p>Короткі професійні профілі команди, яка формує зміст навчання, супроводжує практику та студентські дослідження.</p></div>
      <div className="academic-profile-grid">{team.map((person, index) => <AcademicProfileCard
        key={person.name}
        index={index}
        badge={person.role.toLowerCase().includes("завідувач") ? "Керівник кафедри" : undefined}
        person={{
          name: person.name,
          role: person.role,
          summary: person.summary,
          image: person.image,
          tags: person.interests,
          details: "details" in person ? person.details : undefined,
          links: "links" in person && person.links ? person.links : (person.href ? [{ label: "Науковий профіль", href: person.href }] : []),
        }}
      />)}</div>
    </div></section>}

    {slug === "marketing" && <MarketingTeam entries={editorialTeachers} />}

    <section className="programme-science" id="science"><div className="wrap programme-science-grid"><div><div className="idx">07 / Наукова діяльність кафедри</div><h2>Дослідження, гуртки та проєкти</h2></div><div>{slug === "marketing" ? <><p>Кафедра розвиває дослідження з маркетингової аналітики, digital, брендингу та поведінки споживачів. Монографії й навчальні видання зібрані у «Наукових виданнях», а повні збірники 2024–2026 років — окремо у «Конференціях».</p><div className="programme-science-links"><Link href="/research/journals#marketing-publications">Монографії та навчальні видання →</Link><Link href="/research/conferences#marketing-proceedings">Збірники конференцій →</Link><Link href="/research">Профілі дослідників →</Link></div></> : <><p>Наукова робота розвиває напрями кафедри: {profile.departmentFocus.join(", ")}. Актуальні студентські гуртки, конференції й теми досліджень кафедра оголошує на початку навчального року.</p><Link href="/research">Наука в Академії →</Link></>}</div></div></section>

    {slug === "marketing" && <section className="marketing-student-life" id="marketing-student-life"><div className="wrap"><div className="sec-head"><div><div className="idx">06 / Студентське життя</div><h2>MARKETHINK і студентські ініціативи</h2></div><p>Окремий простір для наукового гуртка кафедри, проєктів, самоврядування та професійного розвитку студентів.</p></div><div className="marketing-student-life-grid"><article><span>01 / Науковий гурток</span><h3>MARKETHINK</h3><p>Дослідження ринку, брендів, поведінки споживачів і digital-комунікацій. Студенти готують доповіді, публікації та презентації для конференцій.</p><Link href="/research/conferences">Конференції та збірники →</Link></article><article><span>02 / Самоврядування</span><h3>Студентські ініціативи</h3><p>Участь у студентській раді, організації подій, волонтерських і комунікаційних проєктах Академії.</p><Link href="/students/council">Студентська рада →</Link></article><article><span>03 / Професійний розвиток</span><h3>Кар’єрні проєкти</h3><p>Кейси з роботодавцями, портфоліо, тренінги, практика та перші професійні контакти.</p><a href="#practice">Практика й партнери →</a></article></div></div></section>}

    <section className="programme-practice" id="practice"><div className="wrap">
      <div className="sec-head programme-practice-head"><div><div className="idx">08 / Практика і професійне середовище</div><h2>Партнери: де знання стають досвідом</h2></div><div><p>{profile.practiceNote}</p><a href={profile.practiceSourceHref} target={profile.practiceSourceHref.startsWith("/") ? undefined : "_blank"} rel={profile.practiceSourceHref.startsWith("/") ? undefined : "noreferrer"}>{profile.practiceSource} ↗</a></div></div>
      <div className="programme-partners">{partners.map((partner) => <AcademicPartnerCard partner={partner} key={partner.name} />)}</div>
      <p className="programme-practice-disclaimer">Місця практики й стажування залежать від навчального року, наявності договору та індивідуальної траєкторії. Актуальне направлення підтверджує кафедра.</p>
    </div></section>

  </>;
}
