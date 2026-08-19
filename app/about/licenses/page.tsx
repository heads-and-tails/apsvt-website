import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "Ліцензії та акредитація",
  description:
    "Ліцензія на освітню діяльність, сертифікати акредитації освітніх програм АПСВТ та посилання на державні реєстри.",
};

export const dynamic = "force-dynamic";

type Certificate = {
  title: string;
  level: string;
  number: string;
  publishedTerm: string;
  image: string;
};

type CurrentCertificate = {
  title: string;
  level: string;
  specialty: string;
  number: string;
  issued: string;
  validUntil: string;
  href: string;
};

const currentCertificates: CurrentCertificate[] = [
  { title: "Фінанси, банківська справа, страхування та фондовий ринок", level: "Магістр", specialty: "072", number: "№ 19421", issued: "23.12.2025", validUntil: "23.12.2026", href: "/documents/accreditation/2026/finance-insurance-master-19421.pdf" },
  { title: "Професійна освіта (за спеціалізаціями)", level: "Магістр", specialty: "015", number: "№ 19390", issued: "23.12.2025", validUntil: "23.12.2026", href: "/documents/accreditation/2026/professional-education-master-19390.pdf" },
  { title: "Психологія", level: "Бакалавр", specialty: "053", number: "№ 21114", issued: "13.05.2026", validUntil: "12.05.2027", href: "/documents/accreditation/2026/psychology-bachelor-21114.pdf" },
  { title: "Психологія бізнесу та управління", level: "Магістр", specialty: "053", number: "№ 10064", issued: "15.01.2025", validUntil: "01.07.2030", href: "/documents/accreditation/2026/business-management-psychology-master-10064.pdf" },
  { title: "Публічне управління та адміністрування", level: "Бакалавр", specialty: "281", number: "№ 20649", issued: "22.04.2026", validUntil: "21.04.2027", href: "/documents/accreditation/2026/public-administration-bachelor-20649.pdf" },
  { title: "Клінічна психологія", level: "Магістр", specialty: "053", number: "№ 6698", issued: "26.12.2023", validUntil: "01.07.2029", href: "/documents/accreditation/2026/clinical-psychology-master-6698.pdf" },
];

const programmeCertificates: Certificate[] = [
  {
    title: "Маркетинг",
    level: "Бакалавр · 075",
    number: "Сертифікат № 511",
    publishedTerm: "У старому джерелі: до 23.07.2025",
    image: "/documents/licenses/01-marketing-bachelor.jpg",
  },
  {
    title: "Соціальна робота",
    level: "Магістр · 231",
    number: "Сертифікат № 195",
    publishedTerm: "У старому джерелі: до 28.01.2025",
    image: "/documents/licenses/02-social-work-master.jpg",
  },
  {
    title: "Соціальна робота",
    level: "Бакалавр · 231",
    number: "Сертифікат № 556",
    publishedTerm: "У старому джерелі: до 23.07.2025",
    image: "/documents/licenses/03-social-work-bachelor.jpg",
  },
  {
    title: "Менеджмент",
    level: "Бакалавр · 073",
    number: "Сертифікат № 510",
    publishedTerm: "У старому джерелі: до 23.07.2025",
    image: "/documents/licenses/04-management-bachelor.jpg",
  },
  {
    title: "Фінанси, банківська справа та страхування",
    level: "Бакалавр · 072",
    number: "Сертифікат № 1498",
    publishedTerm: "У старому джерелі: до 01.07.2026",
    image: "/documents/licenses/15-finance-bachelor-archive.jpg",
  },
  {
    title: "Право",
    level: "Бакалавр · 081",
    number: "Сертифікат № 1686",
    publishedTerm: "У старому джерелі: до 01.07.2026",
    image: "/documents/licenses/16-bachelor-archive.jpg",
  },
];

