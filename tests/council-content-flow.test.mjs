import assert from "node:assert/strict";
import test from "node:test";

const base = new URL(process.argv[2] || "http://localhost:5200");
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(base.hostname), "Fixture writes are restricted to loopback development");
const faculty = "/departments/law-faculty";
async function request(path, method = "GET", body) {
  const response = await fetch(new URL(path, base), { method, headers: body ? { "content-type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
  assert.ok(response.ok, `${method} ${path}: ${response.status}`);
  return response.headers.get("content-type")?.includes("application/json") ? response.json() : response.text();
}

test("faculty council overview follows published subpage content without exposing drafts or removed sections", async () => {
  const created = [];
  const prefix = `Council regression ${Date.now()}`;
  const input = { pagePath: `${faculty}/faculty-council/members`, sectionId: "content", entryType: "section", title: prefix, summary: "", body: "Авторський текст", imageUrl: "/people/law/tetiana-lebid.webp", imageAlt: "Портрет", imageFit: "contain", fileUrl: "", fileName: "", date: "", role: "", email: "", profileUrl: "", status: "published", sortOrder: 500 };
  try {
    let entry = await request("/api/department-content", "POST", input); created.push(entry.id);
    const draft = await request("/api/department-content", "POST", { ...input, title: `${prefix} draft`, status: "draft" }); created.push(draft.id);
    const hidden = await request("/api/department-content", "POST", { ...input, title: `${prefix} hidden`, hidden: true }); created.push(hidden.id);
    let html = await request(faculty);
    assert.ok(html.includes(prefix));
    assert.ok(html.includes("Авторський текст"));
    assert.ok(html.includes("Відкрити оригінал:"));
    assert.ok(!html.includes(draft.title) && !html.includes(hidden.title));
    for (const slug of ["about", "members", "regulations", "plan"]) assert.ok(html.includes(`${faculty}/faculty-council/${slug}`));
    entry = await request(`/api/department-content/${entry.id}`, "PATCH", { ...entry, title: `${prefix} updated`, body: "Оновлений авторський текст" });
    for (const path of [faculty, input.pagePath]) {
      html = await request(path);
      assert.ok(html.includes(entry.title) && html.includes(entry.body), "Updated subpage data must also reach the overview");
    }
    await request(`/api/department-content/${entry.id}`, "PATCH", { ...entry, status: "draft" });
    assert.ok(!(await request(faculty)).includes(entry.title));
    for (const slug of ["meetings", "decisions", "protocols"]) assert.equal((await fetch(new URL(`${faculty}/faculty-council/${slug}`, base))).status, 404);
    console.log("PASS council publication/update, hidden/draft filtering, original links and removed routes");
  } finally {
    for (const id of created) await request(`/api/department-content/${id}`, "DELETE");
  }
});
