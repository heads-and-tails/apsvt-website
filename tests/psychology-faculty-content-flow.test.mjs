import assert from "node:assert/strict";
import test from "node:test";

// Run explicitly against an isolated development D1 database, never production.
// node tests/psychology-faculty-content-flow.test.mjs http://localhost:3219
test("keeps department-owned published records discoverable at the faculty and excludes private material", async () => {
  const base = new URL(process.argv[2] || "http://localhost:3219");
  assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(base.hostname));
  const faculty = "/departments/psychology-social-development-faculty";
  const created = [];
  const marker = `Faculty local validation ${Date.now()}`;
  async function request(path, method = "GET", body) {
    const response = await fetch(new URL(path, base), { method, headers: body ? { "content-type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined });
    assert.ok(response.ok, `${method} ${path}: ${response.status}`);
    return response.headers.get("content-type")?.includes("application/json") ? response.json() : response.text();
  }
  async function entry(label, slug, sectionId, extra = {}) {
    const value = await request("/api/department-content", "POST", {
      pagePath: `${faculty}/${slug}`, sectionId, entryType: "section", title: `${marker} ${label}`, summary: "", body: "Локальний матеріал для перевірки збереження", imageUrl: "", imageAlt: "", fileUrl: "", fileName: "", date: "", role: "", email: "", profileUrl: "", status: "published", sortOrder: 10, ...extra,
    });
    created.push(["department-content", value.id]);
    return value;
  }
  async function document(label, pagePath) {
    const value = await request("/api/documents", "POST", {
      pagePath, title: `${marker} ${label}`, category: "Положення", description: "", fileUrl: "/documents/psychology-faculty/regulations/faculty.pdf", fileName: "faculty.pdf", mimeType: "application/pdf", fileSize: 413934, status: "published", sortOrder: 10,
    });
    created.push(["documents", value.id]);
    return value;
  }
  try {
    const programme = await entry("programme", "clinical-psychology", "department-education");
    const news = await entry("news", "business-psychology", "department-news", { entryType: "news" });
    const repository = await entry("repository", "social-work", "repository");
    const history = await entry("history", "social-work", "department-history");
    const draft = await entry("draft", "business-psychology", "department-news", { status: "draft" });
    const hidden = await entry("hidden", "social-work", "department-documents", { hidden: true });
    const departmentDoc = await document("department-document", `${faculty}/clinical-psychology`);
    const globalDoc = await document("global-document", "*");
    const html = await request(faculty);
    for (const value of [programme, news, repository, history, departmentDoc, globalDoc]) assert.ok(html.includes(value.title), value.title);
    assert.ok(!html.includes(draft.title));
    assert.ok(!html.includes(hidden.title));
    assert.equal(html.split(`<h3>${globalDoc.title}</h3>`).length - 1, 1);
    const original = (await request("/api/department-content")).find((value) => value.id === programme.id);
    assert.equal(original.pagePath, programme.pagePath);
    assert.equal(original.sectionId, "department-education");
    assert.ok((await request(`/department-news/${news.id}`)).includes(news.title));
    for (const slug of ["clinical-psychology", "business-psychology", "social-work"]) {
      const department = await request(`${faculty}/${slug}`);
      for (const value of [programme, news, repository, history]) assert.ok(!department.includes(value.title));
    }
  } finally {
    for (const [resource, id] of created.reverse()) await request(`/api/${resource}/${id}`, "DELETE");
    const restored = await request(faculty);
    assert.ok(!restored.includes(marker), "Restore all temporary local records");
  }
});
