"use client";

import { useMemo, useState } from "react";

export type LibraryBook = { title: string; author: string; year: string; topic: string; type: string; code: string; status: string };

const defaultBooks: LibraryBook[] = [
  { title: "Конституційне право України", author: "О. В. Совгиря, Н. Г. Шукліна", year: "2023", topic: "Право", type: "Підручник", code: "342(477) С56", status: "Доступна" },
  { title: "Цивільне право України", author: "Р. А. Майданик, Ю. О. Заіка", year: "2022", topic: "Право", type: "Підручник", code: "347(477) Ц58", status: "У читальній залі" },
  { title: "Менеджмент", author: "В. Г. Федоренко", year: "2021", topic: "Менеджмент", type: "Навчальний посібник", code: "005 Ф33", status: "Доступна" },
  { title: "Стратегічне управління", author: "З. Є. Шершньова", year: "2020", topic: "Менеджмент", type: "Підручник", code: "005.21 Ш50", status: "На руках" },
  { title: "Економіка праці та соціально-трудові відносини", author: "А. М. Колот", year: "2021", topic: "Економіка", type: "Підручник", code: "331 К61", status: "Доступна" },
  { title: "Соціальна політика", author: "О. М. Палій", year: "2020", topic: "Соціальна робота", type: "Навчальний посібник", code: "304 П14", status: "Доступна" },
  { title: "Психологія особистості", author: "П. П. Горностай", year: "2021", topic: "Психологія", type: "Посібник", code: "159.923 Г69", status: "У читальній залі" },
  { title: "Основи психологічного консультування", author: "В. Г. Панок", year: "2019", topic: "Психологія", type: "Практикум", code: "159.9 П16", status: "Доступна" },
  { title: "Організація туристичних подорожей", author: "І. М. Писаревський", year: "2020", topic: "Туризм", type: "Навчальний посібник", code: "338.48 П34", status: "Доступна" },
  { title: "Маркетинг туристичних дестинацій", author: "Н. В. Корж", year: "2022", topic: "Туризм", type: "Монографія", code: "338.48 К66", status: "На руках" },
  { title: "Публічне управління та адміністрування", author: "В. Д. Бакуменко", year: "2021", topic: "Публічне управління", type: "Підручник", code: "351 Б19", status: "Доступна" },
  { title: "Соціологія", author: "Н. П. Осипова", year: "2020", topic: "Соціальні науки", type: "Підручник", code: "316 О-74", status: "Доступна" },
  { title: "Методологія та організація наукових досліджень", author: "І. С. Добронравова", year: "2021", topic: "Наука", type: "Навчальний посібник", code: "001.8 Д56", status: "У читальній залі" },
  { title: "Академічне письмо", author: "Т. В. Яхонтова", year: "2022", topic: "Наука", type: "Посібник", code: "001.81 Я90", status: "Доступна" },
];

export function BookCatalogue({ language = "uk", books = defaultBooks }: { language?: "uk" | "en"; books?: LibraryBook[] }) {
  const english = language === "en";
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("Усі напрями");
  const [availableOnly, setAvailableOnly] = useState(false);
  const topics = ["Усі напрями", ...Array.from(new Set(books.map((book) => book.topic)))];
  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("uk");
    return books.filter((book) => {
      const searchable = `${book.title} ${book.author} ${book.topic} ${book.code}`.toLocaleLowerCase("uk");
      return (!needle || searchable.includes(needle)) && (topic === "Усі напрями" || book.topic === topic) && (!availableOnly || book.status === "Доступна");
    });
  }, [query, topic, availableOnly]);

  const topicLabel = (value: string) => english ? ({"Усі напрями":"All subjects","Право":"Law","Менеджмент":"Management","Економіка":"Economics","Соціальна робота":"Social Work","Психологія":"Psychology","Туризм":"Tourism","Публічне управління":"Public Administration","Соціальні науки":"Social Sciences","Наука":"Research"}[value] || value) : value;
  const typeLabel = (value: string) => english ? ({"Підручник":"Textbook","Навчальний посібник":"Study guide","Посібник":"Guide","Практикум":"Practical workbook","Монографія":"Monograph"}[value] || value) : value;
  const statusLabel = (value: string) => english ? ({"Доступна":"Available","У читальній залі":"Reading room","На руках":"On loan"}[value] || value) : value;

  return <div className="book-catalogue">
    <div className="catalogue-controls">
      <label className="catalogue-search"><span>{english ? "Search the catalogue" : "Пошук у каталозі"}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={english ? "Title, author, subject or shelfmark" : "Назва, автор, тема або шифр"} type="search" /></label>
      <label><span>{english ? "Subject" : "Напрям"}</span><select value={topic} onChange={(event) => setTopic(event.target.value)}>{topics.map((item) => <option key={item} value={item}>{topicLabel(item)}</option>)}</select></label>
      <label className="available-check"><input checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} type="checkbox" /><span>{english ? "Available now" : "Тільки доступні"}</span></label>
    </div>
    {results.length ? <div className="book-grid">{results.map((book, index) => <article className="book-card" key={`${book.code}-${book.title}`}>
      <div className={`book-cover tone-${index % 4}`} aria-hidden="true"><small>{english ? "APSVT · LIBRARY" : "АПСВТ · БІБЛІОТЕКА"}</small><b>{book.title}</b><i>{book.year}</i></div>
      <div className="book-info"><span>{topicLabel(book.topic)} · {typeLabel(book.type)}</span><h3>{book.title}</h3><p>{book.author}</p><dl><div><dt>{english ? "Year" : "Рік"}</dt><dd>{book.year}</dd></div><div><dt>{english ? "Shelfmark" : "Шифр"}</dt><dd>{book.code}</dd></div></dl><strong className={book.status === "Доступна" ? "available" : ""}>{statusLabel(book.status)}</strong></div>
    </article>)}</div> : <div className="catalogue-empty"><b>{english ? "No results" : "Нічого не знайдено"}</b><p>{english ? "Try a shorter title, an author surname or another subject." : "Спробуйте коротшу назву, прізвище автора або інший напрям."}</p></div>}
  </div>;
}
