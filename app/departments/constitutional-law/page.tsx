import type { Metadata } from "next";
import { LawDepartmentFiveSections } from "../../components/LawDepartmentFiveSections";
import { lawFacultyTeachers } from "../../components/LawFacultyTeam";
import "../criminal-law/criminal-law.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Кафедра конституційного, адміністративного та фінансового права",
  description: "Загальна інформація, завідувач, склад, новини та контакти кафедри.",
};

export default async function Page() {
  const [head, ...teachers] = lawFacultyTeachers.map((person) => ({
    name: person.name,
    role: person.role,
    summary: person.summary,
    image: person.image,
    tags: person.courses,
    links: [
      ...(person.orcid ? [{ label: "ORCID", href: person.orcid }] : []),
      ...(person.scholar ? [{ label: "Google Scholar", href: person.scholar }] : []),
    ],
  }));
  return <LawDepartmentFiveSections
    pagePath="/departments/constitutional-law"
    title="Кафедра конституційного, адміністративного та фінансового права"
    summary="Кафедра забезпечує підготовку з конституційного, адміністративного, фінансового та муніципального права."
    head={head}
    teachers={teachers}
    newsSlugs={["law"]}
  />;
}
