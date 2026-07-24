"use client";

import type { MouseEvent } from "react";
import {
  documentCategories,
  type DocumentCategoryId,
} from "@/lib/official-documents";

export const DOCUMENTS_SECTION_EVENT = "apsvt:documents-section";

export function DocumentsMap() {
  function openSection(event: MouseEvent<HTMLAnchorElement>, category: DocumentCategoryId) {
    event.preventDefault();
    window.history.replaceState(null, "", `#${category}`);
    window.dispatchEvent(new CustomEvent(DOCUMENTS_SECTION_EVENT, { detail: category }));
  }

  return <section className="documents-map"><div className="wrap">
    <div className="documents-map-head"><div className="idx">01 / Структура</div><h2>Оберіть напрям</h2></div>
    <div className="documents-map-grid">
      {documentCategories.map((category) => <a href={`#${category.id}`} onClick={(event) => openSection(event, category.id)} key={category.id}>
        <span>{category.number}</span>
        <div><b>{category.title}</b><p>{category.description}</p></div>
        <i aria-hidden="true">↓</i>
      </a>)}
    </div>
  </div></section>;
}
