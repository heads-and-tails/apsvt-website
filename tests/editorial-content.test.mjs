import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function moduleUrl(path, imports = {}) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  let code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  for (const [from, to] of Object.entries(imports)) code = code.replaceAll(`from "${from}"`, `from "${to}"`);
  return `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
}
const textUrl = await moduleUrl("../lib/editorial-text.ts");
const text = await import(textUrl);
const media = await import(await moduleUrl("../lib/department-media.ts", { "./editorial-text": textUrl }));
const dates = await import(await moduleUrl("../lib/department-news-date.ts"));

test("keeps legacy Word paragraphs, font bullets, numbered lists and scientific links readable", () => {
  const doc = text.editorialTextDocument("Перший абзац\r\nДругий абзац\r\n\r\n## Освіта\n\n\uF02D\tПерша теза\n\uF02D\tДруга теза\n\n3. Третій пункт\n4. Четвертий пункт\n\n**Важливо**: [ORCID](https://orcid.org/0000-0000).\nhttps://doi.org/10.123/example(x).");
  assert.equal(doc.content.filter(node => node.type === "paragraph").length, 4);
  assert.equal(doc.content.find(node => node.type === "heading").attrs.level, 2);
  assert.equal(doc.content.find(node => node.type === "bulletList").content.length, 2);
  assert.equal(doc.content.find(node => node.type === "orderedList").attrs.start, 3);
  assert.equal(doc.content.find(node => node.type === "orderedList").content.length, 2);
  assert.ok(JSON.stringify(doc).includes('"type":"bold"'));
  assert.ok(JSON.stringify(doc).includes('https://doi.org/10.123/example(x)'));
});

test("retains authored rich content and strips unsafe link targets without creating filler", () => {
  const doc = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Авторський текст" }, { type: "hardBreak" }, { type: "text", text: "Продовження", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] }] }] };
  const stored = text.encodeEditorialText(doc);
  assert.ok(text.editorialTextIsValid(stored));
  assert.equal(text.editorialTextPlain(stored), "Авторський текст\nПродовження");
  assert.ok(!stored.includes("javascript:"));
  assert.equal(text.encodeEditorialText({ type: "doc", content: [{ type: "paragraph" }] }), "");
  assert.deepEqual(text.editorialTextDocument("<!-- APSVT_RICH_TEXT_V1 -->\n{bad"), { type: "doc", content: [] });
  for (const doc of [{type: "doc", content: "bad"}, {type: "doc", content: [null]}, {type: "doc", content: [{type: "text", text: "bad"}]}, {type: "doc", content: [{type: "iframe"}]}]) assert.equal(text.editorialTextIsValid("<!-- APSVT_RICH_TEXT_V1 -->\n" + JSON.stringify(doc)), false);
  for (const url of ["javascript:alert(1)", "data:text/html,<script>", "ftp://example.com", "https://user:password@example.com", "random text"]) assert.equal(text.editorialLink(url), null);
  for (const url of ["https://orcid.org/0000", "/contacts", "mailto:faculty@example.com"]) assert.equal(text.editorialLink(url), url);
});

test("validates image fit and focus, preserves attachments and supports legacy image/file fields", () => {
  assert.ok(media.isDepartmentImage({ url: "/media/photo.png", alt: "Портрет", fit: "cover", positionX: 20, positionY: 80 }));
  for (const position of [-1, 101, NaN]) assert.equal(media.isDepartmentImage({ url: "/media/photo.png", alt: "", positionX: position }), false);
  assert.equal(media.isDepartmentImage({ url: "javascript:alert(1)", alt: "" }), false);
  assert.equal(media.isDepartmentAttachment({ url: "/media/file.pdf", label: "" }), false);
  assert.deepEqual(media.departmentImages({ imageUrl: "/photo.jpg", title: "Викладач" }), [{ url: "/photo.jpg", alt: "Викладач", fit: "contain" }]);
  assert.equal(media.departmentImages({ imageUrl: "/photo.jpg", imageFit: "cover", title: "Фото" })[0].fit, "cover");
  assert.deepEqual(media.departmentAttachments({ fileUrl: "/file.pdf", fileName: "Положення", attachments: [{ url: "/file.pdf", label: "Положення" }] }), [{ url: "/file.pdf", label: "Положення" }]);
  assert.deepEqual(media.parseDepartmentMedia("bad JSON", media.isDepartmentImage), []);
});

test("records first publication rather than draft creation and keeps hidden dates internally", () => {
  const before = Date.now();
  const publishedAt = dates.departmentPublishedAt("published", { status: "draft", createdAt: "2020-01-01T00:00:00Z" });
  assert.ok(Date.parse(publishedAt) >= before);
  assert.equal(dates.departmentPublishedAt("draft", { status: "published", publishedAt, createdAt: "2020-01-01T00:00:00Z" }), publishedAt);
  assert.equal(dates.departmentPublicationDate({ date: "", publishedAt, hideDate: true }), null);
  assert.ok(dates.departmentPublicationDate({ date: "", publishedAt, hideDate: true }, true).label);
  assert.equal(dates.departmentPublicationDate({ date: "2026-10-09", publishedAt }).label, "09 жовтня 2026 р.");
  assert.equal(dates.departmentPublicationDate({ date: "", publishedAt: "2026-10-12T22:30:00Z" }).label, "13 жовтня 2026 р.");
  assert.equal(dates.departmentPublicationDate({ date: "bad date" }), null);
});

const lawStructureUrl = await moduleUrl("../lib/law-faculty-structure.ts");
const programmeDocumentsUrl = await moduleUrl("../lib/programme-documents.ts");
const professionalUrl = await moduleUrl("../lib/professional-education.ts", { "./programme-documents": programmeDocumentsUrl });
const access = await import(await moduleUrl("../lib/editorial-access.ts", { "./law-faculty-structure": lawStructureUrl, "./professional-education": professionalUrl }));

test("the configured faculty editor can manage all requested pages and cannot edit unrelated pages", async () => {
  const authSource = await readFile(new URL("../lib/auth.ts", import.meta.url), "utf8");
  const scopes = authSource.match(/\["tsabenok26@ukr\.net",\s*\{[\s\S]*?accessScopes:\s*(\[[\s\S]*?\])/);
  assert.ok(scopes, "The sender must have an explicit configured scope");
  const profile = { role: "editor", accessScopes: JSON.parse(scopes[1].replace(/,\s*\]/, "]")) };
  const paths = ["law-faculty", "constitutional-law", "private-law", "criminal-law", "public-administration"].map(slug => `/departments/${slug}`);
  for (const scope of access.editorialAccessOptions.filter(x => x.value.startsWith("/departments/law-faculty/"))) paths.push(scope.value);
  for (const path of paths) assert.ok(access.canEditPage(profile, path), path);
  for (const path of ["/news", "/schedule", "/programs/marketing", "/departments/digital-technologies"]) assert.equal(access.canEditPage(profile, path), false, path);
});

const legacyProfiles = await import(await moduleUrl("../lib/legacy-faculty-profiles.ts", { "./department-media": await moduleUrl("../lib/department-media.ts", { "./editorial-text": textUrl }) }));
test("binds legacy faculty biographies, names and newest portraits before staff insertion or reorder", () => {
  const source = [{ name: "Перша Людина", role: "Викладач", summary: "Перший профіль", image: "/first.jpg" }, { name: "Друга Людина", role: "Доцент", summary: "Другий профіль", image: "/second.jpg" }];
  const base = { entryType: "override", sectionId: "law-teachers", updatedAt: "2026-09-01", createdAt: "2026-09-01", title: "Текст", role: "text" };
  const selector = field => `main > section:nth-of-type(2) > section:nth-of-type(11) > div:nth-of-type(2) > div > section:nth-of-type(1) > div > div:nth-of-type(2) > article:nth-of-type(2) > div:nth-of-type(2) > ${field}`;
  const entries = [{ ...base, body: selector("p"), summary: "Авторська біографія" }, { ...base, body: selector("h3"), summary: "Оновлене Ім’я" }, { ...base, body: "old selector", role: "image", title: "Друга Людина", imageUrl: "/latest.jpg", updatedAt: "2026-10-01" }, { ...base, body: "old selector", role: "image", title: "Друга Людина", imageUrl: "/older.jpg" }];
  const result = legacyProfiles.legacyFacultyProfiles(source, entries, "law-teachers");
  assert.equal(result[1].sourceName, "Друга Людина");
  assert.equal(result[1].name, "Оновлене Ім’я");
  assert.equal(result[1].summary, "Авторська біографія");
  assert.equal(result[1].image, "/latest.jpg");
  assert.equal(result[0].image, "/first.jpg");
  assert.equal(source[1].name, "Друга Людина");
  assert.equal(source[1].summary, "Другий профіль");
  assert.equal(legacyProfiles.legacyFacultyProfiles(source, entries, "faculty-leadership")[1].summary, "Другий профіль");
});
