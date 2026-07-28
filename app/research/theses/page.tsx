import type { Metadata } from "next";
import { getPublicContent } from "@/lib/content";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { ThesesCatalogue } from "./ThesesCatalogue";

export const metadata: Metadata = {
  title: "Кваліфікаційні роботи студентів",
  description: "Архів бакалаврських і магістерських кваліфікаційних робіт студентів АПСВТ із пошуком за програмою, роком та науковим керівником.",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const theses = await getPublicContent("student_thesis");

  return <main id="top">
    <SiteHeader />
    <section className="theses-hero">
      <div className="wrap">
        <div className="crumb">Головна / Наука / Кваліфікаційні роботи</div>
        <div className="theses-hero-grid">
          <div>
            <span className="theses-kicker">Студентський репозитарій АПСВТ</span>
            <h1>Кваліфікаційні<br />роботи</h1>
            <p>Бакалаврські й магістерські дослідження студентів Академії — з інформацією про освітню програму, рік захисту та наукового керівника.</p>
            <a href="#catalogue">Перейти до каталогу ↓</a>
          </div>
          <aside aria-label="Про архів">
            <span>В архіві</span>
            <b>{theses.length}</b>
            <p>опублікованих робіт</p>
            <dl>
              <div><dt>Рівні</dt><dd>Бакалавр · Магістр</dd></div>
              <div><dt>Формат</dt><dd>Повний текст роботи</dd></div>
              <div><dt>Навігація</dt><dd>Програма · Рік · Керівник</dd></div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
    <ThesesCatalogue items={theses} />
    <section className="theses-about">
      <div className="wrap">
        <span>Про репозитарій</span>
        <div>
          <h2>Від студентської роботи — до відкритого знання</h2>
          <p>У каталозі публікуються схвалені Академією кваліфікаційні роботи. Дані про автора, програму, рік і наукового керівника допомагають швидко знайти потрібне дослідження та коректно його цитувати.</p>
        </div>
      </div>
    </section>
    <SiteFooter />
  </main>;
}
