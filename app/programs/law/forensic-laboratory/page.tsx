import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../../components/SiteHeader";
import { SiteFooter } from "../../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Лабораторія криміналістики",
  description:
    "Навчальна лабораторія криміналістики юридичного факультету АПСВТ: практична робота зі слідами, доказами та криміналістичною технікою.",
};

const practiceFormats = [
  [
    "01",
    "Фото- й відеофіксація",
    "Робота з фото- та відеотехнікою і різними способами фіксації матеріальних об’єктів, що можуть мати значення речових доказів.",
  ],
  [
    "02",
    "Виявлення слідів",
    "Практичне застосування техніко-криміналістичних засобів для виявлення, фіксації, вилучення та навчального дослідження слідів.",
  ],
  [
    "03",
    "Портрет за ознаками",
    "Опанування сучасних технічних засобів складання портрета за зовнішніми ознаками опису людини.",
  ],
  [
    "04",
    "Дактилоскопія",
    "Консультації та практична допомога зі складання загальної і допоміжної дактилоскопічної формули за десятипальцевою системою обліку.",
  ],
];

const equipment = [
  ["01", "Криміналістична техніка"],
  ["02", "Оперативно-розшукова техніка"],
  ["03", "Фото-, аудіо- та відеотехніка"],
  ["04", "Засоби роботи з речовими доказами"],
];

const laboratoryFunctions = [
  "Організація освітньої діяльності на засадах академічної доброчесності.",
  "Участь у процесах забезпечення якості вищої освіти та освітньої діяльності.",
  "Співробітництво з установами й організаціями за напрямами роботи лабораторії.",
  "Організація позааудиторної та самостійної роботи студентів денної, заочної і дистанційної форм навчання.",
  "Впровадження інноваційних освітніх технологій у навчальні заняття.",
  "Проведення і супровід лабораторних та практичних занять відповідно до освітнього розкладу.",
  "Використання технічних засобів під час лабораторних робіт.",
  "Участь в організації та супроводі наукових конференцій, симпозіумів і круглих столів.",
];

export default function Page() {
  return (
    <main id="top" className="forensic-page">
      <SiteHeader />

      <section className="clinic-hero forensic-hero">
        <div className="clinic-hero-image">
          <img
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1800&q=90&auto=format&fit=crop"
            alt="Документи та інструменти для практичного аналізу"
          />
        </div>
        <div className="wrap clinic-hero-copy">
          <Link href="/programs/law">← Програма «Право»</Link>
          <span>Юридичний факультет · навчальна лабораторія</span>
          <h1>
            <span>Лабораторія</span>
            <em>криміналістики</em>
          </h1>
          <p>
            Практичний простір, де студенти опановують криміналістичну техніку,
            виявлення та фіксацію слідів, роботу з доказовою інформацією і
            підготовку до проведення слідчих дій.
          </p>
        </div>
      </section>
      <div className="hero-rule" />

      <section>
        <div className="wrap clinic-intro forensic-intro">
          <div>
            <div className="idx">01 / Призначення</div>
            <h2>Практичні навички для роботи зі слідами</h2>
          </div>
          <div>
            <p className="program-lede">
              Навчальну лабораторію створено для здобуття студентами практичних
              навичок під час вивчення дисципліни «Криміналістика» — від
              виявлення слідів кримінально протиправної діяльності до роботи з
              криміналістичною технікою та науково-криміналістичними засобами.
            </p>
            <p>
              Заняття знайомлять студентів із засобами, які використовують під
              час оперативно-розшукових і слідчих дій. Робота лабораторії
              організована відповідно до офіційного Положення про навчальну
              лабораторію криміналістики.
            </p>
            <a
              href="/documents/archive/old-site/forensic-lab-regulation.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Відкрити положення про лабораторію ↗
            </a>
          </div>
        </div>
      </section>

      <section className="soft clinic-services">
        <div className="wrap">
          <div className="sec-head forensic-section-head">
            <div>
              <div className="idx">02 / Практичні навички</div>
              <h2>Що опановують студенти</h2>
            </div>
            <p>
              Напрями практичної роботи відновлено за матеріалами попередньої
              офіційної сторінки лабораторії Академії.
            </p>
          </div>
          <div className="clinic-step-grid">
            {practiceFormats.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="forensic-equipment">
        <div className="wrap forensic-equipment-grid">
          <div>
            <div className="idx">03 / Матеріально-технічна база</div>
            <h2>Обладнання для практичного навчання</h2>
            <p>
              Навчально-технічна база дає змогу опановувати сучасні методи,
              способи та прийоми виявлення, фіксації, вилучення і дослідження
              речових доказів.
            </p>
          </div>
          <div className="forensic-equipment-list">
            {equipment.map(([number, title]) => (
              <div key={number}>
                <span>{number}</span>
                <b>{title}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="clinic-principles forensic-functions">
        <div className="wrap">
          <div className="forensic-functions-head">
            <div>
              <div className="idx">04 / Функції лабораторії</div>
              <h2>Навчання, дослідження та співпраця</h2>
            </div>
            <p>
              Лабораторія підтримує практичну частину освітнього процесу,
              самостійну роботу студентів та академічні події юридичного
              факультету.
            </p>
          </div>
          <ol className="forensic-function-list">
            {laboratoryFunctions.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="clinic-contact">
        <div className="wrap clinic-contact-grid">
          <div>
            <span>Навчально-практичні осередки</span>
            <h2>Практика правничої освіти</h2>
            <p>
              Лабораторія криміналістики розвиває навички роботи з доказовою
              інформацією, а юридична клініка «Феміда» — правову комунікацію та
              допомогу людям під супервізією.
            </p>
            <div>
              <Link className="cta" href="/programs/law/legal-clinic">
                <span>Юридична клініка «Феміда»</span>
              </Link>
              <Link className="cta ghost" href="/departments/law-faculty">
                <span>Юридичний факультет</span>
              </Link>
            </div>
          </div>
          <aside>
            <small>Офіційний документ · PDF · 5 сторінок</small>
            <h3>Положення про лабораторію</h3>
            <p>
              Документ визначає статус, завдання та організацію роботи
              навчальної лабораторії криміналістики.
            </p>
            <a
              href="/documents/archive/old-site/forensic-lab-regulation.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Відкрити PDF ↗
            </a>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
