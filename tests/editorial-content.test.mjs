import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createHash } from "node:crypto";

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
const administrationMaterials = await import(await moduleUrl("../lib/public-administration-materials.ts"));
const discussionArchive = await import(await moduleUrl("../lib/public-administration-announcements.ts"));

test("scientific club renders only published visible club materials and keeps its empty heading", async () => {
  const rendererUrl = `data:text/javascript;base64,${Buffer.from(`import {createElement} from ${JSON.stringify(import.meta.resolve("react"))}; export function DepartmentEditorialContent({entries}){return entries.map(entry=>createElement("article",{key:entry.id},entry.title))}`).toString("base64")}`;
  const { MarketingScienceClub } = await import(await moduleUrl("../app/programs/[slug]/MarketingScienceClub.tsx", { "@/app/components/DepartmentEditorialContent": rendererUrl }));
  const entry = { id: "published", sectionId: "science-club", status: "published", entryType: "news", title: "Published club news" };
  const html = renderToStaticMarkup(createElement(MarketingScienceClub, { entries: [entry, { ...entry, id: "draft", status: "draft", title: "Draft" }, { ...entry, id: "hidden", hidden: true, title: "Hidden" }, { ...entry, id: "other", sectionId: "department-news", title: "Other section" }, { ...entry, id: "teacher", entryType: "teacher", title: "Teacher profile" }] }));
  assert.match(html, /Published club news/);
  assert.doesNotMatch(html, /Draft|Hidden|Other section|Teacher profile/);
  const empty = renderToStaticMarkup(createElement(MarketingScienceClub, { entries: [] }));
  assert.match(empty, /Науковий гурток/);
  assert.doesNotMatch(empty, /<article|placeholder|перевірк/i);
});

test("preserves the six historical discussion texts, dates and source photographs in the archive", async () => {
  const articles = discussionArchive.publicAdministrationAnnouncements;
  assert.equal(articles.length, 6);
  const sourceTextHashes = ["b4ea476acf469a905960a65bd177c6238288f969465e3faebf2040e56f67fbbf", "11a2bfa992bd6a6bfba9dcef739b9e15dc88f27457e9b2d3aa14e3fd8ee0fadd", "4134d0c3e14a6a6262b4ff87cac0aef1d27c0c59ccd34dc3ac2b3947e6766e21", "dac4f98616ce0c6afb5913e197a88eea4eba7beb2593b178060dceb5d8e7e3a2", "c083e8716150858c851b376cc2e283f526f179adf4295647f25717fc74726fff", "e57de4fddfdd7fd146ba74cab4375e63d12c7ae9a3fbd4a0e2eafd6438a6db86"];
  const imageHashes = ["78279f5d8b4617de961049505d3b53b29c2db049d0cfd0c95e9534d4f58cb0f5", "4f4b20ccd7d88829c1538f87a0b04c1363a4162de40456d8fdf13fec5bd68d79", "6115d0f62068cd2c11d3a65dfb9d1588fe6d2aae4ff0901533313044a36d8243", "3d7d298f09b761500e6622545b84fa3dda56ffeca4959b24b2c5fa72e2abc2aa", "c34001dfd059fd4f0ed8a87b64c8b8ef13f03dd09f8ed70c50b8998ae6dea839", "d0273e2cd856e25350a0521a644bdd4398c0dca97d46aebce02ec7a7bc988505"];
  const index = JSON.parse(await readFile(new URL("../public/materials-index.json", import.meta.url), "utf8"));
  let imageIndex = 0;
  for (const [i, article] of articles.entries()) {
    assert.equal(createHash("sha256").update(article.paragraphs.join("\n\n")).digest("hex"), sourceTextHashes[i]);
    assert.equal(article.date, ["2023-04-18", "2024-03-07", "2025-05-19"][Math.floor(i / 2)]);
    assert.equal(article.images.length, article.kind === "report" ? 2 : 0);
    const record = index.find(record => record.href === `/news/archive/${article.slug}`);
    assert.equal(record.category, "Новини та події");
    assert.equal(record.date, article.dateLabel);
    assert.equal(record.summary, article.paragraphs[0]);
    assert.ok(administrationMaterials.getPublicAdministrationPublication("d4-public-administration-bachelor").groups.find(group => group.id === "drafts").files.some(file => file.href === article.projectHref));
    for (const image of article.images) {
      assert.equal(image.fit, "contain");
      const bytes = await readFile(new URL(`../public${image.url}`, import.meta.url));
      assert.equal(createHash("sha256").update(bytes).digest("hex"), imageHashes[imageIndex++]);
    }
  }
  assert.equal(index.filter(record => record.category === "Новини та події").length, 751);
  assert.equal(discussionArchive.getPublicAdministrationAnnouncement("unknown-record"), undefined);
});

