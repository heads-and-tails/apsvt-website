import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../app/tuition/page.tsx", import.meta.url), "utf8");

test("publishes the approved 2026/27 foreign-student tuition rates", () => {
  assert.match(source, /id="foreign-students"/);
  assert.match(source, /Іноземні студенти \(всі спеціальності\)/);
  assert.match(source, /Магістр — I/);
  assert.match(source, /підготовче відділення \(українська мова\)/);
  assert.match(source, /full: \["1 500", "750", "150"\]/);
  assert.match(source, /full: \["1 600", "800", "160"\]/);
  assert.match(source, /part: \["1 600", "800", "160"\]/);
  assert.match(source, /індекс інфляції за 2025 рік — 8%/);
  assert.match(source, /офіційного курсу валют Національного банку України/);
});
