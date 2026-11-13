import type { Post } from "./data";
import type { DepartmentImage } from "./department-media";

export const financeConferenceNewsSlug = "polsko-ukrainska-ekonomichna-konferentsiia-pulawy-2026";

export const financeConferenceCardImage = {
  imageUrl: "/images/news/finance-pulawy-2026/card.jpeg",
  imageAlt: "Учасники Польсько-української економічної конференції у Пулавах",
  imageFit: "contain" as const,
};

export const financeConferencePhoto: DepartmentImage = {
  url: "/images/news/finance-pulawy-2026/presentation.jpg",
  alt: "Виступ Людмили Гуляєвої на Польсько-українській економічній конференції",
  fit: "contain",
};

export const financeConferenceBeforePhoto = "10–11 червня 2026 року у Пулавському науково-технологічному парку ( м. Пулави, Польща) відбулася Польсько-українська економічна конференція «Реалізація спільних інвестиційних проєктів за кошти фондів Європейського Союзу». Конференція була присвячена розвитку польсько-української економічної співпраці, підготовці спільних інвестиційних ініціатив, залученню фінансування Європейського Союзу, підтримці органів місцевого самоврядування, підприємств та інституцій розвитку в реалізації міжнародних проєктів.\n\nАкадемію праці, соціальних відносин і туризму на заході представила Людмила Гуляєва, доцент кафедри фінансів, експертка з грантів та фандрейзингу. У межах панелі «Фонди Європейського Союзу та міжнародні партнерства для самоврядування і підприємств» Людмила Гуляєва виступила з доповіддю «Технологія підготовки грантової заявки до програм ЄС: практичні рекомендації». У доповіді було розглянуто практичні аспекти підготовки проєктних заявок до програм Європейського Союзу: аналіз конкурсної документації, оцінювання відповідності проєктної ідеї цілям програми, формування міжнародного партнерства, розроблення змістовної частини заявки, підготовку бюджету та запобігання типовим помилкам заявників.";
export const financeConferenceAfterPhoto = "Участь представниці кафедри фінансів у міжнародній конференції засвідчує експертний потенціал Академії у сфері грантового фінансування, міжнародного проєктного менеджменту та розвитку українсько-польської співпраці. Захід став важливим майданчиком для професійного діалогу між представниками самоврядування, бізнесу, фінансових установ, інституцій розвитку та експертного середовища України і Польщі.";
export const financeConferenceAuthor = "Автор: Гуляєва Людмила Петрівна";

export const financeConferenceNews: Post = {
  id: "seed-finance-pulawy-conference-2026",
  slug: financeConferenceNewsSlug,
  title: "Участь АПСВТ у Польсько-українській економічній конференції",
  excerpt: "Доцент кафедри фінансів, експертка з грантів та фандрейзингу Гуляєва Людмила Петрівна представила АПСВТ на Польсько-українській економічній конференції «Реалізація спільних інвестиційних проєктів за кошти фондів Європейського Союзу» в рамках панелі «Фонди Європейського Союзу та міжнародні партнерства для самоврядування і підприємств».",
  body: `${financeConferenceBeforePhoto}\n\n${financeConferenceAfterPhoto}\n\n${financeConferenceAuthor}`,
  category: "Кафедра фінансів",
  imageUrl: financeConferenceCardImage.imageUrl,
  imageAlt: financeConferenceCardImage.imageAlt,
  status: "published",
  featured: true,
  publishedAt: "2026-11-06T00:00:00.000Z",
  createdAt: "2026-11-06T00:00:00.000Z",
  updatedAt: "2026-11-06T00:00:00.000Z",
  authorEmail: "",
};

export function splitFinanceConferenceBody(body: string) {
  const paragraphs = body.split(/\n\s*\n/);
  return {
    beforePhoto: paragraphs.slice(0, 2).join("\n\n"),
    afterPhoto: paragraphs.slice(2).join("\n\n"),
  };
}
