import type { Metadata } from "next";
import { LawDepartmentFiveSections } from "../../components/LawDepartmentFiveSections";
import { getProgrammeProfile } from "@/lib/programme-profiles";
import "../criminal-law/criminal-law.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Кафедра публічного управління та публічної служби",
  description: "Загальна інформація, завідувач, склад, новини та контакти кафедри.",
};

export default function Page() {
  const profile = getProgrammeProfile("public-administration");
  const [head, ...teachers] = (profile?.team || []).map((person) => ({
    name: person.name,
    role: person.role,
    summary: person.summary,
    image: person.image,
    tags: person.interests,
    links: person.href ? [{ label: "Науковий профіль", href: person.href }] : [],
  }));
  return <LawDepartmentFiveSections
    pagePath="/departments/public-administration"
    title="Кафедра публічного управління та публічної служби"
    summary="Кафедра забезпечує підготовку за спеціальністю D4 «Публічне управління та адміністрування»."
    head={head}
    teachers={teachers}
    newsSlugs={["public-administration"]}
  />;
}
