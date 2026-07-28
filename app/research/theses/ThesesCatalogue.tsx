"use client";

import { useMemo, useState } from "react";
import type { PublicContentItem } from "@/lib/content";

const all = "Усі";

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "uk"));
}

function normalized(value: string): string {
  return value.trim().toLocaleLowerCase("uk");
}

export function ThesesCatalogue({ items }: { items: PublicContentItem[] }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState(all);
  const [program, setProgram] = useState(all);
  const [year, setYear] = useState(all);
  const [supervisor, setSupervisor] = useState(all);

  const levels = useMemo(() => unique(items.map((item) => item.payload.level)), [items]);
  const programs = useMemo(() => unique(items.map((item) => item.payload.program)), [items]);
  const years = useMemo(() => unique(items.map((item) => item.payload.year)).sort((a, b) => b.localeCompare(a, "uk", { numeric: true })), [items]);
  const supervisors = useMemo(() => unique(items.map((item) => item.payload.supervisor)), [items]);

  const filtered = useMemo(() => {
    const search = normalized(query);
    return items.filter(({ payload }) => {
      const matchesQuery = !search || normalized([
        payload.title,
        payload.student,
        payload.program,
        payload.supervisor,
        payload.abstract,
        payload.keywords,
      ].filter(Boolean).join(" ")).includes(search);
      return matchesQuery
        && (level === all || payload.level === level)
        && (program === all || payload.program === program)
        && (year === all || payload.year === year)
        && (supervisor === all || payload.supervisor === supervisor);
    });
  }, [items, level, program, query, supervisor, year]);

  const hasFilters = query || level !== all || program !== all || year !== all || supervisor !== all;
  const reset = () => {
    setQuery(""); setLevel(all); setProgram(all); setYear(all); setSupervisor(all);
  };

  return <section className="theses-catalogue" id="catalogue">
    <div className="wrap">
      <header className="theses-catalogue-head">
        <div><span>01 / Каталог</span><h2>Знайдіть роботу</h2></div>
        <p>Шукайте за прізвищем студента, темою або керівником та уточнюйте результати за рівнем освіти, програмою і роком захисту.</p>
      </header>

      <div className="theses-filters">
        <label className="theses-search"><span>Пошук</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Тема, студент, ключове слово…" /></label>
        <label><span>Рівень</span><select value={level} onChange={(event) => setLevel(event.target.value)}><option>{all}</option>{levels.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span>Програма</span><select value={program} onChange={(event) => setProgram(event.target.value)}><option>{all}</option>{programs.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span>Рік</span><select value={year} onChange={(event) => setYear(event.target.value)}><option>{all}</option>{years.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span>Керівник</span><select value={supervisor} onChange={(event) => setSupervisor(event.target.value)}><option>{all}</option>{supervisors.map((value) => <option key={value}>{value}</option>)}</select></label>
        <div className="theses-filter-result"><b>{filtered.length}</b><span>знайдено</span>{hasFilters && <button type="button" onClick={reset}>Скинути</button>}</div>
      </div>

      {filtered.length > 0 ? <div className="theses-list">
        {filtered.map(({ id, payload }, index) => <article className="thesis-card" key={id}>
          <span className="thesis-number">{String(index + 1).padStart(2, "0")}</span>
          <div className="thesis-main">
            <div className="thesis-meta"><span>{payload.level}</span><span>{payload.program}</span><span>{payload.year}</span></div>
            <h3>{payload.title}</h3>
            <p>{payload.abstract}</p>
            {payload.keywords && <small>Ключові слова: {payload.keywords}</small>}
          </div>
          <dl className="thesis-people">
            <div><dt>Автор</dt><dd>{payload.student}</dd></div>
            <div><dt>Науковий керівник</dt><dd>{payload.supervisor}</dd></div>
          </dl>
          <a className="thesis-open" href={payload.fileUrl} target="_blank" rel="noreferrer"><span>Відкрити роботу</span><b>↗</b></a>
        </article>)}
      </div> : <div className="theses-empty">
        <span>АП</span>
        <div>
          <h3>{items.length === 0 ? "Архів готовий до наповнення" : "За цими параметрами робіт немає"}</h3>
          <p>{items.length === 0 ? "Кваліфікаційні роботи з’являться тут після публікації через редакційну панель Академії." : "Спробуйте змінити програму, рік або пошуковий запит."}</p>
          {hasFilters && <button type="button" onClick={reset}>Показати всі роботи</button>}
        </div>
      </div>}
    </div>
  </section>;
}