test("preserves every supplied public-administration original and separates doctoral draft materials", async () => {
  for (const publication of administrationMaterials.publicAdministrationPublications) {
    const files = [publication.currentDocument, ...publication.groups.flatMap(group => group.files)];
    assert.equal(new Set(files.map(file => file.href)).size, files.length);
    for (const file of files) {
      const bytes = await readFile(new URL(`../public${file.href}`, import.meta.url));
      assert.equal(createHash("sha256").update(bytes).digest("hex"), file.sha256, file.title);
    }
  }
  const phd = administrationMaterials.getPublicAdministrationPublication("d4-public-administration-phd");
  assert.equal(1 + phd.groups.flatMap(group => group.files).length, 7);
  const drafts = phd.groups.find(group => group.id === "drafts");
  assert.equal(drafts.collapsed, true);
  assert.equal(drafts.files.length, 3);
  assert.ok(drafts.files.every(file => file.title.startsWith("Проєкт")));
  assert.ok(phd.facts.some(fact => fact.value.includes("Васильєва Наталія Вікторівна")));
  assert.equal(administrationMaterials.getPublicAdministrationPublication("d8-law-phd"), undefined);
});

test("keeps the supplied master's package complete with its correct guarantor and accreditation", () => {
  const programme = administrationMaterials.getPublicAdministrationPublication("d4-public-administration-master");
  assert.equal(1 + programme.groups.flatMap(group => group.files).length, 9);
  assert.ok(programme.facts.some(fact => fact.value === "56066"));
  assert.ok(programme.facts.some(fact => fact.value.includes("Міщенко Катерина Семенівна")));
  assert.ok(programme.facts.some(fact => fact.value.includes("01.07.2029")));
  assert.equal(programme.groups.find(group => group.id === "thesis").files.length, 3);
});

test("keeps the complete bachelor's package grouped with conditional accreditation and historical versions", () => {
  const programme = administrationMaterials.getPublicAdministrationPublication("d4-public-administration-bachelor");
  const files = [programme.currentDocument, ...programme.groups.flatMap(group => group.files)];
  assert.equal(files.length, 153);
  assert.equal(new Set(files.map(file => file.sha256)).size, 153);
  assert.ok(programme.facts.some(fact => fact.value === "56065"));
  assert.ok(programme.facts.some(fact => fact.value.includes("Качан Яна Віталіївна")));
  const accreditation = programme.facts.find(fact => fact.label === "Акредитація").value;
  for (const value of ["Умовна (відкладена)", "20649", "22.04.2026", "21.04.2027", "березень 2027"]) assert.ok(accreditation.includes(value));
  for (const [id, count] of [["mandatory-programmes", 39], ["mandatory-annotations", 37], ["elective-annotations", 33], ["archive-2024", 11], ["archive-2023", 3], ["drafts", 3], ["programme-discussion-records", 4], ["student-survey-records", 5]]) {
    const group = programme.groups.find(group => group.id === id);
    assert.equal(group.files.length, count, id);
    assert.equal(group.collapsed, true, id);
  }
  assert.ok(programme.currentDocument.title.includes("2025–2026"));
  assert.ok(programme.groups.find(group => group.id === "practice").files.some(file => file.href === "/documents/programmes/public-administration/practice-bases.pdf"));
});

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
const studentSectionsUrl = await moduleUrl("../lib/marketing-student-sections.ts");
const methodicalSectionsUrl = await moduleUrl("../lib/marketing-methodical.ts");
const mobilityUrl = await moduleUrl("../lib/marketing-mobility.ts");
const mobility = await import(mobilityUrl);
const teacherAchievementsUrl = await moduleUrl("../lib/marketing-teacher-achievements.ts");
const teacherAchievements = await import(teacherAchievementsUrl);
const sections = await import(await moduleUrl("../lib/editorial-sections.ts", { "./law-faculty-structure": lawStructureUrl, "./professional-education": professionalUrl, "./marketing-student-sections": studentSectionsUrl, "./marketing-methodical": methodicalSectionsUrl, "./marketing-mobility": mobilityUrl, "./marketing-teacher-achievements": teacherAchievementsUrl }));

