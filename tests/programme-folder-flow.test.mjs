import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Explicit integration test; use the owned worktree's isolated D1/R2 dev server.
// node tests/programme-folder-flow.test.mjs http://localhost:5245
test("programme folders support real original files, replacement, publication and safe deletion", async () => {
  const base = new URL(process.argv[2] || "http://localhost:5245");
  assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(base.hostname), "Use an isolated loopback server");
  const created = [];
  const path = "/departments/law-faculty/faculty-programmes/d8-law-master";
  async function request(endpoint, method = "GET", body, expected = 200) {
    const response = await fetch(new URL(endpoint, base), { method, headers: body ? { "content-type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined });
    assert.equal(response.status, expected, `${method} ${endpoint}: ${await response.clone().text()}`);
    return response.headers.get("content-type")?.includes("application/json") ? response.json() : response.text();
  }
  async function create(type, input) {
    const item = await request(`/api/${type}`, "POST", input, 201);
    created.push([type, item.id]); return item;
  }
  const folderInput = (sectionId, title, pagePath = path) => ({ pagePath, sectionId, entryType: "section", title, summary: "", body: "", imageUrl: "", imageAlt: "", fileUrl: "", fileName: "", date: "", hideDate: true, role: "programme-document-folder", email: "", profileUrl: "", hidden: false, status: "published", sortOrder: 10 });
  async function upload(filePath, mime) {
    const bytes = await readFile(new URL(filePath, import.meta.url));
    const params = new URLSearchParams({ fileName: filePath.split("/").at(-1), purpose: "document", pagePath: path });
    const response = await fetch(new URL(`/api/uploads?${params}`, base), { method: "POST", headers: { "content-type": mime }, body: bytes });
    assert.equal(response.status, 200);
    const result = await response.json();
    const downloaded = Buffer.from(await (await fetch(new URL(result.url, base))).arrayBuffer());
    assert.equal(createHash("sha256").update(downloaded).digest("hex"), createHash("sha256").update(bytes).digest("hex"));
    assert.equal(result.fileSize, bytes.length);
    return { fileUrl: result.url, fileName: result.fileName, fileSize: result.fileSize, mimeType: result.mimeType };
  }
  try {
    let working = await create("department-content", folderInput("working-programmes", "Локальні фахові дисципліни"));
    const annotations = await create("department-content", folderInput("course-annotations", "Локальні анотації"));
    const other = await create("department-content", folderInput("working-programmes", "Інша програма", path.replace("master", "bachelor")));
    assert.ok((await request(path)).includes(`id="folder-${working.id}"`));
    const files = await Promise.all([
      upload("../public/documents/archive/may-2026/law-faculty-regulation-2023.pdf", "application/pdf"),
      upload("../public/documents/programmes/public-administration/phd/teaching-team-qualifications.doc", "application/msword"),
      upload("../public/documents/programmes/law/annotations/financial-law.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
    ]);
    const input = { title: `Локальний файл ${Date.now()}`, description: "", pagePath: path, category: `Робоча програма · папка:${working.id}`, ...files[0], status: "published", sortOrder: 10 };
    for (const slug of ["d8-law-bachelor", "d8-law-phd", "d4-public-administration-bachelor", "d4-public-administration-master", "d4-public-administration-phd"]) {
      const programmePath = path.replace("d8-law-master", slug);
      for (const [sectionId, kind] of [["working-programmes", "Робоча програма"], ["course-annotations", "Анотація"]]) {
        const folder = await create("department-content", folderInput(sectionId, `Локальна папка ${slug} ${kind}`, programmePath));
        const file = await create("documents", { ...input, pagePath: programmePath, title: `Локальний файл ${slug} ${kind}`, category: `${kind} · папка:${folder.id}` });
        const html = await request(programmePath);
        assert.ok(html.includes(`id="folder-${folder.id}"`) && html.includes(file.title), `${slug} ${kind}`);
        assert.ok(!(await request(path)).includes(file.title), "Folders remain isolated across all six programmes");
      }
    }
    let document = await create("documents", input);
    const legacy = await create("documents", { ...input, title: "Локальний документ без папки", category: "Анотація · 2025", ...files[1] });
    assert.ok((await request(path)).includes(document.title));
    await request(`/api/department-content/${working.id}`, "DELETE", undefined, 409);
    await request(`/api/department-content/${working.id}`, "PATCH", { ...working, sectionId: "course-annotations" }, 409);
    for (const category of [`Робоча програма · папка:missing`, `Анотація · папка:${working.id}`, `Робоча програма · папка:${other.id}`, "Робоча програма · папка:"]) await request("/api/documents", "POST", { ...input, category }, 400);
    await request(`/api/documents/${document.id}`, "PATCH", { ...document, pagePath: other.pagePath }, 400);
    await request("/api/department-content", "POST", folderInput("study-plans", "Неправильний розділ"), 400);
    working = await request(`/api/department-content/${working.id}`, "PATCH", { ...working, title: "Перейменовані фахові дисципліни" });
    const renamed = await request(path);
    assert.ok(renamed.includes(working.title) && renamed.includes(document.title));
    document = await request(`/api/documents/${document.id}`, "PATCH", { ...document, ...files[2], title: "Замінений локальний файл DOCX" });
    assert.ok((await request(path)).includes(files[2].fileUrl));
    working = await request(`/api/department-content/${working.id}`, "PATCH", { ...working, status: "draft" });
    for (const endpoint of [path, "/documents"]) assert.ok(!(await request(endpoint)).includes(document.title), "Draft parent must hide children everywhere");
    assert.ok((await request(path)).includes(legacy.title), "Ungrouped older files remain available");
    working = await request(`/api/department-content/${working.id}`, "PATCH", { ...working, status: "published" });
    document = await request(`/api/documents/${document.id}`, "PATCH", { ...document, category: `Анотація · папка:${annotations.id}` });
    let html = await request(path);
    assert.ok(html.indexOf(document.title) > html.indexOf(`id="folder-${annotations.id}"`));
    document = await request(`/api/documents/${document.id}`, "PATCH", { ...document, status: "draft" });
    assert.ok(!(await request(path)).includes(document.title));
    await request(`/api/department-content/${annotations.id}`, "DELETE", undefined, 409);
    await request(`/api/documents/${document.id}`, "DELETE");
    await request(`/api/department-content/${annotations.id}`, "DELETE");
    html = await request(path);
    assert.ok(!html.includes(`id="folder-${annotations.id}"`));
    assert.ok((await request(other.pagePath)).includes(other.title));
    console.log("PASS PDF/DOC/DOCX exact upload bytes; empty folders, rename, replacement, move, drafts, global visibility, programme isolation, invalid references and safe deletion.");
  } finally {
    for (const [type, id] of created.filter(([type]) => type === "documents").reverse().concat(created.filter(([type]) => type === "department-content").reverse())) {
      const response = await fetch(new URL(`/api/${type}/${id}`, base), { method: "DELETE" });
      assert.ok(response.ok || response.status === 404, `Fixture cleanup ${type}/${id}`);
    }
  }
});
