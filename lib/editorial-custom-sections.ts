export const customSectionPrefix = "editorial-section-";
export const customSectionRootRole = "editorial-section-root";

export function isCustomSectionId(value: string): boolean {
  return /^editorial-section-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function isCustomSectionRoot(entry: { entryType: string; sectionId: string; role: string }): boolean {
  return entry.entryType === "section" && entry.role === customSectionRootRole && isCustomSectionId(entry.sectionId);
}