const archiveCertificates: Certificate[] = [
  {
    title: "Фінанси, банківська справа та страхування",
    level: "Бакалавр · попередній документ",
    number: "Серія НІ",
    publishedTerm: "Архівний скан",
    image: "/documents/licenses/05-finance-bachelor.jpg",
  },
  {
    title: "Право",
    level: "Бакалавр · попередній документ",
    number: "Серія НІ",
    publishedTerm: "Архівний скан",
    image: "/documents/licenses/06-law-bachelor.jpg",
  },
  {
    title: "Соціологія",
    level: "Бакалавр · 054",
    number: "Серія НІ № 1188634",
    publishedTerm: "У старому джерелі: продовжено до 01.07.2021",
    image: "/documents/licenses/07-sociology-bachelor.jpg",
  },
  {
    title: "Фінанси, банківська справа та страхування",
    level: "Магістр · 072",
    number: "Серія НІ № 1188643",
    publishedTerm: "У старому джерелі: до 01.07.2025",
    image: "/documents/licenses/08-finance-master.jpg",
  },
  {
    title: "Право",
    level: "Магістр · 081",
    number: "Серія НІ № 1188641",
    publishedTerm: "У старому джерелі: до 01.07.2025",
    image: "/documents/licenses/09-law-master.jpg",
  },
  {
    title: "Маркетинг",
    level: "Магістр · 075",
    number: "Серія НІ № 1188642",
    publishedTerm: "У старому джерелі: до 01.07.2026",
    image: "/documents/licenses/10-marketing-master.jpg",
  },
  {
    title: "Підприємництво, торгівля та біржова діяльність",
    level: "Бакалавр · 076",
    number: "Серія АП № 11009149",
    publishedTerm: "У старому джерелі: до 01.07.2027",
    image: "/documents/licenses/11-entrepreneurship-bachelor.jpg",
  },
  {
    title: "Туризм",
    level: "Бакалавр · 242",
    number: "Серія АП № 11009148",
    publishedTerm: "У старому джерелі: до 01.07.2023",
    image: "/documents/licenses/12-tourism-bachelor.jpg",
  },
  {
    title: "Менеджмент",
    level: "Магістр · 073",
    number: "Серія АП № 11008680",
    publishedTerm: "У старому джерелі: до 01.07.2024",
    image: "/documents/licenses/13-management-master.jpg",
  },
  {
    title: "Підприємництво, торгівля та біржова діяльність",
    level: "Магістр · 076",
    number: "Серія АП № 11001485",
    publishedTerm: "У старому джерелі: до 01.07.2023",
    image: "/documents/licenses/14-entrepreneurship-master.jpg",
  },
];

function CertificateCard({ certificate, index }: { certificate: Certificate; index: number }) {
  return (
    <a className="license-certificate-card" href={certificate.image} target="_blank" rel="noreferrer">
      <div className="license-certificate-image">
        <img src={certificate.image} alt={`Скан: ${certificate.title}, ${certificate.level}`} />
      </div>
      <div className="license-certificate-copy">
        <span>{String(index + 1).padStart(2, "0")} / {certificate.level}</span>
        <h3>{certificate.title}</h3>
        <p>{certificate.number}</p>
        <small>{certificate.publishedTerm}</small>
        <b>Переглянути скан ↗</b>
      </div>
    </a>
  );
}

function CurrentCertificateCard({ certificate, index }: { certificate: CurrentCertificate; index: number }) {
  return <a className="current-certificate-card" href={certificate.href} target="_blank" rel="noreferrer">
    <div><span>{String(index + 1).padStart(2, "0")}</span><small>{certificate.level} · спеціальність {certificate.specialty}</small></div>
    <h3>{certificate.title}</h3>
    <dl><div><dt>Сертифікат</dt><dd>{certificate.number}</dd></div><div><dt>Видано</dt><dd>{certificate.issued}</dd></div><div><dt>Діє до</dt><dd>{certificate.validUntil}</dd></div></dl>
    <b>Відкрити офіційний PDF ↗</b>
  </a>;
}

