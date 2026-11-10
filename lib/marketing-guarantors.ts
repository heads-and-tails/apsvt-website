import type { ContentItem } from "./content";
import type { DepartmentEntry } from "./department-content";

export const marketingGuarantorSections = [
  { id: "marketing-bachelor-guarantor", label: "Бакалаврат · Гарант освітньої програми" },
  { id: "marketing-master-guarantor", label: "Магістратура · Гарант освітньої програми" },
];

export function marketingGuarantorEntries(entries: DepartmentEntry[], level: "bachelor" | "master"): DepartmentEntry[] {
  return entries.filter((entry) => entry.pagePath === "/programs/marketing"
    && entry.sectionId === `marketing-${level}-guarantor` && entry.entryType === "section"
    && entry.status === "published" && !entry.hidden);
}

export const marketingGuarantorSeedContent: ContentItem[] = [
  {
    "id": "marketing-bachelor-guarantor-text",
    "kind": "research_resource",
    "payload": {
      "editorialSurface": "page",
      "pagePath": "/programs/marketing",
      "sectionId": "marketing-bachelor-guarantor",
      "entryType": "section",
      "title": "Гарант освітньої програми",
      "summary": "Гарант освітньо-професійної програми «Маркетинг» першого (бакалаврського) рівня вищої освіти",
      "body": "<!-- APSVT_RICH_TEXT_V1 -->\n{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"КОРЧИНСЬКА Олена Анатоліївна\",\"marks\":[{\"type\":\"bold\"}]},{\"type\":\"text\",\"text\":\" — доцент кафедри маркетингу Академії праці, соціальних відносин і туризму.\"}]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Контактна інформація:\",\"marks\":[{\"type\":\"bold\"}]}]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Телефон: \"},{\"type\":\"text\",\"text\":\"+380 66 712 89 55\",\"marks\":[{\"type\":\"link\",\"attrs\":{\"href\":\"tel:+380667128955\"}}]}]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Електронна пошта: \"},{\"type\":\"text\",\"text\":\"academi.marketing2023@gmail.com\",\"marks\":[{\"type\":\"link\",\"attrs\":{\"href\":\"mailto:academi.marketing2023@gmail.com\"}}]}]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Гарант освітньо-професійної програми здійснює координацію процесів її реалізації, моніторингу та перегляду, сприяє забезпеченню якості освітнього процесу, взаємодії зі здобувачами вищої освіти, науково-педагогічними працівниками, роботодавцями та іншими заінтересованими сторонами.\"}]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"З питань змісту освітньо-професійної програми «Маркетинг», організації освітнього процесу, практичної підготовки, академічної мобільності, а також із пропозиціями щодо вдосконалення освітньої програми можна звертатися до гаранта за зазначеними контактами.\"}]}]}",
      "status": "published",
      "publishedAt": "2026-11-10T00:00:00.000Z"
    },
    "sortOrder": 10,
    "createdAt": "2026-11-10T00:00:00.000Z",
    "updatedAt": "2026-11-10T00:00:00.000Z",
    "authorEmail": "nadezda_pisarenko@ukr.net"
  },
  {
    "id": "marketing-master-guarantor-text",
    "kind": "research_resource",
    "payload": {
      "editorialSurface": "page",
      "pagePath": "/programs/marketing",
      "sectionId": "marketing-master-guarantor",
      "entryType": "section",
      "title": "Гарант освітньої програми",
      "summary": "Гарант освітньо-професійної програми «Маркетинг» другого (магістерського) рівня вищої освіти",
      "body": "<!-- APSVT_RICH_TEXT_V1 -->\n{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"ПИСАРЕНКО Надія Василівна\",\"marks\":[{\"type\":\"bold\"}]},{\"type\":\"text\",\"text\":\" — кандидат економічних наук, доцент, завідувачка кафедри маркетингу Академії праці, соціальних відносин і туризму.\"}]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Контактна інформація:\",\"marks\":[{\"type\":\"bold\"}]}]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Телефон: \"},{\"type\":\"text\",\"text\":\"+380 99 961 05 97\",\"marks\":[{\"type\":\"link\",\"attrs\":{\"href\":\"tel:+380999610597\"}}]}]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Електронна пошта: \"},{\"type\":\"text\",\"text\":\"academi.marketing2023@gmail.com\",\"marks\":[{\"type\":\"link\",\"attrs\":{\"href\":\"mailto:academi.marketing2023@gmail.com\"}}]}]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Гарант освітньо-професійної програми здійснює координацію процесів її реалізації, моніторингу та перегляду, сприяє забезпеченню якості освітнього процесу, взаємодії зі здобувачами вищої освіти, науково-педагогічними працівниками, роботодавцями та іншими заінтересованими сторонами.\"}]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"З питань змісту освітньо-професійної програми «Маркетинг», організації освітнього процесу, практичної підготовки, академічної мобільності, а також із пропозиціями щодо вдосконалення освітньої програми можна звертатися до гаранта за зазначеними контактами.\"}]}]}",
      "status": "published",
      "publishedAt": "2026-11-10T00:00:00.000Z"
    },
    "sortOrder": 10,
    "createdAt": "2026-11-10T00:00:00.000Z",
    "updatedAt": "2026-11-10T00:00:00.000Z",
    "authorEmail": "nadezda_pisarenko@ukr.net"
  }
];
