"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

type RankingDocument = {
  title: string;
  meta: string;
  href: string;
};

type RankingRecord = {
  id: string;
  sourceIndex: number;
  sourceTitle: string;
  sourceHref: string;
  position: string;
  name: string;
  score: string;
  priority: string;
  educationScore: string;
  firstSubject: string;
  secondSubject: string;
  thirdSubject: string;
  fourthSubject: string;
  specialGrounds: string;
};

type LoadedRanking = {
  document: RankingDocument;
  sourceIndex: number;
  records: RankingRecord[];
};

function parseSemicolonCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        cell += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ";") {
      row.push(cell.trim());
      cell = "";
    } else if (character === "\n") {
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else if (character !== "\r") {
      cell += character;
    }
  }

  if (cell || row.length) {
    row.push(cell.trim());
    if (row.some(Boolean)) rows.push(row);
  }

  return rows;
}

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("uk-UA").replace(/\s+/g, " ");
}

function recordsFromCsv(text: string, document: RankingDocument, sourceIndex: number) {
  const rows = parseSemicolonCsv(text);

  return rows.slice(1).map((columns, rowIndex): RankingRecord => ({
    id: `${sourceIndex}-${rowIndex}`,
    sourceIndex,
    sourceTitle: document.title,
    sourceHref: document.href,
    position: columns[0] || "—",
    name: columns[1] || "—",
    score: columns[2] || "—",
    priority: columns[3] || "—",
    educationScore: columns[4] || "—",
    firstSubject: columns[5] || "—",
    secondSubject: columns[6] || "—",
    thirdSubject: columns[7] || "—",
    fourthSubject: columns[8] || "—",
    specialGrounds: columns[9] || "—",
  }));
}

function RankingTable({ records }: { records: RankingRecord[] }) {
  return <div className="master-ranking-table-scroll">
    <table className="master-ranking-table">
      <thead><tr>
        <th>№</th><th>Прізвище, ім’я, по батькові</th><th>Конкурсний бал</th><th>Пріоритет</th><th>Середній бал документа</th><th>1 предмет</th><th>2 предмет</th><th>3 предмет</th><th>4 предмет</th><th>Особливі підстави</th>
      </tr></thead>
      <tbody>{records.map((record) => <tr key={record.id}>
        <td>{record.position}</td><td><strong>{record.name}</strong></td><td>{record.score}</td><td>{record.priority}</td><td>{record.educationScore}</td><td>{record.firstSubject}</td><td>{record.secondSubject}</td><td>{record.thirdSubject}</td><td>{record.fourthSubject}</td><td>{record.specialGrounds}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}

export function MasterRankingsExplorer({ documents }: { documents: RankingDocument[] }) {
  const [rankings, setRankings] = useState<LoadedRanking[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    let cancelled = false;

    Promise.all(documents.map(async (document, sourceIndex) => {
      const response = await fetch(document.href);
      if (!response.ok) throw new Error(document.title);
      const text = await response.text();
      return { document, sourceIndex, records: recordsFromCsv(text, document, sourceIndex) };
    }))
      .then((loadedRankings) => {
        if (!cancelled) setRankings(loadedRankings);
      })
      .catch(() => {
        if (!cancelled) setError("Не вдалося завантажити таблиці. Спробуйте оновити сторінку.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [documents]);

  const allRecords = useMemo(() => rankings.flatMap((ranking) => ranking.records), [rankings]);
  const normalizedQuery = normalizeSearch(deferredQuery);
  const searchResults = useMemo(() => {
    if (normalizedQuery.length < 2) return [];
    return allRecords.filter((record) => normalizeSearch(record.name).includes(normalizedQuery));
  }, [allRecords, normalizedQuery]);

  const revealList = (sourceIndex: number) => {
    const list = document.getElementById(`master-ranking-list-${sourceIndex + 1}`);
    if (list instanceof HTMLDetailsElement) list.open = true;
  };

  return <div className="master-ranking-explorer">
    <section className="master-ranking-search" aria-labelledby="master-ranking-search-title">
      <div><span>Швидкий пошук</span><h4 id="master-ranking-search-title">Знайдіть себе у списках</h4><p>Введіть прізвище, ім’я або по батькові — пошук одночасно перевірить усі 26 таблиць.</p></div>
      <div className="master-ranking-search-control">
        <label htmlFor="master-ranking-name">ПІБ вступника</label>
        <input id="master-ranking-name" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Наприклад: Петренко Олена" autoComplete="name" />
        <small aria-live="polite">{loading ? "Завантажуємо рейтингові списки…" : normalizedQuery.length < 2 ? "Введіть щонайменше 2 символи" : `Знайдено: ${searchResults.length}`}</small>
      </div>
    </section>

    {error ? <p className="master-ranking-error" role="alert">{error}</p> : null}

    {!loading && normalizedQuery.length >= 2 ? <section className="master-ranking-results" aria-label="Результати пошуку">
      <header><span>Результати пошуку</span><b>{searchResults.length}</b></header>
      {searchResults.length ? <div className="master-ranking-table-scroll"><table className="master-ranking-table master-ranking-search-table">
        <thead><tr><th>Список</th><th>№</th><th>Прізвище, ім’я, по батькові</th><th>Конкурсний бал</th><th>Пріоритет</th></tr></thead>
        <tbody>{searchResults.map((record) => <tr key={`search-${record.id}`}>
          <td><a href={`#master-ranking-list-${record.sourceIndex + 1}`} onClick={() => revealList(record.sourceIndex)}>{record.sourceTitle}</a></td><td>{record.position}</td><td><strong>{record.name}</strong></td><td>{record.score}</td><td>{record.priority}</td>
        </tr>)}</tbody>
      </table></div> : <p>За цим запитом збігів немає. Перевірте написання прізвища або введіть лише його частину.</p>}
    </section> : null}

    <div className="master-ranking-list-group" aria-busy={loading}>
      {loading ? <p className="master-ranking-loading">Готуємо списки для перегляду…</p> : rankings.map((ranking) => <details className="master-ranking-list" id={`master-ranking-list-${ranking.sourceIndex + 1}`} key={ranking.document.href}>
        <summary><span>{String(ranking.sourceIndex + 1).padStart(2, "0")}</span><div><h5>{ranking.document.title}</h5><small>{ranking.records.length} записів</small></div><b>Переглянути</b><i>+</i></summary>
        <div className="master-ranking-list-body">
          <div className="master-ranking-list-actions"><p>Таблицю можна переглянути нижче або завантажити в оригінальному форматі.</p><a href={ranking.document.href} download>Завантажити CSV ↓</a></div>
          <RankingTable records={ranking.records} />
        </div>
      </details>)}
    </div>
  </div>;
}
