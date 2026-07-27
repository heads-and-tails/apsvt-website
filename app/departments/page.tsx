import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Кафедри Академії",
  description: "Кафедри АПСВТ, їхні освітні напрями, викладачі та офіційні матеріали.",
};

const departments = [
  { n: "01", title: "Кафедра психології", text: "Психічне здоров’я, консультування, дослідження та психологія організацій.", href: "/programs/psychology" },
  { n: "02", title: "Кафедра фінансів", text: "Фінансовий аналіз, банківська справа, страхування та сталі фінанси.", href: "/programs/finance" },
  { n: "03", title: "Кафедра економіки підприємства та менеджменту", text: "Управління організаціями, підприємництво, торгівля й бізнес-аналітика.", href: "/programs/management" },
  { n: "04", title: "Кафедра публічного управління та публічної служби", text: "Публічна політика, державна служба, громади та управління змінами.", href: "/programs/public-administration" },
  { n: "05", title: "Кафедра маркетингу", text: "Ринкова аналітика, бренди, комунікації, digital і поведінка споживачів.", href: "/programs/marketing" },
  { n: "06", title: "Кафедра соціально-трудових відносин та соціальної роботи", text: "Соціальна політика, підтримка людей і громад, консультування та реабілітація.", href: "/programs/social-work" },
  { n: "07", title: "Кафедра спеціальних туристичних дисциплін", text: "Туризм, гостинність, рекреація, події та створення туристичних продуктів.", href: "/programs/tourism" },
  { n: "08", title: "Кафедра іноземних мов та гуманітарних дисциплін", text: "Мовна підготовка, професійна комунікація, гуманітарна освіта та міжкультурний діалог.", href: "/departments/languages-humanities" },
];

export default function Page() {
  return <main id="top"><SiteHeader />
    <section className="phero"><div className="wrap"><div className="crumb">Головна / Кафедри</div><h1>Кафедри<br />Академії</h1><p className="lead">Освітні та наукові команди, що відповідають за зміст програм, якість викладання і зв’язок навчання з практикою.</p></div></section><div className="phero-rule" />
    <section><div className="wrap"><div className="sec-head"><div><div className="idx">01 / Підрозділи</div><h2>Знайдіть свою кафедру</h2></div><p>На сторінках кафедр зібрані програми, команда, дослідницькі напрями та документи, які публікує редакція.</p></div>
      <div className="department-directory">{departments.map((department) => <Link href={department.href} key={department.title}><span>{department.n}</span><div><h2>{department.title}</h2><p>{department.text}</p></div><b>↗</b></Link>)}</div>
    </div></section>
    <SiteFooter />
  </main>;
}
