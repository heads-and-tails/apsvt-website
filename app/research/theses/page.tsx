import type { Metadata } from "next";
import { getPublicContent } from "@/lib/content";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { ThesesCatalogue } from "./ThesesCatalogue";
import { psychologyTheses } from "@/lib/psychology-theses";

export const metadata: Metadata = {
  title: "Кваліфікаційні роботи студентів",
  description: "Архів бакалаврських і магістерських кваліфікаційних робіт студентів АПСВТ із пошуком за програмою, роком та автором.",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const editorialTheses = await getPublicContent("student_thesis");
  const theses = [...psychologyTheses, ...editorialTheses];

  return <main id="top">
    <SiteHeader />
    <section className="theses-hero">
      <div className="wrap">
        <div className="crumb">Головна / Наука / Кваліфікаційні роботи</div>
        <div className="theses-hero-grid">
          <div>
            <span className="theses-kicker">Студентський репозитарій АПСВТ</span>
            <h1>Кваліфікаційні<br />роботи</h1>
            <p>Бакалаврські й магістерські дослідження студентів Академії — з інформацією про автора, освітню програму та рік захисту.</p>
            <a href="#catalogue">Перейти до каталогу ↓</a>
          </div>
          <aside aria-label="Про архів">
            <span>В архіві</span>
            <b>{theses.length}</b>
            <p>опублікованих робіт</p>
            <dl>
              <div><dt>Рівні</dt><dd>Бакалавр · Магістр</dd></div>
              <div><dt>Формат</dt><dd>Повний текст роботи</dd></div>
              <div><dt>Навігація</dt><dd>Програма · Рік · Автор</dd></div>
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
          <p>У каталозі публікуються надані факультетом кваліфікаційні роботи. Дані про автора, програму та рік допомагають швидко знайти потрібне дослідження та коректно його цитувати.</p>
        </div>
      </div>
    </section>
    <SiteFooter />
  </main>;
}
