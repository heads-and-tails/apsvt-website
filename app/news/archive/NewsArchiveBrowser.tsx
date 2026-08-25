"use client";

import { useEffect, useMemo, useState } from "react";

type SourceItem = {
  title: string;
  category: string;
  date: string;
  summary: string;
  href: string;
};

type ArchiveItem = SourceItem & {
  archiveDate: Date | null;
  archiveDateLabel: string;
  archiveYear: string;
};

const ARCHIVE_CATEGORY = "Новини та події";

function readArchiveDate(item: SourceItem): Pick<ArchiveItem, "archiveDate" | "archiveDateLabel" | "archiveYear"> {
  const match = `${item.date} ${item.summary}`.match(/\b(\d{1,2})[.\/-](\d{1,2})[.\/-]((?:19|20)\d{2})(?:\s*[-–]\s*(\d{1,2}):(\d{2}))?/);
  if (!match) return { archiveDate: null, archiveDateLabel: "Дата не збереглася", archiveYear: "Без дати" };

  const [, rawDay, rawMonth, year, rawHour = "12", rawMinute = "00"] = match;
  const day = Number(rawDay);
  const month = Number(rawMonth);
  const hour = Number(rawHour);
  const minute = Number(rawMinute);
  const archiveDate = new Date(Number(year), month - 1, day, hour, minute);
  if (Number.isNaN(archiveDate.getTime()) || archiveDate.getFullYear() !== Number(year) || archiveDate.getMonth() !== month - 1 || archiveDate.getDate() !== day) {
    return { archiveDate: null, archiveDateLabel: "Дата не збереглася", archiveYear: "Без дати" };
  }

  return {
    archiveDate,
    archiveDateLabel: `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`,
    archiveYear: year,
  };
}

function excerpt(value: string) {
  const cleaned = value.replace(/^Головна\s*/i, "").replace(/\s+/g, " ").trim();
  return cleaned.length > 280 ? `${cleaned.slice(0, 279).trimEnd()}…` : cleaned;
}

export function NewsArchiveBrowser() {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("Усі роки");
  const [limit, setLimit] = useState(48);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/materials-index.json")
      .then((response) => {
        if (!response.ok) throw new Error("Archive index is unavailable");
        return response.json() as Promise<SourceItem[]>;
      })
      .then((records) => records
        .filter((item) => item.category === ARCHIVE_CATEGORY)
        .map((item) => ({ ...item, ...readArchiveDate(item) }))
        .sort((left, right) => {
          const leftTime = left.archiveDate?.getTime() ?? Number.NEGATIVE_INFINITY;
          const rightTime = right.archiveDate?.getTime() ?? Number.NEGATIVE_INFINITY;
          return rightTime - leftTime || left.title.localeCompare(right.title, "uk");
        }))
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const years = useMemo(() => {
    const dated = Array.from(new Set(items.map((item) => item.archiveYear).filter((value) => value !== "Без дати")))
      .sort((left, right) => Number(right) - Number(left));
    return ["Усі роки", ...dated, "Без дати"];
  }, [items]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("uk");
    return items.filter((item) => {
      const matchesYear = year === "Усі роки" || item.archiveYear === year;
      const matchesQuery = !needle || `${item.title} ${item.summary}`.toLocaleLowerCase("uk").includes(needle);
      return matchesYear && matchesQuery;
    });
  }, [items, query, year]);

  const resetLimit = () => setLimit(48);

  return <div className="materials-browser news-archive-browser">
    <div className="news-archive-stats" aria-label="Склад архіву">
      <div><b>{loading ? "…" : items.length}</b><span>матеріалів старої версії</span></div>
      <div><b>{loading ? "…" : items.filter((item) => item.archiveDate).length}</b><span>матеріалів зі збереженою датою</span></div>
      <div><b>05·2026</b><span>стан збереженої копії</span></div>
    </div>

    <div className="material-controls">
      <label>Пошук в архіві
        <input value={query} onChange={(event) => { setQuery(event.target.value); resetLimit(); }} placeholder="Назва, подія, людина або тема" />
      </label>
      <label>Рік публікації
        <select value={year} onChange={(event) => { setYear(event.target.value); resetLimit(); }}>
          {years.map((value) => <option value={value} key={value}>{value}</option>)}
        </select>
      </label>
    </div>

    <p className="material-count" aria-live="polite">
      {loading ? "Завантажуємо архів…" : `Знайдено: ${filtered.length} · Показано: ${Math.min(limit, filtered.length)}`}
    </p>

    {!loading && filtered.length === 0 && <div className="news-archive-empty"><b>Матеріалів не знайдено</b><p>Змініть пошуковий запит або оберіть інший рік.</p></div>}

    <div className="material-grid">{filtered.slice(0, limit).map((item, index) => <a href={item.href} className="material-card" key={item.href}>
      <span>{String(index + 1).padStart(3, "0")}</span>
      <div>
        <small>{item.archiveDateLabel} · Архів новин</small>
        <h2>{item.title}</h2>
        <p>{excerpt(item.summary) || "Повний текст матеріалу з архівної версії сайту Академії."}</p>
      </div>
      <b aria-hidden="true">→</b>
    </a>)}</div>

    {limit < filtered.length && <button className="load-more" type="button" onClick={() => setLimit((value) => value + 48)}>Показати ще</button>}
  </div>;
}
