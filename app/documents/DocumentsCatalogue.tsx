"use client";

import { useEffect, useMemo, useState } from "react";
import {
  documentCategories,
  officialDocuments,
  type DocumentCategoryId,
} from "@/lib/official-documents";
import { DOCUMENTS_SECTION_EVENT } from "./DocumentsMap";

function normalize(value: string) {
  return value.toLocaleLowerCase("uk-UA").replace(/[’'`ʼ]/g, "").trim();
}

export function DocumentsCatalogue() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | DocumentCategoryId>("all");
  const [pendingSection, setPendingSection] = useState<DocumentCategoryId | null>(null);

  useEffect(() => {
    function revealSection(event: Event) {
      const selected = (event as CustomEvent<DocumentCategoryId>).detail;
      if (!documentCategories.some((item) => item.id === selected)) return;
      setQuery("");
      setCategory(selected);
      setPendingSection(selected);
    }

    window.addEventListener(DOCUMENTS_SECTION_EVENT, revealSection);
    return () => window.removeEventListener(DOCUMENTS_SECTION_EVENT, revealSection);
  }, []);

  const groups = useMemo(() => {
    const needle = normalize(query);
    return documentCategories.map((item) => ({
      ...item,
      documents: officialDocuments.filter((document) => {
        if (document.category !== item.id) return false;
        if (category !== "all" && document.category !== category) return false;
        if (!needle) return true;
        return normalize(`${document.title} ${document.description} ${document.format} ${document.updated || ""}`).includes(needle);
      }),
    })).filter((item) => item.documents.length > 0);
  }, [category, query]);

  const count = groups.reduce((sum, group) => sum + group.documents.length, 0);

  useEffect(() => {
    if (!pendingSection) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(pendingSection)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setPendingSection(null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [groups, pendingSection]);

  return <section className="documents-catalogue" id="catalogue"><div className="wrap">
    <div className="documents-catalogue-head documents-catalogue-head-simple">
      <div><div className="idx">02 / Каталог</div><h2>Знайдіть потрібне<br />без пошуку навмання</h2></div>
    </div>

    <div className="documents-controls">
      <label>
        <span>Пошук за назвою або темою</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Наприклад: апеляція, плагіат, переведення…" />
      </label>
      <div className="documents-filter" role="group" aria-label="Категорії документів">
        <button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")} type="button">Усі</button>
        {documentCategories.map((item) => <button className={category === item.id ? "active" : ""} onClick={() => setCategory(item.id)} type="button" key={item.id}>{item.title}</button>)}
      </div>
      <div className="documents-result-count"><b>{count}</b><span>{count === 1 ? "документ" : count < 5 ? "документи" : "документів"} у добірці</span></div>
    </div>

    {groups.length > 0 ? <div className="documents-groups">
      {groups.map((group) => <section className="documents-group" id={group.id} key={group.id}>
        <header>
          <span>{group.number}</span>
          <div><h3>{group.title}</h3><p>{group.description}</p></div>
          <b>{String(group.documents.length).padStart(2, "0")}</b>
        </header>
        <div className="documents-list">
          {group.documents.map((document, index) => {
            const external = document.href.startsWith("http");
            return <a className="document-card" href={document.href} target="_blank" rel="noreferrer" key={document.id}>
              <span className="document-card-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <div className="document-card-meta">
                  <span>{document.format}</span>
                  {document.updated && <span>{document.updated}</span>}
                  {document.pages && <span>{document.pages} {document.pages === 1 ? "сторінка" : "сторінок"}</span>}
                  {document.status === "reference" && <span>архів / довідково</span>}
                </div>
                <h4>{document.title}</h4>
                <p>{document.description}</p>
              </div>
              <span className="document-card-action">{external ? "Офіційне джерело" : "Відкрити"} <b>↗</b></span>
            </a>;
          })}
        </div>
      </section>)}
    </div> : <div className="documents-empty"><b>Нічого не знайдено</b><p>Спробуйте коротшу фразу або оберіть «Усі».</p><button type="button" onClick={() => { setQuery(""); setCategory("all"); }}>Очистити пошук</button></div>}
  </div></section>;
}
