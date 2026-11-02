import type { Post } from "./data";
import type { ContentItem } from "./content";

export const managementDiscussionNewsSlug = "obhovorennia-proiektu-opp-menedzhment-2026";
export const managementDiscussionProject = "/documents/management/project-management-master-2026.docx";

export const managementDiscussionNews: Post = {
  id: "seed-management-discussion-2026",
  slug: managementDiscussionNewsSlug,
  title: "Обговорення проєкту ОПП «Менеджмент»",
  excerpt: "Проєкт освітньо-професійної програми за спеціальністю D3 «Менеджмент» та контакти для пропозицій здобувачів освіти, викладачів, стейкголдерів і роботодавців.",
  body: `## Матеріали до обговорення · травень 2026 року

Запрошуємо до обговорення здобувачів вищої освіти, викладачів, стейкхолдерів, роботодавців та інших зацікавлених сторін до обговорення змін до освітньої програми Менеджмент, другого рівня вищої освіти спеціальності D3 Менеджмент.

[Проєкт ОПП «Менеджмент» · магістр · 2026 · DOCX](${managementDiscussionProject})

Ваші побажання та рекомендації можуть бути надані за наступними координатами:

Василець Неля Михайлівна – завідувач кафедри економіки підприємства та менеджменту, за якою закріплена дана програма.

E-mail: [vasilets1306@gmail.com](mailto:vasilets1306@gmail.com).

Охріменко Ігор Віталійович – професор кафедри економіки підприємства та менеджменту.

E-mail: [iv.okhrim@gmail.com](mailto:iv.okhrim@gmail.com).

Дата засідання, зазначена в оголошенні: 16 червня 2026 року о 14:00, аудиторія 307.

[Освітня програма «Менеджмент»](/programs/management#programme-documents)`,
  category: "Оголошення",
  imageUrl: "",
  imageAlt: "",
  status: "published",
  featured: false,
  publishedAt: "2026-11-02T16:20:00.000Z",
  createdAt: "2026-11-02T16:20:00.000Z",
  updatedAt: "2026-11-02T16:20:00.000Z",
  authorEmail: "editorial@apsvt.local",
};

export const managementDiscussionQualitySeed: ContentItem = {
  id: "management-master-discussion-2026",
  kind: "research_resource",
  payload: {
    editorialSurface: "page",
    pagePath: "/programs/management",
    sectionId: "quality",
    entryType: "quality",
    role: "programme-discussion",
    title: "Проєкт ОПП «Менеджмент» · другий (магістерський) рівень · 2026",
    summary: "Матеріали до обговорення · травень 2026 року",
    body: `[Оголошення, дата засідання та контакти для пропозицій](/news/${managementDiscussionNewsSlug})`,
    fileUrl: managementDiscussionProject,
    fileName: "Проєкт ОПП · DOCX",
    date: "2026",
    publishedAt: managementDiscussionNews.publishedAt!,
    status: "published",
  },
  sortOrder: 100,
  createdAt: managementDiscussionNews.createdAt,
  updatedAt: managementDiscussionNews.updatedAt,
  authorEmail: managementDiscussionNews.authorEmail,
};
