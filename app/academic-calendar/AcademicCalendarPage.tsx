import Link from "next/link";
import { getPublicDocuments } from "@/lib/documents";
import { academicCalendarPath, publishedCalendarDocuments, parseCalendarDocumentCategory } from "@/lib/academic-calendar";
import { scheduleSemesters, scheduleStudyForms } from "@/lib/schedule-documents";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { EnglishFooter } from "../components/EnglishFooter";
import { PageDocuments } from "../components/PageDocuments";

export async function AcademicCalendarPage({ english = false }: { english?: boolean }) {
  const documents = publishedCalendarDocuments(await getPublicDocuments(academicCalendarPath));
  const otherDocuments = documents.filter((document) => !parseCalendarDocumentCategory(document.category));
  const formLabel = (id: string, label: string) => english ? id === "full-time" ? "Full-time study" : "Part-time study" : label;
  const semesterLabel = (id: string, label: string) => english ? id === "semester-1" ? "First semester" : "Second semester" : label;
  return <main id="top" className={english ? "english-page" : undefined}><SiteHeader />
    <section className="phero calendar-hero"><div className="wrap">
      <div className="crumb">{english ? "Home / Students / Academic year" : "Головна / Студенту / Навчальний рік"}</div>
      <h1>{english ? "Academic calendar" : "Графік навчального процесу"}<br />2026 / 27</h1>
      <p className="lead">{english ? "Open the official calendar for your study form and semester." : "Відкрийте офіційний графік за формою навчання та семестром."}</p>
      <Link className="cta" href="#calendar-documents"><span>{english ? "Choose a calendar" : "Обрати графік"}</span></Link>
    </div></section><div className="phero-rule" />
    <section className="schedule-directory academic-calendar-directory" id="calendar-documents"><div className="wrap">
      <div className="schedule-directory-head"><div><div className="idx">2026 / 27</div><h2>{english ? "Official calendars" : "Офіційні графіки"}</h2></div><p>{english ? "Choose your study form, then open the semester folder. Documents are provided in their original language and format." : "Оберіть форму навчання та відкрийте папку потрібного семестру. Документи доступні в оригінальному форматі."}</p></div>
      <div className="schedule-study-forms">
        {scheduleStudyForms.map((form) => <details key={form.id} id={`calendar-${form.id}`}>
          <summary><span>{formLabel(form.id, form.label)}</span><b>{english ? "Choose semester" : "Обрати семестр"}</b><i aria-hidden="true">+</i></summary>
          <div className="schedule-semesters">{scheduleSemesters.map((semester) => {
            const files = documents.filter((document) => {
              const selection = parseCalendarDocumentCategory(document.category);
              return selection?.formId === form.id && selection.semesterId === semester.id;
            });
            return <details key={semester.id} id={`calendar-${form.id}-${semester.id}`}>
              <summary><span>{semesterLabel(semester.id, semester.label)}</span><b>{files.length} {english ? files.length === 1 ? "document" : "documents" : files.length === 1 ? "документ" : files.length < 5 ? "документи" : "документів"}</b><i aria-hidden="true">+</i></summary>
              <div className="schedule-course-files">{files.length ? files.map((document) => <a href={document.fileUrl} target="_blank" rel="noreferrer" key={document.id}><b>{document.title}</b><small>{document.fileName}</small><i>{english ? "Open original" : "Відкрити оригінал"} ↗</i></a>) : <p className="academic-empty-state">{english ? "Documents have not been published yet." : "Документи ще не оприлюднено."}</p>}</div>
            </details>;
          })}</div>
        </details>)}
      </div>
    </div></section>
    <PageDocuments pagePath={academicCalendarPath} documents={otherDocuments} title={english ? "Other documents" : "Інші документи"} description="" />
    <section className="bigcta"><div className="wrap"><div className="mono">{english ? "Timetables" : "Навчальні розклади"}</div><h2>{english ? "Classes and exams" : "Заняття та іспити"}</h2><div className="calendar-actions"><Link className="cta" href={english ? "/en/schedule" : "/schedule"}><span>{english ? "Class timetable" : "Розклад занять"}</span></Link><Link className="cta" href={english ? "/en/exam-schedule" : "/schedule#exam-session"}><span>{english ? "Examination timetable" : "Розклад заліків та іспитів"}</span></Link></div></div></section>
    {english ? <EnglishFooter /> : <SiteFooter />}
  </main>;
}
