"use client";

import Link from "next/link";
import { useState } from "react";

type StructureNode = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

const nodes: StructureNode[] = [
  {
    id: "governance",
    eyebrow: "Управління",
    title: "Ректорат і Вчена рада",
    description: "Формують стратегію Академії, забезпечують академічне управління, якість освіти та виконання рішень колегіальних органів.",
    href: "/people",
    linkLabel: "Керівництво і команда",
  },
  {
    id: "economic-faculty",
    eyebrow: "Факультет",
    title: "Економіки, соціальних технологій і туризму",
    description: "Об’єднує кафедри психології, фінансів, економіки та менеджменту, маркетингу, публічного управління, соціальної роботи й туризму.",
    href: "/departments",
    linkLabel: "Переглянути кафедри",
  },
  {
    id: "law-faculty",
    eyebrow: "Факультет",
    title: "Юридичний факультет",
    description: "Готує правників, поєднуючи фундаментальну юридичну освіту з клінічною практикою, дослідженнями та роботою з реальними кейсами.",
    href: "/programs/law",
    linkLabel: "Програма «Право»",
  },
  {
    id: "languages",
    eyebrow: "Загальноакадемічна кафедра",
    title: "Іноземних мов і гуманітарних дисциплін",
    description: "Забезпечує мовну, гуманітарну й міжкультурну підготовку студентів усіх програм, а також навчання української мови іноземців.",
    href: "/departments/languages-humanities",
    linkLabel: "Сторінка кафедри",
  },
  {
    id: "doctoral",
    eyebrow: "Наука",
    title: "Аспірантура та освітньо-наукові програми",
    description: "Координує підготовку докторів філософії, вступні випробування, освітню складову та індивідуальні дослідницькі траєкторії.",
    href: "/programs#doctoral-programmes",
    linkLabel: "Програми PhD",
  },
  {
    id: "international",
    eyebrow: "Міжнародна діяльність",
    title: "Міжнародний відділ",
    description: "Партнерства, академічна мобільність, міжнародні проєкти, робота з іноземними вступниками та участь у програмах Erasmus+.",
    href: "/international",
    linkLabel: "Міжнародні можливості",
  },
  {
    id: "services",
    eyebrow: "Освітня інфраструктура",
    title: "Бібліотека, кампус і центр розвитку освіти",
    description: "Підтримують навчання, підвищення кваліфікації, доступ до інформаційних ресурсів і повсякденне життя академічної спільноти.",
    href: "/facilities",
    linkLabel: "Інфраструктура Академії",
  },
];

const branches = [
  { label: "Управління", ids: ["governance"] },
  { label: "Освіта", ids: ["economic-faculty", "law-faculty", "languages"] },
  { label: "Наука й міжнародність", ids: ["doctoral", "international"] },
  { label: "Підтримка", ids: ["services"] },
];

export function AcademyStructure() {
  const [activeId, setActiveId] = useState("economic-faculty");
  const active = nodes.find((node) => node.id === activeId) || nodes[0];

  return <section className="academy-structure" id="structure"><div className="wrap">
    <div className="academy-structure-head">
      <div><div className="idx">04 / Структура Академії</div><h2>Як пов’язані підрозділи</h2></div>
      <p>Оберіть вузол схеми, щоб побачити його роль і перейти до відповідного розділу сайту.</p>
    </div>
    <div className="structure-layout">
      <div className="structure-tree" aria-label="Інтерактивна організаційна структура Академії">
        <button className="structure-root" type="button" onClick={() => setActiveId("governance")} aria-pressed={activeId === "governance"}>
          <small>АПСВТ</small><b>Академія праці, соціальних відносин і туризму</b>
        </button>
        <div className="structure-branches">
          {branches.map((branch) => <div className="structure-branch" key={branch.label}>
            <span>{branch.label}</span>
            <div>{branch.ids.map((id) => {
              const node = nodes.find((item) => item.id === id)!;
              return <button className={activeId === id ? "active" : ""} type="button" onClick={() => setActiveId(id)} aria-pressed={activeId === id} key={id}>{node.title}</button>;
            })}</div>
          </div>)}
        </div>
      </div>
      <aside className="structure-detail" aria-live="polite">
        <span>{active.eyebrow}</span><h3>{active.title}</h3><p>{active.description}</p><Link href={active.href}>{active.linkLabel} →</Link>
      </aside>
    </div>
  </div></section>;
}
