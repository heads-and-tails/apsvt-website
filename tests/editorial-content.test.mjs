import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

async function moduleUrl(path, imports = {}) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  let code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  code = code.replace(/^import "[^"\n]+\.css";\s*$/gm, "");
  for (const [from, to] of Object.entries({ react: import.meta.resolve("react"), "react/jsx-runtime": import.meta.resolve("react/jsx-runtime"), ...imports })) code = code.replaceAll(`from "${from}"`, `from "${to}"`);
  return `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
}
const textUrl = await moduleUrl("../lib/editorial-text.ts");
const text = await import(textUrl);
const media = await import(await moduleUrl("../lib/department-media.ts", { "./editorial-text": textUrl }));
const dates = await import(await moduleUrl("../lib/department-news-date.ts"));
const academicNews = await import(await moduleUrl("../lib/academic-news.ts"));
const profiles = await import(await moduleUrl("../lib/academic-profile.ts"));

test("keeps staff links stable and summaries short without dropping the full source profile", () => {
  assert.equal(profiles.academicProfilePath("profile/with ? separators"), "/people/profile%2Fwith%20%3F%20separators");
  assert.equal(profiles.academicProfilePath("stable-id", "en"), "/en/people/stable-id");
  assert.equal(profiles.academicProfileSummary("  Короткий\nпрофіль  "), "Короткий профіль");
  const original = "Професійна діяльність та науковий розвиток. ".repeat(15);
  const short = profiles.academicProfileSummary(original);
  assert.ok(short.length <= 240);
  assert.ok(short.endsWith("…"));
  assert.ok(original.startsWith(short.slice(0, -1)));
  assert.ok(profiles.academicProfileSummary("а".repeat(300)).length <= 240);
  assert.equal(profiles.academicProfileSummary(""), "");
});

test("public staff pages reject hidden, draft, missing and other record types", () => {
  const published = { entryType: "teacher", status: "published", hidden: false };
  assert.equal(profiles.isPublicTeacher(published), true);
  for (const entry of [null, { ...published, hidden: true }, { ...published, status: "draft" }, { ...published, entryType: "news" }, { ...published, entryType: "material" }]) assert.equal(profiles.isPublicTeacher(entry), false);
});

test("server-renders complete staff profiles and concise managed cards with the existing editing metadata", async () => {
  const dataUrl = code => `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
  const linkUrl = dataUrl(`import { createElement } from ${JSON.stringify(import.meta.resolve("react"))}; export default function Link(props) { return createElement("a", props); }`);
  const chromeUrl = dataUrl("export function SiteHeader(){return null;} export function SiteFooter(){return null;} export function EnglishFooter(){return null;}");
  const mediaUrl = await moduleUrl("../lib/department-media.ts", { "./editorial-text": textUrl });
  const departmentMediaUrl = await moduleUrl("../app/components/DepartmentMedia.tsx", { "@/lib/department-media": mediaUrl });
  const richTextUrl = await moduleUrl("../app/components/EditorialRichText.tsx", { "@/lib/editorial-text": textUrl });
  const resumeUrl = await moduleUrl("../app/components/TeacherResume.tsx", { "./EditorialRichText": richTextUrl });
  const cardUrl = await moduleUrl("../app/components/AcademicProfileCard.tsx", { "next/link": linkUrl, "@/lib/academic-profile": await moduleUrl("../lib/academic-profile.ts"), "@/lib/department-media": mediaUrl, "./DepartmentMedia": departmentMediaUrl, "./TeacherResume": resumeUrl });
  const { AcademicProfileCard, departmentTeacherProfile } = await import(cardUrl);
  const { AcademicProfilePage } = await import(await moduleUrl("../app/components/AcademicProfilePage.tsx", { "next/link": linkUrl, "./AcademicProfileCard": cardUrl, "./DepartmentMedia": departmentMediaUrl, "./EditorialRichText": richTextUrl, "./SiteHeader": chromeUrl, "./SiteFooter": chromeUrl, "./EnglishFooter": chromeUrl }));
  const entry = { id: "stable-teacher", pagePath: "/departments/digital-technologies", sectionId: "department-team", title: "Авторський профіль", summary: "Професійна діяльність та досвід викладання. ".repeat(15), body: "## Освіта\n\nПовна авторська біографія і професійний розвиток.", role: "Доцент", teacherDegree: "Доктор філософії", teacherTags: ["Методика викладання"], images: [], attachments: [{ url: "/document.pdf", label: "Публікації" }], profileLinks: [{ href: "https://orcid.org/0000-0000-0000-0001", label: "ORCID" }], authorEmail: "private-editor@example.com" };
  const person = departmentTeacherProfile(entry);
  const card = renderToStaticMarkup(createElement(AcademicProfileCard, { person }));
  assert.match(card, /href="\/people\/stable-teacher"/);
  assert.match(card, /data-academic-profile=/);
  assert.doesNotMatch(card, /<details/);
  assert.ok(card.includes(profiles.academicProfileSummary(entry.summary)));
  const html = renderToStaticMarkup(createElement(AcademicProfilePage, { entry }));
  for (const value of [entry.summary, "Повна авторська біографія", "Методика викладання", "/document.pdf", "https://orcid.org/0000-0000-0000-0001"]) assert.ok(html.includes(value), value);
  assert.match(html, /href="\/departments\/digital-technologies#department-team"/);
  assert.doesNotMatch(html, /private-editor@example.com/);
  const native = renderToStaticMarkup(createElement(AcademicProfileCard, { person: { ...person, managedId: undefined } }));
  assert.match(native, /<details/);
  assert.ok(native.includes(entry.summary));
});

