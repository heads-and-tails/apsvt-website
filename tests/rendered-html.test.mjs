import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
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
  assert.match(html,/Оприлюднено результати вступних випробувань від 31 липня 2026 року/);
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
  assert.match(ukHtml,/href="\/research\/journals\/visnyk"/);
  assert.match(ukHtml,/Відкрити Вісник/);
  assert.doesNotMatch(ukHtml,/alsrt\.com\.ua/);
  assert.match(enHtml,/href="\/research\/journals\/visnyk\/en"/);
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

  const vacanciesHtml=await (await render("/vacancies")).text();
  assert.doesNotMatch(vacanciesHtml,/vacancy-status/);
  assert.doesNotMatch(vacanciesHtml,/Термін у розміщеному оголошенні/);
  assert.match(vacanciesHtml,/21 липня — 24 серпня 2026 року/);

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
  assert.match(documentsHtml,/<b>57<\/b><p>ключових офіційних документів<\/p>/);
  assert.match(documentsHtml,/438 фрагментів/);
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
  assert.match(archiveHtml,/<b>21<\/b><p>важливий файл<\/p>/);
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
  assert.match(about,/Зрозуміла мапа/);
  assert.match(about,/Рівень 1/);
  assert.match(about,/Рівень 3/);
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
  assert.match(structure,/useState/);
  assert.match(structure,/aria-live="polite"/);
  assert.match(structure,/aria-pressed/);
});

test("enriches programme pages with departments, practice partners, people and legal clinic",async()=>{
  const [finance,management,tourism,law,clinic,departments,marketing]=await Promise.all([
    (await render("/programs/finance")).text(),
    (await render("/programs/management")).text(),
    (await render("/programs/tourism")).text(),
    (await render("/programs/law")).text(),
    (await render("/programs/law/legal-clinic")).text(),
    (await render("/departments")).text(),
    (await render("/programs/marketing")).text(),
  ]);

  for(const html of [finance,management,tourism,law,marketing]){
    assert.match(html,/Кафедра і академічне середовище/);
    assert.match(html,/Практика і професійне середовище/);
    assert.match(html,/Документи програми/);
  }
  assert.match(finance,/Райффайзен Банк/);
  assert.match(finance,/CFA Institute Research Challenge/);
  assert.match(management,/Сільпо Food/);
  assert.match(management,/Ігор Чорнодід/);
  assert.match(tourism,/Join UP!/);
  assert.match(tourism,/Pegas Touristik/);
  assert.match(law,/Юридична клініка «Феміда»/);
  assert.match(law,/href="\/programs\/law\/legal-clinic"/);
  assert.match(clinic,/Право, яке допомагає людям/);
  assert.match(clinic,/Опубліковані тоді години прийому й телефон є історичними/);
  assert.match(clinic,/legalaid\.gov\.ua/);
  assert.match(departments,/13(?:<!-- -->)? кафедр і навчальних осередків/);
  assert.match(departments,/Кафедра кримінального права, процесу та криміналістики/);
  assert.match(departments,/Кафедра інтелектуальних систем та цифрових технологій/);
  assert.match(marketing,/nadiia-pysarenko\.webp/);
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
  assert.match(html,/results\/2026-07-29\/ukrainian-language\.pdf/);
  assert.match(html,/results\/2026-07-29\/mathematics\.pdf/);
  assert.match(html,/results\/2026-07-29\/history-of-ukraine\.pdf/);
  assert.match(html,/results\/2026-07-29\/english-language\.pdf/);
  assert.match(html,/02 \/ Магістратура/);
  assert.match(html,/Рейтингові списки<br\/>вступників/);
  assert.match(html,/25 PDF-документів/);
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

test("announces and duplicates the published entrance results in news",async()=>{
  const [newsHtml,articleHtml,july31ArticleHtml]=await Promise.all([
    (await render("/news")).text(),
    (await render("/news/rezultaty-vstupnykh-vyprobuvan-29-lypnia-2026")).text(),
    (await render("/news/rezultaty-vstupnykh-vyprobuvan-31-lypnia-2026")).text(),
  ]);
  assert.match(newsHtml,/Оприлюднено результати вступних випробувань від 29 липня 2026 року/);
  assert.match(newsHtml,/Оприлюднено результати вступних випробувань від 31 липня 2026 року/);
  assert.match(articleHtml,/Результати за предметами/);
  assert.match(articleHtml,/href="\/admissions#entrance-results"/);
  for(const file of ["ukrainian-language","mathematics","history-of-ukraine","english-language"]){
    assert.match(articleHtml,new RegExp(`results/2026-07-29/${file}\\.pdf`));
  }
  for(const file of ["ukrainian-language","ukrainian-literature","mathematics","history-of-ukraine","english-language"]){
    assert.match(july31ArticleHtml,new RegExp(`results/2026-07-31/${file}\\.pdf`));
  }
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
  for(const name of ["Кафедра конституційного, адміністративного та фінансового права","Кафедра публічного управління та адміністрування","Кафедра цивільного, трудового та господарського права","Кафедра кримінального права, процесу та криміналістики"]){
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
  const [finance,tourism,about,lawFaculty,economicFaculty,profiles,structure]=await Promise.all([
    (await render("/programs/finance")).text(),
    (await render("/programs/tourism")).text(),
    (await render("/about")).text(),
    (await render("/departments/law-faculty")).text(),
    (await render("/departments/economics-social-tourism-faculty")).text(),
    readFile(new URL("../lib/programme-profiles.ts",import.meta.url),"utf8"),
    readFile(new URL("../app/about/AcademyStructure.tsx",import.meta.url),"utf8"),
  ]);
  assert.match(finance,/partners\/raiffeisen\.svg/);
  assert.match(finance,/partners\/cfa-institute\.svg/);
  assert.match(tourism,/partners\/join-up\.svg/);
  assert.match(tourism,/partners\/pegas-touristik\.png/);
  assert.match(about,/brand\/apsvt-official-logo\.png/);
  assert.match(lawFaculty,/Від першого набору/);
  assert.match(lawFaculty,/Юридична клініка/);
  assert.match(economicFaculty,/Вісім напрямів/);
  assert.match(economicFaculty,/«Академія/);
  assert.match(economicFaculty,/Освітні траєкторії/);
  assert.match(profiles,/departmentHref: "\/departments\/law-faculty#departments"/);
  assert.match(profiles,/departmentHref: "\/departments\/economics-social-tourism-faculty#departments"/);
  assert.match(structure,/structure-current-path/);
  assert.match(structure,/structure-summary/);
  assert.match(structure,/Рівень 3/);
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
    ["marketing","Маркетингові дослідження"],
    ["trade","Електронна комерція"],
    ["social-work","Кейс-менеджмент"],
    ["tourism","Туроперейтинг"],
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
  assert.match(login,/\[0-9\]\{6\}/);
  assert.match(login,/Код із пошти/);
  for(const type of ["Розділи сторінки","Новини","Статті","Матеріали","Фотогалерея","Викладачі"]){assert.match(manager,new RegExp(type));}
  assert.match(publicRenderer,/department-teacher-grid/);
  assert.match(publicRenderer,/department-photo-grid/);
  assert.match(panel,/PDF-інструкція/);
  assert.ok(guide.length>50000);
  assert.equal(guide.subarray(0,4).toString(),"%PDF");
});
