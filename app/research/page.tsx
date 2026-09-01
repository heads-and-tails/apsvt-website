import type { Metadata } from "next";
import Link from "next/link";
import { getPublicContent as getContentItems } from "@/lib/content";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PageDocuments } from "../components/PageDocuments";
import { PublicationSearch } from "./PublicationSearch";

export const metadata: Metadata = {
  title: "Наука і публікації",
  description:
    "Пошук наукових публікацій викладачів АПСВТ, профілі Google Scholar та архів Вісника.",
};
export const dynamic = "force-dynamic";

export default async function Page() {
  const resources = await getContentItems("research_resource");

  return (
    <main id="top">
      <SiteHeader />
      <section className="phero">
        <div className="wrap">
          <div className="crumb">Головна / Наука</div>
          <h1>
            Наука й<br />публікації
          </h1>
          <p className="lead">
            Дослідження Академії, наукові видання, конференції, звіти й
            документи аспірантури та докторантури.
          </p>
        </div>
      </section>
      <div className="phero-rule" />

      <section>
        <div className="wrap research-page-intro">
          <div>
            <div className="idx">01 / Наукова робота</div>
            <h2>Дослідження в Академії</h2>
          </div>
          <p>
            Наукова робота в Академії проводиться відповідно до законів України
            «Про освіту», «Про вищу освіту», «Про наукову і науково-технічну
            діяльність», Порядку підготовки здобувачів ступеня доктора філософії
            та доктора наук, Стратегії розвитку Академії, планів наукових
            досліджень факультетів і кафедр та індивідуальних планів
            науково-педагогічних працівників, аспірантів і докторантів.
          </p>
        </div>
      </section>

      <PublicationSearch />

      <section className="soft research-resources">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="idx">03 / Ресурси Академії</div>
              <h2>Для дослідження</h2>
            </div>
            <p>
              Журнали, репозитарії та академічні бази для навчання, викладання й
              дослідницької роботи.
            </p>
          </div>
          <div className="research-resource-grid">
            {resources.map(({ id, payload }) => (
              <a
                href={payload.url}
                target={payload.url.startsWith("http") ? "_blank" : undefined}
                rel={payload.url.startsWith("http") ? "noreferrer" : undefined}
                key={id}
              >
                <span>{payload.year}</span>
                <small>{payload.category}</small>
                <h3>{payload.title}</h3>
                <p>{payload.description}</p>
                <b>↗</b>
              </a>
            ))}
            <a
              href="/documents/archive/old-site/conference-proceedings-2025.pdf"
              target="_blank"
              rel="noreferrer"
            >
              <span>2025</span>
              <small>Збірник конференції</small>
              <h3>Матеріали міжнародної конференції</h3>
              <p>377 сторінок досліджень про моделі розвитку України.</p>
              <b>↗</b>
            </a>
            <a
              href="/documents/archive/old-site/research-report-2017-2018.pdf"
              target="_blank"
              rel="noreferrer"
            >
              <span>2017/18</span>
              <small>Архівний звіт</small>
              <h3>Наукова робота Академії</h3>
              <p>
                Напрями досліджень, публікації та наукові заходи навчального
                року.
              </p>
              <b>↗</b>
            </a>
          </div>
          <Link className="sec-link restored-all-link" href="/documents#research">
            Усі наукові й методичні документи →
          </Link>
        </div>
      </section>

      <section className="research-portals">
        <div className="wrap portal-grid">
          <Link href="/research/academy-work">
            <span>01</span>
            <div>
              <small>Звіти й теми НДР</small>
              <h2>Наукова робота Академії</h2>
              <p>
                Звіти за 2024–2025 роки та документи науково-дослідної теми про
                ринок праці.
              </p>
            </div>
            <b>→</b>
          </Link>
          <Link href="/research/postgraduate-doctoral">
            <span>02</span>
            <div>
              <small>Програми докторів філософії · Вступ 2026</small>
              <h2>Аспірантура та докторантура</h2>
              <p>
                Накази, строки вступних випробувань і затверджена вартість
                навчання.
              </p>
            </div>
            <b>→</b>
          </Link>
          <Link href="/research/conferences">
            <span>03</span>
            <div>
              <small>Наукові події</small>
              <h2>Конференції Академії</h2>
              <p>
                Архів 2023–2026 років, інформаційні листи, програми та збірники
                матеріалів.
              </p>
            </div>
            <b>→</b>
          </Link>
          <Link href="/research/journals">
            <span>04</span>
            <div>
              <small>Видавнича діяльність</small>
              <h2>Наукові видання</h2>
              <p>
                Науковий вісник АПСВТ, тематичні серії, монографії, навчальні
                та інші науково-методичні видання.
              </p>
            </div>
            <b>→</b>
          </Link>
          <Link href="/research/theses">
            <span>05</span>
            <div>
              <small>Студентський репозитарій</small>
              <h2>Кваліфікаційні роботи</h2>
              <p>
                Бакалаврські та магістерські роботи з пошуком за програмою,
                роком і науковим керівником.
              </p>
            </div>
            <b>→</b>
          </Link>
        </div>
      </section>

      <PageDocuments pagePath="/research" />
      <SiteFooter />
    </main>
  );
}
