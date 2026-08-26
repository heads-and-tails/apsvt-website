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
      : programmeLead.href
        ? [{ label: "Науковий профіль", href: programmeLead.href }]
        : []
    : [];
  return <main id="top"><SiteHeader />
    <section className="program-hero" data-program={program.slug}><div className="program-hero-bg"><img src={program.image} alt="" /></div><div className="wrap program-hero-in"><Link href="/programs" className="back-link">← Усі програми</Link><span className="program-code">{program.code}</span><h1>{program.title}</h1><p>{program.short}</p></div></section><div className="hero-rule" />
    <SectionHub sections={programmeSections} eyebrow={`Навігатор програми ${program.code}`} description="Оберіть навчальний план, кафедру, кар’єру, вступні матеріали або міжнародні можливості — відкриється тільки потрібний розділ.">
    <section id="overview"><div className="wrap program-intro"><div><div className="idx">01 / Спеціальність і програма</div><h2>Навчання з практичним результатом</h2><p className="program-lede">{program.overview}</p><div className="focus-list">{program.focus.map((item,i)=><div key={item}><span>0{i+1}</span><b>{item}</b></div>)}</div></div><aside className="program-facts" id="education-levels"><div><span>Рівень</span><b>{program.levels}</b></div><div><span>Тривалість бакалаврату</span><b>{program.duration}</b></div><div><span>Бакалаврат, денна</span><b>{program.price}</b></div><div><span>Бакалаврат, заочна</span><b>{program.partTimePrice}</b></div>{program.masterPrice&&<div><span>Магістратура, денна</span><b>{program.masterPrice}</b></div>}{program.masterPartTimePrice&&<div><span>Магістратура, заочна</span><b>{program.masterPartTimePrice}</b></div>}<small>Вартість для вступників 2026 року, за один навчальний рік.</small><Link className="cta" href="/tuition#calculator"><span>Усі тарифи й оплата</span></Link></aside></div></section>
    <div>{slug === "law" ? <LawCurriculumPlan /> : <ProgrammeCurriculumPlan slug={slug} code={program.code} title={program.title} />}
    {slug === "law" && <LawCourseAnnotations />}</div>
    <section id="careers"><div className="wrap career-layout"><div><div className="idx">03 / Після випуску</div><h2>Кар’єрні можливості</h2><div className="career-list">{program.careers.map((career,i)=><div key={career}><span>0{i+1}</span><b>{career}</b></div>)}</div></div><aside className="programme-lead-card"><AcademicProfileCard badge="Керівник програми" person={{ name: program.lead, role: program.leadRole, summary: programmeLead?.summary || `Координує освітню траєкторію та академічну якість програми «${program.title}».`, image: programmeLead?.image, tags: programmeLead?.interests, links: programmeLeadLinks }} /></aside></div></section>
    <div><ProgrammeEcosystem slug={slug} /></div>
    <EducationQualitySection
      entries={departmentEntries}
      pagePath={`/programs/${slug}`}
      index="05"
      discussionEmail={programmeProfile?.discussionEmail}
      title={`Якість програми ${program.code}`}
      description="Моніторинг освітнього процесу, результати опитувань студентів, обговорення змін до освітньої програми та щорічне оцінювання викладачів."
    />
    <div id="department-news"><DepartmentEditorialContent entries={departmentEntries} />
    <ProgramEntranceExams slug={slug} />
    <ProgramDoctoralResources slug={slug} /></div>
    <section className="intl-band" id="international"><div className="wrap"><div><div className="idx">07 / Міжнародний горизонт</div><h2>Навчайтеся ширше</h2></div><div>{program.international.map(item=><p key={item}>{item}<span>↗</span></p>)}<Link className="cta" href="/international"><span>Усі можливості</span></Link></div></div></section>
    </SectionHub>
    <PageDocuments pagePath={`/programs/${slug}`} />
    <SiteFooter /></main>;
}
