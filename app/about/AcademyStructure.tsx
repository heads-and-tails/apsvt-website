"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type BranchId = "governance" | "education" | "science" | "support";
type StructureNode = {
  id: string;
  branch: BranchId;
  eyebrow: string;
  title: string;
  description: string;
  path: string;
  facts: string[];
  href: string;
  linkLabel: string;
};

const nodes: StructureNode[] = [
  { id: "rectorate", branch: "governance", eyebrow: "Управління", title: "Ректорат", description: "Забезпечує стратегічне й операційне управління Академією, виконання рішень колегіальних органів і розвиток освітнього середовища.", path: "Академія / Управління", facts: ["ректор", "три проректорські напрями", "відкрита команда"], href: "/people", linkLabel: "Керівництво Академії" },
  { id: "academic-council", branch: "governance", eyebrow: "Колегіальний орган", title: "Вчена рада", description: "Розглядає освітню, наукову, кадрову й організаційну політику та ухвалює ключові академічні рішення.", path: "Академія / Управління", facts: ["освітні програми", "наукова політика", "кадрові рішення"], href: "/people", linkLabel: "Академічна команда" },
  { id: "quality", branch: "governance", eyebrow: "Якість освіти", title: "Внутрішня система якості", description: "Координує перегляд програм, опитування учасників освітнього процесу, роботу гарантів і підготовку до акредитації.", path: "Академія / Управління / Якість", facts: ["гаранти програм", "опитування", "акредитації"], href: "/documents#quality", linkLabel: "Документи з якості" },
  { id: "economic-faculty", branch: "education", eyebrow: "Факультет", title: "Економіки, соціальних технологій і туризму", description: "Об’єднує економічні, управлінські, психологічні, соціальні, цифрові, туристичні та сервісні напрями.", path: "Академія / Освіта", facts: ["8 кафедр", "8 освітніх траєкторій", "практичні лабораторії"], href: "/departments/economics-social-tourism-faculty", linkLabel: "Сторінка факультету" },
  { id: "law-faculty", branch: "education", eyebrow: "Факультет", title: "Юридичний факультет", description: "Готує правників і публічних управлінців, поєднуючи фундаментальні дисципліни з клінічною та криміналістичною практикою.", path: "Академія / Освіта", facts: ["4 кафедри", "клініка «Феміда»", "лабораторія криміналістики"], href: "/departments/law-faculty", linkLabel: "Сторінка факультету" },
  { id: "departments", branch: "education", eyebrow: "Академічні команди", title: "Кафедри Академії", description: "Кафедри відповідають за зміст дисциплін, викладацькі команди, практику, дослідження та зв’язок із роботодавцями.", path: "Академія / Освіта", facts: ["13 кафедр і осередків", "команди програм", "партнери практики"], href: "/departments", linkLabel: "Повна мапа кафедр" },
  { id: "languages", branch: "education", eyebrow: "Загальноакадемічна кафедра", title: "Іноземних мов і гуманітарних дисциплін", description: "Забезпечує мовну, гуманітарну й міжкультурну підготовку всіх студентів, а також українську мову для іноземців.", path: "Академія / Освіта", facts: ["професійна англійська", "українська для іноземців", "критичне мислення"], href: "/departments/languages-humanities", linkLabel: "Профіль кафедри" },
  { id: "doctoral", branch: "science", eyebrow: "Третій рівень освіти", title: "Аспірантура", description: "Координує вступ, освітню складову, індивідуальні плани та дослідницькі траєкторії майбутніх докторів філософії.", path: "Академія / Наука", facts: ["A5", "C1", "C4", "D4"], href: "/programs#doctoral-programmes", linkLabel: "Програми PhD" },
  { id: "research", branch: "science", eyebrow: "Дослідження", title: "Наукова робота й видання", description: "Конференції, фахові публікації, репозитарій кваліфікаційних робіт та підтримка студентських досліджень.", path: "Академія / Наука", facts: ["Вісник АПСВТ", "конференції", "репозитарій"], href: "/research", linkLabel: "Науковий портал" },
  { id: "international", branch: "science", eyebrow: "Міжнародна діяльність", title: "Міжнародний відділ", description: "Розвиває мобільність, інституційні партнерства, міжнародні освітні проєкти та супровід іноземних вступників.", path: "Академія / Міжнародність", facts: ["Erasmus+", "подвійні дипломи", "іноземні студенти"], href: "/international", linkLabel: "Міжнародні можливості" },
  { id: "greenfinedu", branch: "science", eyebrow: "Проєкт Erasmus+", title: "GreenFinEDU", description: "Освітній модуль Жан Моне про Європейську зелену угоду, сталі фінанси й політику Європейського Союзу.", path: "Академія / Міжнародність / Проєкти", facts: ["2023–2026", "базовий курс", "літня школа"], href: "/international#greenfinedu", linkLabel: "Сторінка проєкту" },
  { id: "admissions", branch: "support", eyebrow: "Сервіс", title: "Приймальна комісія", description: "Супроводжує вступників від вибору програми й подання документів до вступних випробувань та зарахування.", path: "Академія / Сервіси", facts: ["вступ 2026", "результати випробувань", "програми іспитів"], href: "/admissions", linkLabel: "Вступ до Академії" },
  { id: "library", branch: "support", eyebrow: "Освітня інфраструктура", title: "Бібліотека", description: "Забезпечує доступ до навчальної, наукової та правничої літератури, каталогів і цифрових ресурсів.", path: "Академія / Сервіси", facts: ["70 000+ одиниць", "електронний каталог", "читальні місця"], href: "/facilities/library", linkLabel: "Бібліотека Академії" },
  { id: "clinic", branch: "support", eyebrow: "Практичний підрозділ", title: "Юридична клініка «Феміда»", description: "Навчально-практичний простір первинної правової допомоги, правопросвітництва та супервізованої роботи студентів.", path: "Академія / Юридичний факультет", facts: ["клінічна освіта", "етика", "правопросвіта"], href: "/programs/law/legal-clinic", linkLabel: "Юридична клініка" },
  { id: "travel-lab", branch: "support", eyebrow: "Навчальна лабораторія", title: "«Академія подорожей»", description: "Модель туристичного підприємства, де студенти створюють маршрути, розраховують продукт і проєктують сервіс.", path: "Академія / ФЕСТТ / Туризм", facts: ["маршрути", "туристичний продукт", "сервіс"], href: "/materials/tourism-lab-533745080.html", linkLabel: "Лабораторія туризму" },
  { id: "campus", branch: "support", eyebrow: "Інфраструктура", title: "Кампус і гуртожиток", description: "Аудиторії, простори для навчання й подій, бібліотека, укриття, харчування та проживання студентів.", path: "Академія / Сервіси", facts: ["навчальний корпус", "гуртожиток", "студентські простори"], href: "/facilities", linkLabel: "Кампус і сервіси" },
  { id: "student-government", branch: "support", eyebrow: "Студентська участь", title: "Студентське самоврядування", description: "Представляє інтереси студентів, розвиває ініціативи, культурні події та участь здобувачів в управлінні якістю освіти.", path: "Академія / Спільнота", facts: ["представництво", "ініціативи", "зворотний зв’язок"], href: "/students", linkLabel: "Студентський простір" },
];

