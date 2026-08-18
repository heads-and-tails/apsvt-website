"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { siteSearchItems } from "@/lib/site-search";

type SiteSearchProps = {
  open: boolean;
  onClose: () => void;
  english?: boolean;
};

const normalise = (value: string) => value.toLocaleLowerCase("uk-UA").replace(/[’'`]/g, "").trim();

function scoreItem(query: string, title: string, description: string, keywords = "") {
  const words = normalise(query).split(/\s+/).filter(Boolean);
  const normalTitle = normalise(title);
  const haystack = `${normalTitle} ${normalise(description)} ${normalise(keywords)}`;
  if (!words.every((word) => haystack.includes(word))) return -1;

  let score = 0;
  for (const word of words) {
    if (normalTitle.startsWith(word)) score += 8;
    else if (normalTitle.includes(word)) score += 5;
    else score += 2;
  }
  return score;
}

export function SiteSearch({ open, onClose, english = false }: SiteSearchProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const results = useMemo(() => {
    if (!deferredQuery.trim()) return siteSearchItems.slice(0, 6);
    return siteSearchItems
      .map((item) => ({ item, score: scoreItem(deferredQuery, item.title, item.description, item.keywords) }))
      .filter(({ score }) => score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(({ item }) => item);
  }, [deferredQuery]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "Tab" && event.shiftKey && document.activeElement === inputRef.current) {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const hasQuery = Boolean(query.trim());
  return <div className="site-search-overlay" role="presentation" onMouseDown={(event) => {
    if (event.currentTarget === event.target) onClose();
  }}>
    <section className="site-search-dialog" role="dialog" aria-modal="true" aria-labelledby="site-search-title">
      <header>
        <div><span>{english ? "Search" : "Пошук по сайту"}</span><h2 id="site-search-title">{english ? "What are you looking for?" : "Що ви шукаєте?"}</h2></div>
        <button ref={closeButtonRef} type="button" onClick={onClose} aria-label={english ? "Close search" : "Закрити пошук"}>×</button>
      </header>
      <label className="site-search-field">
        <span className="site-search-icon" aria-hidden="true">⌕</span>
        <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={english ? "Programme, department, document…" : "Програма, кафедра, документ…"} autoComplete="off" />
        <kbd>ESC</kbd>
      </label>
      <div className="site-search-meta" aria-live="polite">
        <span>{hasQuery ? `${results.length} ${results.length === 1 ? "результат" : "результатів"}` : "Популярні розділи"}</span>
        <small>{english ? "Search currently covers Ukrainian pages" : "Введіть кілька слів — наприклад «кафедра права»"}</small>
      </div>
      {results.length > 0 ? <div className="site-search-results">
        {results.map((item, index) => <Link href={item.href} onClick={onClose} key={`${item.href}-${item.title}`}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div><small>{item.category}</small><h3>{item.title}</h3><p>{item.description}</p></div>
          <b aria-hidden="true">→</b>
        </Link>)}
      </div> : <div className="site-search-empty"><b>Нічого не знайдено</b><p>Спробуйте коротший запит або перейдіть до каталогу <Link href="/programs" onClick={onClose}>освітніх програм</Link>.</p></div>}
    </section>
  </div>;
}
