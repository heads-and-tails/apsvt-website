import { readFile, writeFile } from "node:fs/promises";
import { officialDocuments } from "../lib/official-documents.ts";
import admissionIndex from "../lib/admissions-rag-index.json" with { type: "json" };

const outputPath = process.argv[2] || "lib/documents-rag-index.json";

function clean(value) {
  return value
    .replace(/^Title:.*?^Markdown Content:\s*/ms, "")
    .replace(/^#+\s*/gm, "")
    .replace(/^>\s*/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\|/g, " ")
    .replace(/\u00ad/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function chunks(text, size = 1700, overlap = 260) {
  const result = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(text.length, start + size);
    if (end < text.length) {
      const boundary = Math.max(
        text.lastIndexOf("\n\n", end),
        text.lastIndexOf(". ", end),
        text.lastIndexOf("; ", end),
      );
      if (boundary > start + size * 0.58) end = boundary + 1;
    }
    const value = text.slice(start, end).trim();
    if (value.length >= 80) result.push(value);
    if (end >= text.length) break;
    start = Math.max(start + 1, end - overlap);
  }
  return result;
}

const pages = admissionIndex.pages.map((page) => ({
  ...page,
  category: "admissions",
  kind: "page",
}));

for (const document of officialDocuments) {
  if (document.admissionFile) continue;

  let text = `${document.title}. ${document.description}`;
  if (document.indexFile) {
    text = clean(await readFile(`public/documents/${document.indexFile}`, "utf8"));
  }

  const documentChunks = chunks(text);
  documentChunks.forEach((chunk, index) => {
    pages.push({
      id: `${document.id}-c${index + 1}`,
      file: document.indexFile || document.id,
      documentId: document.id,
      category: document.category,
      title: document.title,
      page: null,
      href: document.href,
      text: chunk,
      kind: "chunk",
    });
  });
}

await writeFile(outputPath, `${JSON.stringify({
  version: 1,
  generatedAt: new Date().toISOString(),
  documents: officialDocuments.length,
  chunks: pages.length,
  pages,
}, null, 2)}\n`);

console.log(`Indexed ${officialDocuments.length} documents into ${pages.length} searchable passages.`);
