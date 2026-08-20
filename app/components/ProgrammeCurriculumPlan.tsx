import { programmeCurricula, type ProgrammeCurriculumCourse } from "@/lib/programme-curricula";

function ProgrammeCourseTable({ courses }: { courses: ProgrammeCurriculumCourse[] }) {
  return <div className="law-curriculum-table programme-curriculum-table">
    <div className="law-curriculum-table-head"><span>№</span><span>Освітній компонент</span><span>Період</span><span>Статус</span></div>
    {courses.map((course, index) => <div className="law-curriculum-row programme-curriculum-row" key={course.name}>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <b>{course.name}</b>
      <strong>{course.stage}</strong>
      <small>{course.status || "компонент програми"}</small>
    </div>)}
  </div>;
}

export function ProgrammeCurriculumPlan({ slug, code, title }: { slug: string; code: string; title: string }) {
  const curriculum = programmeCurricula[slug];
  if (!curriculum) return null;

  return <section className="law-curriculum programme-curriculum soft" id="curriculum">
    <div className="wrap">
      <header className="law-curriculum-head">
        <div>
          <div className="idx">02 / Навчальний план · {curriculum.edition}</div>
          <h2>Що ви вивчатимете</h2>
        </div>
        <div>
          <p>{curriculum.intro}</p>
          <a className="law-curriculum-source" href={curriculum.sourceHref} target={curriculum.sourceHref.startsWith("http") ? "_blank" : undefined} rel={curriculum.sourceHref.startsWith("http") ? "noreferrer" : undefined}>Джерело · {curriculum.sourceLabel}</a>
        </div>
      </header>

      <div className="law-curriculum-stats" aria-label={`Структура програми ${title} у цифрах`}>
        <div><b>240</b><span>кредитів ЄКТС</span></div>
        <div><b>4</b><span>роки навчання</span></div>
        <div><b>60</b><span>кредитів на вибір</span></div>
        <div><b>{curriculum.practice.length}</b><span>етапи практики й атестації</span></div>
      </div>

      <div className="law-curriculum-groups">
        {curriculum.groups.map((group, index) => <details key={group.title}>
          <summary>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><small>{group.label}</small><h3>{group.title}</h3></div>
            <b>{group.period}</b>
            <i>+</i>
          </summary>
          <ProgrammeCourseTable courses={group.courses} />
        </details>)}
      </div>

      <div className="law-curriculum-choice" id="electives">
        <div className="law-curriculum-choice-intro">
          <div className="idx">03 / Індивідуальна траєкторія</div>
          <h3>60 кредитів <em>обираєте ви</em></h3>
          <p>Вибіркові компоненти складають не менше <b>25% програми</b>. Остаточний набір студент формує під час вибору дисциплін та фіксує в індивідуальному навчальному плані.</p>
        </div>
        <div className="law-curriculum-track-list">
          {curriculum.electives.map((track, index) => <article key={track.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><h4>{track.title}</h4><p>{track.examples}</p></div>
          </article>)}
        </div>
      </div>

      <div className="law-curriculum-practice programme-curriculum-practice">
        <header><div className="idx">04 / Практична підготовка та атестація</div><h3>Від знань — до професії</h3></header>
        <div>
          {curriculum.practice.map((item, index) => <article key={item.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h4>{item.title}</h4>
            <b className="is-stage">{item.stage}</b>
            <p>{item.control}</p>
          </article>)}
        </div>
      </div>

      <p className="law-curriculum-note">Показано структуру денної бакалаврської програми {code} «{title}» за оприлюдненими Академією матеріалами. Точна послідовність компонентів, форми контролю та розподіл за семестрами можуть оновлюватися й відрізнятися для денної та заочної форм навчання.</p>
    </div>
  </section>;
}