test("teacher achievements has a separate editorial target and renders published posts, photos and PDFs only", async () => {
  const section = teacherAchievements.marketingTeacherAchievementsSection;
  assert.ok(sections.editorialSectionsForPage("/programs/marketing").some(item => item.id === section.id && item.label === section.label));
  assert.ok(!sections.editorialSectionsForPage("/programs/finance").some(item => item.id === section.id));
  const renderer = `data:text/javascript;base64,${Buffer.from(`import {createElement} from ${JSON.stringify(import.meta.resolve("react"))};export function DepartmentEditorialContent({entries}){return entries.map(entry=>createElement("article",{key:entry.id},entry.title));}`).toString("base64")}`;
  const { MarketingTeacherAchievements } = await import(await moduleUrl("../app/programs/[slug]/MarketingTeacherAchievements.tsx", { "@/lib/marketing-teacher-achievements": teacherAchievementsUrl, "@/app/components/DepartmentEditorialContent": renderer }));
  const entry = { id: "news", sectionId: section.id, status: "published", entryType: "news", title: "Published achievement" };
  const allowed = [entry, { ...entry, id: "photo", entryType: "photo", title: "Confirming photo" }, { ...entry, id: "pdf", entryType: "material", title: "Supporting PDF" }];
  const excluded = [{ ...entry, id: "draft", status: "draft", title: "Private draft" }, { ...entry, id: "hidden", hidden: true, title: "Hidden item" }, { ...entry, id: "teacher", entryType: "teacher", title: "Teacher profile" }, { ...entry, id: "other", sectionId: "department-news", title: "Other news" }];
  const html = renderToStaticMarkup(createElement(MarketingTeacherAchievements, { entries: [...allowed, ...excluded] }));
  for (const item of allowed) assert.ok(html.includes(item.title));
  for (const item of excluded) assert.ok(!html.includes(item.title));
  const empty = renderToStaticMarkup(createElement(MarketingTeacherAchievements, { entries: excluded }));
  assert.ok(empty.includes(section.title));
  assert.match(empty, /матеріали ще не розміщено/);
  assert.doesNotMatch(empty, /<article/);
});

test("places the existing mobility report in the master's subsection without overriding an editor's later placement", () => {
  const id = "68097e3c-0d97-43f3-b41a-fd90a58bc99d";
  assert.equal(mobility.marketingMobilitySectionId(id, "/programs/marketing", "department-news"), mobility.marketingMobilitySection.id);
  assert.equal(mobility.marketingMobilitySectionId(id, "/programs/marketing", "science-club"), "science-club");
  assert.equal(mobility.marketingMobilitySectionId("another-report", "/programs/marketing", "department-news"), "department-news");
  assert.equal(mobility.marketingMobilitySectionId(id, "/programs/finance", "department-news"), "department-news");
  assert.ok(sections.editorialSectionsForPage("/programs/marketing").some(section => section.id === mobility.marketingMobilitySection.id && section.label === mobility.marketingMobilitySection.label));
  assert.ok(!sections.editorialSectionsForPage("/programs/finance").some(section => section.id === mobility.marketingMobilitySection.id));
});

test("mobility subsection shows only its visible published content and keeps a usable empty section", async () => {
  const renderer = `data:text/javascript;base64,${Buffer.from(`import {createElement} from ${JSON.stringify(import.meta.resolve("react"))};export function DepartmentEditorialContent({entries}){return entries.map(entry=>createElement("article",{key:entry.id},entry.title));}`).toString("base64")}`;
  const { MarketingMobility } = await import(await moduleUrl("../app/programs/[slug]/MarketingMobility.tsx", { "@/lib/marketing-mobility": mobilityUrl, "@/app/components/DepartmentEditorialContent": renderer }));
  const published = { id: "visible", sectionId: mobility.marketingMobilitySection.id, status: "published", entryType: "news", title: "Visible mobility report" };
  const variants = [{ ...published, id: "draft", status: "draft", title: "Private draft" }, { ...published, id: "hidden", hidden: true, title: "Hidden report" }, { ...published, id: "other", sectionId: "department-news", title: "Other news" }, { ...published, id: "teacher", entryType: "teacher", title: "Teacher record" }];
  const html = renderToStaticMarkup(createElement(MarketingMobility, { entries: [published, ...variants] }));
  assert.match(html, /Visible mobility report/);
  assert.doesNotMatch(html, /Private draft|Hidden report|Other news|Teacher record/);
  assert.match(html, /Магістратура/);
  const empty = renderToStaticMarkup(createElement(MarketingMobility, { entries: variants }));
  assert.match(empty, /Академічна мобільність та визнання результатів навчання/);
  assert.match(empty, /матеріали ще не розміщено/);
  assert.doesNotMatch(empty, /<article/);
});

test("makes every marketing methodical subsection editable", () => {
  const registered = sections.editorialSectionsForPage("/programs/marketing").filter((section) => section.id.startsWith("marketing-methodical-"));
  assert.equal(registered.length, 18);
  assert.ok(registered.some((section) => section.label === "Бакалаврат · Курсові роботи"));
  assert.ok(registered.some((section) => section.label === "Магістратура · Кваліфікаційні роботи та атестація"));
  for (const level of ["bachelor", "master"]) for (const type of ["work-programmes", "annotations"]) {
    assert.ok(registered.some((section) => section.id === `marketing-methodical-${level}-${type}-electives` && section.label.endsWith("· Вибіркові дисципліни")));
  }
});

