import Link from "next/link";

const studyForms = ["Денна форма", "Заочна форма"] as const;
const semesters = ["І семестр", "ІІ семестр"] as const;
const courses = [
  "1 курс",
  "2 курс",
  "3 курс",
  "4 курс",
  "1 курс магістратури",
  "2 курс магістратури",
] as const;

const collections = [
  {
    id: "education-process",
    index: "01",
    title: "Графік навчального процесу",
    description: "Періоди навчання, практики, сесій і канікул для конкретного курсу.",
  },
  {
    id: "class-schedule",
    index: "02",
    title: "Розклад занять",
    description: "Word- і PDF-файли за спеціальністю, курсом, формою та семестром.",
  },
  {
    id: "exam-session",
    index: "03",
    title: "Розклад заліків та іспитів",
    description: "Дати консультацій, заліків та іспитів за курсами й формами навчання.",
  },
] as const;

export function ScheduleDocumentDirectory() {
  return (
    <section className="schedule-directory" id="documents-by-course">
      <div className="wrap">
        <div className="schedule-directory-head">
          <div>
            <div className="idx">2026 / 27 навчальний рік</div>
            <h2>Графіки й розклади за курсом</h2>
          </div>
          <p>
            Відкрийте тільки потрібний тип документа, форму навчання та семестр.
            Файли публікуються окремо за спеціальністю й курсом.
          </p>
        </div>

        <nav className="schedule-directory-nav" aria-label="Типи навчальних графіків">
          {collections.map((collection) => (
            <a href={`#${collection.id}`} key={collection.id}>
              <span>{collection.index}</span>
              <b>{collection.title}</b>
              <i>↓</i>
            </a>
          ))}
        </nav>

        <div className="schedule-collections">
          {collections.map((collection) => (
            <article className="schedule-collection" id={collection.id} key={collection.id}>
              <header>
                <span>{collection.index}</span>
                <div>
                  <h3>{collection.title}</h3>
                  <p>{collection.description}</p>
                </div>
              </header>
              <div className="schedule-study-forms">
                {studyForms.map((form) => (
                  <details key={`${collection.id}-${form}`}>
                    <summary>
                      <span>{form}</span>
                      <b>Обрати семестр</b>
                      <i>+</i>
                    </summary>
                    <div className="schedule-semesters">
                      {semesters.map((semester) => (
                        <details key={`${collection.id}-${form}-${semester}`}>
                          <summary>
                            <span>{semester}</span>
                            <b>6 рівнів навчання</b>
                            <i>+</i>
                          </summary>
                          <div className="schedule-course-grid">
                            {courses.map((course) => (
                              <a href="#published-schedule-files" key={course}>
                                <span>{course}</span>
                                <b>Знайти файли →</b>
                              </a>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="schedule-publish-note" id="published-schedule-files">
          <div>
            <span>Як знайти документ</span>
            <h3>Спеціальність → форма → семестр → курс</h3>
          </div>
          <p>
            Актуальні файли з’являються нижче після публікації навчально-методичним
            відділом. Якщо потрібного документа ще немає, перевірте інтерактивний
            розклад або навчальний календар.
          </p>
          <div>
            <Link href="/academic-calendar">Навчальний календар →</Link>
            <a href="#live-schedule">Інтерактивний розклад →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
