import type { Post } from "@/lib/data";

import { financePolandCardImage, financePolandNewsSlug } from "./finance-poland-news";
import { financeFinlandCardImage, financeFinlandNewsSlug } from "./finance-finland-news";

import { nadrahaGuestLectureNewsSlug, nadrahaGuestLecturePortrait } from "./nadraha-guest-lecture-news";

import { financeOpenForActionImage, financeOpenForActionNewsSlug } from "./finance-open-for-action-news";
import { financeConferenceCardImage, financeConferenceNewsSlug } from "./finance-conference-news";

type EditorialImage = Pick<Post, "imageUrl" | "imageAlt"> & { imageFit?: "contain" | "cover" };

const editorialImages: Record<string, EditorialImage> = {
  "vitaiemo-mahistriv-pravo-naukovi-zdobutky-2026": {
    imageUrl: "https://bscmsv7ysiioa246.public.blob.vercel-storage.com/news/law-masters-20261114/photo-5.jpeg",
    imageAlt: "Магістри ОПП «Право» з подяками ректора за наукові здобутки",
    imageFit: "contain",
  },
  [financeOpenForActionNewsSlug]: financeOpenForActionImage,
  [financeConferenceNewsSlug]: financeConferenceCardImage,
  [nadrahaGuestLectureNewsSlug]: nadrahaGuestLecturePortrait,
  [financePolandNewsSlug]: financePolandCardImage,
  [financeFinlandNewsSlug]: financeFinlandCardImage,
  "vidkryta-zustrich-suddiv-konstytutsiinoho-sudu-2026-10-29": {
    imageUrl: "/images/news/constitutional-court-meeting-2026-10-29.jpg",
    imageAlt: "Афіша відкритої зустрічі із суддями Конституційного Суду України 29 жовтня 2026 року",
    imageFit: "contain",
  },
  "empower-east-startova-zustrich-2026": {
    imageUrl: "/images/news/empower-east-2026/overview.jpg",
    imageAlt: "Онлайн-зустріч EMPOWER-EAST 16 жовтня 2026 року: огляд проєкту",
    imageFit: "contain",
  },
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

const cardImages: Record<string, EditorialImage> = {
  "finansovo-ekonomichnyi-blok-prohramy-standart-profspilkovyi-perehovornyk": {
    imageUrl: "/images/news/finance-negotiator-2026.png",
    imageAlt: "Онлайн-заняття з фінансово-економічного блоку програми «Стандарт — профспілковий переговорник»",
    imageFit: "contain",
  },
};

export function getEditorialImage(post: Pick<Post, "slug" | "imageUrl" | "imageAlt">, variant: "card" | "hero" = "hero"): EditorialImage {
  if (variant === "card" && cardImages[post.slug]) return cardImages[post.slug];
  return editorialImages[post.slug] ?? { imageUrl: post.imageUrl, imageAlt: post.imageAlt };
}
