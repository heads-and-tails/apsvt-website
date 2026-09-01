import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { doctoralProgrammes } from "@/lib/academy-resources";

export const metadata: Metadata = {
  title: "Кафедри Академії",
  description: "Повна структура кафедр АПСВТ: освітні напрями, викладачі, практика та офіційні матеріали.",
};

const facultyGroups = [
  {
    code: "ФЕСТТ",
    name: "Факультет економіки, соціальних технологій і туризму",
    description: "Економіка, управління, фінанси, маркетинг і цифрові технології.",
    profileHref: "/departments/economics-social-tourism-faculty",
    departments: [
      { id: "finance", title: "Кафедра фінансів", text: "Фінансовий аналіз, банківська справа, страхування та сталі фінанси.", href: "/departments#finance", programmes: [{ code: "D2", title: "Фінанси", href: "/programs/finance" }] },
      { id: "economics-management", title: "Кафедра економіки підприємства та менеджменту", text: "Управління організаціями, підприємництво, торгівля й бізнес-аналітика.", href: "/departments#economics-management", programmes: [{ code: "D3", title: "Менеджмент", href: "/programs/management" }, { code: "D7", title: "Торгівля", href: "/programs/trade" }] },
      { id: "marketing", title: "Кафедра маркетингу", text: "Ринкова аналітика, бренди, комунікації, digital і поведінка споживачів.", href: "/departments#marketing", programmes: [{ code: "D5", title: "Маркетинг", href: "/programs/marketing" }] },
      { id: "digital-technologies", title: "Кафедра інтелектуальних систем та цифрових технологій", text: "Інформаційні системи, цифрові освітні технології та управління інформаційною безпекою.", href: "/departments#digital-technologies", programmes: [{ code: "A5", title: "Професійна освіта · PhD", href: "/programs#doctoral-programmes" }] },
    ],
  },
  {
    code: "ЮФ",
    name: "Юридичний факультет",
    description: "Публічне, приватне й кримінальне право, юридична клініка, криміналістика та публічне управління.",
    profileHref: "/departments/law-faculty",
    departments: [
      { id: "public-law", title: "Кафедра конституційного, адміністративного та фінансового права", text: "Конституційне, адміністративне, фінансове й муніципальне право.", href: "/departments/constitutional-law", programmes: [{ code: "D8", title: "Право", href: "/programs/law" }] },
      { id: "public-administration", title: "Кафедра публічного управління та адміністрування", text: "Публічна політика, державна служба, громади та управління змінами.", href: "/departments#public-administration", programmes: [{ code: "D4", title: "Публічне управління", href: "/programs/public-administration" }] },
      { id: "private-law", title: "Кафедра цивільного, трудового та господарського права", text: "Приватно-правові відносини, цивільний процес, трудові права й соціальний діалог.", href: "/departments/private-law", programmes: [{ code: "D8", title: "Право", href: "/programs/law" }] },
      { id: "criminal-law", title: "Кафедра кримінального права, процесу та криміналістики", text: "Кримінальна юстиція, захист прав людини, судові симуляції та криміналістична лабораторія.", href: "/departments/criminal-law", programmes: [{ code: "D8", title: "Право", href: "/programs/law" }] },
    ],
  },
  {
    code: "ФПСР",
    name: "Факультет психології та соціального розвитку",
    description: "Психічне здоров’я, психологічне благополуччя, соціальна підтримка та професійний розвиток.",
    profileHref: "/departments/psychology-social-development-faculty",
    departments: [
      { id: "clinical-psychology", title: "Кафедра клінічної психології та психотерапії", text: "Психічне здоров’я, діагностика, консультування та психотерапевтичні підходи.", href: "/programs/psychology#department", programmes: [{ code: "C4", title: "Психологія · клінічна траєкторія", href: "/programs/psychology" }] },
      { id: "business-psychology", title: "Кафедра психології бізнесу та управління", text: "Організаційна психологія, професійний розвиток, команди та управління змінами.", href: "/programs/psychology#department", programmes: [{ code: "C4", title: "Психологія бізнесу та управління", href: "/programs/psychology" }] },
      { id: "social-work", title: "Кафедра соціально-трудових відносин та соціальної роботи", text: "Соціальна політика, підтримка людей і громад, консультування та реабілітація.", href: "/programs/social-work#department", programmes: [{ code: "I10", title: "Соціальна робота та консультування", href: "/programs/social-work" }] },
    ],
  },
  {
    code: "ЗАК",
    name: "Загальноакадемічна підготовка",
    description: "Мовні, гуманітарні та міжкультурні компетентності для студентів усіх освітніх програм.",
    profileHref: "/departments/languages-humanities",
    departments: [
      { id: "languages", title: "Кафедра іноземних мов та гуманітарних дисциплін", text: "Професійна іноземна мова, українська для іноземців, критичне мислення та гуманітарна освіта.", href: "/departments/languages-humanities", programmes: [{ code: "Усі", title: "Освітні програми", href: "/programs" }] },
    ],
  },
];

