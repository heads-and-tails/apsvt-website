import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { strFromU8, unzipSync } from "fflate";
import { createHash } from "node:crypto";

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
  assert.match(html,/mental-health-conference-science-2026\.jpg/);
  assert.match(html,/Запрошуємо стати частиною Erasmus\+ Days 2026!/);
  assert.match(html,/Гостьова лекція Єнс-Райнхольда Губерта/);
  assert.match(html,/АПСВТ Наталія Гончаренко взяла участь у програмі PILC &amp; SEITE 2026/);
  assert.match(html,/Навчання «Використання штучного інтелекту для автоматизації міжнародного співробітництва у ЗВО»/);
  assert.doesNotMatch(html,/codex-preview|Your site is taking shape/i);
});

test("publishes the sourced Volodymyr Lipkan column in Academy news",async()=>{
  const slug="volodymyr-lipkan-stratehichna-subiektnist-ukrainy-2026";
  const response=await render(`/news/${slug}`);
  assert.equal(response.status,200);
  const html=await response.text();
  assert.match(html,/Володимир Ліпкан про роль України у світовій безпековій архітектурі/);
  assert.match(html,/people\/law\/criminal\/volodymyr-lipkan\.jpg/);
  assert.match(html,/https:\/\/24tv\.ua\/chomu-zahodi-ne-otsinili-realniy-potentsial-ukrayini-naperedodni_n3155553/);
  assert.match(html,/https:\/\/www\.facebook\.com\/groups\/apsvt\/permalink\/4524404904497978/);
  const news=await(await render("/news")).text();
  assert.ok(news.includes(`/news/${slug}`));
  const english=await render(`/en/news/${slug}`);
  assert.equal(english.status,200);
  assert.match(await english.text(),/Volodymyr Lipkan on Ukraine/);
});

test("returns 404 for missing staff profiles in both languages without replacing the people index",async()=>{
  for(const path of ["/people/missing-staff-profile","/en/people/missing-staff-profile"]){
    const response=await render(path);
    assert.equal(response.status,404,path);
  }
  assert.equal((await render("/people")).status,200);
  assert.equal((await render("/en/people")).status,200);
});

test("publishes the supplied D4 doctoral files with guarantor information and separate closed drafts",async()=>{
  const response=await render("/departments/law-faculty/faculty-programmes/d4-public-administration-phd");
  assert.equal(response.status,200);
  const html=await response.text();
  assert.match(html,/Васильєва Наталія Вікторівна/);
  assert.match(html,/Ще не проводилася/);
  for(const file of ["phd/2025/d4-public-administration.pdf","public-administration/phd/curriculum-full-time-2025-2026.pdf","public-administration/phd/curriculum-part-time-2025-2026.pdf","public-administration/phd/teaching-team-qualifications.doc","public-administration/phd/draft-programme-2025.pdf","public-administration/phd/draft-curriculum-full-time-2025.pdf","public-administration/phd/draft-curriculum-part-time-2025.pdf"])assert.ok(html.includes(file),file);
  const drafts=html.match(/<details[^>]*id="drafts"[^>]*>/);
  assert.ok(drafts);
  assert.doesNotMatch(drafts[0],/\bopen\b/);
  const law=await(await render("/departments/law-faculty/faculty-programmes/d8-law-bachelor")).text();
  assert.doesNotMatch(law,/public-admin-materials/);
});

test("publishes the complete supplied master's package and uses its approved OPP in current catalogues",async()=>{
  const html=await(await render("/departments/law-faculty/faculty-programmes/d4-public-administration-master")).text();
  for(const value of ["Міщенко Катерина Семенівна","56066","01.07.2029","липень 2029","thesis-guidelines.pdf","thesis-topics.pdf","thesis-application.pdf","accreditation-certificate-6830.pdf","curriculum-full-time-2025-2026.pdf","curriculum-part-time-2025-2026.pdf","pre-diploma-practice.pdf","practice-bases.pdf"])assert.ok(html.includes(value),value);
  const current="/documents/programmes/public-administration/master/programme-2025-2026.pdf";
  assert.ok(html.includes(current));
  assert.ok((await(await render("/documents")).text()).includes(current));
  assert.ok((await(await render("/programs/public-administration")).text()).includes(current));
});

test("publishes bachelor's course materials without false empty states and exposes the approved OPP in catalogues",async()=>{
  const html=await(await render("/departments/law-faculty/faculty-programmes/d4-public-administration-bachelor")).text();
  for(const value of ["Качан Яна Віталіївна","56065","Умовна (відкладена)","21.04.2027","березень 2027","mandatory-programmes","mandatory-annotations","elective-annotations","archive-2024","archive-2023","programme-discussion-records","student-survey-records"])assert.ok(html.includes(value),value);
  assert.doesNotMatch(html,/Робочі програми ще не оприлюднено|Анотації ще не оприлюднено/);
  for(const group of ["mandatory-programmes","mandatory-annotations","elective-annotations","archive-2024","archive-2023","drafts"]){
    const disclosure=html.match(new RegExp(`<details[^>]*id="${group}"[^>]*>`));
    assert.ok(disclosure,group);assert.doesNotMatch(disclosure[0],/\bopen\b/);
  }
  const current="/documents/programmes/public-administration/bachelor/programme-2025-2026.pdf";
  assert.ok(html.includes(current));
  assert.ok((await(await render("/documents")).text()).includes(current));
  assert.ok((await(await render("/programs/public-administration")).text()).includes(current));
  const master=await(await render("/departments/law-faculty/faculty-programmes/d4-public-administration-master")).text();
  assert.match(master,/Робочі програми ще не оприлюднено/);
});

