import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { FeedbackForm } from "./FeedbackForm";

export const metadata: Metadata = { title: "Форма зворотного зв’язку", description: "Надішліть звернення Академії праці, соціальних відносин і туризму." };

export default function FeedbackPage() {
  return <main id="top"><SiteHeader englishHref="/en/contacts" />
    <section className="phero"><div className="wrap"><div className="crumb"><Link href="/">Головна</Link> / <Link href="/contacts">Контакти</Link> / Зворотний зв’язок</div><h1>Зворотний<br />зв’язок</h1><p className="lead">Поставте запитання або надішліть пропозицію. Повідомлення отримає загальна поштова скринька Академії.</p></div></section><div className="phero-rule" />
    <section className="feedback-section"><div className="wrap feedback-layout"><div><div className="idx">Написати Академії</div><h2>Ваше звернення</h2><p>Заповніть форму, і ми зможемо відповісти на вказану вами адресу.</p><p>Для питань вступу також можна звернутися до <a href="mailto:pk@socosvita.kiev.ua">приймальної комісії</a>.</p><p>Повідомлення передається на пошту Академії через сервіс FormSubmit. Якщо не бажаєте користуватися формою, напишіть безпосередньо на <a href="mailto:info@socosvita.kiev.ua">info@socosvita.kiev.ua</a>.</p></div><FeedbackForm /></div></section>
    <SiteFooter /></main>;
}
