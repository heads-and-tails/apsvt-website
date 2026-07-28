const documents = {
  bachelor: "/documents/admissions/entrance-exams/bakalavrat-spivbesidy-2026.pdf",
  master: "/documents/admissions/entrance-exams/mahistratura-spivbesidy-fakhovi-ispity-2026.pdf",
  phd: "/documents/admissions/entrance-exams/aspirantura-vstupni-vyprobuvannia-2026.pdf",
};

const bachelorDates = [
  { date: "14 липня", type: "Консультація", inPerson: "10:00 · ауд. 318", online: "10:00 · дистанційно" },
  { date: "15 липня", type: "Співбесіда", inPerson: "10:00 · ауд. 318", online: "12:00 · дистанційно", special: "14:00 · окремі категорії" },
  { date: "28 липня", type: "Консультація", inPerson: "10:00 · ауд. 318", online: "10:00 · дистанційно" },
  { date: "29 липня", type: "Співбесіда", inPerson: "10:00 · ауд. 318", online: "12:00 · дистанційно", special: "14:00 · окремі категорії" },
  { date: "31 липня", type: "Співбесіда", inPerson: "10:00 · ауд. 318", online: "12:00 · дистанційно", special: "14:00 · окремі категорії" },
];

const masterDates = [
  { date: "05 серпня", type: "Консультації", inPerson: "10:00 · іноземна мова", online: "12:00 · фах" },
  { date: "06 серпня", type: "Співбесіда з іноземної мови", inPerson: "10:00 · ауд. 318", online: "12:00 · дистанційно", special: "14:00 · окремі категорії" },
  { date: "07 серпня", type: "Фаховий іспит", inPerson: "10:00 · в Академії", online: "12:00 · дистанційно" },
  { date: "18 серпня", type: "Співбесіда з іноземної мови", inPerson: "10:00 · ауд. 318", online: "12:00 · дистанційно", special: "14:00 · окремі категорії" },
  { date: "19 серпня", type: "Фаховий іспит", inPerson: "10:00 · в Академії", online: "12:00 · дистанційно" },
];

const masterPrograms = [
  ["A5", "Професійна освіта", "Цифрові технології; управління інформаційною безпекою", "325"],
  ["C4", "Психологія", "Клінічна психологія; психологія бізнесу та управління", "205"],
  ["D2", "Фінанси, банківська справа, страхування та фондовий ринок", "Фінанси, банківська справа, страхування та фондовий ринок", "402"],
  ["D3", "Менеджмент", "Менеджмент", "402"],
  ["D4", "Публічне управління та адміністрування", "Публічне управління та адміністрування", "402"],
  ["D5", "Маркетинг", "Маркетинг", "402"],
  ["D8", "Право", "Право", "506"],
  ["I10", "Соціальна робота та консультування", "Соціальна робота та ветеранський супровід", "224"],
];

const phdDates = [
  { date: "21 серпня", type: "Співбесіда з іноземної мови замість ЄВІ", inPerson: "10:00 · ауд. 318", online: "12:00 · дистанційно", special: "14:00 · окремі категорії" },
  { date: "25 серпня", type: "Іспит з методології наукових досліджень замість ЄВВ", inPerson: "10:00 · ауд. 205", online: "12:00 · дистанційно" },
  { date: "26 серпня", type: "Іспит зі спеціальності", inPerson: "10:00 · в Академії", online: "12:00 · дистанційно" },
  { date: "26 серпня", type: "Презентація дослідницької пропозиції", inPerson: "13:00 · в Академії", online: "14:00 · дистанційно" },
];

const phdPrograms = [
  ["A5", "Професійна освіта (за спеціалізаціями)", "325"],
  ["C1", "Економіка та міжнародні економічні відносини", "402"],
  ["C4", "Психологія", "205"],
  ["D4", "Публічне управління та адміністрування", "507"],
  ["D8", "Право", "506"],
];

type ScheduleRow = {
  date: string;
  type: string;
  inPerson: string;
  online: string;
  special?: string;
};

function ScheduleRows({ rows }: { rows: ScheduleRow[] }) {
  return <div className="entrance-schedule-rows">
    {rows.map((row, index) => <article key={`${row.date}-${row.type}`}>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <div className="entrance-schedule-date"><b>{row.date}</b><small>2026 року</small></div>
      <div className="entrance-schedule-event"><h4>{row.type}</h4><p>{row.inPerson}</p><p>{row.online}</p>{row.special && <p>{row.special}</p>}</div>
    </article>)}
  </div>;
}

