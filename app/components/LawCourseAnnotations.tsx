import annotations from "@/app/data/law-course-annotations.json";

type Annotation = {
  slug: string;
  title: string;
  specialty: string;
  level: string;
  category: string;
  credits: string;
  year: string;
  developers: string[];
  goal: string;
  description: string[];
  outcomes: string[];
  modules: { title: string; text: string }[];
  document: string;
};

const courseAnnotations = annotations as Annotation[];

export function LawCourseAnnotations() {
  return <section className="law-annotations" id="course-annotations">
    <div className="wrap">
      <div className="law-annotations-head">
        <div><div className="idx">03 / Анотації дисциплін</div><h2>Відкрийте зміст<br />кожного курсу</h2></div>
        <p>Короткі характеристики, кредити, викладачі, очікувані результати та тематичні модулі. Натисніть на назву дисципліни — картка розгорнеться без переходу на іншу сторінку.</p>
      </div>
      <div className="law-annotation-list">
        {courseAnnotations.map((course, index) => <details key={course.slug} id={`annotation-${course.slug}`}>
          <summary>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><small>{course.year} · {course.category}</small><h3>{course.title}</h3></div>
            <div className="law-annotation-credit"><b>{course.credits}</b><small>кредитів ЄКТС</small></div>
            <i aria-hidden="true">+</i>
          </summary>
          <div className="law-annotation-body">
            <div className="law-annotation-overview">
              <div><span>Освітній рівень</span><b>{course.level}</b></div>
              <div><span>Спеціальність</span><b>{course.specialty}</b></div>
              <div><span>Розробники</span>{course.developers.map(person => <b key={person}>{person}</b>)}</div>
            </div>
            <div className="law-annotation-copy">
              <div><small>Мета дисципліни</small><p>{course.goal}</p></div>
              {course.description.length > 0 && <div><small>Про курс</small>{course.description.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>}
              {course.modules.length > 0 && <div><small>Тематичні модулі</small><ol>{course.modules.map(module => <li key={module.title}><b>{module.title}</b><p>{module.text}</p></li>)}</ol></div>}
              {course.outcomes.length > 0 && <details className="law-outcomes"><summary>Показати очікувані результати навчання <span>+</span></summary><ul>{course.outcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul></details>}
              <a className="law-annotation-download" href={course.document} download>Завантажити оригінальну анотацію · DOCX ↓</a>
            </div>
          </div>
        </details>)}
      </div>
    </div>
  </section>;
}
