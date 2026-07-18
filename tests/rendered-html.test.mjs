import assert from "node:assert/strict";
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
