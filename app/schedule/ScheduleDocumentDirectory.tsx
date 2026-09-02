import Link from "next/link";
import type { PageDocument } from "@/lib/documents";
import {
  parseScheduleDocumentCategory,
  scheduleCourses,
  scheduleSemesters,
  scheduleStudyForms,
} from "@/lib/schedule-documents";

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

function fileSize(value: number): string {
  if (!value) return "";
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} КБ`;
  return `${(value / (1024 * 1024)).toFixed(1)} МБ`;
}

export function ScheduleDocumentDirectory({ documents }: { documents: PageDocument[] }) {
  const structuredDocuments = documents.flatMap((document) => {
    const selection = parseScheduleDocumentCategory(document.category);
    return selection ? [{ document, selection }] : [];
  });
  const structuredIds = new Set(structuredDocuments.map(({ document }) => document.id));
  const otherDocuments = documents.filter((document) => !structuredIds.has(document.id));

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
                {scheduleStudyForms.map((form) => (
                  <details key={`${collection.id}-${form.id}`}>
                    <summary>
                      <span>{form.label}</span>
                      <b>Обрати семестр</b>
                      <i>+</i>
                    </summary>
                    <div className="schedule-semesters">
                      {scheduleSemesters.map((semester) => (
                        <details key={`${collection.id}-${form.id}-${semester.id}`}>
                          <summary>
                            <span>{semester.label}</span>
                            <b>6 рівнів навчання</b>
                            <i>+</i>
                          </summary>
                          <div className="schedule-course-grid">
                            {scheduleCourses.map((course) => {
                              const courseDocuments = structuredDocuments.filter(({ selection }) =>
                                selection.collectionId === collection.id
                                && selection.formId === form.id
                                && selection.semesterId === semester.id
                                && selection.courseId === course.id);
                              return <div className="schedule-course-cell" key={course.id}>
                                <span>{course.label}</span>
                                {courseDocuments.length ? <div className="schedule-course-files">{courseDocuments.map(({ document, selection }) => (
                                  <a href={document.fileUrl} target="_blank" rel="noreferrer" key={document.id}>
                                    <b>{selection.specialty || document.title}</b>
                                    {selection.specialty && <small>{document.title}</small>}
                                    <i>{fileSize(document.fileSize) || "Відкрити"} ↗</i>
                                  </a>
                                ))}</div> : <small>Файли ще не опубліковано</small>}
                              </div>;
                            })}
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

        {otherDocuments.length > 0 && <div className="schedule-other-files">
          <div><span>Інші опубліковані матеріали</span><h3>Файли без прив’язки до курсу</h3></div>
          <div>{otherDocuments.map((document) => <a href={document.fileUrl} target="_blank" rel="noreferrer" key={document.id}><b>{document.title}</b><small>{document.category}{fileSize(document.fileSize) ? ` · ${fileSize(document.fileSize)}` : ""}</small><i>Відкрити ↗</i></a>)}</div>
        </div>}

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
