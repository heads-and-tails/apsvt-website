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
  { id: "overview", index: "01", title: "Про програми", description: "Бакалаврська й магістерська траєкторії, навчальні плани та дисципліни.", icon: "OP", aliases: ["education-levels", "curriculum", "electives", "course-annotations"] },
  { id: "department", index: "02", title: "Кафедра і освітнє середовище", description: "Про кафедру, документи, викладачі, практика та партнери.", icon: "D2", aliases: ["programme-documents", "team", "science", "practice"] },
  { id: "international", index: "03", title: "Міжнародні проєкти", description: "GreenFinEDU, Erasmus+ та професійні міжнародні ініціативи.", icon: "INT" },
  { id: "quality", index: "04", title: "Якість освіти", description: "Моніторинг, опитування, оцінювання НПП та обговорення змін до ОП.", icon: "✓" },
  { id: "applicants", index: "05", title: "Вступникам", description: "Кар’єрні можливості, умови вступу, вартість і консультація.", icon: "2026", aliases: ["careers"] },
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
      ? "Оберіть програми, освітнє середовище, міжнародні проєкти, якість, вступ, новини або контакти — відкриється тільки потрібний розділ."
      : "Оберіть навчальний план, кафедру, кар’єру, вступні матеріали або міжнародні можливості — відкриється тільки потрібний розділ.";
  const marketingSectionContent = slug === "marketing" ? [
    <section className="programme-department" id="department" key="marketing-about"><div className="wrap programme-department-grid">
      <div><div className="idx">01 / Про кафедру</div><h2>Кафедра маркетингу</h2><p className="programme-department-faculty">Факультет економіки, соціальних технологій і туризму</p></div>
      <div className="programme-department-copy"><p>Кафедра забезпечує підготовку здобувачів за спеціальністю D5 «Маркетинг» на бакалаврському та магістерському рівнях.</p><div className="programme-department-focus"><span>бакалаврат</span><span>магістратура</span><span>освітня програма D5</span></div><Link href="/departments/economics-social-tourism-faculty#departments">Кафедра у структурі Академії →</Link></div>
    </div></section>,
    <MarketingTeam entries={departmentEntries.filter((entry) => entry.entryType === "teacher")} key="marketing-team" />,
    <ProgrammeCurriculumPlan slug={slug} code={program.code} title={program.title} key="marketing-programmes" />,
    <section className="marketing-science-clean" id="science" key="marketing-science"><div className="wrap"><div className="sec-head"><div><div className="idx">04 / Наукова діяльність</div><h2>Наукова діяльність кафедри</h2></div><p>У розділі залишено лише матеріали, підтверджені кафедрою.</p></div><div className="marketing-science-clean-grid">
      <Link href="/research/conferences#marketing-proceedings"><span>01</span><small>Конференції</small><h3>Збірники матеріалів конференцій</h3><p>Повні PDF за 2024, 2025 та 2026 роки.</p><b>→</b></Link>
      <Link href="/research/journals#marketing-publications"><span>02</span><small>Наукові видання</small><h3>Монографії кафедри</h3><p>Дві колективні монографії, підготовлені викладачами кафедри.</p><b>→</b></Link>
      <Link href="/research/journals#marketing-publications"><span>03</span><small>Навчальне видання</small><h3>Соціально відповідальний маркетинг</h3><p>Навчальний посібник кафедри.</p><b>→</b></Link>
      <Link href="/materials/3331-0b35c55db.html"><span>04</span><small>Науковий гурток</small><h3>MARKETHINK</h3><p>Матеріали гуртка та участі студентів у конференціях.</p><b>→</b></Link>
    </div></div></section>,
    <section className="programme-documents" id="programme-documents" key="marketing-methodical"><div className="wrap"><div className="programme-documents-head"><div><div className="idx">05 / Навчально-методичне забезпечення</div><h2>Офіційні програми й матеріали</h2></div><Link href="/documents#education">Усі освітні документи →</Link></div><div className="programme-document-list">
      {program.materials.map((material, index) => <a href={material.href} target={material.href.endsWith(".pdf") ? "_blank" : undefined} rel={material.href.endsWith(".pdf") ? "noreferrer" : undefined} key={material.href}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{material.href.endsWith(".pdf") ? "PDF · офіційний документ" : "Матеріали кафедри"}</small><h3>{material.label}</h3></div><b>{material.href.endsWith(".pdf") ? "↗" : "→"}</b></a>)}
      <Link href="/research/journals#marketing-publications"><span>04</span><div><small>Повні тексти</small><h3>Монографії та навчальний посібник кафедри</h3></div><b>→</b></Link>
    </div></div></section>,
    <section className="marketing-student-life" id="marketing-student-life" key="marketing-student-life"><div className="wrap"><div className="sec-head"><div><div className="idx">06 / Студентське життя та самоврядування</div><h2>Навчання поза аудиторією</h2></div><p>Підтверджені сторінки студентської наукової та громадської активності.</p></div><div className="marketing-student-life-grid"><article><span>01 / Науковий гурток</span><h3>MARKETHINK</h3><p>Матеріали гуртка та участі студентів кафедри у наукових заходах.</p><Link href="/materials/3331-0b35c55db.html">Відкрити матеріали →</Link></article><article><span>02 / Самоврядування</span><h3>Студентська рада</h3><p>Представництво студентів, ініціативи, події та участь у житті Академії.</p><Link href="/students/council">Перейти до студентської ради →</Link></article></div></div></section>,
    <section id="careers" key="marketing-careers"><div className="wrap career-layout"><div><div className="idx">07 / Працевлаштування</div><h2>Професійні напрями</h2><p className="program-lede">Базові напрями роботи, зазначені для освітньої траєкторії D5 «Маркетинг».</p><div className="career-list">{program.careers.map((career, index) => <div key={career}><span>{String(index + 1).padStart(2, "0")}</span><b>{career}</b></div>)}</div></div><aside className="programme-lead-card"><AcademicProfileCard badge="Завідувачка кафедри" person={{ name: program.lead, role: program.leadRole, summary: "Координує освітню програму та роботу кафедри маркетингу.", image: programmeLead?.image, links: programmeLeadLinks }} /></aside></div></section>,
    <div id="department-news" key="marketing-news"><AcademicNews slugs={[slug]} title="Новини кафедри маркетингу" /><DepartmentEditorialContent entries={departmentEntries.filter((entry) => !["hero", "teacher", "partner"].includes(entry.entryType))} /></div>,
  ] : null;
  const financeSectionContent = slug === "finance" ? [
    <div id="overview" key="finance-programmes">
      <section className="finance-level-selector" aria-labelledby="finance-level-selector-title"><div className="wrap">
        <div className="finance-level-selector-head"><div className="idx">01 / Оберіть рівень освіти</div><h2 id="finance-level-selector-title">Про програми</h2><p>Оберіть потрібну освітню траєкторію — сторінка плавно переведе Вас до її структури, плану та матеріалів.</p></div>
        <div className="finance-level-selector-grid">
          <a className="finance-level-link bachelor" href="#finance-bachelor"><span>01</span><small>Перший рівень вищої освіти</small><strong>Бакалавр</strong><p>Навчальний план, програмні та вибіркові дисципліни, практика й атестація.</p><b>Перейти до бакалаврату ↓</b></a>
          <a className="finance-level-link master" href="#finance-master"><span>02</span><small>Другий рівень вищої освіти</small><strong>Магістр</strong><p>Магістерська траєкторія, професійні дисципліни, практика та офіційна ОПП.</p><b>Перейти до магістратури ↓</b></a>
        </div>
      </div></section>
      <section id="finance-bachelor"><div className="wrap program-intro"><div><div className="idx">Бакалавр / структура програми</div><h2>Бакалаврська траєкторія</h2><p className="program-lede">{program.overview}</p><div className="focus-list">{program.focus.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b></div>)}</div></div><aside className="program-facts" id="education-levels"><div><span>Рівні</span><b>{program.levels}</b></div><div><span>Тривалість бакалаврату</span><b>{program.duration}</b></div><div><span>Бакалаврат, денна</span><b>{program.price}</b></div><div><span>Бакалаврат, заочна</span><b>{program.partTimePrice}</b></div>{program.masterPrice && <div><span>Магістратура, денна</span><b>{program.masterPrice}</b></div>}{program.masterPartTimePrice && <div><span>Магістратура, заочна</span><b>{program.masterPartTimePrice}</b></div>}<small>Вартість для вступників 2026 року, за один навчальний рік.</small><Link className="cta" href="/tuition#calculator"><span>Усі тарифи й оплата</span></Link></aside></div></section>
      <ProgrammeCurriculumPlan slug={slug} code={program.code} title={program.title} />
      <section className="finance-master-programme" id="finance-master"><div className="wrap"><div className="sec-head"><div><div className="idx">Магістр / структура програми</div><h2>Магістерська траєкторія</h2></div><p>Розділ підготовлено в такій самій логіці, як бакалаврський. Детальний перелік дисциплін кафедра додасть після погодження актуального навчального плану.</p></div><div className="finance-master-grid"><article><span>01</span><h3>Що вивчатимете</h3><p>Поглиблена фінансова аналітика, управління фінансами й професійна підготовка.</p></article><article><span>02</span><h3>Програмні дисципліни</h3><p>Обов’язкові компоненти буде оприлюднено за затвердженим планом.</p></article><article><span>03</span><h3>Вибіркові дисципліни</h3><p>Індивідуальна траєкторія формується з актуального каталогу вибору.</p></article><article><span>04</span><h3>Практична підготовка</h3><p>Практика, дослідницька робота та підсумкова атестація.</p></article></div><a className="finance-master-document" href={program.materials[0]?.href} target="_blank" rel="noreferrer">Офіційна ОПП магістра · PDF ↗</a></div></section>
    </div>,
    <div key="finance-department"><ProgrammeEcosystem slug={slug} entries={departmentEntries} /></div>,
    <section className="intl-band finance-international" id="international" key="finance-international"><div className="wrap"><div><div className="idx">03 / Міжнародні проєкти</div><h2>Фінанси без кордонів</h2><p>Міжнародні освітні й професійні ініціативи кафедри.</p></div><div>{program.international.map((item, index) => <p key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}<span>↗</span></p>)}<Link className="cta" href="/international#greenfinedu"><span>GreenFinEDU та матеріали</span></Link></div></div></section>,
    <EducationQualitySection entries={departmentEntries} pagePath={`/programs/${slug}`} index="04" discussionEmail={programmeProfile?.discussionEmail} title="Якість освіти кафедри фінансів" description="Моніторинг освітнього процесу, результати опитувань студентів, обговорення змін до освітніх програм та щорічне оцінювання викладачів." key="finance-quality" />,
    <section className="finance-applicants" id="applicants" key="finance-applicants"><div className="wrap"><div className="sec-head"><div><div className="idx">05 / Вступникам</div><h2>Вступ і професійна перспектива</h2></div><p>Умови вступу, вартість навчання, консультація та напрями роботи після завершення програми — в одному розділі.</p></div><div className="finance-applicants-grid"><div className="career-list">{program.careers.map((career, index) => <div key={career}><span>{String(index + 1).padStart(2, "0")}</span><b>{career}</b></div>)}</div><div className="finance-applicant-links"><Link href="/admissions"><small>Вступна кампанія 2026</small><b>Умови, строки й документи</b><span>→</span></Link><Link href="/tuition"><small>Вартість і оплата</small><b>Тарифи та безпечна оплата</b><span>→</span></Link><Link href="/contacts"><small>Консультація</small><b>Поставити запитання Академії</b><span>→</span></Link></div></div></div></section>,
    <div id="department-news" key="finance-news"><AcademicNews slugs={[slug]} title="Новини кафедри фінансів" /><DepartmentEditorialContent entries={departmentEntries.filter((entry) => !["hero", "teacher", "partner"].includes(entry.entryType))} /></div>,
    <section className="finance-contact" id="contacts" key="finance-contacts"><div className="wrap finance-contact-grid"><div><div className="idx">07 / Контакти</div><h2>Зв’язок із кафедрою фінансів</h2><p>Питання щодо освітніх програм, навчальних дисциплін, партнерств і матеріалів кафедри можна надіслати завідувачці кафедри.</p></div><div className="finance-contact-card"><small>Завідувачка кафедри</small><h3>Яніна Ткаченко</h3><a href="mailto:tkachenko.ys@socosvita.kiev.ua">tkachenko.ys@socosvita.kiev.ua</a><Link href="/contacts">Усі контакти Академії →</Link></div></div></section>,
  ] : null;
  const specialSectionContent = marketingSectionContent || financeSectionContent;
  return <main id="top" data-page-materials-server="true"><SiteHeader />
    <section className="program-hero" data-program={program.slug}><div className="program-hero-bg"><img src={program.image} alt="" /></div><div className="wrap program-hero-in"><Link href="/programs" className="back-link">← Усі програми</Link><span className="program-code">{program.code}</span><h1>{program.title}</h1><p>{program.short}</p></div></section><div className="hero-rule" />
    <SectionHub sections={activeSections} eyebrow={slug === "marketing" ? "Навігатор кафедри маркетингу" : slug === "finance" ? "Навігатор кафедри фінансів" : `Навігатор програми ${program.code}`} description={navigatorDescription}>
    {specialSectionContent || <>
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
