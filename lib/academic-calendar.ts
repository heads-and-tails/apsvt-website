import type { PageDocument } from "./documents";
import { scheduleSemesters, scheduleStudyForms, type ScheduleSemesterId, type ScheduleStudyFormId } from "./schedule-documents";

export const academicCalendarPath = "/academic-calendar";
const categoryPrefix = "Графік навчального процесу";

export type CalendarSelection = { formId: ScheduleStudyFormId; semesterId: ScheduleSemesterId };

export function buildCalendarDocumentCategory(selection: CalendarSelection): string {
  return [categoryPrefix, scheduleStudyForms.find((form) => form.id === selection.formId)!.label, scheduleSemesters.find((semester) => semester.id === selection.semesterId)!.label].join(" · ");
}

export function parseCalendarDocumentCategory(category: string): CalendarSelection | null {
  const parts = category.split(" · ").map((part) => part.trim());
  const form = scheduleStudyForms.find((item) => item.label === parts[1]);
  const semester = scheduleSemesters.find((item) => item.label === parts[2]);
  return parts.length === 3 && parts[0] === categoryPrefix && form && semester ? { formId: form.id, semesterId: semester.id } : null;
}

export function publishedCalendarDocuments(documents: PageDocument[]): PageDocument[] {
  return documents.filter((document) => document.pagePath === academicCalendarPath && document.status === "published");
}