test("renders six dated historical discussion articles with source projects and photos outside current news",async()=>{
  const programme=await(await render("/departments/law-faculty/faculty-programmes/d4-public-administration-bachelor")).text();
  const currentNews=await(await render("/news")).text();
  for(const [year,date,dateLabel] of [[2023,"2023-04-18","18.04.2023"],[2024,"2024-03-07","07.03.2024"],[2025,"2025-05-19","19.05.2025"]]){
    for(const kind of ["announcement","report"]){
      const path=`/news/archive/public-administration-bachelor-discussion-${year}-${kind}`;
      const response=await render(path);assert.equal(response.status,200,path);const html=await response.text();
      assert.ok(programme.includes(path));assert.ok(!currentNews.includes(path));
      assert.ok(html.includes(`<time dateTime="${date}">${dateLabel}</time>`));
      assert.match(html,/Проєкт ОПП «Публічне управління та адміністрування»/);
      assert.match(html,/href="\/news\/archive"/);
      assert.match(html,/href="\/departments\/law-faculty\/faculty-programmes\/d4-public-administration-bachelor"/);
      assert.equal((html.match(/src="\/images\/programme-discussions\//g)||[]).length,kind==="report"?2:0);
      assert.ok(html.includes(kind==="announcement"?"відбудеться":year===2024?"було проведено":"відбулося"));
    }
  }
  assert.equal((await render("/news/archive/unknown-programme-discussion")).status,404);
});

test("takes the Ukrainian source archive EN control to the available English news index",async()=>{
  const paths=["/news/archive",...[2023,2024,2025].flatMap(year=>["announcement","report"].map(kind=>`/news/archive/public-administration-bachelor-discussion-${year}-${kind}`))];
  for(const path of paths){
    const html=await(await render(path)).text();
    const toggle=html.match(/<a[^>]*class="lang-toggle"[^>]*>/)?.[0];
    assert.ok(toggle);assert.match(toggle,/href="\/en\/news"/);
  }
  const english=await render("/en/news");assert.equal(english.status,200);
  assert.match(await english.text(),/News and/);
});

test("renders a separate guarantor and teaching-team section on every A5 programme",async()=>{
  for(const slug of ["digital-bachelor","digital-master","information-security-bachelor","information-security-master","phd"]){
    const response=await render(`/programs/professional-education/${slug}`);
    assert.equal(response.status,200);
    const html=await response.text();
    assert.match(html,/id="programme-team"/);
    assert.match(html,/Гарант і група забезпечення ОП/);
    assert.match(html,/id="programme-documents"/);
    assert.match(html,/id="curriculum"/);
  }
});

test("publishes Yaroslav Zhuravel's AI training report with three supplied event photos",async()=>{
  const article=await render("/news/treninh-shtuchnyi-intelekt-osvita-nauka-2026");
  assert.equal(article.status,200);
  const html=await article.text();
  assert.match(html,/13 жовтня 2026 року в Академії праці/);
  assert.match(html,/Наталія Гончаренко/);
  assert.doesNotMatch(html,/Освіта стає цінною тоді|<b>Автор<\/b>/);
  for(const file of ["ai-training-2026-01.jpeg","ai-training-2026-02.jpeg","ai-training-2026-03.jpeg"]){
    assert.match(html,new RegExp(file));
  }
  assert.doesNotMatch(html,/115656\.png/);
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
  assert.match(ukHtml,/href="\/research\/journals\/visnyk"/);
  assert.match(ukHtml,/Відкрити Вісник/);
  assert.doesNotMatch(ukHtml,/alsrt\.com\.ua/);
  assert.match(enHtml,/href="\/research\/journals\/visnyk\/en"/);
  assert.match(enHtml,/Open journal/);
});

test("publishes the verified 2025 Scientific Bulletin record without an embedded site",async()=>{
  const html=await (await render("/research/journals/visnyk")).text();
  assert.match(html,/ISSN 3041-2390/);
  assert.match(html,/24\.02\.2025 № 349/);
  assert.match(html,/C1/);
  assert.match(html,/C4/);
  assert.match(html,/D2/);
  assert.match(html,/D3/);
  assert.match(html,/visnyk-cover-2025\.jpg/);
  assert.doesNotMatch(html,/<iframe/);
  assert.doesNotMatch(html,/D1 Облік/);
});

test("uses one scannable academic order and keeps May 2026 archive documents local",async()=>{
  const [programme,faculty,department]=await Promise.all([
    (await render("/programs/finance")).text(),
    (await render("/departments/economics-social-tourism-faculty")).text(),
    (await render("/departments/criminal-law")).text(),
  ]);
  for(const html of [programme,faculty,department]) assert.match(html,/admissions-section-hub/);
  for(const label of ["Про програми","Навчальний план","Кафедра і освітнє середовище","Міжнародні проєкти","Якість освіти"]){
    assert.match(programme,new RegExp(label));
  }
  assert.match(faculty,/Навігатор факультету/);
  assert.match(department,/criminal-law-department-2023\.pdf/);
  for(const file of ["quality-system.pdf","student-survey-questionnaires.pdf","law-faculty-regulation-2023.pdf","criminal-law-department-2023.pdf"]){
    const bytes=await readFile(new URL(`../public/documents/archive/may-2026/${file}`,import.meta.url));
    assert.ok(bytes.length>100000,`${file} should be a downloaded archive PDF`);
  }
});

test("finance programmes offer direct bachelor and master navigation without photo overlays",async()=>{
  const html=await (await render("/programs/finance#overview")).text();
  assert.match(html,/href="#finance-bachelor"/);
  assert.match(html,/href="#finance-master"/);
  assert.match(html,/id="finance-bachelor"/);
  assert.match(html,/id="finance-master"/);
  assert.match(html,/academic-profile-badge/);
  assert.doesNotMatch(html,/academic-profile-photo[^>]*>[\s\S]{0,500}<em>Керівник кафедри<\/em>/);
});

test("finance materials follow the department's course structure and link to supplied PDFs",async()=>{
  const html=await (await render("/programs/finance#overview")).text();
  for(const label of ["Документи бакалаврату","1 курс","2 курс","3 курс","4 курс","Документи магістратури","Програмні дисципліни","Фахова фінансова підготовка","27","Грантове фінансування","Видання кафедри фінансів"]){
    assert.match(html,new RegExp(label));
  }
  for(const file of ["bachelor-fulltime-2026.pdf","bachelor-fulltime-2025.pdf","bachelor-parttime-2025.pdf","bachelor-fulltime-2024.pdf","bachelor-parttime-2024.pdf","bachelor-parttime-2023.pdf","master-programme-2025.pdf","master-fulltime-2025.pdf","master-parttime-2025.pdf"]){
    assert.match(html,new RegExp(file));
    const bytes=await readFile(new URL(`../public/documents/programmes/finance/${file}`,import.meta.url));
    assert.ok(bytes.length>100000,`${file} should be an attached PDF`);
  }
  assert.doesNotMatch(html,/master-fulltime-2026\.pdf/);
  for(const file of ["greenfinedu-guide","greenfinedu-proceedings","greenfinedu-conference-programme"]){
    assert.match(html,new RegExp(`${file}\\.pdf`));
    const pdf=await readFile(new URL(`../public/documents/research/finance/${file}.pdf`,import.meta.url));
    const cover=await readFile(new URL(`../public/images/finance/${file}.jpg`,import.meta.url));
    assert.ok(pdf.length>100000 && cover.length>100000,`${file} should include the supplied PDF and cover`);
  }
});

test("documents catalogue includes the shared faculty and department section",async()=>{
  const html=await (await render("/documents")).text();
  assert.match(html,/Документи кафедр і факультетів/);
  assert.match(html,/Матеріали, які кафедри та факультети публікують через редакційну панель/);
});

test("keeps corrected admissions and archive documents in their requested sections",async()=>{
  const [admissionsHtml,documentsHtml]=await Promise.all([
    (await render("/admissions#enrollment-orders")).text(),
    (await render("/documents")).text(),
  ]);
  const ordersStart=admissionsHtml.indexOf('id="enrollment-orders"');
  const bachelorStart=admissionsHtml.indexOf("Бакалаврат",ordersStart);
  const masterStart=admissionsHtml.indexOf("Магістратура",bachelorStart+1);
  const phdStart=admissionsHtml.indexOf("Аспірантура",masterStart+1);
  assert.ok(bachelorStart>=0 && masterStart>bachelorStart && phdStart>masterStart);
  assert.doesNotMatch(admissionsHtml.slice(bachelorStart,masterStart),/№ 222\/с/);
  assert.match(admissionsHtml.slice(masterStart,phdStart),/№ 222\/с/);
  assert.match(documentsHtml,/Етичний кодекс АПСВТ/);
  assert.match(documentsHtml,/План запобігання, виявлення та протидії корупції/);
  assert.match(documentsHtml,/Архів матеріалів із запобігання та протидії корупції/);
});

test("links the recovered May 2026 news archive from the public news section",async()=>{
  const [newsHtml,archiveHtml]=await Promise.all([
    (await render("/news")).text(),
    (await render("/news/archive")).text(),
  ]);
  assert.match(newsHtml,/href="\/news\/archive"/);
  assert.match(newsHtml,/751 матеріал/);
  assert.match(archiveHtml,/Архів[\s\S]*новин/);
  assert.match(archiveHtml,/Збережена копія станом на травень 2026 року/);
  const index=JSON.parse(await readFile(new URL("../public/materials-index.json",import.meta.url),"utf8"));
  assert.equal(index.filter((item)=>item.category==="Новини та події").length,751);
});

test("renders editorially managed public information",async()=>{
  const admissionsHtml=await (await render("/admissions")).text();
  assert.match(admissionsHtml,/19 липня — 1 серпня, 18:00/);
  assert.match(admissionsHtml,/Ключові дати 2026/);

  const scheduleHtml=await (await render("/schedule")).text();
  assert.match(scheduleHtml,/Офіційні навчальні ресурси/);
  assert.match(scheduleHtml,/Розклад заліків та іспитів/);
  assert.doesNotMatch(scheduleHtml,/Основи менеджменту/);
  assert.match(scheduleHtml,/moodle\.socosvita\.kiev\.ua/);

  const libraryHtml=await (await render("/facilities/library")).text();
  assert.match(libraryHtml,/Конституційне право України/);

  const eventsHtml=await (await render("/events")).text();
  assert.match(eventsHtml,/Міжнародний день Академії/);

  const vacanciesHtml=await (await render("/vacancies")).text();
  assert.doesNotMatch(vacanciesHtml,/vacancy-status/);
  assert.doesNotMatch(vacanciesHtml,/Термін у розміщеному оголошенні/);
  assert.match(vacanciesHtml,/21 липня — 24 серпня 2026 року/);
  assert.match(vacanciesHtml,/Конкурс №2 і №3/);
  assert.match(vacanciesHtml,/<b>18<\/b><strong>відкритих посад<\/strong>/);
  assert.match(vacanciesHtml,/До [\s\S]{0,80}16 вересня 2026 року[\s\S]{0,80} включно/);
  assert.match(vacanciesHtml,/Кафедра української та іноземних мов і гуманітарних наук/);
  assert.match(vacanciesHtml,/Кафедра клінічної психології та психотерапії/);
  assert.match(vacanciesHtml,/Кафедра психології бізнесу та управління/);
  assert.match(vacanciesHtml,/konkurs-2-3-movy-psykholohiia-2026\.docx/);

  const researchHtml=await (await render("/research")).text();
  assert.match(researchHtml,/Ресурси Академії/);
  assert.match(researchHtml,/Повний випуск наукового журналу Академії у форматі PDF/);
  assert.match(researchHtml,/sites\/default\/files\/Visnyk_1-2_2020\.pdf/);
  assert.doesNotMatch(researchHtml,/socosvita\.kiev\.ua\/Visnyk_/);
});

test("publishes academic competition 2 and 3 in news",async()=>{
  const slug="konkurs-2-3-naukovo-pedahohichni-pratsivnyky-2026";
  const [newsHtml,articleHtml]=await Promise.all([
    (await render("/news")).text(),
    (await render(`/news/${slug}`)).text(),
  ]);
  assert.match(newsHtml,/Оголошено конкурс №2 і №3/);
  assert.match(articleHtml,/18 посад/);
  assert.match(articleHtml,/до 16 вересня 2026 року включно/i);
  assert.match(articleHtml,/href="\/vacancies#competition-2-3"/);
  assert.match(articleHtml,/konkurs-2-3-movy-psykholohiia-2026\.docx/);
});

test("publishes the Mental Health conference and Academy strategy",async()=>{
  const articleHtml=await (await render("/news/mental-health-conference-2026")).text();
  assert.match(articleHtml,/ІІ Міжнародна науково-практична конференція/);
  assert.match(articleHtml,/8 жовтня · 10:00/);
  assert.match(articleHtml,/820 3384 7880/);
  assert.match(articleHtml,/us02web\.zoom\.us\/j\/82033847880\?pwd=mes82pPUnHbGTplhIE0rXPrnCbsRHp\.1/);
  assert.doesNotMatch(articleHtml,/92275487678|922 7548 7678/);
  assert.match(articleHtml,/mental-health-conference-science-2026\.jpg/);
  assert.match(articleHtml,/Програма конференції/);
  assert.match(articleHtml,/mental-health-conference-2026-program-v2\.pdf/);
  assert.doesNotMatch(articleHtml,/mental-health-conference-2026-information-letter\.docx/);

  const documentsHtml=await (await render("/documents#governance")).text();
  assert.match(documentsHtml,/Стратегія розвитку Академії до 2026 року/);
  assert.match(documentsHtml,/strategy-development-to-2026\.pdf/);
  assert.match(documentsHtml,/statute-2017\.pdf/);

  const strategy=await readFile(new URL("../public/documents/academy/strategy-development-to-2026.pdf",import.meta.url));
  const conferenceProgram=await readFile(new URL("../public/documents/news/mental-health-conference-2026-program-v2.pdf",import.meta.url));
  assert.equal(strategy.subarray(0,4).toString(),"%PDF");
  assert.equal(conferenceProgram.subarray(0,4).toString(),"%PDF");
});

test("publishes the international cooperation AI training with online registration",async()=>{
  const slug="treninh-shi-mizhnarodne-spivrobitnytstvo-2026";
  const [homeHtml,newsHtml,articleHtml,eventsHtml]=await Promise.all([
    (await render("/")).text(),
    (await render("/news")).text(),
    (await render(`/news/${slug}`)).text(),
    (await render(`/events?event=${encodeURIComponent("Використання штучного інтелекту для автоматизації міжнародного співробітництва у ЗВО")}`)).text(),
  ]);
  for(const html of [homeHtml,newsHtml,articleHtml]) assert.match(html,/Використання штучного інтелекту для автоматизації міжнародного співробітництва у ЗВО/);
  assert.match(articleHtml,/13 жовтня · 11:30/);
  assert.match(articleHtml,/Науково-педагогічні працівники та здобувачі освіти/);
  assert.match(articleHtml,/href="\/events\?event=.*#registration"/);
  assert.match(eventsHtml,/оптимізація підготовки грантових заявок/i);
  assert.match(eventsHtml,/Для науково-педагогічних працівників і здобувачів освіти Академії/);
  assert.match(eventsHtml,/13 жовтня 2026 р\./);
  assert.match(eventsHtml,/selected=""[^>]*>Використання штучного інтелекту/);
});

test("publishes both corrected Project Lab presentations in the international section",async()=>{
  const html=await (await render("/international#project-lab")).text();
  assert.match(html,/Project Lab: ШІ в заявках Erasmus\+/);
  assert.match(html,/project-lab-ai-erasmus-basic-2026\.pptx/);
  assert.match(html,/project-lab-ai-erasmus-academy-2026\.pptx/);
  assert.match(html,/Путівник з міжнародної мобільності/);
  for(const name of ["project-lab-ai-erasmus-basic-2026.pptx","project-lab-ai-erasmus-academy-2026.pptx"]){
    const bytes=await readFile(new URL(`../public/documents/international/project-lab/${name}`,import.meta.url));
    assert.equal(bytes.subarray(0,2).toString(),"PK");
    assert.ok(bytes.length>50000);
    const archive = unzipSync(bytes);
    const slides = Object.entries(archive).filter(([path]) => /^ppt\/slides\/slide\d+\.xml$/.test(path));
    assert.equal(slides.length, 10);
    const text = slides.flatMap(([, xml]) => [...strFromU8(xml).matchAll(/<a:t\b[^>]*>([\s\S]*?)<\/a:t>/g)].map(match => match[1])).join(" ");
    assert.doesNotMatch(text, /Заявки без плагіату, що повністю відповідають вимогам EU AI Act|Обов['’]язкове декларування використання ШІ згідно з EU AI Act 2026/);
    assert.match(text, name.includes("academy")
      ? /Практичні навички для підготовки оригінальних заявок із перевіркою фактів, джерел та вимог конкретного конкурсу/
      : /Перевіряйте вимоги конкретного конкурсу щодо використання ШІ; дотримуйтеся правил оригінальності, точності та інтелектуальної власності/);
  }
});

test("publishes the PILC and SEITE 2026 international programme",async()=>{
  const articleHtml=await (await render("/news/natalia-goncharenko-pilc-seite-2026")).text();
  assert.match(articleHtml,/АПСВТ Наталія Гончаренко взяла участь у програмі PILC &amp; SEITE 2026/);
  assert.match(articleHtml,/Людиноцентричне лідерство/);
  assert.match(articleHtml,/Horizon Europe, Erasmus\+/);
  assert.match(articleHtml,/youtu\.be\/DANh8PwOcN4/);
  assert.doesNotMatch(articleHtml,/0506073117|050 607 31 17/);
});

test("publishes the faculty staff meeting through both news lists and its Ukrainian/English articles",async()=>{
  const slug = "zbory-kolektyvu-fakultetu-psykholohii-19-zhovtnia-2026";
  for (const path of ["/news", "/departments/psychology-social-development-faculty"]) {
    const response = await render(path);
    assert.equal(response.status, 200);
    const html = await response.text();
    const cards = (html.match(/<a\b[^>]*>/g) || []).filter(tag => tag.includes('class="news"') && tag.includes(`href="/news/${slug}"`));
    assert.equal(cards.length, 1);
    assert.match(html, /19 жовтня 2026 року о 18:00/);
  }
  for (const path of [`/news/${slug}`, `/en/news/${slug}`]) {
    const response = await render(path);
    assert.equal(response.status, 200);
    const html = await response.text();
    const agenda = html.match(/<ol[^>]*>([\s\S]*?)<\/ol>/)?.[1];
    assert.ok(agenda);
    assert.equal((agenda.match(/<li>/g) || []).length, 3);
    assert.match(html, path.startsWith("/en/") ? /19 October 2026 at 18:00/ : /19\.10\.26 року у 18\.00/);
  }
});

test("publishes the guest lecture in Academy and faculty news",async()=>{
  const [homeHtml,newsHtml,facultyHtml,articleHtml]=await Promise.all([
    (await render("/")).text(),
    (await render("/news")).text(),
    (await render("/departments/psychology-social-development-faculty")).text(),
    (await render("/news/guest-lecture-jens-reinhold-hubert-2026")).text(),
  ]);
  for(const html of [homeHtml,newsHtml,facultyHtml]) assert.match(html,/Гостьова лекція Єнс-Райнхольда Губерта/);
  assert.match(articleHtml,/8 жовтня · 13:20/);
  assert.match(articleHtml,/820 3384 7880 · код 977364/);
  assert.match(articleHtml,/news-guest-lecture-2026-10-08\.png/);
});

test("publishes the conference results, current regulations and mobility guide",async()=>{
  const [resultsHtml,conferencesHtml,regulationsHtml,documentsHtml,internationalHtml,studentsHtml]=await Promise.all([
    (await render("/news/mental-health-conference-2026-results")).text(),
    (await render("/research/conferences")).text(),
    (await render("/documents/regulations")).text(),
    (await render("/documents#governance")).text(),
    (await render("/international#mobility-guide")).text(),
    (await render("/students")).text(),
  ]);
  assert.match(resultsHtml,/Відбулася ІІ Міжнародна науково-практична конференція/);
  assert.match(resultsHtml,/Наталія Родіна/);
  assert.match(resultsHtml,/Єнса-Райнхольда Губерта/);
  assert.match(conferencesHtml,/Підсумки конференції/);
  assert.match(regulationsHtml,/Положення про організацію освітнього процесу в АПСВТ/);
  assert.match(regulationsHtml,/educational-process-2026\.pdf/);
  assert.match(regulationsHtml,/Положення про академічну доброчесність в АПСВТ/);
  assert.match(regulationsHtml,/academic-integrity-2026\.pdf/);
  assert.match(documentsHtml,/statute-apsvt-2026\.docx/);
  assert.match(internationalHtml,/Путівник з міжнародної мобільності/);
  assert.match(internationalHtml,/international-mobility-guide-2026\.pptx/);
  assert.match(studentsHtml,/Путівник з міжнародної мобільності/);

  const pdfs=["academic-integrity-2026.pdf","educational-process-2026.pdf"];
  for(const file of pdfs){
    const bytes=await readFile(new URL(`../public/documents/regulations/${file}`,import.meta.url));
    assert.equal(bytes.subarray(0,4).toString(),"%PDF",`${file} should remain a PDF`);
  }
  for(const file of [
    "governance/statute-apsvt-2026.docx",
    "international/international-mobility-guide-2026.pptx",
  ]){
    const bytes=await readFile(new URL(`../public/documents/${file}`,import.meta.url));
    assert.equal(bytes.subarray(0,2).toString(),"PK",`${file} should remain a valid Office archive`);
  }
});

test("lists the 2026 academic staff vacancy competition regulation with its original PDF",async()=>{
  const html=await (await render("/documents/regulations")).text();
  assert.match(html,/Положення про проведення конкурсу на заміщення вакантних посад науково-педагогічних працівників/);
  assert.match(html,/href="\/documents\/regulations\/npp-vacancy-competition-2026\.pdf"/);
  assert.match(html,/12 сторінок/);
  const bytes=await readFile(new URL("../public/documents/regulations/npp-vacancy-competition-2026.pdf",import.meta.url));
  assert.equal(bytes.subarray(0,4).toString(),"%PDF");
});

test("replaces the outdated bullying measures plan with the 2026–2027 signed PDF",async()=>{
  const [regulationsHtml,documentsHtml]=await Promise.all([
    (await render("/documents/regulations")).text(),
    (await render("/documents")).text(),
  ]);
  for(const html of [regulationsHtml,documentsHtml]){
    assert.match(html,/План заходів щодо запобігання та протидії булінгу/);
    assert.match(html,/anti-bullying-measures-2026-2027\.pdf/);
    assert.doesNotMatch(html,/anti-bullying-measures-2025\.pdf/);
  }
  const bytes=await readFile(new URL("../public/documents/regulations/anti-bullying-measures-2026-2027.pdf",import.meta.url));
  assert.equal(bytes.subarray(0,4).toString(),"%PDF");
});

test("gives every law programme level a stable page and keeps dates optional",async()=>{
  const facultyHtml=await (await render("/departments/law-faculty#faculty-programmes")).text();
  const programmePaths=[
    "/departments/law-faculty/faculty-programmes/d8-law-bachelor",
    "/departments/law-faculty/faculty-programmes/d8-law-master",
    "/departments/law-faculty/faculty-programmes/d8-law-phd",
    "/departments/law-faculty/faculty-programmes/d4-public-administration-bachelor",
    "/departments/law-faculty/faculty-programmes/d4-public-administration-master",
    "/departments/law-faculty/faculty-programmes/d4-public-administration-phd",
  ];
  for(const path of programmePaths){
    assert.match(facultyHtml,new RegExp(`href="${path}"`));
    const response=await render(path);
    assert.equal(response.status,200,`${path} should render`);
    assert.match(await response.text(),/Опис програми, освітні компоненти, навчальні плани/);
  }

  const panel=await readFile(new URL("../app/panel/PanelEditor.tsx",import.meta.url),"utf8");
  const data=await readFile(new URL("../lib/data.ts",import.meta.url),"utf8");
  assert.match(panel,/Не відображати дату публікації/);
  assert.match(data,/APSVT_HIDE_DATE/);
});

test("publishes international partnerships and the foreign applicant guide",async()=>{
  const html=await (await render("/international")).text();
  assert.match(html,/Studieninstitut POLS/);
  assert.match(html,/Transport and Telecommunication Institute/);
  assert.match(html,/Vysoká škola technická a ekonomická v Prešove/);
  assert.match(html,/Міжнародні можливості/);
  assert.match(html,/DAAD · Німеччина/);
  assert.match(html,/16 листопада 2026 · 23:59 за Києвом/);
  assert.match(html,/houseofeurope\.org\.ua\/opportunity\/947/);
  assert.match(html,/Chevening · Велика Британія/);
  assert.match(html,/6 жовтня 2026 · 11:00 UTC/);
  assert.match(html,/chevening\.org\/scholarship\/ukraine/);
  assert.match(html,/Гранти та звіти/);
  assert.match(html,/101127204/);
  assert.match(html,/575275-EPP-1-2016-1-UA-EPPJMO-MODULE/);
  assert.match(html,/materials\/conference-06-06-19-eacf33800\.html/);
  assert.match(html,/research-report-2017-2018\.pdf/);
  assert.match(html,/Академія оформлює електронне запрошення на навчання/);
  assert.match(html,/apply\.studyinukraine\.gov\.ua\/home/);
  assert.match(html,/758-2024-%D0%BF#Text/);
  assert.match(html,/07-poriadok-pryiomu-inozemtsiv\.pdf/);
  assert.match(html,/Чи оформлює Академія запрошення на навчання/);
  assert.match(html,/inz@socosvita\.kiev\.ua/);
});

test("publishes the Academy licence, accreditation scans and verification links",async()=>{
  const html=await (await render("/about/licenses")).text();
  assert.match(html,/Ліцензії\.<br\/>Акредитація\./);
  assert.match(html,/23/);
  assert.match(html,/license-educational-activity-2021\.pdf/);
  assert.match(html,/Сертифікат № 1498/);
  assert.match(html,/Серія АП № 11009149/);
  assert.match(html,/registry\.edbo\.gov\.ua\/university\/53/);
  assert.match(html,/registry\.naqa\.gov\.ua/);
  assert.match(html,/Архів попередніх сертифікатів/);
  assert.match(html,/Психологія бізнесу та управління/);
  assert.match(html,/Сертифікати та акредитація/);

  const currentCertificates=[
    "finance-insurance-master-19421.pdf",
    "professional-education-master-19390.pdf",
    "psychology-bachelor-21114.pdf",
    "business-management-psychology-master-10064.pdf",
    "public-administration-bachelor-20649.pdf",
    "clinical-psychology-master-6698.pdf",
  ];
  for(const certificate of currentCertificates){
    assert.match(html,new RegExp(certificate.replace(".","\\.")));
    const pdf=await readFile(new URL(`../public/documents/accreditation/2026/${certificate}`,import.meta.url));
    assert.equal(pdf.subarray(0,4).toString(),"%PDF",`${certificate} should remain a PDF`);
  }

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

test("archives the original 1990s scans and reuses the existing 2021 law certificate",async()=>{
  const html=await(await render("/about/licenses")).text();
  const sources=[
    ["historical/1996-marketing-specialist-license-110111.jpg","cc2741568b09b2f895a35bafa6cd64c19b4ce9300485bd08f255f25b79dd4bbe"],
    ["historical/1998-marketing-specialist-license-110111.jpg","d71f0ba92628f82e921c8a4e6b4c5ef4e135c45f0248ba87ca8c59cf9e0d53ae"],
    ["historical/1999-marketing-specialist-accreditation-115002.jpg","6c38d0b9b759e42d6d7a0e0dda8281f3379de0a1e03afbc2fe3495063ef4e7de"],
    ["16-bachelor-archive.jpg","e4deb3f24d91e6390c84d0304f51825dac3be1501231e4fe9a962536d9dd1394"],
  ];
  for(const[file,sha256]of sources){
    assert.equal(createHash("sha256").update(await readFile(new URL(`../public/documents/licenses/${file}`,import.meta.url))).digest("hex"),sha256,file);
    assert.equal((html.match(new RegExp(`<a\\b[^>]*href="/documents/licenses/${file.replaceAll(".","\\.")}"`,"g"))||[]).length,1,file);
  }
  for(const date of ["23.12.1996","01.07.1999","17.07.1998","31.12.1999","12.08.1999","01.07.2004"])assert.ok(html.includes(date),date);
  assert.match(html,/rotate\(180deg\)/);
  assert.match(html,/не підтверджує чинний статус програми/);
  assert.match(html,/href="\/en\/materials"/);
});

test("publishes every unique historical certificate and all eight licence packet originals",async()=>{
  const html=await(await render("/about/licenses")).text();
  const sources=JSON.parse(await readFile(new URL("./fixtures/historical-accreditation-scans.json",import.meta.url),"utf8"));
  assert.equal(sources.length,25);
  assert.equal(new Set(sources.map(source=>source.sha256)).size,25);
  for(const {file,sha256,metadata}of sources){
    assert.equal(createHash("sha256").update(await readFile(new URL(`../public/documents/licenses/historical/${file}`,import.meta.url))).digest("hex"),sha256,file);
    const cards=html.match(new RegExp(`<a\\b[^>]*href="/documents/licenses/historical/${file.replaceAll(".","\\.")}"[^>]*>[\\s\\S]*?</a>`,"g"))||[];
    assert.equal(cards.length,1,file);
    for(const text of metadata)assert.ok(cards[0].includes(text),`${file}: ${text}`);
  }
  const packet=html.match(/<section aria-labelledby="historical-license-heading">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(packet);
  assert.equal((packet.match(/class="license-certificate-card"/g)||[]).length,8);
  assert.ok(packet.includes("три аркуші додатка та чотири зворотні боки"));
  assert.ok(packet.includes("Зворотний бік · печатка"));
  assert.match(html,/Аркуші історичної ліцензії: <!-- -->8/);
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
  assert.match(documentsHtml,/Інклюзивність і безбар’єрність/);
  assert.match(documentsHtml,/Якість освіти/);
  assert.match(documentsHtml,/<b>\d+<\/b><p>ключових офіційних документів<\/p>/);
  assert.match(documentsHtml,/повнотекстових джерел/);
  assert.match(documentsHtml,/href="#catalogue"/);
  assert.match(documentsHtml,/href="#admissions"/);
  assert.match(documentsHtml,/href="#quality"/);
  assert.match(documentsHtml,/href="#accreditation"/);
  assert.match(documentsHtml,/href="#inclusiveness"/);
  assert.match(homeHtml,/href="\/documents#anticorruption"[^>]*>Запобігання корупції<\/a>/);
  assert.doesNotMatch(documentsHtml,/Джерело добірки|Перенесено з офіційного сайту/);
});

test("publishes a curated archive restored from the former Academy website",async()=>{
  const [documentsHtml,archiveHtml]=await Promise.all([
    (await render("/documents")).text(),
    (await render("/documents/archive")).text(),
  ]);
  assert.doesNotMatch(documentsHtml,/href="\/documents\/archive"/);
  assert.match(documentsHtml,/Методичні та наукові матеріали/);
  assert.match(archiveHtml,/Важливі файли\.<br\/><em>Знову доступні\.<\/em>/);
  assert.match(archiveHtml,/<b>20<\/b><p>важливий файл<\/p>/);
  assert.match(archiveHtml,/Відновлено зі старої версії сайту|Архів старої версії/);
  assert.match(archiveHtml,/internal-quality-system\.pdf/);
  assert.match(archiveHtml,/conference-proceedings-2025\.pdf/);
  assert.match(archiveHtml,/legal-clinic-regulation\.pdf/);
  assert.match(archiveHtml,/forensic-lab-regulation\.pdf/);

  const restoredFiles=[
    "academic-staff-development-2025.pdf",
    "academic-status-2025.pdf",
    "anti-bullying-harassment-2023.pdf",
    "anti-bullying-measures-2025.pdf",
    "anticorruption-report-2023.pdf",
    "conference-proceedings-2025.pdf",
    "educational-programme-approval-stages.pdf",
    "ethics-code.pdf",
    "forensic-lab-regulation.pdf",
    "individual-study-plan-2024.pdf",
    "internal-investigation-2021.pdf",
    "internal-quality-system.pdf",
    "legal-clinic-regulation.pdf",
    "pedagogical-practice-guidelines.pdf",
    "plagiarism-check-2025.pdf",
    "professional-qualifications-regulation.pdf",
    "programme-guarantor.pdf",
    "reduced-mobility-support.pdf",
    "research-report-2017-2018.pdf",
    "social-scholarship-2025.pdf",
    "statute-amendments-2022.pdf",
  ];
  for(const file of restoredFiles){
    const bytes=await readFile(new URL(`../public/documents/archive/old-site/${file}`,import.meta.url));
    assert.equal(bytes.subarray(0,4).toString(),"%PDF",`${file} should remain a PDF`);
  }
});

test("publishes curated Academy, doctoral and GreenFinEDU resources in their relevant sections",async()=>{
  const [home,about,documents,programs,departments,international,research,psychology,management,publicAdministration,studentGuide,regulations,individualPlan,teacherOfYear,graduation]=await Promise.all([
    (await render("/")).text(),
    (await render("/about")).text(),
    (await render("/documents")).text(),
    (await render("/programs")).text(),
    (await render("/departments")).text(),
    (await render("/international")).text(),
    (await render("/research")).text(),
    (await render("/programs/psychology")).text(),
    (await render("/programs/management")).text(),
    (await render("/programs/public-administration")).text(),
    (await render("/students/guide")).text(),
    (await render("/documents/regulations")).text(),
    (await render("/documents/regulations/individual-study-plan")).text(),
    (await render("/documents/regulations/teacher-of-year")).text(),
    (await render("/events/graduation-2026")).text(),
  ]);

  assert.match(home,/Документи й ресурси Академії/);
  assert.match(home,/href="\/students\/guide"/);
  assert.match(home,/Свято вручення дипломів/);
  assert.match(home,/href="\/events\/graduation-2026"/);
  assert.match(about,/Від соціально-трудової освіти до міждисциплінарної Академії/);
  assert.match(about,/Від Академії/);
  assert.match(about,/Рівень 0/);
  assert.match(about,/Факультет/);
  assert.match(about,/Кафедра/);
  assert.match(about,/Програма/);
  assert.match(about,/statute-2017\.pdf/);
  assert.match(documents,/Установчі документи/);
  assert.match(documents,/Аспірантура та освітньо-наукові програми/);
  assert.match(documents,/Міжнародні освітні проєкти/);
  assert.match(programs,/Освітньо-наукові програми/);
  assert.match(programs,/educational-facilities\.pdf/);
  assert.match(programs,/programme-guarantor\.pdf/);
  assert.match(programs,/professional-qualifications-regulation\.pdf/);
  assert.match(departments,/Програми кафедр для підготовки докторів філософії/);
  assert.match(research,/Програми докторів філософії/);
  assert.match(research,/conference-proceedings-2025\.pdf/);
  assert.match(research,/research-report-2017-2018\.pdf/);
  assert.match(international,/GreenFinEDU/);
  assert.match(international,/Проєкт № 101126681/);
  assert.match(international,/project-presentation\.pptx/);
  assert.match(international,/Архів навчальних матеріалів/);
  assert.match(psychology,/c4-psychology\.pdf/);
  assert.match(management,/c1-economics\.pdf/);
  assert.match(publicAdministration,/d4-public-administration\.pdf/);
  assert.match(studentGuide,/Що зробити насамперед/);
  assert.match(studentGuide,/first-year-guide-2024\.pdf/);
  assert.match(regulations,/Оберіть положення/);
  assert.match(regulations,/Положення про порядок оскарження процедури проведення контрольних заходів та їх результатів/);
  assert.match(regulations,/appeal-control-procedures-results\.pdf/);
  assert.doesNotMatch(regulations,/academic-tests-plagiarism-check\.pdf/);
  assert.match(individualPlan,/Індивідуальний навчальний план/);
  assert.match(individualPlan,/individual-study-plan-2019\.pdf/);
  assert.match(teacherOfYear,/Професійна майстерність і визнання/);
  assert.match(teacherOfYear,/best-teacher-competition\.pdf/);
  assert.match(graduation,/Моменти свята/);
  assert.match(graduation,/Google Drive/);
  assert.match(documents,/href="\/students\/guide"/);
  assert.match(documents,/href="\/documents\/regulations\/individual-study-plan"/);
  assert.match(documents,/href="\/documents\/regulations\/teacher-of-year"/);

  const pdfs=[
    "academy/statute-2017.pdf",
    "education/individual-study-plan-2019.pdf",
    "education/best-teacher-competition.pdf",
    "students/first-year-guide-2024.pdf",
    "programmes/phd/2025/a5-professional-education.pdf",
    "programmes/phd/2025/c1-economics.pdf",
    "programmes/phd/2025/c4-psychology.pdf",
    "programmes/phd/2025/d4-public-administration.pdf",
    "programmes/phd/2025/educational-facilities.pdf",
  ];
  for(const file of pdfs){
    const bytes=await readFile(new URL(`../public/documents/${file}`,import.meta.url));
    assert.equal(bytes.subarray(0,4).toString(),"%PDF",`${file} should remain a PDF`);
  }

  const officeFiles=[
    "project-presentation.pptx",
    "project-launch-agenda.docx",
    "intensive-course-programme.docx",
    "advanced-online-course-programme.docx",
    "summer-school-programme.docx",
  ];
  for(const file of officeFiles){
    const bytes=await readFile(new URL(`../public/documents/international/greenfinedu/${file}`,import.meta.url));
    assert.equal(bytes.subarray(0,2).toString(),"PK",`${file} should remain a valid Office archive`);
  }

  const structure=await readFile(new URL("../app/about/AcademyStructure.tsx",import.meta.url),"utf8");
  assert.match(structure,/<details/);
  assert.match(structure,/structure-faculties/);
  assert.match(structure,/Програми:/);
});

test("enriches programme pages with departments, practice partners, people and legal clinic",async()=>{
  const [finance,management,law,clinic,departments,marketing]=await Promise.all([
    (await render("/programs/finance")).text(),
    (await render("/programs/management")).text(),
    (await render("/programs/law")).text(),
    (await render("/programs/law/legal-clinic")).text(),
    (await render("/departments")).text(),
    (await render("/programs/marketing")).text(),
  ]);

  for(const html of [finance,management,law]){
    assert.match(html,/Кафедра і (?:академічне|освітнє) середовище/);
    assert.match(html,/Практика і професійне середовище/);
    assert.match(html,/Документи програми/);
  }
  assert.match(marketing,/Науково-педагогічний склад/);
  assert.match(finance,/Райффайзен Банк/);
  assert.match(finance,/CFA Institute Research Challenge/);
  assert.match(management,/Сільпо Food/);
  assert.match(management,/Ігор Чорнодід/);
  assert.match(law,/Юридична клініка «Феміда»/);
  assert.match(law,/href="\/programs\/law\/legal-clinic"/);
  assert.match(clinic,/Право, яке допомагає людям/);
  assert.match(clinic,/Опубліковані тоді години прийому й телефон є історичними/);
  assert.match(clinic,/legalaid\.gov\.ua/);
  assert.match(departments,/\d+(?:<!-- -->)? кафедр і навчальних осередків/);
  assert.match(departments,/Кафедра кримінального права, процесу та криміналістики/);
  assert.match(departments,/Кафедра інтелектуальних систем та цифрових технологій/);
  assert.match(marketing,/nadiia-pysarenko\.webp/);
});

test("keeps marketing news department-authored without removing Academy-wide articles",async()=>{
  const marketing=await(await render("/programs/marketing")).text();
  for(const slug of ["mental-health-conference-2026-results","natalia-goncharenko-pilc-seite-2026","marketing-research-international-conference-2026"]){
    assert.ok(!marketing.includes(`href="/news/${slug}"`),slug);
    assert.equal((await render(`/news/${slug}`)).status,200,slug);
  }
  assert.match(marketing,/id="department-news"/);
  assert.doesNotMatch(marketing,/class="academic-news-section"/);
  const finance=await(await render("/programs/finance")).text();
  assert.match(finance,/class="academic-news-section"/);
  const news=await render("/news");assert.equal(news.status,200);
  assert.match(await news.text(),/mental-health-conference-2026-results/);
});

test("keeps a directly addressable marketing scientific club without its retired April article",async()=>{
  const response=await render("/programs/marketing");assert.equal(response.status,200);
  const html=await response.text();
  assert.match(html,/href="#science-club"/);
  assert.match(html,/id="science-club" aria-labelledby="marketing-science-club-title"/);
  assert.match(html,/id="marketing-science-club-title">Науковий гурток/);
  assert.doesNotMatch(html,/href="\/materials\/3331-0b35c55db\.html"/);
  assert.match(html,/marketing-science-club-link/);
  for(const href of ["/research/conferences#marketing-proceedings","/research/journals#marketing-publications","/documents/marketing/student-achievements/2026.pdf","/documents/marketing/student-achievements/2025.pdf"])assert.ok(html.includes(`href="${href}"`),href);
  assert.match(html,/Міжнародна та експертна діяльність НПП кафедри/);
  assert.doesNotMatch(await(await render("/programs/finance")).text(),/id="science-club"/);
});

test("publishes the marketing students' 2025 and 2026 research achievements",async()=>{
  const marketing=await (await render("/programs/marketing")).text();
  assert.match(marketing,/id="marketing-student-achievements"/);
  assert.match(marketing,/Наукові здобутки здобувачів/);
  assert.match(marketing,/href="\/documents\/marketing\/student-achievements\/2026\.pdf"/);
  assert.match(marketing,/href="\/documents\/marketing\/student-achievements\/2025\.pdf"/);
  assert.equal((marketing.match(/marketing-achievement-list/g) || []).length >= 1,true);

  const achievementFiles=[
    ["2025.pdf",359055],
    ["2026.pdf",443926],
  ];
  for(const [file,size] of achievementFiles){
    const bytes=await readFile(new URL(`../public/documents/marketing/student-achievements/${file}`,import.meta.url));
    assert.equal(bytes.subarray(0,5).toString(),"%PDF-");
    assert.equal(bytes.length,size);
  }
});

test("keeps two separately addressable marketing student subsections with all original profiles",async()=>{
  const html=await(await render("/programs/marketing")).text();
  for(const [id,title] of [["marketing-student-experience","Студентське життя: навчання, можливості, досягнення"],["marketing-student-science","Студентська наука: конференції, дослідження, досягнення"]]){
    assert.ok(html.includes(`href="#${id}"`));
    assert.ok(html.includes(`id="${id}" aria-labelledby="${id}-title"`));
    assert.ok(html.includes(`id="${id}-title">${title}`));
  }
  const content=JSON.parse(await readFile(new URL("../lib/marketing-verbatim.json",import.meta.url),"utf8"));
  const studentHtml=html.slice(html.indexOf('id="marketing-student-experience"'),html.indexOf('id="marketing-student-science"'));
  assert.equal((studentHtml.match(/class="marketing-verbatim-card"/g)||[]).length,content.students.length);
  for(const person of content.students){assert.ok(html.includes(person.name));assert.ok(html.includes(`src="${person.image}"`));}
  assert.doesNotMatch(await(await render("/programs/finance")).text(),/id="marketing-student-science"/);
});

test("publishes an independent marketing repository without demonstration materials",async()=>{
  const html=await(await render("/programs/marketing")).text();
  assert.match(html,/id="marketing-repository" aria-labelledby="marketing-repository-title"/);
  assert.match(html,/id="marketing-repository-title">РЕПОЗИТАРІЙ/);
  const repository=html.slice(html.indexOf('<section class="marketing-repository"'),html.indexOf('</section>',html.indexOf('<section class="marketing-repository"')));
  assert.doesNotMatch(repository,/Демонстраційний|documents\/examples|thesis-marketing-demo|placeholder/);
  assert.match(html,/id="marketing-student-experience"/);
  assert.match(html,/id="marketing-student-science"/);
  assert.doesNotMatch(await(await render("/programs/finance")).text(),/id="marketing-repository"/);
});

test("separates marketing bachelor and master materials and publishes stakeholder documents",async()=>{
  const marketing=await (await render("/programs/marketing#curriculum")).text();
  assert.match(marketing,/Оберіть рівень освіти/);
  assert.match(marketing,/Перший рівень вищої освіти/);
  assert.match(marketing,/Другий рівень вищої освіти/);
  assert.match(marketing,/id="quality"/);
  assert.ok(marketing.indexOf('id="curriculum"') < marketing.indexOf('id="quality"'),"Quality follows programmes");
  assert.match(marketing,/Результати моніторингу якості освіти/);
  assert.match(marketing,/Обговорення змін до ОПП/);
  assert.match(marketing,/Шановні стейкхолдери!/);
  assert.match(marketing,/academi\.marketing2023@gmail\.com/);
  assert.match(marketing,/propozytsii-stakeholderiv-mahistr-2026\.pdf/);
  assert.match(marketing,/anketa-stakeholderiv-mahistr-2026\.pdf/);
  assert.doesNotMatch(marketing,/Google-форма[^<]*<\/a>/);
  const programmeBody=marketing.slice(marketing.indexOf('class="marketing-programmes"'),marketing.indexOf('class="marketing-quality"'));
  assert.doesNotMatch(programmeBody,/marketing-stakeholder-call|anketa-stakeholderiv-mahistr-2026|propozytsii-stakeholderiv-mahistr-2026/);
  const qualityBody=marketing.slice(marketing.indexOf('class="marketing-quality"'),marketing.indexOf('class="marketing-science-clean"'));
  assert.equal((qualityBody.match(/id="marketing-stakeholder-call"/g)||[]).length,1,"Stakeholder call is not duplicated");
  for(const slug of ["obhovorennia-opp-marketynh-12-bereznia-2026","obhovorennia-opp-marketynh-17-travnia-2026"]){
    assert.match(qualityBody,new RegExp(slug));
  }

  for(const file of ["propozytsii-stakeholderiv-mahistr-2026.pdf","anketa-stakeholderiv-mahistr-2026.pdf"]){
    const bytes=await readFile(new URL(`../public/documents/marketing/stakeholders/${file}`,import.meta.url));
    assert.equal(bytes.subarray(0,5).toString(),"%PDF-");
    assert.ok(bytes.length>100_000);
  }
});

test("publishes marketing master programmes and nested methodical document folders",async()=>{
  const marketing=await (await render("/programs/marketing")).text();
  assert.match(marketing,/Освітньо-професійна програма «Маркетинг» 2026 року/);
  assert.match(marketing,/Освітньо-професійна програма «Маркетинг» 2025 року/);
  assert.match(marketing,/Кваліфікаційні роботи/);
  assert.match(marketing,/Магістратура/);
  assert.match(marketing,/Графік консультацій викладачів/);
  for(const relativePath of [
    "programmes/opp-marketing-master-2025.pdf",
    "programmes/opp-marketing-master-2026.pdf",
    "methodical/qualification-master-2025.pdf",
    "methodical/qualification-master-2026.pdf",
    "methodical/teacher-consultations-2026-2027.pdf",
  ]){
    const href=`/documents/marketing/${relativePath}`;
    assert.ok(marketing.includes(`href="${href}"`),`Missing link: ${href}`);
    const bytes=await readFile(new URL(`../public/documents/marketing/${relativePath}`,import.meta.url));
    assert.equal(bytes.subarray(0,5).toString(),"%PDF-");
    assert.ok(bytes.length>100_000);
  }
});

test("publishes the two requested marketing programme discussion announcements",async()=>{
  const [march,may]=await Promise.all([
    (await render("/news/obhovorennia-opp-marketynh-12-bereznia-2026")).text(),
    (await render("/news/obhovorennia-opp-marketynh-17-travnia-2026")).text(),
  ]);
  assert.match(march,/12 березня 2026 року о 14:00/);
  assert.match(may,/17 травня 2026 року о 14:00/);
  for(const html of [march,may]){
    assert.match(html,/Meeting ID: 993 238 3465/);
    assert.match(html,/Passcode: 1111/);
    assert.match(html,/1dcgVBio_3E2kyrMCDS-neHA2SDEBT3pr/);
  }
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
  assert.match(html,/Результати вступних<br\/>випробувань/);
  assert.match(html,/Результати вступних випробувань від 29 липня 2026 року/);
  assert.match(html,/Результати вступних випробувань від 31 липня 2026 року/);
  assert.match(html,/Результати вступних випробувань від 6 серпня 2026 року/);
  assert.match(html,/results\/2026-08-06\/english-interview-master\.pdf/);
  assert.match(html,/PDF · 2 сторінки/);
  assert.match(html,/results\/2026-07-29\/ukrainian-language\.pdf/);
  assert.match(html,/results\/2026-07-29\/mathematics\.pdf/);
  assert.match(html,/results\/2026-07-29\/history-of-ukraine\.pdf/);
  assert.match(html,/results\/2026-07-29\/english-language\.pdf/);
  const bachelorSection=html.indexOf('id="entrance-bachelor"');
  const bachelorAdditional=html.indexOf('id="entrance-bachelor-additional"');
  const bachelorAdditionalPdf=html.indexOf("additional-session-2026/bachelor-interviews.pdf");
  const masterSection=html.indexOf('id="entrance-master"');
  const masterAdditional=html.indexOf('id="entrance-master-additional"');
  const masterAdditionalPdf=html.indexOf("additional-session-2026/master-interviews-professional-exams.pdf");
  const phdSection=html.indexOf('id="entrance-phd"');
  assert.ok(bachelorSection<bachelorAdditional && bachelorAdditional<bachelorAdditionalPdf && bachelorAdditionalPdf<masterSection);
  assert.ok(masterSection<masterAdditional && masterAdditional<masterAdditionalPdf && masterAdditionalPdf<phdSection);
  assert.match(html,/8–11 вересня 2026/);
  assert.match(html,/02 \/ Магістратура/);
  assert.match(html,/Рейтингові списки<br\/>вступників/);
  assert.match(html,/43 PDF-документів/);
  assert.match(html,/rankings\/2026-08-03\/law-full-time-first-year\.pdf/);
  assert.match(html,/rankings\/2026-08-03\/marketing-full-time-first-year\.pdf/);

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

  const additionalSessionFiles=["bachelor-interviews.pdf","master-interviews-professional-exams.pdf"];
  for(const file of additionalSessionFiles){
    const pdf=await readFile(new URL(`../public/documents/admissions/entrance-exams/additional-session-2026/${file}`,import.meta.url));
    assert.equal(pdf.subarray(0,4).toString(),"%PDF",`${file} should remain a PDF`);
  }

  const resultFiles=[
    "ukrainian-language.pdf",
    "mathematics.pdf",
    "history-of-ukraine.pdf",
    "english-language.pdf",
  ];
  for(const file of resultFiles){
    const pdf=await readFile(new URL(`../public/documents/admissions/results/2026-07-29/${file}`,import.meta.url));
    assert.equal(pdf.subarray(0,4).toString(),"%PDF",`${file} should remain a PDF`);
  }

  const july31Files=["ukrainian-language.pdf","ukrainian-literature.pdf","mathematics.pdf","history-of-ukraine.pdf","english-language.pdf"];
  for(const file of july31Files){
    const pdf=await readFile(new URL(`../public/documents/admissions/results/2026-07-31/${file}`,import.meta.url));
    assert.equal(pdf.subarray(0,4).toString(),"%PDF",`${file} should remain a PDF`);
  }

  const rankingDir=new URL("../public/documents/admissions/rankings/2026-08-03/",import.meta.url);
  const rankingFiles=await readdir(rankingDir);
  assert.equal(rankingFiles.length,25);
  for(const file of rankingFiles){
    const pdf=await readFile(new URL(file,rankingDir));
    assert.equal(pdf.subarray(0,4).toString(),"%PDF",`${file} should remain a PDF`);
  }
});

test("publishes the master applicant ratings from August and September as 47 grouped PDFs",async()=>{
  const html=await (await render("/admissions")).text();
  assert.match(html,/47 PDF-документів/);
  assert.match(html,/Рейтингові списки вступників від 24\.08\.2026/);
  assert.match(html,/Рейтингові списки вступників від 23\.09\.2026/);
  assert.match(html,/rankings\/2026-08-24-master\/law-full-time-recommended\.pdf/);
  assert.match(html,/rankings\/2026-08-24-master\/clinical-psychology-part-time-other\.pdf/);
  assert.match(html,/rankings\/2026-09-23-master\/law-full-time\.pdf/);
  assert.match(html,/rankings\/2026-09-23-master\/professional-education-part-time\.pdf/);
  assert.doesNotMatch(html,/26 CSV-таблиць|master-ranking-01\.csv/);

  const masterRankingDir=new URL("../public/documents/admissions/rankings/2026-08-24-master/",import.meta.url);
  const masterRankingFiles=(await readdir(masterRankingDir)).filter((file)=>file.endsWith(".pdf"));
  assert.equal(masterRankingFiles.length,32);
  for(const file of masterRankingFiles){
    const pdf=await readFile(new URL(file,masterRankingDir));
    assert.equal(pdf.subarray(0,4).toString(),"%PDF",`${file} should remain a PDF`);
  }

  const septemberRankingDir=new URL("../public/documents/admissions/rankings/2026-09-23-master/",import.meta.url);
  const septemberRankingFiles=(await readdir(septemberRankingDir)).filter((file)=>file.endsWith(".pdf"));
  assert.equal(septemberRankingFiles.length,15);
  for(const file of septemberRankingFiles){
    const pdf=await readFile(new URL(file,septemberRankingDir));
    assert.equal(pdf.subarray(0,4).toString(),"%PDF",`${file} should remain a PDF`);
  }
});

test("announces and duplicates the published entrance results in news",async()=>{
  const [newsHtml,articleHtml,july31ArticleHtml,august6ArticleHtml]=await Promise.all([
    (await render("/news")).text(),
    (await render("/news/rezultaty-vstupnykh-vyprobuvan-29-lypnia-2026")).text(),
    (await render("/news/rezultaty-vstupnykh-vyprobuvan-31-lypnia-2026")).text(),
    (await render("/news/rezultaty-vstupnykh-vyprobuvan-6-serpnia-2026")).text(),
  ]);
  assert.match(newsHtml,/Оприлюднено результати вступних випробувань від 29 липня 2026 року/);
  assert.match(newsHtml,/Оприлюднено результати вступних випробувань від 31 липня 2026 року/);
  assert.match(newsHtml,/Оприлюднено результати вступних випробувань від 6 серпня 2026 року/);
  assert.match(articleHtml,/Результати за предметами/);
  assert.match(articleHtml,/href="\/admissions#entrance-results"/);
  for(const file of ["ukrainian-language","mathematics","history-of-ukraine","english-language"]){
    assert.match(articleHtml,new RegExp(`results/2026-07-29/${file}\\.pdf`));
  }
  for(const file of ["ukrainian-language","ukrainian-literature","mathematics","history-of-ukraine","english-language"]){
    assert.match(july31ArticleHtml,new RegExp(`results/2026-07-31/${file}\\.pdf`));
  }
  assert.match(august6ArticleHtml,/results\/2026-08-06\/english-interview-master\.pdf/);
  assert.match(august6ArticleHtml,/english-interview\.mp4/);
  assert.match(august6ArticleHtml,/Відеозапис співбесіди/);
});

test("publishes the applicant rankings announcement in news",async()=>{
  const listing=await (await render("/news")).text();
  assert.match(listing,/Оприлюднено рейтингові списки вступників на бакалаврат/);
  assert.match(listing,/25 офіційних рейтингових списків/);

  const article=await (await render("/news/reitynhovi-spysky-vstupnykiv-bakalavrat-2026")).text();
  assert.match(article,/25 рейтингових списків за програмами/);
  assert.match(article,/Професійна освіта/);
  assert.match(article,/Публічне управління та адміністрування/);
  assert.match(article,/href="\/admissions#applicant-rankings"/);
});

test("publishes entrance-examination programmes and duplicates doctoral files on programme pages",async()=>{
  const admissionsHtml=await (await render("/admissions")).text();
  assert.match(admissionsHtml,/Програми вступних<br\/>випробувань/);
  assert.match(admissionsHtml,/01 \/ Бакалаврат/);
  assert.match(admissionsHtml,/02 \/ Магістратура/);
  assert.match(admissionsHtml,/03 \/ Доктор філософії/);
  assert.match(admissionsHtml,/Українська мова як іноземна/);
  assert.match(admissionsHtml,/Англійська мова/);
  assert.match(admissionsHtml,/Географія/);
  assert.match(admissionsHtml,/Методологія наукових досліджень/);

  const programmeFiles={
    bachelor:["ukrainian-language","mathematics","history-of-ukraine","english-language","german-language","biology","physics","chemistry","ukrainian-literature","ukrainian-as-foreign-language"],
    phd:["professional-education","law","public-administration","economics-international-relations","psychology","foreign-language-english","foreign-language-german","research-methodology-economics"],
  };
  for(const [level,files] of Object.entries(programmeFiles)){
    for(const file of files){
      assert.match(admissionsHtml,new RegExp(`exam-programs/2026/${level}/${file}\\.pdf`));
      const pdf=await readFile(new URL(`../public/documents/admissions/exam-programs/2026/${level}/${file}.pdf`,import.meta.url));
      assert.equal(pdf.subarray(0,4).toString(),"%PDF",`${file} should remain a PDF`);
    }
  }

  const [psychology,law,publicAdministration,lawFaculty,forensicLaboratory]=await Promise.all([
    (await render("/programs/psychology")).text(),
    (await render("/programs/law")).text(),
    (await render("/programs/public-administration")).text(),
    (await render("/departments/law-faculty")).text(),
    (await render("/programs/law/forensic-laboratory")).text(),
  ]);
  assert.match(psychology,/exam-programs\/2026\/phd\/psychology\.pdf/);
  assert.match(law,/exam-programs\/2026\/phd\/law\.pdf/);
  assert.match(law,/legal-clinic-regulation\.pdf/);
  assert.match(law,/forensic-lab-regulation\.pdf/);
  assert.match(publicAdministration,/exam-programs\/2026\/phd\/public-administration\.pdf/);
  assert.match(publicAdministration,/<h1>Кафедра Публічного Управління та Публічної Служби<\/h1>/);
  for(const name of ["Кафедра конституційного, адміністративного та фінансового права","Кафедра Публічного Управління та Публічної Служби","Кафедра цивільного, трудового та господарського права","Кафедра кримінального права, процесу та криміналістики"]){
    assert.match(lawFaculty,new RegExp(name));
  }
  assert.match(forensicLaboratory,/Лабораторія[\s\S]{0,180}криміналістики/);
  assert.match(forensicLaboratory,/Фото- й відеофіксація/);
  assert.match(forensicLaboratory,/Засоби роботи з речовими доказами/);
  assert.match(forensicLaboratory,/Організація освітньої діяльності на засадах академічної доброчесності/);
  assert.match(forensicLaboratory,/forensic-lab-regulation\.pdf/);
  for(const html of [psychology,law,publicAdministration]){
    assert.match(html,/foreign-language-english\.pdf/);
    assert.match(html,/foreign-language-german\.pdf/);
    assert.match(html,/Методологія наукових досліджень/);
    assert.match(html,/href="\/admissions#entrance-programs"/);
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

  const [panel,auth,migration,access,documents,documentMigration,pageDocuments,accessMigration,accessRules,multiAccessMigration,editorialEmail]=await Promise.all([
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
    readFile(new URL("../lib/editorial-email.ts",import.meta.url),"utf8"),
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
  assert.match(auth,/createUser/);
  assert.match(auth,/editorial_must_change_password/);
  assert.match(auth,/status: "approved"/);
  assert.match(access,/\/api\/editorial\/users/);
  assert.match(access,/Створити й надіслати доступ/);
  assert.match(editorialEmail,/resetPasswordForEmail/);
  assert.match(editorialEmail,/using Supabase fallback/);
  assert.match(documents,/uploadEditorialFile\(file, "document", form\.pagePath\)/);
  assert.match(documents,/\/api\/documents/);
  assert.match(documentMigration,/editorial_documents/);
  assert.match(documentMigration,/editorial-documents/);
  assert.match(pageDocuments,/getPublicDocuments/);
  assert.match(access,/Сторінки \/ кафедри/);
  assert.match(access,/Кафедри та програми/);
  assert.match(accessMigration,/access_scope/);
  assert.match(accessMigration,/private\.can_edit_page/);
  assert.match(accessRules,/canEditPage/);
  assert.match(accessRules,/Психологічний напрям/);
  assert.match(access,/type="checkbox"/);
  assert.match(access,/ScopePicker/);
  assert.match(accessRules,/accessScopes\.includes/);
  assert.match(multiAccessMigration,/string_to_array\(access_scope, ','\)/);
});

test("keeps Word schedule import out of the Academy panel",async()=>{
  const [operations,importer,parser,route,content]=await Promise.all([
    readFile(new URL("../app/panel/OperationsEditor.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/panel/ScheduleImporter.tsx",import.meta.url),"utf8"),
    readFile(new URL("../lib/schedule-import.ts",import.meta.url),"utf8"),
    readFile(new URL("../app/api/content/import-schedule/route.ts",import.meta.url),"utf8"),
    readFile(new URL("../lib/content.ts",import.meta.url),"utf8"),
  ]);
  assert.doesNotMatch(operations,/ScheduleImporter/);
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

test("renders verified partner marks, the official emblem and designed faculty pages",async()=>{
  const [finance,about,lawFaculty,economicFaculty,psychologyFaculty,psychologyFacultySource,profiles,structure]=await Promise.all([
    (await render("/programs/finance")).text(),
    (await render("/about")).text(),
    (await render("/departments/law-faculty")).text(),
    (await render("/departments/economics-social-tourism-faculty")).text(),
    (await render("/departments/psychology-social-development-faculty")).text(),
    readFile(new URL("../app/departments/psychology-social-development-faculty/page.tsx",import.meta.url),"utf8"),
    readFile(new URL("../lib/programme-profiles.ts",import.meta.url),"utf8"),
    readFile(new URL("../app/about/AcademyStructure.tsx",import.meta.url),"utf8"),
  ]);
  assert.match(finance,/partners\/raiffeisen\.svg/);
  assert.match(finance,/partners\/cfa-institute\.svg/);
  assert.match(about,/brand\/apsvt-official-logo\.png/);
  assert.match(lawFaculty,/першого набору студентів у 1994 році/);
  assert.match(lawFaculty,/Юридична клініка/);
  assert.match(economicFaculty,/Чотири напрями — один факультет/);
  assert.match(economicFaculty,/Спеціальності й освітні програми/);
  assert.match(economicFaculty,/Освітні траєкторії/);
  assert.match(psychologyFaculty,/Факультет психології та соціального розвитку/);
  assert.match(psychologyFacultySource,/Кафедра клінічної психології та психотерапії/);
  assert.match(psychologyFacultySource,/PsychologyFacultyLaboratory/);
  assert.match(profiles,/departmentHref: "\/departments\/law-faculty#departments"/);
  assert.match(profiles,/departmentHref: "\/departments\/economics-social-tourism-faculty#departments"/);
  assert.match(profiles,/departmentHref: "\/departments\/psychology-social-development-faculty#departments"/);
  assert.match(structure,/structure-academy-root/);
  assert.match(structure,/structure-levels/);
  assert.match(structure,/Рівень 0/);
});

test("adds a global site search with programme, faculty and department results",async()=>{
  const [home,header,search,index]=await Promise.all([
    (await render("/")).text(),
    readFile(new URL("../app/components/SiteHeader.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/components/SiteSearch.tsx",import.meta.url),"utf8"),
    readFile(new URL("../lib/site-search.ts",import.meta.url),"utf8"),
  ]);
  assert.match(home,/Пошук/);
  assert.match(header,/SiteSearch/);
  assert.match(search,/role="dialog"/);
  assert.match(search,/useDeferredValue/);
  assert.match(index,/Юридичний факультет/);
  assert.match(index,/Кафедра клінічної психології та психотерапії/);
  assert.match(index,/Професійна освіта · Цифрові технології/);
});

test("routes public-administration programme feedback to the requested address",async()=>{
  const html=await (await render("/programs/public-administration")).text();
  assert.match(html,/publ\.adm\.apsvt@gmail\.com/);
  assert.match(html,/mailto:publ\.adm\.apsvt@gmail\.com/);
});

test("publishes the psychology and social development faculty as a separate structure",async()=>{
  const [html,page,directory,structure]=await Promise.all([
    (await render("/departments/psychology-social-development-faculty")).text(),
    readFile(new URL("../app/departments/psychology-social-development-faculty/page.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/departments/page.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/about/AcademyStructure.tsx",import.meta.url),"utf8"),
  ]);
  assert.match(html,/ФПСР/);
  assert.match(html,/3<\/b><span>кафедри/);
  assert.match(page,/Кафедра психології бізнесу та управління/);
  assert.match(page,/Соціальна робота та консультування/);
  assert.match(directory,/psychology-social-development-faculty/);
  assert.match(structure,/Факультет психології та соціального розвитку/);
});

test("publishes Moodle and the student council across student resources",async()=>{
  const [students,facilities,council]=await Promise.all([
    (await render("/students")).text(),
    (await render("/facilities")).text(),
    (await render("/students/council")).text(),
  ]);
  assert.match(students,/https:\/\/moodle\.socosvita\.kiev\.ua\//);
  assert.match(students,/Студентська рада/);
  assert.match(facilities,/href="\/students\/council"/);
  assert.match(council,/Ваш голос/);
  assert.match(council,/Положення про самоврядування/);
  assert.match(council,/info@socosvita\.kiev\.ua/);
});

test("publishes source-based law course annotations and the updated faculty team",async()=>{
  const [law,faculty]=await Promise.all([
    (await render("/programs/law")).text(),
    (await render("/departments/law-faculty")).text(),
  ]);
  assert.match(law,/Відкрийте зміст/);
  assert.match(law,/Адміністративне право/);
  assert.match(law,/Право європейського союзу/i);
  assert.match(law,/12<\/b><small>кредитів ЄКТС/);
  assert.match(law,/Навчальний план · редакція 2025/);
  assert.match(law,/240<\/b><span>кредитів ЄКТС/);
  assert.match(law,/33<\/b><span>обов’язкові дисципліни/);
  assert.match(law,/Теорія держави і права/);
  assert.match(law,/Прокуратура в Україні/);
  assert.match(law,/Виробнича практика · 4 курс/);
  assert.doesNotMatch(law,/Кваліфікаційна робота/);
  assert.match(law,/theory-state-law\.docx/);
  assert.match(law,/people\/law\/tetiana-lebid\.webp/);
  assert.match(faculty,/Тетяна Лебідь/);
  assert.match(faculty,/Оксана Домбровська/);
  assert.match(faculty,/Олександра Спінчевська/);
  assert.match(faculty,/people\/law\/yaroslav-zhuravel\.webp/);
  assert.doesNotMatch(faculty,/Домашня адреса|Телефон 096/);
});

test("publishes document-based curriculum sections for every bachelor programme",async()=>{
  const routes=[
    ["psychology","Психодіагностика"],
    ["finance","Корпоративні фінанси"],
    ["management","Операційний менеджмент"],
    ["public-administration","Електронне урядування"],
    ["trade","Електронна комерція"],
    ["social-work","Кейс-менеджмент"],
  ];
  for(const [slug,course] of routes){
    const html=await (await render(`/programs/${slug}`)).text();
    assert.match(html,/Навчальний план ·/);
    assert.match(html,new RegExp("240</b><span>кредитів ЄКТС"));
    assert.match(html,new RegExp("60</b><span>кредитів на вибір"));
    assert.match(html,new RegExp(course));
    assert.match(html,/Практична підготовка та атестація/);
    assert.doesNotMatch(html,/class="study-plan"/);
  }
});

test("ships code login and complete department-page editing",async()=>{
  const [login,manager,publicRenderer,panel,guide]=await Promise.all([
    readFile(new URL("../app/panel/login/LoginForm.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/panel/DepartmentManager.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/components/DepartmentEditorialContent.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/panel/PanelEditor.tsx",import.meta.url),"utf8"),
    readFile(new URL("../public/documents/editorial-panel-guide.pdf",import.meta.url)),
  ]);
  assert.match(login,/verifyOtp/);
  assert.match(login,/\[0-9\]\{8\}/);
  assert.match(login,/Одноразовий код/);
  for(const type of ["Розділи сторінки","Новини","Статті","Матеріали","Фотогалерея","Викладачі"]){assert.match(manager,new RegExp(type));}
  assert.match(publicRenderer,/AcademicProfileCard/);
  assert.match(publicRenderer,/department-photo-grid/);
  assert.match(panel,/Інструкція ↗/);
  assert.ok(guide.length>50000);
  assert.equal(guide.subarray(0,4).toString(),"%PDF");
});

test("publishes the 2026 remote admission route for Ukrainians abroad",async()=>{
  const [admissions,international]=await Promise.all([
    (await render("/admissions")).text(),
    (await render("/international")).text(),
  ]);
  for(const html of [admissions,international]){
    assert.match(html,/id="ukrainians-abroad"/);
    assert.match(html,/Вступайте/);
    assert.match(html,/Дія\.Підпис/);
    assert.match(html,/Посвідчення закордонного українця/);
    assert.match(html,/https:\/\/cabinet\.edbo\.gov\.ua\//);
    assert.match(html,/economic-and-business-ethics\.html/);
    assert.match(html,/inz@socosvita\.kiev\.ua/);
  }
});

test("publishes the criminal law, procedure and forensics department",async()=>{
  const [departmentHtml,facultyHtml,directoryHtml]=await Promise.all([
    (await render("/departments/criminal-law")).text(),
    (await render("/departments/law-faculty")).text(),
    (await render("/departments")).text(),
  ]);
  assert.match(departmentHtml,/Кафедра кримінального права, процесу та криміналістики/);
  for(const person of ["Ірина Завидняк","Володимир Ліпкан","Микола Маломуж","Андрій Бегма","Роман Лев","Олександр Ярмоленко"]){
    assert.match(departmentHtml,new RegExp(person));
  }
  assert.match(departmentHtml,/iryna-zavydniak\.jpg/);
  assert.match(departmentHtml,/oleksandr-yarmolenko\.jpg/);
  assert.match(departmentHtml,/Загальна інформація про кафедру/);
  assert.match(departmentHtml,/Науково-педагогічний склад/);
  assert.match(facultyHtml,/href="\/departments\/criminal-law"/);
  assert.match(directoryHtml,/href="\/departments\/criminal-law"/);
});

test("keeps four law departments to five closed sections and separates programme document categories",async()=>{
  const paths=["constitutional-law","criminal-law","private-law","public-administration"];
  for(const slug of paths){
    const html=await (await render(`/departments/${slug}`)).text();
    assert.equal((html.match(/class="admissions-icon-card/g)||[]).length,5,`${slug} must show exactly five sections`);
    for(const title of ["Загальна інформація про кафедру","Завідувач кафедри","Склад кафедри","Новини","Контакти"]) assert.match(html,new RegExp(title));
    assert.doesNotMatch(html,/id="science-clubs"|id="academic-council"|id="programme-discussion"/);
  }
  const faculty=await (await render("/departments/law-faculty")).text();
  assert.doesNotMatch(faculty,/id="faculty-discussion"|Рішення та протоколи/);
  assert.match(faculty,/class="faculty-council-materials"/);
  for(const slug of ["d8-law-bachelor","d8-law-master","d8-law-phd","d4-public-administration-bachelor","d4-public-administration-master","d4-public-administration-phd"]){
    const html=await (await render(`/departments/law-faculty/faculty-programmes/${slug}`)).text();
    if(slug==="d4-public-administration-bachelor"){
      assert.match(html,/<summary>Робочі програми · обов’язкові дисципліни<\/summary>/);
      assert.match(html,/<summary>Анотації · обов’язкові дисципліни<\/summary>/);
    }else{
      assert.match(html,/<h2>Робочі програми<\/h2>/);
      assert.match(html,/<h2>Анотації<\/h2>/);
    }
  }
  for(const path of ["faculty-council/meetings","faculty-council/decisions","faculty-council/protocols","faculty-discussion/about"]){
    assert.equal((await render(`/departments/law-faculty/${path}`)).status,404,path);
  }
  for(const page of ["about","members","regulations","plan"]){
    assert.equal((await render(`/departments/law-faculty/faculty-council/${page}`)).status,200,page);
  }
});

test("publishes the private, labour and commercial law department",async()=>{
  const [departmentHtml,directoryHtml]=await Promise.all([
    (await render("/departments/private-law")).text(),
    (await render("/departments")).text(),
  ]);
  assert.match(departmentHtml,/Кафедра цивільного, трудового та господарського права/);
  assert.match(departmentHtml,/Катерина Біда/);
  assert.match(departmentHtml,/D8 «Право»/);
  assert.match(directoryHtml,/href="\/departments\/private-law"/);
});

test("supports bulk schedule files in the panel and the Telegram bot",async()=>{
  const [panel,manager,bulkRoute,documents,telegram,styles]=await Promise.all([
    readFile(new URL("../app/panel/PanelEditor.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/panel/ScheduleDocumentManager.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/api/documents/bulk/route.ts",import.meta.url),"utf8"),
    readFile(new URL("../lib/documents.ts",import.meta.url),"utf8"),
    readFile(new URL("../lib/telegram-editorial.ts",import.meta.url),"utf8"),
    readFile(new URL("../app/expanded.css",import.meta.url),"utf8"),
  ]);
  assert.match(panel,/ScheduleDocumentManager/);
  assert.match(panel,/panel\?view=schedule|initialView/);
  assert.match(manager,/type="file" multiple/);
  assert.match(manager,/\/api\/documents\/bulk/);
  assert.match(manager,/Замінити файл/);
  assert.match(bulkRoute,/documents\.length > 20/);
  assert.match(documents,/createDocuments/);
  assert.match(telegram,/schedule-files/);
  assert.match(telegram,/ed:sch:replace/);
  assert.match(telegram,/Надішліть наступний файл/);
  assert.match(styles,/@media\(max-width:700px\).*schedule-manager-intro/s);
});
