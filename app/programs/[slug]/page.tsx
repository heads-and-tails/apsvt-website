import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageDocuments } from "../../components/PageDocuments";
import { getProgram, programs } from "@/lib/programs";
import { ProgramEntranceExams } from "./ProgramEntranceExams";
import { ProgramDoctoralResources } from "./ProgramDoctoralResources";
import { ProgrammeEcosystem } from "./ProgrammeEcosystem";
import { LawCourseAnnotations } from "@/app/components/LawCourseAnnotations";
import { LawCurriculumPlan } from "@/app/components/LawCurriculumPlan";
import { ProgrammeCurriculumPlan } from "@/app/components/ProgrammeCurriculumPlan";
import { AcademicProfileCard } from "@/app/components/AcademicProfileCard";
import { getProgrammeProfile } from "@/lib/programme-profiles";
import { marketingTeam } from "@/lib/marketing-team";
import { getDepartmentEntries } from "@/lib/department-content";
import { DepartmentEditorialContent } from "@/app/components/DepartmentEditorialContent";
import { SectionHub, type SectionHubItem } from "@/app/components/SectionHub";
import { EducationQualitySection } from "@/app/components/EducationQualitySection";
import { AcademicNews } from "@/app/components/AcademicNews";
import { MarketingTeam } from "./MarketingTeam";

export const dynamic = "force-dynamic";
export function generateStaticParams(){return programs.map((program)=>({slug:program.slug}));}

const programmeSections: readonly SectionHubItem[] = [
  { id: "overview", index: "01", title: "Про програму", description: "Зміст, результати навчання, рівні освіти та вартість.", icon: "OP", aliases: ["education-levels"] },
  { id: "curriculum", index: "02", title: "Навчальний план", description: "Компоненти, кредити, атестація, анотації та вибіркові дисципліни.", icon: "PLAN", aliases: ["electives", "course-annotations"] },
  { id: "careers", index: "03", title: "Кар’єра", description: "Професійні можливості після випуску та керівник програми.", icon: "GO" },
  { id: "department", index: "04", title: "Кафедра й освітнє середовище", description: "Документи, команда, наука, практика та партнери.", icon: "DEP", aliases: ["programme-documents", "team", "science", "practice"] },
  { id: "quality", index: "05", title: "Якість освіти", description: "Моніторинг, опитування, оцінювання викладачів та обговорення змін до програми.", icon: "✓" },
  { id: "department-news", index: "06", title: "Новини й вступні матеріали", description: "Новини кафедри, програми випробувань і ресурси PhD.", icon: "NEWS", aliases: ["doctoral-programme"] },
  { id: "international", index: "07", title: "Міжнародні можливості", description: "Мобільність, партнерські ініціативи та міжнародний досвід.", icon: "INT" },
];

const marketingSections: readonly SectionHubItem[] = [
  { id: "department", index: "01", title: "Про кафедру", description: "Місія, напрями роботи та освітнє середовище кафедри маркетингу.", icon: "D5" },
  { id: "department-team", index: "02", title: "Науково-педагогічний склад", description: "Викладачі, освіта, наукові інтереси та професійні профілі.", icon: "NPP" },
  { id: "curriculum", index: "03", title: "Освітні програми", description: "Рівні освіти, навчальні плани, обов’язкові й вибіркові компоненти.", icon: "OP", aliases: ["overview", "education-levels", "electives", "course-annotations"] },
  { id: "science", index: "04", title: "Наукова діяльність", description: "Дослідження, видання, конференції та наукові профілі викладачів.", icon: "SCI" },
  { id: "programme-documents", index: "05", title: "Навчально-методичне забезпечення", description: "Офіційні програми, плани, дисципліни й матеріали кафедри.", icon: "PDF" },
  { id: "marketing-student-life", index: "06", title: "Студентське життя та самоврядування", description: "Гурток MARKETHINK, студентські ініціативи й участь у житті Академії.", icon: "M" },
  { id: "careers", index: "07", title: "Кар’єра і працевлаштування", description: "Професійні ролі, практика, роботодавці та кар’єрні можливості.", icon: "GO", aliases: ["practice"] },
  { id: "department-news", index: "08", title: "Новини", description: "Події, публікації та оголошення кафедри маркетингу.", icon: "NEWS" },
];

const financeSections: readonly SectionHubItem[] = [
  ...programmeSections.slice(0, 5),
  { id: "department-news", index: "06", title: "Новини", description: "Події, публікації та оголошення кафедри фінансів.", icon: "NEWS", aliases: ["doctoral-programme"] },
  { id: "contacts", index: "07", title: "Контакти", description: "Зв’язок із кафедрою фінансів та редакційною командою сторінки.", icon: "MAIL" },
];

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const program=getProgram((await params).slug);
  return program?{title:program.title,description:`${program.title}: навчальний план, вартість, викладачі та кар'єра в АПСВТ.`}:{};
}

