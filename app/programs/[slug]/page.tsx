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

export const dynamic = "force-dynamic";
export function generateStaticParams(){return programs.map((program)=>({slug:program.slug}));}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const program=getProgram((await params).slug);
  return program?{title:program.title,description:`${program.title}: навчальний план, вартість, викладачі та кар'єра в АПСВТ.`}:{};
}

export default async function Page({params}:{params:Promise<{slug:string}>}){
  const slug=(await params).slug;const program=getProgram(slug);if(!program)notFound();
  const departmentEntries = await getDepartmentEntries(`/programs/${slug}`);
  const programmeTeam = slug === "marketing" ? marketingTeam : getProgrammeProfile(slug)?.team || [];
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
    <section><div className="wrap program-intro"><div><div className="idx">01 / Про програму</div><h2>Навчання з практичним результатом</h2><p className="program-lede">{program.overview}</p><div className="focus-list">{program.focus.map((item,i)=><div key={item}><span>0{i+1}</span><b>{item}</b></div>)}</div></div><aside className="program-facts"><div><span>Рівень</span><b>{program.levels}</b></div><div><span>Тривалість бакалаврату</span><b>{program.duration}</b></div><div><span>Бакалаврат, денна</span><b>{program.price}</b></div><div><span>Бакалаврат, заочна</span><b>{program.partTimePrice}</b></div>{program.masterPrice&&<div><span>Магістратура, денна</span><b>{program.masterPrice}</b></div>}{program.masterPartTimePrice&&<div><span>Магістратура, заочна</span><b>{program.masterPartTimePrice}</b></div>}<small>Вартість для вступників 2026 року, за один навчальний рік.</small><Link className="cta" href="/tuition#calculator"><span>Усі тарифи й оплата</span></Link></aside></div></section>
    {slug === "law" ? <LawCurriculumPlan /> : <ProgrammeCurriculumPlan slug={slug} code={program.code} title={program.title} />}
    {slug === "law" && <LawCourseAnnotations />}
    <section><div className="wrap career-layout"><div><div className="idx">03 / Після випуску</div><h2>Кар’єрні можливості</h2><div className="career-list">{program.careers.map((career,i)=><div key={career}><span>0{i+1}</span><b>{career}</b></div>)}</div></div><aside className="programme-lead-card"><AcademicProfileCard badge="Керівник програми" person={{ name: program.lead, role: program.leadRole, summary: programmeLead?.summary || `Координує освітню траєкторію та академічну якість програми «${program.title}».`, image: programmeLead?.image, tags: programmeLead?.interests, links: programmeLeadLinks }} /></aside></div></section>
    <ProgrammeEcosystem slug={slug} />
    <DepartmentEditorialContent entries={departmentEntries} />
    <ProgramEntranceExams slug={slug} />
    <ProgramDoctoralResources slug={slug} />
    <section className="intl-band"><div className="wrap"><div><div className="idx">{slug === "marketing" ? "05" : "04"} / Міжнародний горизонт</div><h2>Навчайтеся ширше</h2></div><div>{program.international.map(item=><p key={item}>{item}<span>↗</span></p>)}<Link className="cta" href="/international"><span>Усі можливості</span></Link></div></div></section>
    <PageDocuments pagePath={`/programs/${slug}`} />
    <SiteFooter /></main>;
}
