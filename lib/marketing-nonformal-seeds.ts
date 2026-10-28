import type { ContentItem } from "./content";
import authoredEntries from "./marketing-nonformal-content.json";

const publishedAt = "2026-10-28T06:18:51.321Z";

export const marketingNonformalSeedContent: ContentItem[] = authoredEntries.map((entry): ContentItem => ({
  id: entry.id,
  kind: "research_resource",
  payload: {
    editorialSurface: "page",
    pagePath: "/programs/marketing",
    sectionId: entry.sectionId,
    entryType: entry.entryType,
    title: entry.title,
    summary: entry.summary,
    body: entry.body,
    images: entry.images,
    attachments: entry.attachments,
    date: "date" in entry ? entry.date || "" : "",
    status: "published",
    publishedAt,
  },
  sortOrder: entry.sortOrder,
  createdAt: publishedAt,
  updatedAt: publishedAt,
  authorEmail: "editorial@apsvt.local",
}));
