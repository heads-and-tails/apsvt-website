import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../../components/SiteHeader";
import { SiteFooter } from "../../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Юридична клініка «Феміда»",
  description: "Навчально-практичний простір юридичного факультету АПСВТ: правопросвітництво, первинна правова допомога та професійні навички студентів.",
};

const steps = [
  ["01", "Первинне звернення", "Клініка з’ясовує суть питання, перевіряє можливість прийняти його в роботу та пояснює формат допомоги."],
  ["02", "Робота студента", "Студент-консультант аналізує факти й норми права, готує проєкт відповіді та перелік можливих наступних кроків."],
  ["03", "Перевірка викладачем", "Куратор перевіряє правову позицію, точність формулювань, етичність і зрозумілість консультації."],
  ["04", "Відповідь і правопросвіта", "Клієнт отримує первинну правову інформацію, а студенти — супервізований досвід професійної комунікації."],
];

export default function Page() {
  return <main id="top"><SiteHeader />
    <section className="clinic-hero"><div className="clinic-hero-image"><img src="/news-legal-clinic.jpg" alt="Практичне заняття студентів юридичного факультету" /></div><div className="wrap clinic-hero-copy"><Link href="/programs/law">← Програма «Право»</Link><span>Юридичний факультет · навчально-практичний підрозділ</span><h1>Юридична клініка<br /><em>«Феміда»</em></h1><p>Простір, де студенти вчаться слухати клієнта, аналізувати правову ситуацію, працювати етично й пояснювати право зрозумілою мовою.</p></div></section><div className="hero-rule" />

    <section><div className="wrap clinic-intro"><div><div className="idx">01 / Місія</div><h2>Право, яке допомагає людям</h2></div><div><p className="program-lede">Клініка поєднує практичну підготовку майбутніх правників із правопросвітницькою та соціальною місією. Студенти працюють під керівництвом викладачів-практиків і вчаться відповідально супроводжувати первинні звернення.</p><p>У матеріалах Академії зафіксовано початок роботи «Феміди» у 2014 році. Опубліковані тоді години прийому й телефон є історичними та не використовуються як актуальні контакти.</p><a href="/materials/1421-7a912e34c.html">Історія відкриття клініки →</a></div></div></section>

    <section className="soft clinic-services"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Практична підготовка</div><h2>Як будується робота</h2></div><p>Клініка не підміняє адвоката або систему безоплатної вторинної правової допомоги. Її основа — первинна інформація, правопросвіта й супервізоване навчання.</p></div><div className="clinic-step-grid">{steps.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="clinic-principles"><div className="wrap clinic-principles-grid"><div><div className="idx">03 / Професійні принципи</div><h2>Етика до відповіді</h2><p>Кожна навчальна консультація має бути коректною, конфіденційною та перевіреною куратором.</p></div><div className="clinic-principle-list"><div><b>Конфіденційність</b><p>Персональні дані й зміст звернення не використовуються поза погодженим навчальним процесом.</p></div><div><b>Відсутність конфлікту інтересів</b><p>Перед роботою команда перевіряє, чи може клініка етично прийняти звернення.</p></div><div><b>Зрозуміла мова</b><p>Правова інформація пояснюється без зайвого професійного жаргону й хибних обіцянок.</p></div><div><b>Супервізія</b><p>Студентська відповідь не передається без перевірки викладачем або практикуючим юристом.</p></div></div></div></section>

    <section className="clinic-contact"><div className="wrap clinic-contact-grid"><div><span>Актуальний статус прийому</span><h2>Уточніть консультацію<br />перед зверненням</h2><p>Графік і формат роботи можуть змінюватися протягом навчального року. Академія підтвердить, чи ведеться прийом, і передасть звернення юридичному факультету.</p><div><a className="cta" href="mailto:info@socosvita.kiev.ua"><span>info@socosvita.kiev.ua</span></a><a className="cta ghost" href="tel:+380445260664"><span>+38 (044) 526-06-64</span></a></div></div><aside><small>Якщо потрібна термінова або вторинна допомога</small><h3>Система безоплатної правничої допомоги</h3><p>Для представництва в суді, захисту у кримінальному провадженні та невідкладних ситуацій зверніться до державної системи БПД.</p><a href="https://legalaid.gov.ua/" target="_blank" rel="noreferrer">legalaid.gov.ua ↗</a></aside></div></section>

    <section className="programme-documents"><div className="wrap"><div className="programme-documents-head"><div><div className="idx">04 / Документи й лабораторії</div><h2>Нормативна основа<br />та суміжна практика</h2></div><Link href="/documents#education">Усі документи →</Link></div><div className="programme-document-list"><a href="/documents/archive/old-site/legal-clinic-regulation.pdf" target="_blank" rel="noreferrer"><span>01</span><div><small>PDF · 4 сторінки</small><h3>Положення про юридичну клініку Академії</h3></div><b>↗</b></a><a href="/documents/archive/old-site/forensic-lab-regulation.pdf" target="_blank" rel="noreferrer"><span>02</span><div><small>PDF · 5 сторінок</small><h3>Положення про навчальну лабораторію криміналістики</h3></div><b>↗</b></a><Link href="/departments/law-faculty"><span>03</span><div><small>Історія, команда й структура</small><h3>Юридичний факультет Академії</h3></div><b>→</b></Link></div></div></section>
    <SiteFooter />
  </main>;
}
