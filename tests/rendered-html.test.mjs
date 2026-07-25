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
  const paths=["/en/about","/en/programs","/en/admissions","/en/tuition","/en/people","/en/international","/en/research","/en/research/journals","/en/research/conferences","/en/facilities","/en/facilities/campus","/en/facilities/dormitory","/en/facilities/library","/en/events","/en/students","/en/schedule","/en/exam-schedule","/en/academic-calendar","/en/materials","/en/stories","/en/faq","/en/news","/en/contacts"];
  for(const path of paths){
    const response=await render(path);
    assert.equal(response.status,200,`${path} should render`);
    const html=await response.text();
    assert.match(html,/Academy of Labour|Admissions 2026|Degree programmes|Research and publications|Campus and services|Student space|Academy events|Class schedule|Examination timetable|Academic year|Academy materials|Academy stories|Frequently asked questions|News and stories|Contacts|Clear tuition/i,`${path} should contain English content`);
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

test("publishes international partnerships and the foreign applicant guide",async()=>{
  const html=await (await render("/international")).text();
  assert.match(html,/Studieninstitut POLS/);
  assert.match(html,/Transport and Telecommunication Institute/);
  assert.match(html,/Vysoká škola technická a ekonomická v Prešove/);
  assert.match(html,/Академія оформлює електронне запрошення на навчання/);
  assert.match(html,/apply\.studyinukraine\.gov\.ua\/home/);
  assert.match(html,/758-2024-%D0%BF#Text/);
  assert.match(html,/07-poriadok-pryiomu-inozemtsiv\.pdf/);
  assert.match(html,/Чи оформлює Академія запрошення на навчання/);
  assert.match(html,/inz@sococvita\.kiev\.ua/);
});

test("publishes the Academy licence, accreditation scans and verification links",async()=>{
  const html=await (await render("/about/licenses")).text();
  assert.match(html,/Ліцензії\.<br\/>Акредитація\./);
  assert.match(html,/17/);
  assert.match(html,/license-educational-activity-2021\.pdf/);
  assert.match(html,/Сертифікат № 1498/);
  assert.match(html,/Серія АП № 11009149/);
  assert.match(html,/registry\.edbo\.gov\.ua\/university\/53/);
  assert.match(html,/registry\.naqa\.gov\.ua/);
  assert.match(html,/Архів попередніх сертифікатів/);

  const licence=await readFile(new URL("../public/documents/licenses/license-educational-activity-2021.pdf",import.meta.url));
  assert.equal(licence.subarray(0,4).toString(),"%PDF");

  const scans=[
    "01-marketing-bachelor.jpg",
    "02-social-work-master.jpg",
    "03-social-work-bachelor.jpg",
    "04-management-bachelor.jpg",
    "05-finance-bachelor.jpg",
    "06-law-bachelor.jpg",
    "07-sociology-bachelor.jpg",
    "08-finance-master.jpg",
    "09-law-master.jpg",
    "10-marketing-master.jpg",
    "11-entrepreneurship-bachelor.jpg",
    "12-tourism-bachelor.jpg",
    "13-management-master.jpg",
    "14-entrepreneurship-master.jpg",
    "15-finance-bachelor-archive.jpg",
    "16-bachelor-archive.jpg",
  ];
  for(const scan of scans){
    const image=await readFile(new URL(`../public/documents/licenses/${scan}`,import.meta.url));
    assert.equal(image[0],0xff,`${scan} should remain a JPEG`);
    assert.equal(image[1],0xd8,`${scan} should remain a JPEG`);
  }
});

test("publishes the official documents hub in the footer",async()=>{
  const [homeHtml,documentsHtml]=await Promise.all([
    (await render("/")).text(),
    (await render("/documents")).text(),
  ]);
  assert.match(homeHtml,/href="\/documents"[^>]*>Документи<\/a>/);
  assert.match(documentsHtml,/Документи\.<br\/><em>Зрозуміло\.<\/em>/);
  assert.match(documentsHtml,/Положення про організацію освітнього процесу/);
  assert.match(documentsHtml,/Запобігання корупції/);
  assert.match(documentsHtml,/Ліцензії та акредитація/);
  assert.match(documentsHtml,/<b>27<\/b><p>ключових офіційних документів<\/p>/);
  assert.match(documentsHtml,/438 фрагментів/);
  assert.match(documentsHtml,/href="#catalogue"/);
  assert.match(documentsHtml,/href="#admissions"/);
  assert.doesNotMatch(documentsHtml,/Джерело добірки|Перенесено з офіційного сайту/);
});

test("answers document questions from the curated RAG index with sources",async()=>{
  const app=await worker();
  const response=await app.fetch(new Request("http://localhost/api/documents/ask",{
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify({question:"Як подати апеляцію на результат вступного випробування?"}),
  }),{ASSETS:{fetch:async()=>new Response("Not found",{status:404})}},{waitUntil(){},passThroughOnException(){}});
  assert.equal(response.status,200);
  const answer=await response.json();
  assert.equal(answer.status,"found");
  assert.ok(answer.sources.length>0);
  assert.match(answer.sources[0].title,/апеляц/i);
  assert.match(answer.sources[0].href,/10-poriadok-podannia-apeliatsii\.pdf/);
});

test("publishes the applicant hub and official 2026 admission documents",async()=>{
  const html=await (await render("/admissions")).text();
  assert.match(html,/Вступнику 2026/);
  assert.match(html,/Правила прийому<br\/>та нормативні документи/);
  assert.match(html,/01-pravyla-pryiomu-apsvt-2026\.pdf/);
  assert.match(html,/11-dodatok-8\.pdf/);
  assert.match(html,/Подання і розгляд апеляцій/);
  assert.match(html,/Запитайте\.<br\/>Отримайте джерело\./);
  assert.match(html,/RAG · 11 документів · 150 сторінок/);
  assert.match(html,/Запитання не зберігається/);
  assert.ok(html.indexOf("Правила прийому на навчання")<html.indexOf("Положення про Приймальну комісію"));
  assert.ok(html.indexOf("Положення про Приймальну комісію")<html.indexOf("Дії Приймальної комісії"));
  assert.ok(html.indexOf("Дії Приймальної комісії")<html.indexOf("Додаток 8"));

  const files=[
    "01-pravyla-pryiomu-apsvt-2026.pdf",
    "02-polozhennia-pro-pryimalnu-komisiiu.pdf",
    "03-polozhennia-pro-komisii-vstupnykh-vyprobuvan.pdf",
    "04-poriadok-dii-pk-v-umovakh-zahroz.pdf",
    "05-poriadok-inkliuzyvnosti-vstupnoi-kampanii.pdf",
    "06-poriadok-zberihannia-robit-vstupnykiv.pdf",
    "07-poriadok-pryiomu-inozemtsiv.pdf",
    "08-poriadok-provedennia-vstupnykh-vyprobuvan.pdf",
    "09-poriadok-akredytatsii-media.pdf",
    "10-poriadok-podannia-apeliatsii.pdf",
    "11-dodatok-8.pdf",
  ];
  for(const file of files){
    const pdf=await readFile(new URL(`../public/documents/admissions/${file}`,import.meta.url));
    assert.equal(pdf.subarray(0,4).toString(),"%PDF",`${file} should remain a PDF`);
  }
});

test("publishes official 2026 tuition, secure bank details and local contracts",async()=>{
  const html=await (await render("/tuition")).text();
  assert.match(html,/Вартість<br\/>навчання/);
  for(const value of ["38 600","30 900","43 500","34 800","36 300","23 500","20 400"]){
    assert.match(html,new RegExp(value.replace("$","\\$")));
  }
  assert.doesNotMatch(html,/Тарифи у валютному еквіваленті|\$415|\$500|\$1 500/);
  assert.doesNotMatch(html,/Скопіюйте\.|31\.08\.2023|від 30 900/);
  assert.doesNotMatch(html,/Оберіть свою<br\/>траєкторію|Жодних карткових даних|Локальна копія документа Академії/);
  assert.match(html,/Рівень і програма/);
  assert.match(html,/Форма навчання/);
  assert.match(html,/Навчальний рік/);
  assert.match(html,/Банківські реквізити для оплати навчання/);
  assert.match(html,/UA673052990000026005006704535/);
  assert.match(html,/04641405/);
  assert.match(html,/\+38 096 450 85 04/);
  assert.match(html,/contract-paid-educational-service\.docx/);
  assert.match(html,/contract-education\.docx/);
  assert.match(html,/tuition-2026-2027\.pdf/);
  assert.match(html,/privatbank\.ua\/cpa\/mobile-p24-payments/);
  assert.match(html,/portmone\.com\.ua\/r3\/oplata-osvity-akademiia-pratsi-sotsialnykh-vidnosyn-i-turyzmu-kyiv/);
  assert.match(html,/Оплатити навчання через Portmone/);
  assert.match(html,/Отримувач уже заповнений/);

  const [pdf,paidContract,educationContract,assistant]=await Promise.all([
    readFile(new URL("../public/documents/tuition/tuition-2026-2027.pdf",import.meta.url)),
    readFile(new URL("../public/documents/tuition/contract-paid-educational-service.docx",import.meta.url)),
    readFile(new URL("../public/documents/tuition/contract-education.docx",import.meta.url)),
    readFile(new URL("../app/tuition/TuitionPaymentAssistant.tsx",import.meta.url),"utf8"),
  ]);
  assert.equal(pdf.subarray(0,4).toString(),"%PDF");
  assert.equal(paidContract.subarray(0,2).toString(),"PK");
  assert.equal(educationContract.subarray(0,2).toString(),"PK");
  assert.match(assistant,/navigator\.clipboard\.writeText/);
  assert.match(assistant,/Призначення платежу/);

  const programmeHtml=await (await render("/programs/psychology")).text();
  assert.match(programmeHtml,/Магістратура, заочна/);
  assert.match(programmeHtml,/34 800 ₴ \/ рік/);
  assert.match(programmeHtml,/href="\/tuition#calculator"/);
});

test("answers applicant questions from the indexed admission documents with page citations",async()=>{
  const app=await worker();
  const response=await app.fetch(new Request("http://localhost/api/admissions/ask",{
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify({question:"Як і коли подати апеляцію?"}),
  }),{ASSETS:{fetch:async()=>new Response("Not found",{status:404})}},{waitUntil(){},passThroughOnException(){}});
  assert.equal(response.status,200);
  const answer=await response.json();
  assert.equal(answer.status,"found");
  assert.ok(answer.sources.length>0);
  assert.match(answer.sources[0].href,/10-poriadok-podannia-apeliatsii\.pdf#page=\d+/);
  assert.match(answer.sources[0].title,/апеляцій/i);
  assert.ok(answer.sources[0].excerpt.length>40);
});

test("renders the interactive student schedule application demo",async()=>{
  const response=await render("/student-app");
  assert.equal(response.status,200);
  const html=await response.text();
  const source=await readFile(new URL("../app/student-app/StudentAppDemo.tsx",import.meta.url),"utf8");
  assert.match(html,/Розклад<br\/>у кишені/);
  assert.match(html,/З’єднано з редакційною панеллю/);
  assert.match(html,/Основи менеджменту/);
  assert.match(html,/href="\/schedule"/);
  assert.match(source,/Надіслати демо-сповіщення/);
  assert.match(source,/Мій розклад/);
  assert.match(source,/Notification\.requestPermission/);
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
  assert.match(css,/\.tuition-applicant-table tbody\{display:grid/);
  assert.match(css,/\.tuition-applicant-table tbody td:before\{content:attr\(data-label\)/);
  assert.match(css,/#prices,#continuing,#payment,#contracts,#english-rates,#english-payment\{scroll-margin-top:/);
  assert.match(css,/\.contact-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)\}/);
  assert.match(css,/\.ct\{min-width:0;overflow:hidden\}/);
  assert.match(schedule,/data-label="Дисципліна"/);
  assert.match(schedule,/className="weekly-schedule-wrap"/);
  assert.match(schedule,/className="schedule-weeks"/);
  assert.match(schedule,/Усі опубліковані розклади/);
  assert.match(schedule,/Приєднатися ↗/);
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

  const [panel,auth,migration,access,documents,documentMigration,pageDocuments,accessMigration,accessRules,multiAccessMigration]=await Promise.all([
    readFile(new URL("../app/panel/page.tsx",import.meta.url),"utf8"),
    readFile(new URL("../lib/auth.ts",import.meta.url),"utf8"),
    readFile(new URL("../supabase/migrations/202607220001_editorial_panel.sql",import.meta.url),"utf8"),
    readFile(new URL("../app/panel/AccessManager.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/panel/DocumentManager.tsx",import.meta.url),"utf8"),
    readFile(new URL("../supabase/migrations/202607230001_editorial_documents.sql",import.meta.url),"utf8"),
    readFile(new URL("../app/components/PageDocuments.tsx",import.meta.url),"utf8"),
    readFile(new URL("../supabase/migrations/202607230002_editorial_access_scopes.sql",import.meta.url),"utf8"),
    readFile(new URL("../lib/editorial-access.ts",import.meta.url),"utf8"),
    readFile(new URL("../supabase/migrations/202607230003_editorial_multi_access_scopes.sql",import.meta.url),"utf8"),
  ]);
  assert.doesNotMatch(panel,/apsvt-academy\.ikucha\.chatgpt\.site\/panel/);
  assert.match(panel,/initialProfiles/);
  assert.match(auth,/status !== "approved"/);
  assert.match(migration,/enable row level security/i);
  assert.match(migration,/editorial-media/);
  assert.match(migration,/private\.is_approved_editor/);
  const [loginForm,forgotForm,callback,resetForm]=await Promise.all([
    readFile(new URL("../app/panel/login/LoginForm.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/panel/forgot-password/ForgotPasswordForm.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/auth/callback/route.ts",import.meta.url),"utf8"),
    readFile(new URL("../app/panel/reset-password/ResetPasswordForm.tsx",import.meta.url),"utf8"),
  ]);
  assert.match(loginForm,/Забули пароль/);
  assert.match(forgotForm,/resetPasswordForEmail/);
  assert.match(forgotForm,/\/panel\/reset-password/);
  assert.match(callback,/requestedNext/);
  assert.match(callback,/invalid-link/);
  assert.match(resetForm,/weak_password/);
  assert.match(auth,/inviteUserByEmail/);
  assert.match(auth,/status: "approved"/);
  assert.match(access,/\/api\/editorial\/users/);
  assert.match(access,/Додати й погодити/);
  assert.match(documents,/purpose", "document"/);
  assert.match(documents,/\/api\/documents/);
  assert.match(documentMigration,/editorial_documents/);
  assert.match(documentMigration,/editorial-documents/);
  assert.match(pageDocuments,/getPublicDocuments/);
  assert.match(access,/Сторінки \/ кафедри/);
  assert.match(access,/Кафедри та програми/);
  assert.match(accessMigration,/access_scope/);
  assert.match(accessMigration,/private\.can_edit_page/);
  assert.match(accessRules,/canEditPage/);
  assert.match(accessRules,/Кафедра психології/);
  assert.match(access,/type="checkbox"/);
  assert.match(access,/ScopePicker/);
  assert.match(accessRules,/accessScopes\.includes/);
  assert.match(multiAccessMigration,/string_to_array\(access_scope, ','\)/);
});

test("imports and normalizes sets of Word schedules before publishing",async()=>{
  const [importer,parser,route,content,styles]=await Promise.all([
    readFile(new URL("../app/panel/ScheduleImporter.tsx",import.meta.url),"utf8"),
    readFile(new URL("../lib/schedule-import.ts",import.meta.url),"utf8"),
    readFile(new URL("../app/api/content/import-schedule/route.ts",import.meta.url),"utf8"),
    readFile(new URL("../lib/content.ts",import.meta.url),"utf8"),
    readFile(new URL("../app/expanded.css",import.meta.url),"utf8"),
  ]);
  assert.match(importer,/multiple/);
  assert.match(importer,/parseScheduleDocx/);
  assert.match(importer,/Попередній перегляд/);
  assert.match(importer,/Показувати онлайн-посилання/);
  assert.match(parser,/normalizeTime/);
  assert.match(parser,/parseDateRange/);
  assert.match(parser,/ЕКЗАМЕН\|ЗАЛІК/);
  assert.match(route,/entries\.length > 600/);
  assert.match(route,/requirePagePublisher/);
  assert.match(content,/replaceImportedSchedule/);
  assert.match(content,/json_extract\(payload, '\$\.sourceId'\)/);
  assert.match(styles,/\.schedule-import-table-wrap/);
});

test("ships the public BytesLab Academy workspace with protected management",async()=>{
  const [page,dashboard,route,storage,styles]=await Promise.all([
    readFile(new URL("../app/panel/workspace/page.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/panel/workspace/WorkspaceDashboard.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/api/workspace/[id]/route.ts",import.meta.url),"utf8"),
    readFile(new URL("../lib/workspace.ts",import.meta.url),"utf8"),
    readFile(new URL("../app/panel/workspace/workspace.css",import.meta.url),"utf8"),
  ]);
  assert.match(page,/getPublisher/);
  assert.doesNotMatch(page,/redirect\("\/panel\/login"\)/);
  assert.match(dashboard,/Публічний перегляд/);
  assert.match(dashboard,/AI-помічник оцінювання|AI-оцінювання/);
  assert.match(dashboard,/Moodle \+ Telegram/);
  assert.match(dashboard,/disabled=\{!isAdmin/);
  assert.match(route,/publisher\.role !== "admin"/);
  assert.match(route,/requireAdmin\(\)/);
  assert.match(storage,/__byteslab_workspace__/);
  assert.match(storage,/workspace_items/);
  assert.match(styles,/@media\(max-width:720px\)/);
});
