import type { Metadata } from "next";
import { LawDepartmentFiveSections, type LawDepartmentTeacher } from "../../components/LawDepartmentFiveSections";
import "./criminal-law.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Кафедра кримінального права, процесу та криміналістики",
  description: "Загальна інформація, завідувач, склад, новини та контакти кафедри.",
};

const head: LawDepartmentTeacher = {
  name: "Ірина Завидняк",
  role: "Завідувачка кафедри, кандидатка юридичних наук, доцентка",
  summary: "Очолює кафедру з вересня 2023 року.",
  details: "Магістр права, у 2016 році захистила дисертацію про адміністративно-правовий статус благодійних організацій в Україні. Має практичний досвід служби у податковій міліції, викладає та проводить дослідження у сфері кримінального права і процесу. Авторка понад 100 наукових і навчально-методичних праць.",
  image: "/people/law/criminal/iryna-zavydniak.jpg",
  links: [{ label: "ORCID", href: "https://orcid.org/0000-0003-1816-7426" }, { label: "Google Scholar", href: "https://scholar.google.com.ua/citations?hl=uk&user=LaBtTboAAAAJ" }],
};

const teachers: LawDepartmentTeacher[] = [
  { name: "Володимир Ліпкан", role: "Професор кафедри, доктор юридичних наук, доктор політичних наук", summary: "Дослідник проблем безпеки, стратегічних комунікацій, інформаційної та кібербезпекової політики.", image: "/people/law/criminal/volodymyr-lipkan.jpg", links: [{ label: "ORCID", href: "https://orcid.org/0000-0002-7411-2086" }, { label: "Google Scholar", href: "https://scholar.google.com/citations?user=mmE8GhkAAAAJ" }] },
  { name: "Микола Маломуж", role: "Професор кафедри", summary: "Фахівець із національної безпеки та розвідки; з 2023 року працює професором кафедри.", image: "/people/law/criminal/mykola-malomuzh.jpg" },
  { name: "Андрій Бегма", role: "Доцент кафедри, кандидат юридичних наук", summary: "Поєднує викладання з юридичною практикою; в Академії працює з 2013 року.", image: "/people/law/criminal/andrii-behma.jpg", links: [{ label: "ORCID", href: "https://orcid.org/0000-0003-3009-2850" }] },
  { name: "Роман Лев", role: "Доцент кафедри, доктор філософії в галузі права", summary: "Юрист і адвокат, працює доцентом кафедри з січня 2025 року.", image: "/people/law/criminal/roman-lev.jpg", links: [{ label: "ORCID", href: "https://orcid.org/0009-0005-7316-9012" }] },
  { name: "Олександр Ярмоленко", role: "Доцент кафедри, доктор юридичних наук", summary: "Має багаторічний досвід роботи в правоохоронних і податкових органах та здійснює адвокатську діяльність.", image: "/people/law/criminal/oleksandr-yarmolenko.jpg", links: [{ label: "ORCID", href: "https://orcid.org/0000-0003-1414-5991" }] },
];

export default async function Page() {
  return <LawDepartmentFiveSections
    pagePath="/departments/criminal-law"
    title="Кафедра кримінального права, процесу та криміналістики"
    summary="Кафедра поєднує правничу підготовку з практикою кримінального права, процесу та криміналістики."
    head={head}
    teachers={teachers}
    newsSlugs={["law"]}
    archiveDocument={{ title: "Положення про кафедру · архів 2023", href: "/documents/archive/may-2026/criminal-law-department-2023.pdf" }}
  />;
}
