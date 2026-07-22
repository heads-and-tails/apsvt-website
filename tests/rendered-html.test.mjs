import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

let workerPromise;
async function worker(){
  if(!workerPromise){
    const workerUrl=new URL("../dist/server/index.js",import.meta.url);
    workerUrl.searchParams.set("test",`${process.pid}-${Date.now()}`);
    workerPromise=import(workerUrl.href).then(module=>module.default);
  }
  return workerPromise;
}

async function render(path="/"){
  const app=await worker();
  return app.fetch(new Request(`http://localhost${path}`,{headers:{accept:"text/html"}}),{ASSETS:{fetch:async()=>new Response("Not found",{status:404})}},{waitUntil(){},passThroughOnException(){}});
}

test("server-renders the finished Ukrainian homepage",async()=>{
  const response=await render();
  assert.equal(response.status,200);
  assert.match(response.headers.get("content-type")??"",/^text\/html\b/i);
  const html=await response.text();
  assert.match(html,/<title>АПСВТ — освіта з людським виміром<\/title>/i);
  assert.match(html,/href="\/en"[^>]*>EN<\/a>/i);
  assert.match(html,/Освітні траєкторії/);
  assert.match(html,/news-hospitality-lab\.jpg/);
  assert.match(html,/news-international-workshop\.jpg/);
  assert.match(html,/news-legal-clinic\.jpg/);
  assert.match(html,/news-marketing-conference\.jpg/);
  assert.doesNotMatch(html,/codex-preview|Your site is taking shape/i);
});

test("serves every main public section in English",async()=>{
  const paths=["/en/about","/en/programs","/en/admissions","/en/people","/en/international","/en/research","/en/research/journals","/en/research/conferences","/en/facilities","/en/facilities/campus","/en/facilities/dormitory","/en/facilities/library","/en/events","/en/students","/en/schedule","/en/exam-schedule","/en/academic-calendar","/en/materials","/en/stories","/en/faq","/en/news","/en/contacts"];
  for(const path of paths){
    const response=await render(path);
    assert.equal(response.status,200,`${path} should render`);
    const html=await response.text();
    assert.match(html,/Academy of Labour|Admissions 2026|Degree programmes|Research and publications|Campus and services|Student space|Academy events|Class schedule|Examination timetable|Academic year|Academy materials|Academy stories|Frequently asked questions|News and stories|Contacts/i,`${path} should contain English content`);
    assert.match(html,/href="\/en\/programs"/i,`${path} should keep English navigation`);
  }
});

test("serves programme and news detail pages in English",async()=>{
  const programme=await render("/en/programs/management");
  assert.equal(programme.status,200);
  const programmeHtml=await programme.text();
  assert.match(programmeHtml,/What you will study/);
  assert.match(programmeHtml,/Career opportunities/);
  assert.match(programmeHtml,/Strategic Management/);
  assert.match(programmeHtml,/href="\/programs\/management"[^>]*>UA<\/a>/i);

  const article=await render("/en/news/open-day-2026");
  assert.equal(article.status,200);
  const articleHtml=await article.text();
  assert.match(articleHtml,/Open Day: experience the Academy in person/);
  assert.match(articleHtml,/Participation is free/);
  assert.match(articleHtml,/href="\/news\/open-day-2026"[^>]*>UA<\/a>/i);
});

test("keeps full people, research, materials and library content in English",async()=>{
  const peopleHtml=await (await render("/en/people")).text();
  assert.match(peopleHtml,/Rectorate/);
  assert.match(peopleHtml,/Faculty of Economics, Social Technologies and Tourism/);
  assert.match(peopleHtml,/Viktor Sukhomlyn/);
  assert.doesNotMatch(peopleHtml,/Photo forthcoming/);

  const researchHtml=await (await render("/en/research")).text();
  assert.match(researchHtml,/Publication search/);
  assert.match(researchHtml,/Google Scholar/);
  assert.match(researchHtml,/APSVT Scientific Bulletin/);
  assert.doesNotMatch(researchHtml,/Found:\s*\d+/);

  const materialsHtml=await (await render("/en/materials")).text();
  assert.match(materialsHtml,/Complete searchable collection|Complete catalogue/i);
  assert.match(materialsHtml,/Title, topic or word in the description/);
  assert.doesNotMatch(materialsHtml,/materials found/);

  const libraryHtml=await (await render("/en/facilities/library")).text();
  assert.match(libraryHtml,/70,000\+/);
  assert.match(libraryHtml,/Search the catalogue/);
  assert.match(libraryHtml,/Opening hours/);
  assert.doesNotMatch(libraryHtml,/items found|demonstration section/);
});