test("keeps marketing quality discussion separate and editable in the panel", () => {
  const marketing = sections.editorialSectionsForPage("/programs/marketing");
  assert.deepEqual(marketing.find((section) => section.id === "marketing-quality-discussion"), { id: "marketing-quality-discussion", label: "Якість освіти · Обговорення змін до ОПП" });
  assert.equal(sections.editorialSectionsForPage("/programs/finance").some((section) => section.id === "marketing-quality-discussion"), false);
});

test("makes both marketing student subsections selectable before any entries exist", () => {
  const registered = sections.editorialSectionsForPage("/programs/marketing");
  assert.deepEqual(registered.filter((section) => ["marketing-student-experience", "marketing-student-science"].includes(section.id)), [
    { id: "marketing-student-experience", label: "Студентське життя: навчання, можливості, досягнення" },
    { id: "marketing-student-science", label: "Студентська наука: конференції, дослідження, досягнення" },
  ]);
});

test("offers a separate empty marketing repository without changing unrelated page destinations", () => {
  assert.deepEqual(sections.editorialSectionsForPage("/programs/marketing").find((section) => section.id === "marketing-repository"), { id: "marketing-repository", label: "Репозитарій" });
  assert.equal(sections.editorialSectionsForPage("/programs/finance").some((section) => section.id === "marketing-repository"), false);
});

test("offers marketing programme levels and partnership tabs as distinct editor destinations", () => {
  const marketing = sections.editorialSectionsForPage("/programs/marketing");
  const expected = ["marketing-bachelor-programmes", "marketing-bachelor-plans", "marketing-master-programmes", "marketing-master-plans", "marketing-partners", "marketing-partner-agreements"];
  assert.deepEqual(marketing.filter((section) => expected.includes(section.id)).map((section) => section.id), expected);
  assert.equal(sections.editorialSectionsForPage("/programs/finance").some((section) => expected.includes(section.id)), false);
});

test("marketing programme section keeps only existing master's PDFs until editors add new materials", async () => {
  const rendererUrl = `data:text/javascript;base64,${Buffer.from(`export function DepartmentEditorialContent({entries}){return entries.map(entry=>entry.title).join(",")}`).toString("base64")}`;
  const { MarketingEducationPrograms } = await import(await moduleUrl("../app/programs/[slug]/MarketingEducationPrograms.tsx", { "@/app/components/DepartmentEditorialContent": rendererUrl }));
  const html = renderToStaticMarkup(createElement(MarketingEducationPrograms, { entries: [] }));
  assert.match(html, /marketing-bachelor-programmes/);
  assert.match(html, /marketing-bachelor-plans/);
  assert.match(html, /marketing-master-programmes/);
  assert.match(html, /marketing-master-plans/);
  assert.match(html, /role="tab" id="marketing-bachelor-programmes-tab"/);
  assert.match(html, /role="tab" id="marketing-master-plans-tab"/);
  assert.match(html, /opp-marketing-master-2026\.pdf/);
  assert.match(html, /opp-marketing-master-2025\.pdf/);
  assert.doesNotMatch(html, /d5-marketing-bachelor\.pdf|drive\.google\.com|ProgrammeCurriculumPlan/);
});

test("feedback requires valid contact data and explicit consent", async () => {
  const { parseFeedback } = await import(await moduleUrl("../lib/feedback-form.ts"));
  const valid = { name: "Олена", email: "olena@example.org", subject: "Питання", message: "Запитання про сайт Академії", consent: true, website: "" };
  assert.deepEqual(parseFeedback(valid), valid);
  assert.equal(parseFeedback({ ...valid, consent: false }), null);
  assert.equal(parseFeedback({ ...valid, email: "invalid" }), null);
  assert.equal(parseFeedback({ ...valid, message: "short" }), null);
});

test("restored anticorruption plan is a local six-page PDF rather than the dead legacy page", async () => {
  const official = await readFile(new URL("../lib/official-documents.ts", import.meta.url), "utf8");
  assert.match(official, /id: "anticorruption-plan"[\s\S]*?href: "\/documents\/anticorruption\/plan-zakhodiv-2024-2027\.pdf"/);
  const pdf = await readFile(new URL("../public/documents/anticorruption/plan-zakhodiv-2024-2027.pdf", import.meta.url));
  assert.equal(pdf.subarray(0, 4).toString(), "%PDF");
});

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
