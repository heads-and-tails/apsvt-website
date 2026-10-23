import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Run explicitly against an isolated development D1/R2 database.
// Usage: node tests/department-content-flow.test.mjs http://localhost:5198
test("department content and programme documents survive real uploads, publishing and category changes", async () => {
  const base = new URL(process.argv[2] || "http://localhost:5198");
  assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(base.hostname), "Use an isolated loopback server");
  const created = [];
  async function request(path, method = "GET", body) {
    const response = await fetch(new URL(path, base), { method, headers: body ? { "content-type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined });
    assert.ok(response.ok, `${method} ${path}: ${response.status}`);
    return response.headers.get("content-type")?.includes("application/json") ? response.json() : response.text();
  }
  async function upload(path, mime, purpose, pagePath) {
    const bytes = await readFile(new URL(path, import.meta.url));
    const params = new URLSearchParams({ fileName: path.split("/").at(-1), purpose, pagePath });
    const response = await fetch(new URL(`/api/uploads?${params}`, base), { method: "POST", headers: { "content-type": mime }, body: bytes });
    assert.ok(response.ok, `Upload: ${response.status}`);
    const file = await response.json();
    const downloaded = Buffer.from(await (await fetch(new URL(file.url, base))).arrayBuffer());
    assert.equal(createHash("sha256").update(downloaded).digest("hex"), createHash("sha256").update(bytes).digest("hex"));
    assert.equal(file.fileSize, bytes.length);
    return file;
  }
  const pages = ["d8-law-bachelor", "d8-law-master", "d8-law-phd", "d4-public-administration-bachelor", "d4-public-administration-master", "d4-public-administration-phd"].map(slug => `/departments/law-faculty/faculty-programmes/${slug}`);
  try {
    const pdf = await upload("../public/documents/archive/may-2026/law-faculty-regulation-2023.pdf", "application/pdf", "document", pages[0]);
    const image = await upload("../public/ai-training-2026-02.jpeg", "image/jpeg", "image", "/departments/constitutional-law");
    // This 4 MB image used to hit vinext's unexpected 1 MB multipart limit.
    assert.ok(image.fileSize > 1024 * 1024 && image.fileSize < 8 * 1024 * 1024);
    const entry = await request("/api/department-content", "POST", { pagePath: "/about", sectionId: "", entryType: "news", title: `Локальна перевірка ${Date.now()}`, summary: "", body: "Авторський текст", imageUrl: "", imageAlt: "", images: [{ url: image.url, alt: "Перевірка", fit: "contain" }], attachments: [{ url: pdf.url, label: "Перевірка PDF" }], fileUrl: "", fileName: "", date: "", hideDate: true, role: "", email: "", profileUrl: "", status: "draft", sortOrder: 10 });
    created.push(["department-content", entry.id]);
    assert.equal(entry.publishedAt, undefined);
    assert.ok(!(await request("/api/page-materials?path=/about")).some(x => x.id === entry.id));
    const published = await request(`/api/department-content/${entry.id}`, "PATCH", { ...entry, status: "published" });
    assert.ok(published.publishedAt);
    const publicEntry = (await request("/api/page-materials?path=/about")).find(x => x.id === entry.id);
    for (const key of ["hideDate", "hidden", "publishedAt", "createdAt", "images", "attachments"]) assert.deepEqual(publicEntry[key], published[key], key);
    assert.equal(publicEntry.authorEmail, undefined);
    const shown = await request(`/api/department-content/${entry.id}`, "PATCH", { ...published, hideDate: false });
    assert.equal(shown.publishedAt, published.publishedAt);
    assert.ok((await request(`/department-news/${entry.id}`)).includes("<b>Опубліковано</b>"));
    const invalid = await fetch(new URL(`/api/department-content/${entry.id}`, base), { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...shown, body: '<!-- APSVT_RICH_TEXT_V1 -->\n{"type":"doc","content":"bad"}' }) });
    assert.equal(invalid.status, 400);
    const teacher = await request("/api/department-content", "POST", { ...shown, pagePath: "/departments/constitutional-law", sectionId: "department-team", entryType: "teacher", title: "Локальна перевірка опису фото", role: "Перевірка редактора", teacherSourceName: "", images: [{ url: image.url, alt: "Авторський опис портрета", fit: "contain" }] });
    created.push(["department-content", teacher.id]);
    assert.ok((await request(teacher.pagePath)).includes('alt="Авторський опис портрета"'), "Teacher images must retain the editor's description");
    const quality = await request("/api/department-content", "POST", { ...shown, pagePath: "/programs/law", sectionId: "quality", entryType: "quality", title: "Локальна перевірка форматування", role: "monitoring", body: '<!-- APSVT_RICH_TEXT_V1 -->\n' + JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Збережено форматування", marks: [{ type: "bold" }] }] }] }) });
    created.push(["department-content", quality.id]);
    const qualityHtml = await request(quality.pagePath);
    assert.ok(qualityHtml.includes("<strong>Збережено форматування</strong>"), "Shared quality sections must render the visual editor's saved formatting");
    for (const path of pages) {
      let docs = [];
      for (const category of ["Робоча програма", "Анотація"]) {
        const doc = await request("/api/documents", "POST", { title: `Локальна перевірка ${category}`, description: "", category: `${category} · 2026`, pagePath: path, fileUrl: pdf.url, fileName: pdf.fileName, mimeType: pdf.mimeType, fileSize: pdf.fileSize, status: "published", sortOrder: 10 });
        created.push(["documents", doc.id]); docs.push(doc);
      }
      const html = await request(path);
      for (const heading of ["Робочі програми навчальних дисциплін", "Анотації навчальних дисциплін"]) assert.match(html, new RegExp(`<h2>${heading}</h2>`));
      for (const doc of docs) assert.ok(html.includes(doc.title));
      assert.ok(!(await request("/api/public-content?kind=research_resource")).some(x => docs.some(d => d.id === x.id)), "Documents must not leak into research entries");
      const draft = await request(`/api/documents/${docs[0].id}`, "PATCH", { ...docs[0], status: "draft" });
      assert.equal(draft.status, "draft");
      assert.ok(!(await request(path)).includes(draft.title));
      for (const doc of docs) await request(`/api/documents/${doc.id}`, "DELETE");
      const empty = await request(path);
      for (const heading of ["Робочі програми навчальних дисциплін", "Анотації навчальних дисциплін"]) assert.match(empty, new RegExp(`<h2>${heading}</h2>`));
    }
    console.log("PASS original upload bytes; first publication and public flags; all six programme document categories, draft/update/delete and empty headings.");
  } finally {
    for (const [type, id] of created.reverse()) { const response = await fetch(new URL(`/api/${type}/${id}`, base), { method: "DELETE" }); assert.ok(response.ok || response.status === 404, "Fixture cleanup"); }
  }
});
