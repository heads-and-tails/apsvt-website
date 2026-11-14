import type { Post } from "./data";
import type { DepartmentImage } from "./department-media";

export const lawMastersNewsSlug = "vitaiemo-mahistriv-pravo-naukovi-zdobutky-2026";

export const lawMastersImages: DepartmentImage[] = [
  { url: "https://bscmsv7ysiioa246.public.blob.vercel-storage.com/news/law-masters-20261114/photo-5.jpeg", alt: "Магістри ОПП «Право» з подяками ректора за наукові здобутки", fit: "contain" },
  { url: "https://bscmsv7ysiioa246.public.blob.vercel-storage.com/news/law-masters-20261114/photo-1.jpeg", alt: "Вручення подяки ректора магістрантці ОПП «Право»", fit: "contain" },
  { url: "https://bscmsv7ysiioa246.public.blob.vercel-storage.com/news/law-masters-20261114/photo-2.jpeg", alt: "Магістрантка ОПП «Право» отримує подяку ректора за наукові здобутки", fit: "contain" },
  { url: "https://bscmsv7ysiioa246.public.blob.vercel-storage.com/news/law-masters-20261114/photo-3.jpeg", alt: "Вручення подяки ректора магістранту ОПП «Право»", fit: "contain" },
  { url: "https://bscmsv7ysiioa246.public.blob.vercel-storage.com/news/law-masters-20261114/photo-4.jpeg", alt: "Магістрант ОПП «Право» отримує подяку ректора за наукові здобутки", fit: "contain" },
];

export const lawMastersNews: Post = {
  id: "seed-law-masters-research-awards-2026",
  slug: lawMastersNewsSlug,
  title: "Вітаємо магістрів ОПП «Право» з відзначенням наукових здобутків!",
  excerpt: "Серед наших магістрів чимало талановитих, цілеспрямованих і перспективних правників, які не лише успішно опановують освітню програму, а й активно займаються науковою діяльністю. За вагомі здобутки в науковій роботі, за поданням Вченої ради юридичного факультету, окремих здобувачів було відзначено подяками ректора Академії. Сьогодні ці заслужені відзнаки знайшли своїх власників!",
  body: "**Щиро вітаємо наших магістрів!** Бажаємо успішних результатів ЄДКІ, невичерпної наснаги, професійного зростання та впевненості у власних силах. Нехай здобуті знання стануть міцним фундаментом майбутніх перемог, а обрана професія - справою життя, що приноситиме не лише особистий успіх, а й користь суспільству та Україні!\n\n**Пишаємося вами та віримо в ваше успішне професійне майбутнє!**",
  category: "Право",
  imageUrl: lawMastersImages[0].url,
  imageAlt: lawMastersImages[0].alt,
  status: "published",
  featured: true,
  publishedAt: "2026-11-14T07:43:37.000Z",
  createdAt: "2026-11-14T07:43:37.000Z",
  updatedAt: "2026-11-14T07:43:37.000Z",
  authorEmail: "editorial@apsvt.local",
};
