import type { DepartmentEntry } from "./department-content";
import type { PageDocument } from "./documents";
import { psychologyDepartments } from "./psychology-departments";
import { psychologyFacultyPath, psychologyFacultyStructure } from "./psychology-faculty-structure";

export const psychologyFacultySources = [
  psychologyFacultyPath,
  ...psychologyDepartments.map((department) => `${psychologyFacultyPath}/${department.slug}`),
];

export const psychologyDepartmentDestinations: Readonly<Record<string, string>> = {
  "department-education": "faculty-programmes",
  repository: "faculty-repository",
  "department-news": "department-news",
  "department-documents": "faculty-regulations",
  "department-history": "faculty-about",
  "department-science": "faculty-science",
  "student-science": "faculty-science",
  "science-clubs": "faculty-science",
  "academic-council": "faculty-council",
  "programme-discussion": "faculty-proposals",
  quality: "faculty-proposals",
};

const departmentSections = new Set(["department-about", "department-head", "department-team", "department-contacts"]);
const sharedDepartmentSections = new Set(["department-education", "repository", "department-news", "department-documents"]);
const facultySections = new Set<string>(psychologyFacultyStructure.map((section) => section.id));
const sourcePaths = new Set(psychologyFacultySources);

// Keep published records under their original editorial owners and URLs.
export function collectPsychologyFacultyContent(entries: readonly DepartmentEntry[], documents: readonly PageDocument[]) {
  const entriesBySection = new Map<string, DepartmentEntry[]>();
  const seenEntries = new Set<string>();
  for (const entry of entries) {
    if (!sourcePaths.has(entry.pagePath) || entry.status !== "published" || entry.hidden || seenEntries.has(entry.id)) continue;
    let target: string | undefined;
    if (entry.pagePath === psychologyFacultyPath) {
      target = facultySections.has(entry.sectionId) ? entry.sectionId : "department-news";
    } else {
      const socialWork = entry.pagePath === `${psychologyFacultyPath}/social-work`;
      const previouslyVisible = departmentSections.has(entry.sectionId) || sharedDepartmentSections.has(entry.sectionId)
        || socialWork && (entry.entryType === "quality" || Object.hasOwn(psychologyDepartmentDestinations, entry.sectionId));
      if (!previouslyVisible || ["hero", "override", "teacher", "partner"].includes(entry.entryType)) continue;
      if (entry.entryType === "quality") {
        if (!socialWork) continue;
        target = "faculty-proposals";
      } else if (entry.entryType === "news") {
        target = "department-news";
      } else if (!departmentSections.has(entry.sectionId)) {
        target = psychologyDepartmentDestinations[entry.sectionId];
      }
    }
    if (!target) continue;
    seenEntries.add(entry.id);
    entriesBySection.set(target, [...(entriesBySection.get(target) || []), entry]);
  }
  const visibleDocuments = new Map<string, PageDocument>();
  for (const document of documents) {
    if (document.status === "published" && (document.pagePath === "*" || sourcePaths.has(document.pagePath))) {
      visibleDocuments.set(document.id, document);
    }
  }
  return {
    entriesBySection,
    documents: [...visibleDocuments.values()].sort((a, b) => a.sortOrder - b.sortOrder || b.createdAt.localeCompare(a.createdAt)),
  };
}
