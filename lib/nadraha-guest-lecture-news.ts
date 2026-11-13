import type { Post } from "./data";

export const nadrahaGuestLectureNewsSlug = "hostova-lektsiia-vasylia-nadrahy-sotsialne-zabezpechennia-2026";

export const nadrahaGuestLecturePortrait = {
  imageUrl: "/images/news/nadraha-guest-lecture-2026.jpeg",
  imageAlt: "Василь Іванович Надрага",
  imageFit: "contain" as const,
};

export const nadrahaGuestLectureNews: Post = {
  id: "seed-nadraha-guest-lecture-2026-12-03",
  slug: nadrahaGuestLectureNewsSlug,
  title: "Гостьова лекція «Сучасна парадигма соціального забезпечення в Україні»",
  excerpt: "У грудні 2026 року в Академії праці, соціальних відносин і туризму відбудеться гостьова лекція на тему «Сучасна парадигма соціального забезпечення в Україні».",
  body: "Запрошений лектор - Василь Іванович Надрага, колишній Міністр праці та соціальної політики України, доктор економічних наук, професор кафедри менеджменту та міжнародних економічних відносин Навчально-наукового інституту управління, економіки та природокористування Таврійського національного університету імені В. І. Вернадського.\n\nПід час зустрічі планується обговорення сучасних підходів до формування та реалізації державної соціальної політики, трансформації системи соціального забезпечення в умовах воєнного стану, актуальних викликів соціального захисту населення та перспектив удосконалення соціального законодавства України.\n\nДо участі запрошуються здобувачі вищої освіти, науково-педагогічні працівники Академії та всі зацікавлені особи.\n\n📅 Дата проведення: 3 грудня 2026 року\n\n💻 Формат: онлайн (лінк буде повідомлено додатково).",
  category: "Оголошення",
  imageUrl: nadrahaGuestLecturePortrait.imageUrl,
  imageAlt: nadrahaGuestLecturePortrait.imageAlt,
  status: "published",
  featured: true,
  publishedAt: "2026-11-13T18:00:00.000Z",
  createdAt: "2026-11-13T18:00:00.000Z",
  updatedAt: "2026-11-13T18:00:00.000Z",
  authorEmail: "",
};