test("opens the dedicated Scientific Bulletin website from both languages",async()=>{
  const [ukHtml,enHtml]=await Promise.all([
    (await render("/research/journals")).text(),
    (await render("/en/research/journals")).text(),
  ]);
  assert.match(ukHtml,/href="https:\/\/visnyk-apsvt-journal\.vercel\.app\/"/);
  assert.match(ukHtml,/Відкрити Вісник/);
  assert.doesNotMatch(ukHtml,/alsrt\.com\.ua/);
  assert.match(enHtml,/href="https:\/\/visnyk-apsvt-journal\.vercel\.app\/en"/);
  assert.match(enHtml,/Open journal/);
});

test("renders editorially managed public information",async()=>{
  const admissionsHtml=await (await render("/admissions")).text();
  assert.match(admissionsHtml,/19 липня — 1 серпня, 18:00/);
  assert.match(admissionsHtml,/Ключові дати 2026/);

  const scheduleHtml=await (await render("/schedule")).text();
  assert.match(scheduleHtml,/Основи менеджменту/);
  assert.match(scheduleHtml,/Графік іспитів і заліків/);

  const libraryHtml=await (await render("/facilities/library")).text();
  assert.match(libraryHtml,/Конституційне право України/);

  const eventsHtml=await (await render("/events")).text();
  assert.match(eventsHtml,/Міжнародний день Академії/);

  const researchHtml=await (await render("/research")).text();
  assert.match(researchHtml,/Ресурси Академії/);
  assert.match(researchHtml,/Повний випуск наукового журналу Академії у форматі PDF/);
  assert.match(researchHtml,/sites\/default\/files\/Visnyk_1-2_2020\.pdf/);
  assert.doesNotMatch(researchHtml,/socosvita\.kiev\.ua\/Visnyk_/);
});

test("ships the complete mobile layout system",async()=>{
  const [css,schedule,exams,english]=await Promise.all([
    readFile(new URL("../app/expanded.css",import.meta.url),"utf8"),
    readFile(new URL("../app/schedule/ScheduleBrowser.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/exam-schedule/ExamScheduleBrowser.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/en/EnglishInteractive.tsx",import.meta.url),"utf8"),
  ]);
  assert.match(css,/table\.schedule-table tr\{display:grid/);
  assert.match(css,/\.auth-card\{width:100%;max-width:100%/);
  assert.match(css,/input,select,textarea\{font-size:16px!important/);
  assert.match(css,/@media\(max-width:360px\)/);
  assert.match(css,/\.contact-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)\}/);
  assert.match(css,/\.ct\{min-width:0;overflow:hidden\}/);
  assert.match(schedule,/data-label="Дисципліна"/);
  assert.match(schedule,/className="weekly-schedule-wrap"/);
  assert.match(schedule,/"Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця"/);
  assert.match(exams,/data-label="Контроль"/);
  assert.match(english,/data-label="Subject"/);
  assert.match(english,/className="weekly-schedule-wrap"/);
});

test("renders one accessible navigation menu across languages",async()=>{
  const [ukHtml,enHtml,header,css]=await Promise.all([
    (await render("/programs")).text(),
    (await render("/en/programs")).text(),
    readFile(new URL("../app/components/SiteHeader.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/expanded.css",import.meta.url),"utf8"),
  ]);
  assert.match(ukHtml,/aria-controls="site-navigation"/);
  assert.match(ukHtml,/Відкрити меню/);
  assert.match(enHtml,/Open menu/);
  assert.match(header,/event\.key !== "Escape"/);
  assert.match(header,/document\.body\.style\.overflow = "hidden"/);
  assert.match(header,/className="desktop-mainnav"/);
  assert.match(css,/\.mainnav\{display:block;position:absolute;top:100%/);
  assert.match(css,/@media\(min-width:1101px\)\{\.mainnav\{display:none\}\.burger\{display:none\}\}/);
  assert.match(css,/height:calc\(100svh - 68px\)/);
  assert.match(css,/\.mainnav\{background:var\(--paper\)\}/);
});

test("ships a protected Supabase editorial panel",async()=>{
  const login=await render("/panel/login");
  assert.equal(login.status,200);
  const html=await login.text();
  assert.match(html,/Вхід до панелі/);
  assert.match(html,/Підключення готується/);

  const [panel,auth,migration]=await Promise.all([
    readFile(new URL("../app/panel/page.tsx",import.meta.url),"utf8"),
    readFile(new URL("../lib/auth.ts",import.meta.url),"utf8"),
    readFile(new URL("../supabase/migrations/202607220001_editorial_panel.sql",import.meta.url),"utf8"),
  ]);
  assert.doesNotMatch(panel,/apsvt-academy\.ikucha\.chatgpt\.site\/panel/);
  assert.match(panel,/initialProfiles/);
  assert.match(auth,/status !== "approved"/);
  assert.match(migration,/enable row level security/i);
  assert.match(migration,/editorial-media/);
  assert.match(migration,/private\.is_approved_editor/);
});
