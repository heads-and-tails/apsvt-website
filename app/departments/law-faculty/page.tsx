import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { LawFacultyTeam } from "../../components/LawFacultyTeam";

export const metadata: Metadata = {
  title: "Юридичний факультет",
  description: "Юридичний факультет АПСВТ: кафедри, команда, практичні лабораторії, наукові проєкти та освітні програми.",
};

const departments = [
  ["01", "Публічне право", "Конституційне, адміністративне, фінансове й муніципальне право.", "/programs/law#department"],
  ["02", "Кримінальна юстиція", "Кримінальне право, процес, захист прав людини та криміналістика.", "/programs/law#practice"],
  ["03", "Приватне і трудове право", "Цивільне, господарське, трудове право та судовий захист.", "/programs/law#department"],
  ["04", "Публічне управління", "Публічна політика, служба, розвиток громад і соціальний діалог.", "/programs/public-administration"],
];

export default function Page() {
  return <main id="top"><SiteHeader />
    <section className="law-faculty-hero"><div className="law-faculty-hero-image"><img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1800&q=92&auto=format&fit=crop" alt="Правнича освіта" /></div><div className="wrap law-faculty-hero-copy"><Link href="/departments">← Усі кафедри</Link><span>ЮФ · з 1994 року</span><h1>Юридичний<br /><em>факультет</em></h1><p>Фундаментальна правнича освіта, клінічна практика, криміналістична лабораторія та дослідження, що працюють для людини й держави.</p><div><b>4</b><span>кафедри</span><b>2</b><span>практичні осередки</span></div></div></section><div className="hero-rule" />

    <section className="law-faculty-intro"><div className="wrap law-faculty-intro-grid"><div><div className="idx">01 / Про факультет</div><h2>Від першого набору<br />до правничої екосистеми</h2></div><div><p className="program-lede">Становлення факультету розпочалося з першого набору студентів у 1994 році. Сьогодні він готує практиків для судових, правозахисних і правоохоронних установ, органів влади, місцевого самоврядування та юридичного бізнесу.</p><p>До викладання залучені науковці та юристи-практики. Виїзні заняття, гостьові лекції, клінічна робота й лабораторні симуляції перетворюють теорію на професійну дію.</p><div className="law-faculty-milestones"><span><b>1994</b>перший набір студентів</span><span><b>2014</b>відкриття клініки «Феміда»</span><span><b>2026</b>актуальні програми D8 і D4</span></div></div></div></section>

    <section className="law-faculty-departments" id="departments"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Академічна структура</div><h2>Чотири кафедри —<br />єдина траєкторія</h2></div><p>Оберіть академічний напрям, щоб перейти до програми, практики та документів.</p></div><div className="law-department-grid">{departments.map(([number, title, text, href]) => <Link href={href} key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p><b>Перейти →</b></Link>)}</div></div></section>

    <section className="law-practice-showcase"><div className="wrap"><div className="law-practice-head"><div><div className="idx">03 / Практика всередині факультету</div><h2>Навчальні ситуації,<br />наближені до реальних</h2></div><p>Студент проходить шлях від аналізу фактичної ситуації до аргументованої й етичної правової позиції.</p></div><div className="law-practice-grid"><Link href="/programs/law/legal-clinic"><span>01</span><small>Правова допомога</small><h3>Юридична клініка<br />«Феміда»</h3><p>Інтерв’ювання клієнта, правовий аналіз, підготовка відповіді й супервізія викладача.</p><b>Відкрити сторінку →</b></Link><Link href="/programs/law#practice"><span>02</span><small>Навчальна лабораторія</small><h3>Криміналістичний<br />майданчик</h3><p>Технічна фотолабораторія, кабінет слідчого, фіксація слідів і моделювання процесуальних дій.</p><b>Дивитися практику →</b></Link><article><span>03</span><small>Професійне середовище</small><h3>Суди, адвокатура<br />та публічні установи</h3><p>Зовнішні бази практики кафедра підтверджує перед направленням відповідно до програми й навчального року.</p><b>За погодженням факультету</b></article></div></div></section>

    <LawFacultyTeam />

    <section className="programme-documents"><div className="wrap"><div className="programme-documents-head"><div><div className="idx">05 / Програми й положення</div><h2>Документи без<br />архівного хаосу</h2></div><Link href="/documents#education">Усі документи →</Link></div><div className="programme-document-list"><a href="/documents/admissions/exam-programs/2026/phd/law.pdf" target="_blank" rel="noreferrer"><span>01</span><div><small>PDF · вступ 2026</small><h3>Програма вступного випробування D8 «Право»</h3></div><b>↗</b></a><a href="/documents/archive/old-site/legal-clinic-regulation.pdf" target="_blank" rel="noreferrer"><span>02</span><div><small>PDF · навчально-практичний підрозділ</small><h3>Положення про юридичну клініку</h3></div><b>↗</b></a><a href="/documents/archive/old-site/forensic-lab-regulation.pdf" target="_blank" rel="noreferrer"><span>03</span><div><small>PDF · навчальна лабораторія</small><h3>Положення про лабораторію криміналістики</h3></div><b>↗</b></a></div><div className="law-faculty-source"><span>Історична довідка адаптована з офіційних матеріалів Академії</span><Link href="/materials">Відновлений каталог матеріалів →</Link></div></div></section>
    <SiteFooter />
  </main>;
}
