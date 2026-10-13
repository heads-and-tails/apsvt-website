import { EditorialRichText } from "./EditorialRichText";

export function TeacherResumeText({ text }: { text: string }) {
  return <div className="teacher-resume-text"><EditorialRichText text={text} headingOffset={2} /></div>;
}

export function TeacherResume({ text, name }: { text: string; name: string }) {
  if (!text.trim()) return null;
  return <details className="teacher-resume" name="department-teacher-resumes">
    <summary aria-label={`Резюме та наукові профілі — ${name}`}>Резюме та наукові профілі <span aria-hidden="true">+</span></summary>
    <TeacherResumeText text={text} />
  </details>;
}