const branches: { id: BranchId; label: string; short: string; mark: string }[] = [
  { id: "governance", label: "Управління і якість", short: "Стратегія, рішення, якість", mark: "УЯ" },
  { id: "education", label: "Освіта", short: "Факультети й кафедри", mark: "ОС" },
  { id: "science", label: "Наука й міжнародність", short: "Дослідження, PhD, Erasmus+", mark: "НМ" },
  { id: "support", label: "Сервіси й практика", short: "Вступ, кампус, лабораторії", mark: "СП" },
];

export function AcademyStructure() {
  const [branchId, setBranchId] = useState<BranchId>("education");
  const branchNodes = useMemo(() => nodes.filter((node) => node.branch === branchId), [branchId]);
  const [activeId, setActiveId] = useState("economic-faculty");
  const active = nodes.find((node) => node.id === activeId) || branchNodes[0];
  const activeBranch = branches.find((branch) => branch.id === branchId) || branches[0];
  const activeIndex = branchNodes.findIndex((node) => node.id === active.id);

  function selectBranch(id: BranchId) {
    setBranchId(id);
    setActiveId(nodes.find((node) => node.branch === id)?.id || nodes[0].id);
  }

  return <section className="academy-structure" id="structure"><div className="wrap">
    <div className="academy-structure-head">
      <div><div className="idx">04 / Структура Академії</div><h2>Зрозуміла мапа<br />Академії</h2></div>
      <p>Три прості кроки: оберіть напрям, потім підрозділ — і одразу відкрийте потрібну сторінку. На телефоні гілки можна гортати горизонтально.</p>
    </div>
    <div className="structure-summary" aria-label="Коротко про структуру"><div><b>01</b><span>Академія</span><small>єдина система</small></div><i>→</i><div><b>04</b><span>Напрями</span><small>освіта, наука, управління, сервіси</small></div><i>→</i><div><b>{nodes.length}</b><span>Підрозділів</span><small>кожен із власною функцією</small></div></div>
    <div className="structure-workspace">
      <div className="structure-root-line"><div><span className="structure-root-logo"><img src="/brand/apsvt-official-logo.png" alt="Офіційна емблема АПСВТ" /></span><span className="structure-root-copy"><small>Рівень 1 · АПСВТ · 1993</small><b>Академія праці, соціальних відносин і туризму</b></span><span className="structure-root-count"><b>Київ</b><small>освітній і науковий центр</small></span></div></div>
      <div className="structure-guide"><span>Рівень 2</span><b>Оберіть напрям</b><small>Активний напрям виділено синім</small></div>
      <div className="structure-branch-tabs" role="tablist" aria-label="Гілки структури Академії">{branches.map((branch, index) => <button role="tab" aria-selected={branchId === branch.id} aria-controls={`structure-panel-${branch.id}`} data-branch={branch.id} className={branchId === branch.id ? "active" : ""} onClick={() => selectBranch(branch.id)} type="button" key={branch.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{branch.mark}</strong><b>{branch.label}</b><small>{branch.short}</small><i>{nodes.filter((node) => node.branch === branch.id).length} підрозділів</i></button>)}</div>
      <div className="structure-current-path" aria-live="polite"><span>Ви тут</span><b>Академія</b><i>→</i><b>{activeBranch.label}</b><i>→</i><strong>{active.title}</strong></div>
    <div className="structure-layout">
      <div className="structure-unit-panel" id={`structure-panel-${branchId}`} role="tabpanel"><header><span>Рівень 3</span><div><b>{activeBranch.label}</b><small>Оберіть один із {branchNodes.length} підрозділів</small></div></header><div className="structure-node-grid">{branchNodes.map((node, index) => <button className={active.id === node.id ? "active" : ""} type="button" onClick={() => setActiveId(node.id)} aria-pressed={active.id === node.id} key={node.id}><span>{String(index + 1).padStart(2, "0")}</span><small>{node.eyebrow}</small><b>{node.title}</b><i>→</i></button>)}</div></div>
      <aside className="structure-detail" data-branch={branchId} aria-live="polite">
        <div className="structure-detail-index"><span>Обраний підрозділ</span><b>{String(activeIndex + 1).padStart(2, "0")}<small> / {String(branchNodes.length).padStart(2, "0")}</small></b></div><small>{active.path}</small><span>{active.eyebrow}</span><h3>{active.title}</h3><p>{active.description}</p><div className="structure-facts">{active.facts.map((fact) => <b key={fact}>{fact}</b>)}</div><Link href={active.href}>{active.linkLabel} →</Link>
      </aside>
    </div>
    </div>
  </div></section>;
}
