import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../../components/SiteHeader";
import { SiteFooter } from "../../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Лабораторія криміналістики",
  description: "Навчальна лабораторія криміналістики юридичного факультету АПСВТ: моделювання слідчих дій, робота зі слідами, доказами та криміналістичною технікою.",
};

const practiceFormats = [
  ["01", "Огляд місця події", "Студенти вчаться планувати огляд, фіксувати обстановку, складати схеми та процесуальні документи."],
  ["02", "Виявлення і фіксація слідів", "Практичні заняття охоплюють пошук, опис, фотографування та навчальне вилучення слідів."],
  ["03", "Криміналістична фотографія", "Технічна фотолабораторія допомагає опанувати масштабну, орієнтуючу, оглядову й детальну зйомку."],
  ["04", "Моделювання процесуальних дій", "Навчальні сценарії відтворюють роботу слідчого, спеціаліста та інших учасників кримінального провадження."],
];

export default function Page() {
  return <main id="top"><SiteHeader />
    <section className="clinic-hero"><div className="clinic-hero-image"><img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1800&q=90&auto=format&fit=crop" alt="Документи та інструменти для практичного аналізу" /></div><div className="wrap clinic-hero-copy"><Link href="/programs/law">← Програма «Право»</Link><span>Юридичний факультет · навчальна лабораторія</span><h1>Лабораторія<br /><em>криміналістики</em></h1><p>Практичний простір для опанування криміналістичної техніки, тактики слідчих дій, фіксації доказової інформації та професійної командної роботи.</p></div></section><div className="hero-rule" />

    <section><div className="wrap clinic-intro"><div><div className="idx">01 / Призначення</div><h2>Від теорії доказів<br />до професійної дії</h2></div><div><p className="program-lede">Лабораторія доповнює аудиторне навчання контрольованими симуляціями. Студенти відпрацьовують алгоритми криміналістичної роботи, вчаться уважно спостерігати, коректно документувати та пояснювати свої рішення.</p><p>Заняття проводяться як навчальні сценарії під керівництвом викладача. Вони допомагають пов’язати кримінальне право і процес із практикою дослідження слідів та підготовки процесуальних матеріалів.</p><a href="/documents/archive/old-site/forensic-lab-regulation.pdf" target="_blank" rel="noreferrer">Відкрити положення про лабораторію ↗</a></div></div></section>

    <section className="soft clinic-services"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Практичні формати</div><h2>Що опановують студенти</h2></div><p>Навчальні вправи поєднують криміналістичну техніку, процесуальні правила, командну взаємодію та професійну етику.</p></div><div className="clinic-step-grid">{practiceFormats.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="clinic-principles"><div className="wrap clinic-principles-grid"><div><div className="idx">03 / Освітній результат</div><h2>Точність до висновку</h2><p>Криміналістична практика вчить не лише користуватися інструментами, а й відповідально працювати з фактами.</p></div><div className="clinic-principle-list"><div><b>Спостережливість</b><p>Помічати деталі, відрізняти припущення від встановлених фактів і перевіряти робочі версії.</p></div><div><b>Процесуальна коректність</b><p>Документувати навчальні дії послідовно, зрозуміло та з урахуванням вимог права.</p></div><div><b>Командна робота</b><p>Розподіляти ролі, обмінюватися інформацією і відповідати за якість спільного результату.</p></div><div><b>Етичність</b><p>Поважати гідність людини, конфіденційність і межі допустимого під час професійної підготовки.</p></div></div></div></section>

    <section className="clinic-contact"><div className="wrap clinic-contact-grid"><div><span>Навчально-практичні осередки</span><h2>Дві практики<br />однієї правничої освіти</h2><p>Лабораторія криміналістики розвиває навички роботи з доказовою інформацією, а юридична клініка «Феміда» — правову комунікацію та допомогу людям під супервізією.</p><div><Link className="cta" href="/programs/law/legal-clinic"><span>Юридична клініка «Феміда»</span></Link><Link className="cta ghost" href="/departments/law-faculty"><span>Юридичний факультет</span></Link></div></div><aside><small>Офіційний документ</small><h3>Положення про лабораторію</h3><p>Документ визначає статус, завдання та організацію роботи навчальної лабораторії криміналістики.</p><a href="/documents/archive/old-site/forensic-lab-regulation.pdf" target="_blank" rel="noreferrer">Відкрити PDF ↗</a></aside></div></section>
    <SiteFooter />
  </main>;
}
