export const scheduleCollections = [
  { id: "education-process", label: "Графік навчального процесу" },
  { id: "class-schedule", label: "Розклад занять" },
  { id: "exam-session", label: "Розклад заліків та іспитів" },
] as const;

export const scheduleStudyForms = [
  { id: "full-time", label: "Денна форма" },
  { id: "part-time", label: "Заочна форма" },
] as const;

export const scheduleSemesters = [
  { id: "semester-1", label: "І семестр" },
  { id: "semester-2", label: "ІІ семестр" },
] as const;

export const scheduleCourses = [
  { id: "course-1", label: "1 курс" },
  { id: "course-2", label: "2 курс" },
  { id: "course-3", label: "3 курс" },
  { id: "course-4", label: "4 курс" },
  { id: "master-1", label: "1 курс магістратури" },
  { id: "master-2", label: "2 курс магістратури" },
] as const;

export type ScheduleCollectionId = (typeof scheduleCollections)[number]["id"];
export type ScheduleStudyFormId = (typeof scheduleStudyForms)[number]["id"];
export type ScheduleSemesterId = (typeof scheduleSemesters)[number]["id"];
export type ScheduleCourseId = (typeof scheduleCourses)[number]["id"];

export type ScheduleDocumentSelection = {
  collectionId: ScheduleCollectionId;
  formId: ScheduleStudyFormId;
  semesterId: ScheduleSemesterId;
  courseId: ScheduleCourseId;
  specialty: string;
};

export const defaultScheduleDocumentSelection: ScheduleDocumentSelection = {
  collectionId: "class-schedule",
  formId: "full-time",
  semesterId: "semester-1",
  courseId: "course-1",
  specialty: "",
};

function optionById<T extends readonly { id: string; label: string }[]>(options: T, id: string) {
  return options.find((option) => option.id === id);
}

export function buildScheduleDocumentCategory(selection: ScheduleDocumentSelection): string {
  const parts = [
    optionById(scheduleCollections, selection.collectionId)?.label,
    optionById(scheduleStudyForms, selection.formId)?.label,
    optionById(scheduleSemesters, selection.semesterId)?.label,
    optionById(scheduleCourses, selection.courseId)?.label,
    selection.specialty.trim(),
  ].filter(Boolean);
  return parts.join(" · ");
}

export function parseScheduleDocumentCategory(value: string): ScheduleDocumentSelection | null {
  const parts = value.split(" · ").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 4) return null;
  const collection = scheduleCollections.find((option) => option.label === parts[0]);
  const form = scheduleStudyForms.find((option) => option.label === parts[1]);
  const semester = scheduleSemesters.find((option) => option.label === parts[2]);
  const course = scheduleCourses.find((option) => option.label === parts[3]);
  if (!collection || !form || !semester || !course) return null;
  return {
    collectionId: collection.id,
    formId: form.id,
    semesterId: semester.id,
    courseId: course.id,
    specialty: parts.slice(4).join(" · "),
  };
}

export function scheduleDocumentCategoryLabel(value: string): string {
  const selection = parseScheduleDocumentCategory(value);
  if (!selection) return value;
  const collection = optionById(scheduleCollections, selection.collectionId)?.label || value;
  return selection.specialty ? `${collection} · ${selection.specialty}` : collection;
}
