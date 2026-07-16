#!/usr/bin/env python3
"""Transform recovered APSVT pages into design-matched static materials."""

from __future__ import annotations

import html
import json
import re
import shutil
from pathlib import Path

from bs4 import BeautifulSoup, Comment, NavigableString


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT.parent / "apsvt-awwwards"
SOURCE_PAGES = SOURCE_ROOT / "content" / "pages"
SOURCE_DOCUMENTS = SOURCE_ROOT / "documents"
OUTPUT_PAGES = ROOT / "public" / "materials"
OUTPUT_DOCUMENTS = ROOT / "public" / "documents"
OUTPUT_INDEX = ROOT / "public" / "materials-index.json"


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def clean_body(legacy, title: str) -> tuple[str, str]:
    candidate = None
    for selector in (
        ".field-name-body .field-item",
        ".full-article .content",
        ".node .content",
        "article .content",
    ):
        node = legacy.select_one(selector)
        if node and len(clean_text(node.get_text(" ", strip=True))) > 30:
            candidate = node
            break
    if candidate is None:
        candidate = legacy.body or legacy

    for selector in ("script", "style", "form", "nav", ".links", ".tabs", ".breadcrumb", ".print-link", ".sharethis-wrapper", ".downloads", ".download-list", ".b-related-page-item", "#gtx-trans"):
        for node in candidate.select(selector):
            node.decompose()
    for comment in candidate.find_all(string=lambda value: isinstance(value, Comment)):
        comment.extract()
    for image in list(candidate.select("img")):
        source = image.get("src", "").strip()
        if not source or source == "#asset-pending":
            image.decompose()
    for anchor in list(candidate.select("a")):
        label = clean_text(anchor.get_text(" ", strip=True))
        if re.match(r"^(TXT|PDF|DOCX?|XLSX?)\s*·", label, re.I) or label in {"Завантажити", "Продивитись", "Переглянути"}:
            anchor.decompose()
        else:
            anchor.unwrap()
    for node in list(candidate.find_all(["h2", "h3", "h4", "p"])):
        label = clean_text(node.get_text(" ", strip=True)).strip("*_ ").upper()
        if label in {"ДОКУМЕНТИ ДО МАТЕРІАЛУ", "ЗАВАНТАЖЕННЯ", "ДОДАТОК РОЗМІР ЗАВАНТАЖИТИ ПРОДИВИТИСЬ"}:
            node.decompose()
    for value in list(candidate.find_all(string=True)):
        if isinstance(value, NavigableString):
            cleaned = re.sub(r"@@HTML\d+@@", "", str(value)).replace("**", "")
            if cleaned != str(value):
                value.replace_with(cleaned)
    for node in list(candidate.select("p")):
        if not clean_text(node.get_text(" ", strip=True)).strip("*_") and not node.select_one("a[href]"):
            node.decompose()

    text = clean_text(candidate.get_text(" ", strip=True))
    if text.lower().startswith(title.lower()):
        text = text[len(title):].strip()
    summary = text[:300] + ("…" if len(text) > 300 else "")
    return str(candidate), summary


def page_shell(title: str, category: str, date: str, body: str, filename: str) -> str:
    safe_title = html.escape(title)
    safe_category = html.escape(category)
    safe_date = html.escape(date or "Матеріал Академії")
    return f'''<!doctype html>
<html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{safe_title} · АПСВТ</title><meta name="description" content="{safe_category}: {safe_title}"><link rel="stylesheet" href="/materials.css"></head>
<body><header><div class="wrap topbar"><a class="brand" href="/"><span class="mark"><i>А</i></span><span>Академія праці,<br>соціальних відносин і туризму<em>Київ · засновано 1993</em></span></a><nav><a href="/about">Академія</a><a href="/programs">Програми</a><a href="/admissions">Вступ</a><a href="/news">Новини</a><a class="active" href="/materials">Матеріали</a><a href="/contacts">Контакти</a></nav></div></header>
<main><section class="hero"><div class="wrap"><div class="crumb">Матеріали / {safe_category}</div><h1>{safe_title}</h1><div class="meta"><span>{safe_date}</span><span>Офіційний матеріал АПСВТ</span></div></div></section><div class="rule"></div><article class="wrap article"><a class="back" href="/materials">← Усі матеріали</a><div class="archive-label">Повний текст матеріалу</div><div class="content">{body}</div></article></main>
<footer><div class="wrap"><b>АПСВТ · Київ</b><a href="/">Головна</a><a href="/materials">Матеріали</a><span>© 1993–2026</span></div></footer></body></html>'''


def main() -> None:
    OUTPUT_PAGES.mkdir(parents=True, exist_ok=True)
    OUTPUT_DOCUMENTS.mkdir(parents=True, exist_ok=True)
    items: list[dict[str, str]] = []

    for source in sorted(SOURCE_PAGES.glob("*.html")):
        raw = source.read_text("utf-8", errors="replace")
        soup = BeautifulSoup(raw, "lxml")
        legacy = soup.select_one(".legacy-body")
        if legacy is None:
            continue
        title_node = soup.select_one(".article-hero h1")
        if title_node is None:
            continue
        title = clean_text(title_node.get_text(" ", strip=True))
        crumb = clean_text((soup.select_one(".article-hero .crumb") or title_node).get_text(" ", strip=True))
        category = crumb.split("·", 1)[0].strip() or "Матеріали Академії"
        meta = soup.select_one(".article-hero .meta span")
        date = clean_text(meta.get_text(" ", strip=True)) if meta else ""
        body, summary = clean_body(legacy, title)
        target = OUTPUT_PAGES / source.name
        rendered = re.sub(r"[ \t]+\n", "\n", page_shell(title, category, date, body, source.name))
        target.write_text(rendered, "utf-8")
        items.append({
            "title": title,
            "category": category,
            "date": date,
            "summary": summary or "Офіційний матеріал Академії.",
            "href": f"/materials/{source.name}",
            "type": "page",
        })

    document_count = 0
    for source in sorted(SOURCE_DOCUMENTS.glob("*")):
        if not source.is_file():
            continue
        shutil.copy2(source, OUTPUT_DOCUMENTS / source.name)
        document_count += 1

    OUTPUT_INDEX.write_text(json.dumps(items, ensure_ascii=False, separators=(",", ":")), "utf-8")
    print(json.dumps({"pages": len(items), "documents": document_count}, ensure_ascii=False))


if __name__ == "__main__":
    main()