export default function Page() {
  const count = facultyGroups.reduce((sum, group) => sum + group.departments.length, 0);
  return <main id="top"><SiteHeader />
    <section className="phero department-hero"><div className="wrap"><div className="crumb">Головна / Кафедри</div><span>{count} кафедр і навчальних осередків</span><h1>Кафедри<br />Академії</h1><p className="lead">Повна академічна структура: команди, які відповідають за зміст програм, якість викладання, дослідження і зв’язок навчання з практикою.</p></div></section><div className="phero-rule" />
    <section className="department-map"><div className="wrap"><div className="sec-head"><div><div className="idx">01 / Академічні підрозділи</div><h2>Від факультету<br />до програми</h2></div><p>Спочатку оберіть факультет, потім кафедру. Програми кожної кафедри вже показані окремими кнопками — шукати їх на інших сторінках не потрібно.</p></div>
      <div className="department-faculties">{facultyGroups.map((group, groupIndex) => <section className="department-faculty" key={group.code}><header><span>{String(groupIndex + 1).padStart(2, "0")}</span><div><small>Факультет · {group.code}</small><h2>{group.name}</h2><p>{group.description}</p><Link className="department-faculty-profile" href={group.profileHref}>Відкрити сторінку факультету →</Link></div><b>{group.departments.length}<small>кафедр</small></b></header><div className="department-directory">{group.departments.map((department, index) => <article id={department.id} key={department.title}><span>{String(index + 1).padStart(2, "0")}</span><div><small>Кафедра</small><h3><Link href={department.href}>{department.title}</Link></h3><p>{department.text}</p><nav aria-label={`Програми: ${department.title}`}>{department.programmes.map((programme) => <Link href={programme.href} key={`${department.id}-${programme.code}`}><b>{programme.code}</b><span>{programme.title}</span><i>↗</i></Link>)}</nav></div></article>)}</div></section>)}</div>
    </div></section>
    <section className="department-practice-band"><div className="wrap"><div><div className="idx">02 / Навчально-практичні осередки</div><h2>Практика всередині Академії</h2></div><div className="department-practice-links"><Link href="/programs/law/legal-clinic"><span>Юридична клініка «Феміда»</span><b>Первинна правова допомога й супервізія →</b></Link><Link href="/programs/law/forensic-laboratory"><span>Лабораторія криміналістики</span><b>Кабінет слідчого та криміналістичний майданчик →</b></Link></div></div></section>
    <section className="department-doctoral"><div className="wrap">
      <div className="department-doctoral-head"><div><div className="idx">03 / Аспірантура</div><h2>Програми кафедр для підготовки докторів філософії</h2></div><p>Документи продубльовано у каталозі програм, у розділі вступу та на сторінках відповідних напрямів.</p></div>
      <div className="department-doctoral-grid">{doctoralProgrammes.map((programme) => <a href={programme.href} target="_blank" rel="noreferrer" key={programme.code}><span>{programme.code}</span><small>{programme.department}</small><h3>{programme.title}</h3><b>PDF · {programme.pages} сторінок ↗</b></a>)}</div>
      <Link className="department-doctoral-all" href="/programs#doctoral-programmes">Усі освітньо-наукові програми →</Link>
    </div></section>
    <SiteFooter />
  </main>;
}
