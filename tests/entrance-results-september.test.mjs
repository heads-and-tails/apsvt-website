import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const source = readFileSync(new URL("../lib/entrance-results.ts", import.meta.url), "utf8");
const component = readFileSync(new URL("../app/admissions/EntranceExamResults.tsx", import.meta.url), "utf8");
const links = [...source.matchAll(/href: "(\/documents\/admissions\/results\/2026-09-09\/[^\"]+)"/g)].map((match) => match[1]);

test("September 9 includes five first-year and four NRK6/NRK7 original PDFs", () => {
  assert.equal(links.length, 9);
  assert.equal(new Set(links).size, 9);
  assert.equal(links.filter((link) => link.includes("/first-year/")).length, 5);
  assert.equal(links.filter((link) => link.includes("/nrk6-nrk7/")).length, 4);
  for (const link of links) {
    const path = new URL(`../public${link}`, import.meta.url);
    assert.equal(readFileSync(path).subarray(0, 5).toString(), "%PDF-");
    const metadata = execFileSync("pdfinfo", [path.pathname], { encoding: "utf8" });
    assert.match(metadata, /Pages:\s+1\b/);
  }
});

test("September result date and basis folders stay collapsed by default", () => {
  const block = component.slice(component.indexOf("function SeptemberResults"), component.indexOf("function ResultBatch"));
  assert.match(block, /Результати вступних випробувань від 9 вересня 2026 року/);
  assert.match(block, /Основа вступу — НРК6 або НРК7/);
  assert.equal((block.match(/<details\b/g) || []).length, 2);
  assert.doesNotMatch(block, /<details[^>]*\bopen\b/);
  assert.match(component, /<SeptemberResults \/>/);
});
