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
    description: "Економіка, управління, поведінкові та соціальні науки, цифрові технології, туризм і гостинність.",
    profileHref: "/departments/economics-social-tourism-faculty",
    departments: [
      { id: "psychology", title: "Кафедра психології", text: "Психічне здоров’я, консультування, дослідження та психологія організацій.", href: "/programs/psychology", programmes: "C4 Психологія" },
      { id: "finance", title: "Кафедра фінансів", text: "Фінансовий аналіз, банківська справа, страхування та сталі фінанси.", href: "/programs/finance", programmes: "D2 Фінанси" },
      { id: "economics-management", title: "Кафедра економіки підприємства та менеджменту", text: "Управління організаціями, підприємництво, торгівля й бізнес-аналітика.", href: "/programs/management", programmes: "D3 Менеджмент · D7 Торгівля" },
      { id: "marketing", title: "Кафедра маркетингу", text: "Ринкова аналітика, бренди, комунікації, digital і поведінка споживачів.", href: "/programs/marketing", programmes: "D5 Маркетинг" },
      { id: "social-work", title: "Кафедра соціально-трудових відносин та соціальної роботи", text: "Соціальна політика, підтримка людей і громад, консультування та реабілітація.", href: "/programs/social-work", programmes: "I10 Соціальна робота" },
      { id: "tourism", title: "Кафедра спеціальних туристичних дисциплін", text: "Туризм, гостинність, рекреація, події та створення туристичних продуктів.", href: "/programs/tourism", programmes: "J3 Туризм та рекреація" },
      { id: "digital-technologies", title: "Кафедра інтелектуальних систем та цифрових технологій", text: "Інформаційні системи, цифрові освітні технології та управління інформаційною безпекою.", href: "/programs#doctoral-programmes", programmes: "A5 Професійна освіта" },
      { id: "hospitality", title: "Кафедра енотехнологій і сервісу в готельно-ресторанному сегменті", text: "Гостинність, сервіс, еногастрономічна культура та практичні лабораторні формати.", href: "/news/hospitality-management-lab", programmes: "Готельно-ресторанний сервіс" },
    ],
  },
  {
    code: "ЮФ",
    name: "Юридичний факультет",
    description: "Публічне, приватне й кримінальне право, юридична клініка, криміналістика та публічне управління.",
    profileHref: "/departments/law-faculty",
    departments: [
      { id: "public-law", title: "Кафедра конституційного, адміністративного та фінансового права", text: "Конституційне, адміністративне, фінансове й муніципальне право.", href: "/programs/law#department", programmes: "D8 Право" },
      { id: "public-administration", title: "Кафедра публічного управління та адміністрування", text: "Публічна політика, державна служба, громади та управління змінами.", href: "/programs/public-administration", programmes: "D4 Публічне управління" },
      { id: "private-law", title: "Кафедра цивільного, трудового та господарського права", text: "Приватно-правові відносини, цивільний процес, трудові права й соціальний діалог.", href: "/programs/law#department", programmes: "D8 Право" },
      { id: "criminal-law", title: "Кафедра кримінального права, процесу та криміналістики", text: "Кримінальна юстиція, захист прав людини, судові симуляції та криміналістична лабораторія.", href: "/programs/law/forensic-laboratory", programmes: "D8 Право" },
    ],
  },
  {
    code: "ЗАК",
    name: "Загальноакадемічна підготовка",
    description: "Мовні, гуманітарні та міжкультурні компетентності для студентів усіх освітніх програм.",
    profileHref: "/departments/languages-humanities",
    departments: [
      { id: "languages", title: "Кафедра іноземних мов та гуманітарних дисциплін", text: "Професійна іноземна мова, українська для іноземців, критичне мислення та гуманітарна освіта.", href: "/departments/languages-humanities", programmes: "Усі освітні програми" },
    ],
  },
];

export default function Page() {
  const count = facultyGroups.reduce((sum, group) => sum + group.departments.length, 0);
  return <main id="top"><SiteHeader />
    <section className="phero department-hero"><div className="wrap"><div className="crumb">Головна / Кафедри</div><span>{count} кафедр і навчальних осередків</span><h1>Кафедри<br />Академії</h1><p className="lead">Повна академічна структура: команди, які відповідають за зміст програм, якість викладання, дослідження і зв’язок навчання з практикою.</p></div></section><div className="phero-rule" />
    <section className="department-map"><div className="wrap"><div className="sec-head"><div><div className="idx">01 / Академічні підрозділи</div><h2>Від факультету<br />до програми</h2></div><p>Кожна картка веде на програму або профіль кафедри, де зібрані викладачі, практика, партнери й документи.</p></div>
      <div className="department-faculties">{facultyGroups.map((group, groupIndex) => <section className="department-faculty" key={group.code}><header><span>{String(groupIndex + 1).padStart(2, "0")}</span><div><small>{group.code}</small><h2>{group.name}</h2><p>{group.description}</p><Link className="department-faculty-profile" href={group.profileHref}>Відкрити сторінку підрозділу →</Link></div><b>{group.departments.length}</b></header><div className="department-directory">{group.departments.map((department, index) => <Link id={department.id} href={department.href} key={department.title}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{department.programmes}</small><h3>{department.title}</h3><p>{department.text}</p></div><b>↗</b></Link>)}</div></section>)}</div>
    </div></section>
    <section className="department-practice-band"><div className="wrap"><div><div className="idx">02 / Навчально-практичні осередки</div><h2>Практика всередині Академії</h2></div><div className="department-practice-links"><Link href="/programs/law/legal-clinic"><span>Юридична клініка «Феміда»</span><b>Первинна правова допомога й супервізія →</b></Link><Link href="/programs/law/forensic-laboratory"><span>Лабораторія криміналістики</span><b>Кабінет слідчого та криміналістичний майданчик →</b></Link><Link href="/materials/tourism-lab-533745080.html"><span>«Академія подорожей»</span><b>Модель реального туристичного підприємства →</b></Link></div></div></section>
    <section className="department-doctoral"><div className="wrap">
      <div className="department-doctoral-head"><div><div className="idx">03 / Аспірантура</div><h2>Програми кафедр для підготовки докторів філософії</h2></div><p>Документи продубльовано у каталозі програм, у розділі вступу та на сторінках відповідних напрямів.</p></div>
      <div className="department-doctoral-grid">{doctoralProgrammes.map((programme) => <a href={programme.href} target="_blank" rel="noreferrer" key={programme.code}><span>{programme.code}</span><small>{programme.department}</small><h3>{programme.title}</h3><b>PDF · {programme.pages} сторінок ↗</b></a>)}</div>
      <Link className="department-doctoral-all" href="/programs#doctoral-programmes">Усі освітньо-наукові програми →</Link>
    </div></section>
    <SiteFooter />
  </main>;
}
