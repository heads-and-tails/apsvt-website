import type { Post } from "@/lib/data";

type EditorialImage = Pick<Post, "imageUrl" | "imageAlt">;

const editorialImages: Record<string, EditorialImage> = {
  "open-day-2026": {
    imageUrl: "/apsvt-students-real.jpg",
    imageAlt: "Випускники та викладачі Академії біля навчального корпусу",
  },
  "hospitality-management-lab": {
    imageUrl: "/news-hospitality-lab.jpg",
    imageAlt: "Практичне заняття студентів з менеджменту гостинності",
  },
  "international-partnerships-2026": {
    imageUrl: "/news-international-workshop.jpg",
    imageAlt: "Міжнародний академічний воркшоп зі студентами та викладачами",
  },
  "legal-clinic-real-cases": {
    imageUrl: "/news-legal-clinic.jpg",
    imageAlt: "Студенти юридичної клініки аналізують справу з викладачем",
  },
  "marketing-research-international-conference-2026": {
    imageUrl: "/news-marketing-conference.jpg",
    imageAlt: "Презентація дослідження на міжнародній науковій конференції",
  },
};

export function getEditorialImage(post: Pick<Post, "slug" | "imageUrl" | "imageAlt">): EditorialImage {
  return editorialImages[post.slug] ?? { imageUrl: post.imageUrl, imageAlt: post.imageAlt };
}
