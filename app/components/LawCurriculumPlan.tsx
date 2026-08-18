type CurriculumCourse = {
  name: string;
  credits: number;
  control: string;
};

const generalCourses: CurriculumCourse[] = [
  { name: "Історія української державності", credits: 3, control: "екзамен" },
  { name: "Світова та українська культура і мистецтво", credits: 3, control: "екзамен" },
  { name: "Українська мова за професійним спрямуванням", credits: 3, control: "екзамен" },
  { name: "Соціально-політичні студії", credits: 3, control: "екзамен" },
  { name: "Філософія", credits: 3, control: "екзамен" },
  { name: "Основи національної безпеки", credits: 6, control: "екзамен" },
  { name: "Інформаційно-комунікаційні технології", credits: 6, control: "залік · екзамен" },
  { name: "Іноземна мова", credits: 12, control: "залік · екзамен" },
  { name: "Профспілки в умовах соціальних трансформацій", credits: 3, control: "екзамен" },
  { name: "Академічні студії та доброчесність", credits: 3, control: "екзамен" },
];

const professionalCourses: CurriculumCourse[] = [
  { name: "Теорія держави і права", credits: 12, control: "залік · екзамен" },
  { name: "Історія українського права", credits: 4, control: "екзамен" },
  { name: "Конституційне право України", credits: 6, control: "залік · екзамен" },
  { name: "Адміністративне право", credits: 7, control: "залік · екзамен" },
  { name: "Цивільне право", credits: 7, control: "залік · екзамен" },
  { name: "Кримінальне право", credits: 7, control: "залік · екзамен" },
  { name: "Цивільний процес", credits: 7, control: "залік · екзамен" },
  { name: "Кримінальний процес", credits: 6, control: "залік · екзамен" },
  { name: "Трудове право", credits: 11, control: "залік · екзамен" },
  { name: "Криміналістика", credits: 3, control: "екзамен" },
  { name: "Економічне право", credits: 6, control: "залік · екзамен" },
  { name: "Міжнародне право", credits: 3, control: "екзамен" },
  { name: "Муніципальне право", credits: 3, control: "екзамен" },
  { name: "Право Європейського Союзу", credits: 3, control: "екзамен" },
  { name: "Фінансове право", credits: 3, control: "екзамен" },
  { name: "Юридична деонтологія", credits: 3, control: "екзамен" },
  { name: "Історія держави і права зарубіжних країн", credits: 5, control: "екзамен" },
  { name: "Судові і правоохоронні органи", credits: 6, control: "екзамен" },
  { name: "Прокуратура в Україні", credits: 3, control: "екзамен" },
  { name: "Господарський процес", credits: 3, control: "екзамен" },
  { name: "Право соціального забезпечення", credits: 5, control: "екзамен" },
  { name: "Адміністративний процес", credits: 3, control: "екзамен" },
  { name: "Римське право", credits: 3, control: "екзамен" },
];

const electiveTracks = [
  {
    title: "Публічне право",
    examples: "Адміністративна юстиція · Державна служба · Публічна інформація · Муніципальна правотворчість",
  },
  {
    title: "Приватне й економічне право",
    examples: "Корпоративне право · Договірне право · Банкрутство · Нотаріат · Міжнародне приватне право",
  },
  {
    title: "Трудове та соціальне право",
    examples: "Міжнародне трудове право · Соціальний захист · Зайнятість · Судовий захист трудових прав",
  },
  {
    title: "Кримінальна юстиція й безпека",
    examples: "Кримінологія · Кваліфікація злочинів · Кіберправо · Розслідування кіберзлочинів · Антикорупційне право",
  },
  {
    title: "Міжнародне право і права людини",
    examples: "Міжнародний судовий процес · Дипломатичне і консульське право · Права людини · Національна безпека",
  },
];

const practice = [
  { title: "Навчальна практика", credits: 6, control: "захист" },
  { title: "Виробнича практика · 3 курс", credits: 4, control: "захист" },
  { title: "Виробнича практика · 4 курс", credits: 5, control: "захист" },
  { title: "Атестаційний екзамен", credits: 1, control: "екзамен" },
];

function CourseTable({ courses }: { courses: CurriculumCourse[] }) {
  return <div className="law-curriculum-table">
    <div className="law-curriculum-table-head"><span>№</span><span>Освітній компонент</span><span>ЄКТС</span><span>Контроль</span></div>
    {courses.map((course, index) => <div className="law-curriculum-row" key={course.name}>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <b>{course.name}</b>
      <strong>{course.credits}</strong>
      <small>{course.control}</small>
    </div>)}
  </div>;
}

export function LawCurriculumPlan() {
  return <section className="law-curriculum soft" id="curriculum">
    <div className="wrap">
      <header className="law-curriculum-head">
        <div>
          <div className="idx">02 / Навчальний план · редакція 2025</div>
          <h2>Що ви вивчатимете</h2>
        </div>
        <div>
          <p>Реальна структура бакалаврської програми D8 «Право» за офіційною освітньо-професійною програмою Академії. Для кожної обов’язкової дисципліни вказано обсяг у кредитах ЄКТС і форму підсумкового контролю.</p>
          <span className="law-curriculum-source">Джерело · офіційна ОПП D8 «Право» · 2025</span>
        </div>
      </header>

      <div className="law-curriculum-stats" aria-label="Структура програми у цифрах">
        <div><b>240</b><span>кредитів ЄКТС</span></div>
        <div><b>33</b><span>обов’язкові дисципліни</span></div>
        <div><b>60</b><span>кредитів на вибір</span></div>
        <div><b>15</b><span>кредитів практики</span></div>
      </div>

      <div className="law-curriculum-groups">
        <details open>
          <summary><span>01</span><div><small>Обов’язковий блок</small><h3>Загальна підготовка</h3></div><b>45 ЄКТС</b><i>+</i></summary>
          <CourseTable courses={generalCourses} />
        </details>
        <details>
          <summary><span>02</span><div><small>Обов’язковий блок</small><h3>Фахова підготовка</h3></div><b>119 ЄКТС</b><i>+</i></summary>
          <CourseTable courses={professionalCourses} />
        </details>
      </div>

      <div className="law-curriculum-choice" id="electives">
        <div className="law-curriculum-choice-intro">
          <div className="idx">03 / Індивідуальна траєкторія</div>
          <h3>60 кредитів <em>обираєте ви</em></h3>
          <p><b>15 ЄКТС</b> — дисципліни загальної підготовки. <b>45 ЄКТС</b> — професійні правничі дисципліни. Конкретний набір студент формує в індивідуальному навчальному плані.</p>
        </div>
        <div className="law-curriculum-track-list">
          {electiveTracks.map((track, index) => <article key={track.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><h4>{track.title}</h4><p>{track.examples}</p></div>
          </article>)}
        </div>
      </div>

      <div className="law-curriculum-practice">
        <header><div className="idx">04 / Практична підготовка та атестація</div><h3>Від аудиторії — до юридичної практики</h3></header>
        <div>
          {practice.map((item, index) => <article key={item.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h4>{item.title}</h4>
            <b>{item.credits} <small>ЄКТС</small></b>
            <p>{item.control}</p>
          </article>)}
        </div>
      </div>

      <p className="law-curriculum-note">Послідовність дисциплін за семестрами визначає навчальний план відповідної форми навчання. Загальний обсяг бакалаврської програми — 240 кредитів ЄКТС, тривалість — 3 роки 10 місяців.</p>
    </div>
  </section>;
}
