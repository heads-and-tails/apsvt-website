"use client";

import { useMemo, useState } from "react";

const books = [
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

export function BookCatalogue() {
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

  return <div className="book-catalogue">
    <div className="catalogue-controls">
      <label className="catalogue-search"><span>Пошук у каталозі</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Назва, автор, тема або шифр" type="search" /></label>
      <label><span>Напрям</span><select value={topic} onChange={(event) => setTopic(event.target.value)}>{topics.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="available-check"><input checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} type="checkbox" /><span>Тільки доступні</span></label>
    </div>
    <div className="catalogue-result"><b>{results.length}</b> видань знайдено <span>· демонстраційний фрагмент електронного каталогу</span></div>
    {results.length ? <div className="book-grid">{results.map((book, index) => <article className="book-card" key={`${book.code}-${book.title}`}>
      <div className={`book-cover tone-${index % 4}`} aria-hidden="true"><small>АПСВТ · БІБЛІОТЕКА</small><b>{book.title}</b><i>{book.year}</i></div>
      <div className="book-info"><span>{book.topic} · {book.type}</span><h3>{book.title}</h3><p>{book.author}</p><dl><div><dt>Рік</dt><dd>{book.year}</dd></div><div><dt>Шифр</dt><dd>{book.code}</dd></div></dl><strong className={book.status === "Доступна" ? "available" : ""}>{book.status}</strong></div>
    </article>)}</div> : <div className="catalogue-empty"><b>Нічого не знайдено</b><p>Спробуйте коротшу назву, прізвище автора або інший напрям.</p></div>}
  </div>;
}
