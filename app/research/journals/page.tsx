import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Наукові видання",
  description:
    "Науковий вісник АПСВТ, міжнародні партнерські видання та інформація для авторів.",
};

const journalUrl = "/research/journals/visnyk";

const specialties = [
  "C1 Економіка",
  "C4 Психологія",
  "D2 Фінанси, банківська справа, страхування та фондовий ринок",
  "D3 Менеджмент",
];

export default function Page() {
  return (
    <main id="top">
      <SiteHeader />
      <section className="phero journal-hero">
        <div className="wrap">
          <div className="crumb">Наука / Видання</div>
          <h1>
            Дослідження,
            <br />
            відкриті світові
          </h1>
          <p className="lead">
            Періодичні видання Академії для дослідників економіки, психології,
            управління, права й соціальних трансформацій.
          </p>
        </div>
      </section>
      <div className="phero-rule" />

      <section>
        <div className="wrap">
          <article className="journal-feature">
            <Link
              className="journal-cover"
              href={journalUrl}
              aria-label="Відкрити сайт Наукового вісника АПСВТ"
            >
              <span>НАУКОВИЙ ВІСНИК</span>
              <b>АПСВТ</b>
              <small>Економіка · психологія · управління</small>
            </Link>
            <div>
              <div className="idx">Фахове видання · категорія Б</div>
              <h2>Науковий вісник Академії</h2>
              <p className="lead">
                У лютому 2025 року серію «Економіка, психологія та управління»
                включено до Переліку наукових фахових видань України, категорія
                «Б» (наказ МОН № 349 від 24.02.2025).
              </p>
              <p>
                Електронний журнал засновано у 2024 році. Він публікує
                фундаментальні й прикладні дослідження з економіки, психології,
                фінансів та менеджменту чотири рази на рік.
              </p>
              <p>
                У розділі Вісника на сайті Академії доступні архів випусків,
                повні PDF, вимоги для авторів та електронне подання рукописів.
              </p>
              <div className="journal-actions">
                <Link
                  className="cta dark"
                  href={journalUrl}
                >
                  <span>Відкрити Вісник →</span>
                </Link>
                <Link className="sec-link" href="/research">
                  Знайти публікацію →
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="soft">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="idx">01 / Спеціальності</div>
              <h2>Визнані напрями</h2>
            </div>
          </div>
          <div className="specialty-grid">
            {specialties.map((item, index) => (
              <article key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{item}</b>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="idx">02 / Міжнародне партнерство</div>
              <h2>Consortio</h2>
            </div>
          </div>
          <div className="detail-layout">
            <div className="detail-copy">
              <p className="lede">
                Economic-Social and Law Journal of Central and Eastern Europe
                популяризує дослідження університетів Центральної та Східної
                Європи.
              </p>
              <p>
                АПСВТ є асоційованим партнером видання. До наукової ради входять
                представники Польщі, України, Грузії, Вірменії, Туреччини та
                Ізраїлю.
              </p>
            </div>
            <aside className="panel">
              <h3>Перед поданням статті</h3>
              <ul>
                <li>
                  <span className="y">01</span>Перевірте тематичну відповідність
                </li>
                <li>
                  <span className="y">02</span>Підготуйте анотації й метадані
                </li>
                <li>
                  <span className="y">03</span>Дотримуйтеся академічної
                  доброчесності
                </li>
                <li>
                  <span className="y">04</span>Вкажіть усі джерела та DOI
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