export default function LicensesPage() {
  return (
    <main id="top">
      <SiteHeader />

      <section className="license-hero">
        <div className="wrap license-hero-grid">
          <div>
            <div className="crumb">Головна / Про Академію / Ліцензії та акредитація</div>
            <span className="mono">Офіційні документи АПСВТ</span>
            <h1>Ліцензії.<br />Акредитація.<br /><em>Відкритість.</em></h1>
            <p>Документи про право Академії провадити освітню діяльність і архів сертифікатів освітніх програм — з прямим переходом до державних реєстрів.</p>
          </div>
          <aside className="license-hero-card">
            <span>Документи у розділі</span>
            <b>23</b>
            <p>1 ліцензійний документ<br />22 сертифікати та архівні скани</p>
            <a href="#license-document">Перейти до ліцензії ↓</a>
          </aside>
        </div>
      </section>

      <nav className="license-page-nav" aria-label="Навігація сторінкою">
        <div className="wrap">
          <a href="#license-document"><span>01</span><b>Ліцензія</b></a>
          <a href="#current-certificates"><span>02</span><b>Нові сертифікати</b></a>
          <a href="#certificates"><span>03</span><b>Попередні скани</b></a>
          <a href="#verification"><span>04</span><b>Перевірити статус</b></a>
        </div>
      </nav>

      <section id="license-document">
        <div className="wrap license-document-grid">
          <div className="license-document-copy">
            <div className="idx">01 / Освітня діяльність</div>
            <h2>Ліцензія Академії</h2>
            <p className="lead">Відомості щодо здійснення освітньої діяльності у сфері вищої освіти сформовані Міністерством освіти і науки України.</p>
            <p>Документ містить рішення про провадження освітньої діяльності на бакалаврському, магістерському та третьому освітньо-науковому рівнях, а також окремі відомості за спеціальністю 081 «Право».</p>
            <div className="license-document-actions">
              <a className="cta dark" href="/documents/licenses/license-educational-activity-2021.pdf" target="_blank" rel="noreferrer"><span>Відкрити PDF · 2 сторінки</span></a>
              <a href="https://mon.gov.ua/storage/app/media/pravo-diyalnosti/2021/march/nakaz%2026_l.pdf" target="_blank" rel="noreferrer">Наказ МОН № 26-л ↗</a>
            </div>
          </div>
          <aside className="license-levels" aria-label="Ліцензовані обсяги у документі 2021 року">
            <span>За документом від 04.03.2021</span>
            <div><b>540</b><p>бакалаврський рівень<br /><small>осіб на рік</small></p></div>
            <div><b>230</b><p>магістерський рівень<br /><small>осіб на рік</small></p></div>
            <div><b>20</b><p>освітньо-науковий рівень<br /><small>осіб на рік</small></p></div>
          </aside>
        </div>
      </section>

      <section className="current-certificates-section" id="current-certificates">
        <div className="wrap">
          <div className="license-section-head">
            <div><div className="idx">02 / Додано у 2026 році</div><h2>Сертифікати та акредитація</h2></div>
            <p>Офіційні PDF-сертифікати з номером, датою видачі та строком дії. Для перевірки поточного статусу скористайтеся державними реєстрами наприкінці сторінки.</p>
          </div>
          <div className="current-certificate-grid">
            {currentCertificates.map((certificate, index) => <CurrentCertificateCard certificate={certificate} index={index} key={certificate.number} />)}
          </div>
        </div>
      </section>

      <section className="license-certificates-section" id="certificates">
        <div className="wrap">
          <div className="license-section-head">
            <div>
              <div className="idx">03 / Попередня добірка</div>
              <h2>Скани сертифікатів</h2>
            </div>
            <p>Це скани, перенесені з попередньої офіційної сторінки Академії. Зазначені строки відтворено як історичні дані джерела; актуальний статус потрібно перевіряти в державних реєстрах нижче.</p>
          </div>
          <div className="license-certificate-grid">
            {programmeCertificates.map((certificate, index) => (
              <CertificateCard certificate={certificate} index={index} key={`${certificate.title}-${certificate.level}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="license-archive-section" id="archive">
        <div className="wrap">
          <details className="license-archive">
            <summary>
              <span>04 / Повний комплект</span>
              <b>Архів попередніх сертифікатів</b>
              <i>+</i>
            </summary>
            <p className="license-archive-note">Архів збережено для прозорості та історії акредитації. Він не підтверджує чинний статус програми на сьогодні.</p>
            <div className="license-certificate-grid archive">
              {archiveCertificates.map((certificate, index) => (
                <CertificateCard certificate={certificate} index={index + programmeCertificates.length} key={`${certificate.title}-${certificate.level}`} />
              ))}
            </div>
          </details>
        </div>
      </section>

      <section className="license-verification" id="verification">
        <div className="wrap">
          <div className="license-section-head light">
            <div>
              <div className="idx">05 / Актуальний статус</div>
              <h2>Перевірте в офіційному реєстрі</h2>
            </div>
            <p>Державні реєстри є джерелом актуальної інформації про видані, переоформлені, розширені, звужені або анульовані ліцензії та сертифікати.</p>
          </div>
          <div className="license-registry-grid">
            <a href="https://registry.edbo.gov.ua/university/53" target="_blank" rel="noreferrer">
              <small>ЄДЕБО · картка закладу № 53</small>
              <b>Академія в Реєстрі суб’єктів освітньої діяльності</b>
              <span>Перевірити ліцензії та програми ↗</span>
            </a>
            <a href="https://registry.naqa.gov.ua/" target="_blank" rel="noreferrer">
              <small>НАЗЯВО</small>
              <b>Реєстр акредитаційних справ</b>
              <span>Знайти програму Академії ↗</span>
            </a>
            <a href="https://mon.gov.ua/ministerstvo-2/poslugi/litsenzuvannya/litsenziyniy-reestr-subektiv-osvitnoi-diyalnosti/litsenziyniy-reestr-subektiv-osvitnoi-diyalnosti-u-sferi-vishchoi-osviti" target="_blank" rel="noreferrer">
              <small>Міністерство освіти і науки України</small>
              <b>Ліцензійний реєстр у сфері вищої освіти</b>
              <span>Відкрити реєстр МОН ↗</span>
            </a>
          </div>
          <div className="license-help">
            <span>?</span>
            <div><b>Не знаєте, який документ потрібен?</b><p>Для вступу зазвичай достатньо перевірити програму в ЄДЕБО. Для офіційної довідки зверніться до Академії — команда підкаже потрібний документ.</p></div>
            <Link href="/contacts">Зв’язатися з Академією →</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
