import type { Metadata } from "next";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { NewsArchiveBrowser } from "./NewsArchiveBrowser";

export const metadata: Metadata = {
  title: "Архів новин",
  description: "Матеріали новинної частини попередньої версії сайту АПСВТ, збереженої станом на травень 2026 року.",
};

export default function NewsArchivePage() {
  return <main id="top">
    <SiteHeader />
    <section className="phero">
      <div className="wrap">
        <div className="crumb">Головна / Новини / Архів</div>
        <h1>Архів<br />новин</h1>
        <p className="lead">Новини, оголошення та події з попередньої версії офіційного сайту Академії. Збережена копія станом на травень 2026 року.</p>
      </div>
    </section>
    <div className="phero-rule" />
    <section>
      <div className="wrap">
        <div className="deep-intro news-archive-intro">
          <div><div className="idx">Збережена історія Академії</div><h2>Повні тексти без втрати матеріалів</h2></div>
          <p>Архів відокремлений від актуальних новин, але залишається доступним для пошуку. Якщо дата публікації збереглася у старому матеріалі, її можна використати для фільтрації за роком.</p>
        </div>
        <NewsArchiveBrowser />
      </div>
    </section>
    <SiteFooter />
  </main>;
}
