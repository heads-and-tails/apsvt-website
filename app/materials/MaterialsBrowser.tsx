"use client";

import { useEffect, useMemo, useState } from "react";

type Item = { title: string; category: string; date: string; summary: string; href: string };

const VISNYK_ISSUES: Record<string, string> = {
  "/materials/visnyk-1-2-2020-50b2542a1.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_1-2_2020.pdf",
  "/materials/visnyk-3-4-2020-5ac217cef.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_3-4_2020.pdf",
  "/materials/visnyk-1-2019-e0ba72738.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_1_2019.pdf",
  "/materials/visnyk-2-2019-643fbc683.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_2_2019.pdf",
  "/materials/visnyk-3-2019-665fcaf31.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_3_2019.pdf",
  "/materials/visnyk-4-2019-012fd0cbb.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_4_2019.pdf",
  "/materials/visnyk-2-2018-c27f342ff.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_2_2018.pdf",
  "/materials/visnyk-3-2018-0ecc8ab18.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_3_2018.pdf",
  "/materials/visnyk-4-2018-d95ccb926.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_4_2018.pdf",
};

const categoryEnglish: Record<string, string> = {
  "Архів Академії": "Academy archive",
  "Новини та події": "News and events",
  "Освітні програми": "Degree programmes",
  "Документи": "Documents",
  "Наука": "Research",
};

function isVisnyk(item: Item) {
  return item.href.toLowerCase().includes("visnyk") || item.title.toLocaleLowerCase("uk").includes("вісник");
}

function resolveMaterialLink(item: Item) {
  return VISNYK_ISSUES[item.href] || item.href;
}

export function MaterialsBrowser({ language = "uk" }: { language?: "uk" | "en" }) {
  const english = language === "en";
  const [items, setItems] = useState<Item[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Усі");
  const [limit, setLimit] = useState(60);

  useEffect(() => {
    fetch("/materials-index.json").then((response) => response.json()).then(setItems).catch(() => setItems([]));
  }, []);

  const categories = useMemo(() => ["Усі", ...Array.from(new Set(items.map((item) => item.category))).sort()], [items]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("uk");
    return items.filter((item) => (category === "Усі" || item.category === category) && (!needle || `${item.title} ${item.summary} ${item.category}`.toLocaleLowerCase("uk").includes(needle)));
  }, [items, query, category]);

  const categoryLabel = (value: string) => english ? (value === "Усі" ? "All sections" : categoryEnglish[value] || value) : value;

  return <div className="materials-browser">
    <div className="material-controls">
      <label>{english ? "Search" : "Пошук"}<input value={query} onChange={(event) => { setQuery(event.target.value); setLimit(60); }} placeholder={english ? "Title, topic or word in the description" : "Назва, тема або слово у змісті"} /></label>
      <label>{english ? "Section" : "Розділ"}<select value={category} onChange={(event) => { setCategory(event.target.value); setLimit(60); }}>{categories.map((item) => <option value={item} key={item}>{categoryLabel(item)}</option>)}</select></label>
    </div>
    <div className="material-grid">{filtered.slice(0, limit).map((item, index) => {
      const href = resolveMaterialLink(item);
      const external = href.startsWith("http");
      const journal = isVisnyk(item);
      return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="material-card" key={item.href}>
        <span>{String(index + 1).padStart(3, "0")}</span>
        <div><small>{categoryLabel(item.category)}{item.date && item.date !== "Матеріал Академії" ? ` · ${item.date}` : ""}{VISNYK_ISSUES[item.href] ? (english ? " · Full issue · PDF" : " · Повний випуск · PDF") : journal ? (english ? " · Academy journal" : " · Журнал Академії") : external ? (english ? " · External resource" : " · Зовнішній ресурс") : ""}</small><h2>{item.title}</h2><p>{item.summary}</p></div>
        <b>{external ? "↗" : "→"}</b>
      </a>;
    })}</div>
    {limit < filtered.length && <button className="load-more" onClick={() => setLimit((value) => value + 60)}>{english ? "Show more" : "Показати більше"}</button>}
  </div>;
}
