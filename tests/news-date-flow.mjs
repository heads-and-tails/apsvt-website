import assert from "node:assert/strict";

// Run against an isolated development database, never a live editor account.
// Usage: node tests/news-date-flow.mjs http://localhost:5197
const base = new URL(process.argv[2] || "http://localhost:5197");
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(base.hostname), "Use a loopback development server");
const created = [];
let original;
async function request(path, method = "GET", body) {
  const response = await fetch(new URL(path, base), {
    method,
    headers: body ? { "content-type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  assert.ok(response.ok, `${method} ${path}: ${response.status} ${response.ok ? "" : await response.text()}`);
  return response.headers.get("content-type")?.includes("application/json") ? response.json() : response.text();
}
function newsCard(html, href) {
  const cards = html.match(/<a\b[^>]*class="news"[^>]*>[\s\S]*?<\/a>/g) || [];
  const card = cards.find((item) => item.includes(`href="${href}"`));
  assert.ok(card, `Missing card ${href}`);
  return card;
}
function kicker(html) {
  const value = html.match(/<div class="detail-kicker mono">([\s\S]*?)<\/div>/)?.[1];
  assert.ok(value, "Missing article metadata");
  return value;
}
try {
  const stamp = Date.now();
  const entry = await request("/api/department-content", "POST", {
    pagePath: "/departments/constitutional-law", sectionId: "department-news", entryType: "news",
    title: `Перевірка дати ${stamp}`, summary: "Перевірка збереження налаштування", body: "Текст контрольної новини.",
    imageUrl: "", imageAlt: "", fileUrl: "", fileName: "", date: "2026-10-09", hideDate: true,
    role: "", email: "", profileUrl: "", status: "published", sortOrder: 10,
  });
  created.push(["department-content", entry.id]);
  assert.equal(entry.hideDate, true);
  assert.equal(entry.date, "2026-10-09");
  assert.equal((await request("/api/department-content")).find(item => item.id === entry.id).hideDate, true);
  let article = await request(`/department-news/${entry.id}`);
  assert.doesNotMatch(kicker(article), /жовтня/);
  assert.doesNotMatch(article, /<b>Опубліковано<\/b>|<b>Автор<\/b>/);
  const parent = await request(entry.pagePath);
  const card = (parent.match(/<article\b[^>]*>[\s\S]*?<\/article>/g) || []).find(item => item.includes(entry.title));
  assert.ok(card);
  assert.doesNotMatch(card, /<time/);
  const shown = await request(`/api/department-content/${entry.id}`, "PATCH", { ...entry, hideDate: false });
  assert.equal(shown.date, entry.date);
  article = await request(`/department-news/${entry.id}`);
  assert.match(kicker(article), /09 жовтня 2026/);
  assert.match(article, /<b>Опубліковано<\/b>/);

  const post = await request("/api/posts", "POST", {
    title: `Контрольна новина ${stamp}`, excerpt: "Перевірка налаштування дати", body: "Авторський текст без доданих цитат.",
    category: "Новини", imageUrl: "/apsvt-event-real.jpg", imageAlt: "", status: "published",
    featured: false, hideDate: true, publishedAt: "2026-10-09T12:00:00.000Z",
  });
  created.push(["posts", post.id]);
  assert.equal(post.hideDate, true);
  assert.equal(post.publishedAt, "2026-10-09T12:00:00.000Z");
  article = await request(`/news/${post.slug}`);
  assert.doesNotMatch(kicker(article), /жовтня/);
  assert.doesNotMatch(article, /Освіта стає цінною тоді|<b>Автор<\/b>|APSVT_HIDE_DATE/);
  assert.doesNotMatch(newsCard(await request("/news"), `/news/${post.slug}`), /class="date"/);
  const restored = await request(`/api/posts/${post.id}`, "PATCH", { ...post, hideDate: false });
  assert.equal(restored.publishedAt, post.publishedAt);
  assert.match(kicker(await request(`/news/${post.slug}`)), /09 жовтня 2026/);
  assert.match(newsCard(await request("/news"), `/news/${post.slug}`), /class="date"/);
  const invalid = await fetch(new URL(`/api/posts/${post.id}`, base), {
    method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...post, hideDate: "false" }),
  });
  assert.equal(invalid.status, 400);

  original = (await request("/api/posts")).find(item => item.slug === "treninh-shtuchnyi-intelekt-osvita-nauka-2026");
  assert.ok(original, "Missing translated seed article");
  const hidden = await request(`/api/posts/${original.id}`, "PATCH", { ...original, hideDate: true });
  assert.equal(hidden.publishedAt, original.publishedAt);
  assert.doesNotMatch(kicker(await request(`/en/news/${original.slug}`)), / · /);
  assert.doesNotMatch(newsCard(await request("/en/news"), `/en/news/${original.slug}`), /class="date"/);
  await request(`/api/posts/${original.id}`, "PATCH", { ...original, hideDate: false });
  assert.match(kicker(await request(`/en/news/${original.slug}`)), / · /);
  assert.match(newsCard(await request("/en/news"), `/en/news/${original.slug}`), /class="date"/);
  console.log("PASS: department and Academy date persistence, both public surfaces, reversible setting, English copies, invalid input, authored content.");
} finally {
  if (original) await request(`/api/posts/${original.id}`, "PATCH", original);
  for (const [type, id] of created.reverse()) await request(`/api/${type}/${id}`, "DELETE");
}
