import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Наукові видання",
  description:
    "Науковий вісник АПСВТ, міжнародні партнерські видання та інформація для авторів.",
};

const journalUrl = "/research/journals/visnyk";
const monographUrl = "/documents/research/publications/metody-diahnostyky-ta-psykholohichnoho-suprovodu-2026.pdf";
const monographDoi = "https://doi.org/10.56287/8285-65-4";

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

      <section className="soft monograph-release" id="monograph-stress-2026">
        <div className="wrap">
          <article className="journal-feature monograph-feature">
            <a
              className="monograph-cover"
              href={monographUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Відкрити колективну монографію у форматі PDF"
            >
              <Image
                src="/images/research/metody-diahnostyky-2026-cover.jpg"
                alt="Обкладинка монографії «Методи діагностики та психологічного супроводу життєдіяльності особистості в умовах стресу»"
                width={1191}
                height={1685}
                priority
              />
              <span>Відкрити PDF ↗</span>
            </a>
            <div>
              <div className="idx">Нове видання · 2026</div>
              <h2>Методи діагностики та психологічного супроводу</h2>
              <p className="lead">
                Колективна монографія про психодіагностику, психологічну допомогу
                в кризових ситуаціях і рекреаційні практики підтримки особистості
                в умовах стресу.
              </p>
              <p>
                За редакцією професорів Людмили Бегези, Наталії Максимової та
                Катерини Мілютіної. Видання рекомендовано Вченою радою АПСВТ і
                адресовано науковцям, викладачам, психологам, психотерапевтам,
                фахівцям із соціальної роботи та здобувачам освіти.
              </p>
              <dl className="monograph-facts">
                <div><dt>Формат</dt><dd>Колективна монографія · 390 с.</dd></div>
                <div><dt>ISBN</dt><dd>978-617-8285-65-4</dd></div>
                <div><dt>Ліцензія</dt><dd>CC BY 4.0</dd></div>
              </dl>
              <div className="journal-actions">
                <a className="cta dark" href={monographUrl} target="_blank" rel="noreferrer">
                  <span>Читати монографію →</span>
                </a>
                <a className="sec-link" href={monographDoi} target="_blank" rel="noreferrer">
                  DOI 10.56287/8285-65-4 ↗
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

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
