import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Студентська рада",
  description: "Студентське самоврядування АПСВТ: представництво, ініціативи, події та участь студентів у житті Академії.",
};

const directions = [
  ["01", "Представництво", "Донесення позиції студентів до адміністрації, факультетів і робочих груп Академії."],
  ["02", "Якість освіти", "Участь в обговоренні освітнього процесу, опитуваннях і вдосконаленні студентського досвіду."],
  ["03", "Ініціативи й події", "Підтримка освітніх, культурних, волонтерських, спортивних і благодійних проєктів."],
  ["04", "Студентська підтримка", "Допомога з орієнтацією в кампусі, комунікацією та пошуком потрібного сервісу."],
];

const participation = [
  ["01", "Сформулюйте ідею", "Коротко опишіть проблему, пропозицію або подію та кого вона стосується."],
  ["02", "Зберіть команду", "Запросіть студентів своєї групи, програми або факультету долучитися до ініціативи."],
  ["03", "Зверніться до Ради", "Передайте пропозицію через загальні контакти Академії із позначкою «Студентська рада»."],
  ["04", "Реалізуйте разом", "Узгодьте формат, відповідальних, простір і необхідну підтримку для втілення ідеї."],
];

export default function Page() {
  return <main id="top"><SiteHeader />
    <section className="phero img student-council-hero"><div className="bgi"><img src="/apsvt-event-real.jpg" alt="Студентська спільнота Академії під час події" /></div><div className="wrap"><div className="crumb">Головна / Студенту / Студентська рада</div><span className="detail-kicker">Студентське самоврядування</span><h1>Ваш голос<br />у житті Академії</h1><p className="lead">Студентська рада представляє інтереси студентів, підтримує ініціативи та допомагає перетворювати ідеї спільноти на конкретні зміни.</p><a className="cta" href="mailto:info@socosvita.kiev.ua?subject=%D0%94%D0%BB%D1%8F%20%D0%A1%D1%82%D1%83%D0%B4%D0%B5%D0%BD%D1%82%D1%81%D1%8C%D0%BA%D0%BE%D1%97%20%D1%80%D0%B0%D0%B4%D0%B8"><span>Написати Студентській раді</span></a></div></section><div className="phero-rule" />

    <section><div className="wrap split"><div className="copy"><div className="idx">01 / Про Раду</div><h2>Студенти впливають</h2><p className="lead">Самоврядування — це можливість брати участь у рішеннях, що стосуються навчання, кампусу, комунікації та студентського життя.</p><p>Рада працює як відкритий канал між студентами й Академією. Її завдання — збирати пропозиції, представляти спільну позицію та допомагати студентським командам запускати корисні ініціативи.</p></div><div className="panel"><h3>Коли звертатися</h3><ul><li><span className="y">01</span>Є пропозиція щодо навчання або сервісів</li><li><span className="y">02</span>Потрібна підтримка студентської ініціативи</li><li><span className="y">03</span>Хочете організувати подію чи волонтерський проєкт</li><li><span className="y">04</span>Потрібно представити спільну позицію студентів</li></ul></div></div></section>

    <section className="deep-content"><div className="wrap"><div className="deep-intro"><h2>Чим займається<br />Студентська рада</h2><p>Робота Ради поєднує представництво, підтримку студентів і розвиток спільноти — від пропозиції до реалізованої ініціативи.</p></div><div className="deep-grid">{directions.map(([number, title, text]) => <article className="deep-card" data-n={number} key={number}><span className="mono">Напрям</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="stats"><div className="wrap stat-grid"><div className="stat"><b>1</b><span>голос студентської спільноти</span></div><div className="stat"><b>4</b><span>напрями участі</span></div><div className="stat"><b>2</b><span>факультети в діалозі</span></div><div className="stat"><b>∞</b><span>простір для ініціатив</span></div></div></section>

    <section className="soft"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Долучитися</div><h2>Від ідеї<br />до спільної дії</h2></div><p>Не обов’язково чекати виборів або мати готовий великий проєкт. Почніть із чіткої пропозиції.</p></div><div className="steps">{participation.map(([number, title, text]) => <article className="step" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="bigcta"><div className="wrap"><span className="mono">Документи та контакти</span><h2>Долучайтеся<br />до спільноти</h2><p>Ознайомтеся з положенням про студентське самоврядування або надішліть запит через офіційні контакти Академії.</p><div className="student-council-actions"><Link className="cta" href="/documents#education"><span>Положення про самоврядування</span></Link><Link className="cta ghost" href="/contacts"><span>Контакти Академії</span></Link></div></div></section>
    <SiteFooter />
  </main>;
}