test("keeps explicitly requested faculty news visible once without changing ordinary relevance", () => {
  const post = (id, title) => ({ id, slug: id, title, excerpt: "", body: "", category: "Оголошення" });
  const posts = [
    post("conference", "Психологія, ментальне та психічне здоров’я, соціальний розвиток"),
    post("meeting", "Збори трудового колективу факультету психології"),
    post("community", "Соціальне благополуччя"),
    post("unrelated", "Новини Академії"),
  ];
  assert.deepEqual(academicNews.selectAcademicNews(posts, ["psychology", "social-work"], 2).map(p => p.id), ["conference", "meeting"]);
  assert.deepEqual(academicNews.selectAcademicNews(posts, ["psychology", "social-work"], 2, ["meeting"]).map(p => p.id), ["meeting", "conference"]);
  assert.deepEqual(academicNews.selectAcademicNews(posts, ["psychology"], 3, ["meeting", "meeting", "missing"]).map(p => p.id), ["meeting", "conference", "community"]);
  assert.deepEqual(academicNews.selectAcademicNews(posts, ["psychology"], 1, ["unrelated"]).map(p => p.id), ["unrelated"]);
  assert.deepEqual(academicNews.selectAcademicNews(posts, ["psychology"], 2, ["missing"]), academicNews.selectAcademicNews(posts, ["psychology"], 2));
});

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
const professional = await import(professionalUrl);
const sections = await import(await moduleUrl("../lib/editorial-sections.ts", { "./law-faculty-structure": lawStructureUrl, "./professional-education": professionalUrl }));

test("offers the programme team in the editor for all five A5 programmes without changing department sections", () => {
  assert.equal(professional.professionalEducationProgrammes.length, 5);
  for (const programme of professional.professionalEducationProgrammes) {
    const configured = sections.editorialSectionsForPage(programme.path);
    assert.deepEqual(configured.find(section => section.id === "programme-team"), { id: "programme-team", label: "Гарант і група забезпечення ОП" });
    assert.deepEqual(configured.filter(section => section.id !== "programme-team").map(section => section.id), ["overview", "programme-documents", "curriculum", "disciplines", "electives", "practice", "admissions", "quality", "documents"]);
  }
  assert.equal(sections.editorialSectionsForPage(professional.digitalDepartmentPath).some(section => section.id === "programme-team"), false);
});
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

