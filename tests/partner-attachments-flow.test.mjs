import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import test from "node:test";

// Run explicitly against an isolated development D1/R2 database.
// Usage: node tests/partner-attachments-flow.test.mjs http://localhost:5228
test("partner agreement uploads survive publication, editing and removal within their page", async () => {
  const base = new URL(process.argv[2] || "http://localhost:5228");
  assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(base.hostname));
  const pagePath = "/departments/digital-technologies";
  const created = [];
  async function request(path, method = "GET", body) {
    const response = await fetch(new URL(path, base), { method, headers: body ? { "content-type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined });
    assert.ok(response.ok, `${method} ${path}: ${response.status}`);
    return response.headers.get("content-type")?.includes("application/json") ? response.json() : (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
  }
  try {
    const bytes = await readFile(new URL("../public/documents/psychology-faculty/consultations-2026-2027.pdf", import.meta.url));
    const params = new URLSearchParams({ fileName: "local-partner-agreement.pdf", purpose: "document", pagePath });
    const response = await fetch(new URL(`/api/uploads?${params}`, base), { method: "POST", headers: { "content-type": "application/pdf" }, body: bytes });
    assert.equal(response.status, 200);
    const uploaded = await response.json();
    const downloaded = Buffer.from(await (await fetch(new URL(uploaded.url, base))).arrayBuffer());
    assert.equal(createHash("sha256").update(downloaded).digest("hex"), createHash("sha256").update(bytes).digest("hex"));
    const input = { pagePath, sectionId: "partners", entryType: "partner", title: `Локальний партнер ${Date.now()}`, summary: "Опис партнерства", body: "", imageUrl: "/apsvt-hero.png", imageAlt: "Логотип", attachments: [{ url: uploaded.url, label: "Договір про співробітництво" }], fileUrl: "", fileName: "", date: "", role: "Освітній партнер", email: "", profileUrl: "https://example.org", status: "draft", sortOrder: 10 };
    let entry = await request("/api/department-content", "POST", input);
    created.push(entry.id);
    assert.deepEqual(entry.attachments, input.attachments);
    assert.ok(!(await request(pagePath)).includes(entry.title));
    assert.ok(!(await request(`/api/page-materials?path=${pagePath}`)).some((item) => item.id === entry.id));
    entry = await request(`/api/department-content/${entry.id}`, "PATCH", { ...entry, status: "published" });
    const publicEntry = (await request(`/api/page-materials?path=${pagePath}`)).find((item) => item.id === entry.id);
    assert.deepEqual(publicEntry.attachments, input.attachments);
    assert.equal(publicEntry.authorEmail, undefined);
    const html = await request(pagePath);
    assert.ok(html.includes(entry.title) && html.includes(uploaded.url) && html.includes("Договір про співробітництво"));
    assert.ok(!(await request("/departments/constitutional-law")).includes(entry.title));
    entry = await request(`/api/department-content/${entry.id}`, "PATCH", { ...entry, attachments: [{ url: uploaded.url, label: "Перейменований договір" }] });
    const reloaded = (await request("/api/department-content")).find((item) => item.id === entry.id);
    for (const key of ["attachments", "imageUrl", "imageAlt", "summary", "profileUrl", "role"]) assert.deepEqual(reloaded[key], entry[key], key);
    assert.ok((await request(pagePath)).includes("Перейменований договір"));
    entry = await request(`/api/department-content/${entry.id}`, "PATCH", { ...entry, hidden: true });
    assert.ok(!(await request(pagePath)).includes(entry.title));
    entry = await request(`/api/department-content/${entry.id}`, "PATCH", { ...entry, hidden: false, attachments: [] });
    const withoutAgreement = await request(pagePath);
    assert.ok(withoutAgreement.includes(entry.title));
    assert.ok(!withoutAgreement.includes(uploaded.url));
    assert.deepEqual((await request("/api/department-content")).find((item) => item.id === entry.id).attachments, []);
  } finally {
    for (const id of created.reverse()) await request(`/api/department-content/${id}`, "DELETE");
  }
});