export default async function Page({params}:{params:Promise<{slug:string}>}){
  const slug=(await params).slug;const program=getProgram(slug);if(!program)notFound();
  const departmentEntries = await getDepartmentEntries(`/programs/${slug}`);
  const programmeProfile = getProgrammeProfile(slug);
  const programmeTeam = slug === "marketing" ? marketingTeam : programmeProfile?.team || [];
  const programmeLead = programmeTeam.find((person) => person.name === program.lead) || programmeTeam[0];
  const programmeLeadLinks = programmeLead
    ? "profiles" in programmeLead
      ? programmeLead.profiles
      : "links" in programmeLead && programmeLead.links
        ? programmeLead.links
        : programmeLead.href
          ? [{ label: "Науковий профіль", href: programmeLead.href }]
          : []
    : [];
  const activeSections = slug === "marketing" ? marketingSections : slug === "finance" ? financeSections : programmeSections;
  const navigatorDescription = slug === "marketing"
    ? "Оберіть склад кафедри, освітні програми, науку, матеріали, студентське життя, кар’єру або новини — відкриється тільки потрібний розділ."
    : slug === "finance"
      ? "Оберіть навчальний план, кафедру, кар’єру, новини або контакти — відкриється тільки потрібний розділ."
      : "Оберіть навчальний план, кафедру, кар’єру, вступні матеріали або міжнародні можливості — відкриється тільки потрібний розділ.";
  const marketingSectionContent = slug === "marketing" ? [
    <section className="marketing-department-empty" id="department" key="marketing-about"><div className="wrap"><div className="idx">01 / Про кафедру</div><h2>Про кафедру</h2><p>Інформація буде додана кафедрою маркетингу.</p></div></section>,
    <MarketingTeam entries={departmentEntries.filter((entry) => entry.entryType === "teacher")} key="marketing-team" />,
    <section className="marketing-department-empty" id="curriculum" key="marketing-programmes"><div className="wrap"><div className="idx">03 / Освітні програми</div><h2>Освітні програми</h2><p>Інформація буде додана кафедрою маркетингу.</p></div></section>,
    <section className="marketing-science-clean" id="science" key="marketing-science"><div className="wrap"><div className="sec-head"><div><div className="idx">04 / Наукова діяльність</div><h2>Наукова діяльність кафедри</h2></div><p>У розділі залишено лише матеріали, підтверджені кафедрою.</p></div><div className="marketing-science-clean-grid">
      <Link href="/research/conferences#marketing-proceedings"><span>01</span><small>Конференції</small><h3>Збірники матеріалів конференцій</h3><p>Повні PDF за 2024, 2025 та 2026 роки.</p><b>→</b></Link>
      <Link href="/research/journals#marketing-publications"><span>02</span><small>Наукові видання</small><h3>Монографії кафедри</h3><p>Дві колективні монографії, підготовлені викладачами кафедри.</p><b>→</b></Link>
      <Link href="/research/journals#marketing-publications"><span>03</span><small>Навчальне видання</small><h3>Соціально відповідальний маркетинг</h3><p>Навчальний посібник кафедри.</p><b>→</b></Link>
      <Link href="/materials/3331-0b35c55db.html"><span>04</span><small>Науковий гурток</small><h3>MARKETHINK</h3><p>Матеріали гуртка та участі студентів у конференціях.</p><b>→</b></Link>
    </div></div></section>,
    <section className="marketing-department-empty" id="programme-documents" key="marketing-methodical"><div className="wrap"><div className="idx">05 / Навчально-методичне забезпечення</div><h2>Навчально-методичне забезпечення</h2><p>Інформація буде додана кафедрою маркетингу.</p></div></section>,
    <section className="marketing-department-empty" id="marketing-student-life" key="marketing-student-life"><div className="wrap"><div className="idx">06 / Студентське життя та самоврядування</div><h2>Студентське життя та самоврядування</h2><p>Інформація буде додана кафедрою маркетингу.</p></div></section>,
    <section className="marketing-department-empty" id="careers" key="marketing-careers"><div className="wrap"><div className="idx">07 / Працевлаштування</div><h2>Працевлаштування</h2><p>Інформація буде додана кафедрою маркетингу.</p></div></section>,
    <section className="marketing-department-empty" id="department-news" key="marketing-news"><div className="wrap"><div className="idx">08 / Новини</div><h2>Новини кафедри</h2><p>Інформація буде додана кафедрою маркетингу.</p></div></section>,
  ] : null;
  return <main id="top" data-page-materials-server="true"><SiteHeader />
    <section className="program-hero" data-program={program.slug}><div className="program-hero-bg"><img src={program.image} alt="" /></div><div className="wrap program-hero-in"><Link href="/programs" className="back-link">← Усі програми</Link><span className="program-code">{program.code}</span><h1>{program.title}</h1><p>{program.short}</p></div></section><div className="hero-rule" />
    <SectionHub sections={activeSections} eyebrow={slug === "marketing" ? "Навігатор кафедри маркетингу" : `Навігатор програми ${program.code}`} description={navigatorDescription}>
    {marketingSectionContent || <>
    <section id="overview"><div className="wrap program-intro"><div><div className="idx">01 / Спеціальність і програма</div><h2>Навчання з практичним результатом</h2><p className="program-lede">{program.overview}</p><div className="focus-list">{program.focus.map((item,i)=><div key={item}><span>0{i+1}</span><b>{item}</b></div>)}</div></div><aside className="program-facts" id="education-levels"><div><span>Рівень</span><b>{program.levels}</b></div><div><span>Тривалість бакалаврату</span><b>{program.duration}</b></div><div><span>Бакалаврат, денна</span><b>{program.price}</b></div><div><span>Бакалаврат, заочна</span><b>{program.partTimePrice}</b></div>{program.masterPrice&&<div><span>Магістратура, денна</span><b>{program.masterPrice}</b></div>}{program.masterPartTimePrice&&<div><span>Магістратура, заочна</span><b>{program.masterPartTimePrice}</b></div>}<small>Вартість для вступників 2026 року, за один навчальний рік.</small><Link className="cta" href="/tuition#calculator"><span>Усі тарифи й оплата</span></Link></aside></div></section>
    <div>{slug === "law" ? <LawCurriculumPlan /> : <ProgrammeCurriculumPlan slug={slug} code={program.code} title={program.title} />}
    {slug === "law" && <LawCourseAnnotations />}</div>
    <section id="careers"><div className="wrap career-layout"><div><div className="idx">03 / Після випуску</div><h2>Кар’єрні можливості</h2><div className="career-list">{program.careers.map((career,i)=><div key={career}><span>0{i+1}</span><b>{career}</b></div>)}</div></div><aside className="programme-lead-card"><AcademicProfileCard badge="Керівник програми" person={{ name: program.lead, role: program.leadRole, summary: programmeLead?.summary || `Координує освітню траєкторію та академічну якість програми «${program.title}».`, image: programmeLead?.image, tags: programmeLead?.interests, links: programmeLeadLinks }} /></aside></div></section>
    <div><ProgrammeEcosystem slug={slug} entries={departmentEntries} /></div>
    <EducationQualitySection
      entries={departmentEntries}
      pagePath={`/programs/${slug}`}
      index="05"
      discussionEmail={programmeProfile?.discussionEmail}
      title={`Якість програми ${program.code}`}
      description="Моніторинг освітнього процесу, результати опитувань студентів, обговорення змін до освітньої програми та щорічне оцінювання викладачів."
    />
    <div id="department-news"><AcademicNews slugs={[slug]} title={`Новини програми ${program.code}`} />
    <DepartmentEditorialContent entries={departmentEntries.filter((entry) => !["hero", "teacher", "partner"].includes(entry.entryType))} />
    <ProgramEntranceExams slug={slug} />
    <ProgramDoctoralResources slug={slug} /></div>
    {slug === "finance" ? <section className="finance-contact" id="contacts"><div className="wrap finance-contact-grid">
      <div><div className="idx">07 / Контакти</div><h2>Зв’язок із кафедрою фінансів</h2><p>Питання щодо освітніх програм, навчальних дисциплін, партнерств і матеріалів кафедри можна надіслати завідувачці кафедри.</p></div>
      <div className="finance-contact-card"><small>Завідувачка кафедри</small><h3>Яніна Ткаченко</h3><a href="mailto:tkachenko.ys@socosvita.kiev.ua">tkachenko.ys@socosvita.kiev.ua</a><Link href="/contacts">Усі контакти Академії →</Link></div>
    </div></section> : <section className="intl-band" id="international"><div className="wrap"><div><div className="idx">07 / Міжнародний горизонт</div><h2>Навчайтеся ширше</h2></div><div>{program.international.map(item=><p key={item}>{item}<span>↗</span></p>)}<Link className="cta" href="/international"><span>Усі можливості</span></Link></div></div></section>}
    </>}
    </SectionHub>
    {slug !== "marketing" && <PageDocuments pagePath={`/programs/${slug}`} />}
    <SiteFooter /></main>;
}