test("respects successful empty published-news queries and preserves fallback for backend failures", async () => {
  const mockUrl = `data:text/javascript;base64,${Buffer.from(`
    export const state = { rows: [], error: null, reads: [] };
    function query() {
      return {
        mode: "", equals: [], includes: [], excludes: [],
        select(mode) { this.mode = mode; return this; },
        eq(key, value) { this.equals.push([key, value]); return this; },
        in(key, values) { this.includes.push([key, values]); return this; },
        neq(key, value) { this.excludes.push([key, value]); return this; },
        order() { return this; }, limit() { return this; }, update() { return this; },
        upsert() { return Promise.resolve({ error: null }); },
        then(resolve, reject) {
          if (this.mode === "id") return Promise.resolve({ data: [{ id: "existing" }], error: null }).then(resolve, reject);
          if (this.mode !== "*") return Promise.resolve({ data: null, error: null }).then(resolve, reject);
          state.reads.push({ equals: this.equals, includes: this.includes });
          const rows = state.rows.filter(row => this.equals.every(([key, value]) => row[key] === value)
            && this.includes.every(([key, values]) => values.includes(row[key]))
            && this.excludes.every(([key, value]) => row[key] !== value));
          return Promise.resolve({ data: state.error ? null : rows, error: state.error }).then(resolve, reject);
        },
      };
    }
    export function createSupabaseAdmin() { return { from: query }; }
    export function createSupabasePublicClient() { return { from: query }; }
    export function isSupabaseConfigured() { return true; }
  `).toString("base64")}`;
  const { state } = await import(mockUrl);
  const posts = await import(await moduleUrl("../lib/data.ts", {
    "@/lib/supabase/admin": mockUrl,
    "@/lib/supabase/public": mockUrl,
    "@/lib/supabase/config": mockUrl,
    "@/lib/entrance-results": await moduleUrl("../lib/entrance-results.ts"),
    "@/lib/admissions-rankings": await moduleUrl("../lib/admissions-rankings.ts"),
    "@/lib/academic-competition": await moduleUrl("../lib/academic-competition.ts"),
  }));
  const slug = posts.psychologyCollectiveMeetingNewsSlug;
  state.rows = [{
    id: "seed-psychology-collective-meeting-2026-10-19", slug,
    title: "Saved database article", excerpt: "", body: "Saved database body", category: "Оголошення",
    image_url: "/program-psychology.jpg", image_alt: "", status: "draft", featured: true,
    published_at: null, created_at: "2026-10-14T10:47:29Z", updated_at: "2026-10-14T10:47:29Z",
    author_email: "publisher@example.test",
  }];
  assert.deepEqual(await posts.getPosts({ slugs: [slug] }), []);
  assert.deepEqual(state.reads.at(-1).equals, [["status", "published"]]);
  assert.deepEqual(state.reads.at(-1).includes, [["slug", [slug]]]);
  const drafts = await posts.getPosts({ includeDrafts: true, slugs: [slug] });
  assert.equal(drafts[0].status, "draft");
  assert.equal(drafts[0].body, "Saved database body");
  state.rows[0].status = "published";
  assert.equal((await posts.getPosts({ slugs: [slug] }))[0].body, "Saved database body");
  assert.deepEqual(await posts.getPosts({ slugs: ["missing-publication"] }), []);
  state.error = { message: "Backend unavailable" };
  const fallback = await posts.getPosts({ slugs: [slug] });
  assert.equal(fallback.length, 1);
  assert.equal(fallback[0].slug, slug);
  assert.equal(fallback[0].body, posts.seedPosts.find(post => post.slug === slug).body);
});
