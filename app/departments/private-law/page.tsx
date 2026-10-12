import type { Metadata } from "next";
import { LawDepartmentFiveSections, type LawDepartmentTeacher } from "../../components/LawDepartmentFiveSections";
import "../criminal-law/criminal-law.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Кафедра цивільного, трудового та господарського права",
  description: "Загальна інформація, завідувач, склад, новини та контакти кафедри.",
};

const head: LawDepartmentTeacher = {
  name: "Василь Бонтлаб",
  role: "Завідувач кафедри, доктор юридичних наук",
  summary: "Цивільний процес і сучасні тенденції розвитку цивільного права та процесу.",
};

const teachers: LawDepartmentTeacher[] = [
  { name: "Катерина Біда", role: "Кандидатка юридичних наук, доцентка", summary: "Господарське право, міжнародний комерційний арбітраж і цивільно-процесуальні документи." },
  { name: "Наталія Циганчук", role: "Кандидатка юридичних наук, доцентка", summary: "Трудове право, трудові спори та методика адвокатської діяльності." },
  { name: "Сергій Потапенко", role: "Доктор філософії в галузі права, доцент", summary: "Земельне, житлове й екологічне право, філософія права та цивільно-правові делікти." },
  { name: "Оксана Мельник", role: "Кандидатка юридичних наук, доцентка", summary: "Цивільне право, медіація, право соціального забезпечення та охорона праці." },
];

export default async function Page() {
  return <LawDepartmentFiveSections
    pagePath="/departments/private-law"
    title="Кафедра цивільного, трудового та господарського права"
    summary="Кафедра відповідає за навчальні компоненти цивільного, трудового, господарського та суміжних галузей права в межах спеціальності D8 «Право»."
    head={head}
    teachers={teachers}
    newsSlugs={["law"]}
  />;
}
