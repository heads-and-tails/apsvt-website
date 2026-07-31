import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { academyDriveCollections } from "@/lib/academy-resources";
import { GraduationGallery } from "./GraduationGallery";

export const metadata: Metadata = {
  title: "Свято вручення дипломів 2026",
  description: "Фотогалерея свята вручення дипломів випускникам Академії у 2026 році.",
};

export default function Page() {
  return <main id="top"><SiteHeader />
    <section className="graduation-hero"><div className="wrap"><div className="crumb">Головна / Події / Вручення дипломів</div><div className="graduation-hero-title"><div><span>Літо · 2026</span><h1>Диплом —<br /><em>і далі.</em></h1></div><p>Свято вручення дипломів — мить, коли роки навчання стають новим початком. Зібрали пам’ятні кадри випускників, викладачів, рідних і друзів Академії.</p></div></div></section><div className="phero-rule" />
    <section className="graduation-intro"><div className="wrap"><div><div className="idx">01 / Випуск 2026</div><h2>Свято спільноти Академії</h2></div><div><p className="resource-lede">Диплом засвідчує освітній результат, але головне залишається з людиною: знання, професійна впевненість, дружба й досвід спільної роботи.</p><p>Натисніть на фотографію, щоб відкрити її у великому форматі. Повний архів містить додаткові фото та відео.</p></div></div></section>
    <section className="graduation-gallery-section"><div className="wrap"><div className="resource-section-head"><div><div className="idx">02 / Фотогалерея</div><h2>Моменти свята</h2></div><p>Добірка з офіційної фото- й відеоколекції Академії.</p></div><GraduationGallery /></div></section>
    <section className="graduation-archive"><div className="wrap"><div><span>Повна колекція</span><h2>Більше фотографій і відео</h2><p>У вихідній папці збережено повний архів матеріалів зі свята вручення дипломів.</p></div><a href={academyDriveCollections.graduationPhotos} target="_blank" rel="noreferrer"><b>Google Drive</b><span>Фото · відео</span><strong>Відкрити повний архів ↗</strong></a></div></section>
    <SiteFooter />
  </main>;
}
