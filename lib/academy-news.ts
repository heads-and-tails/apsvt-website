import { applicantRankingsNewsSlug } from "./admissions-rankings";
import type { Post } from "./data";
import type { DepartmentEntry } from "./department-content";
import { departmentImages } from "./department-media";
import { departmentPublicationDate } from "./department-news-date";

export type AcademyNewsItem = {
  post: Post;
  href: string;
  imageFit?: "contain" | "cover";
};

function newsPreview(summary: string): string {
  const text = summary.trim();
  return text.length > 240 ? `${text.slice(0, 240).replace(/\s+\S*$/, "").trimEnd()}…` : text;
}

function publicationTime(post: Post): number {
  const published = post.publishedAt ? Date.parse(post.publishedAt) : NaN;
  if (Number.isFinite(published)) return published;
  const created = Date.parse(post.createdAt);
  return Number.isFinite(created) ? created : 0;
}

export function mergeAcademyNews(posts: Post[], entries: DepartmentEntry[]): AcademyNewsItem[] {
  const items: AcademyNewsItem[] = posts
    .filter((post) => post.status === "published" && !post.category.startsWith("__") && post.slug !== applicantRankingsNewsSlug)
    .map((post) => ({ post, href: `/news/${post.slug}` }));

  for (const entry of entries) {
    if (entry.pagePath !== "/programs/marketing" || entry.entryType !== "news" || entry.status !== "published" || entry.hidden) continue;
    const image = departmentImages(entry)[0];
    items.push({
      href: `/department-news/${entry.id}`,
      imageFit: image?.fit,
      post: {
        id: `department:${entry.id}`,
        slug: entry.id,
        title: entry.title,
        excerpt: newsPreview(entry.summary),
        body: entry.body,
        category: "Кафедра маркетингу",
        imageUrl: image?.url || "",
        imageAlt: image?.alt || "",
        status: "published",
        featured: false,
        hideDate: entry.hideDate,
        publishedAt: departmentPublicationDate(entry, true)?.dateTime || null,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
        authorEmail: entry.authorEmail,
      },
    });
  }

  return [...new Map(items.map((item) => [item.href, item])).values()].sort((a, b) =>
    publicationTime(b.post) - publicationTime(a.post),
  );
}