function PdfButton({ href, pages }: { href: string; pages: number }) {
  return <a className="entrance-pdf-button" href={href} target="_blank" rel="noreferrer">
    <span>Офіційний документ</span>
    <b>Відкрити PDF ↗</b>
    <small>{pages} {pages === 1 ? "сторінка" : pages < 5 ? "сторінки" : "сторінок"}</small>
  </a>;
}

export function EntranceExamSchedule() {
  return <section className="entrance-exams" id="entrance-exams"><div className="wrap">
    <div className="entrance-exams-head">
      <div><div className="idx">05 / Приймальна комісія</div><h2>Розклад вступних<br />випробувань</h2></div>
      <div className="entrance-exams-note"><b>Вступ 2026</b><p>Дати, час, формат і аудиторії витягнуто з офіційних графіків Приймальної комісії.</p><span>3 рівні освіти · 7 сторінок</span></div>
    </div>

    <nav className="entrance-level-nav" aria-label="Рівні освіти">
      <a href="#entrance-bachelor"><span>01</span><b>Бакалаврат</b><small>14–31 липня</small></a>
      <a href="#entrance-master"><span>02</span><b>Магістратура</b><small>5–19 серпня</small></a>
      <a href="#entrance-phd"><span>03</span><b>Аспірантура</b><small>21–26 серпня</small></a>
    </nav>

    <article className="entrance-level" id="entrance-bachelor">
      <header><div><span>01 / Бакалаврат</span><h3>Співбесіди</h3><p>Для вступників на основі повної загальної середньої освіти та НРК5, які беруть участь у конкурсі за кошти фізичних та/або юридичних осіб.</p></div><PdfButton href={documents.bachelor} pages={1} /></header>
      <div className="entrance-level-grid">
        <ScheduleRows rows={bachelorDates} />
        <aside className="entrance-subjects"><span>Перелік предметів</span><h4>Одна співбесіда за обраним предметом</h4><p>Українська мова, математика, історія України, українська література, іноземна мова, біологія, фізика, хімія або географія.</p><small>Для окремих категорій передбачено спеціальний дистанційний час о 14:00.</small></aside>
      </div>
    </article>

    <article className="entrance-level" id="entrance-master">
      <header><div><span>02 / Магістратура</span><h3>Співбесіди та фахові іспити</h3><p>Для вступників на основі НРК6 і НРК7. Графік охоплює консультації, співбесіди з іноземної мови та фахові іспити.</p></div><PdfButton href={documents.master} pages={4} /></header>
      <ScheduleRows rows={masterDates} />
      <div className="entrance-program-table" role="table" aria-label="Аудиторії фахових іспитів магістратури">
        <div className="entrance-program-head" role="row"><span>Код</span><span>Спеціальність</span><span>Освітня програма</span><span>Аудиторія</span></div>
        {masterPrograms.map(([code, speciality, program, room]) => <div className="entrance-program-row" role="row" key={code}><b>{code}</b><strong>{speciality}</strong><span>{program}</span><em>ауд. {room}</em></div>)}
      </div>
    </article>

    <article className="entrance-level" id="entrance-phd">
      <header><div><span>03 / Аспірантура</span><h3>Вступні випробування</h3><p>Для вступників на здобуття ступеня доктора філософії: іноземна мова, методологія досліджень, іспит зі спеціальності та презентація дослідницької пропозиції.</p></div><PdfButton href={documents.phd} pages={2} /></header>
      <ScheduleRows rows={phdDates} />
      <div className="entrance-program-table compact" role="table" aria-label="Аудиторії вступних випробувань аспірантури">
        <div className="entrance-program-head" role="row"><span>Код</span><span>Спеціальність</span><span>Аудиторія</span></div>
        {phdPrograms.map(([code, speciality, room]) => <div className="entrance-program-row" role="row" key={code}><b>{code}</b><strong>{speciality}</strong><em>ауд. {room}</em></div>)}
      </div>
    </article>

    <div className="entrance-format-note"><span>i</span><div><b>Дистанційна участь</b><p>Meeting ID, код доступу та спеціальні умови наведено в офіційних PDF. Перед випробуванням перевірте актуальність реквізитів у Приймальній комісії.</p></div><a href="mailto:pk@socosvita.kiev.ua">pk@socosvita.kiev.ua →</a></div>
  </div></section>;
}
