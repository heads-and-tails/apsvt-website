export type AccreditationScan = {
  title: string;
  level: string;
  number: string;
  publishedTerm: string;
  image: string;
  previewRotation?: 180;
};

export const historicalAccreditationScans: AccreditationScan[] = [
  {
    title: "Ліцензія на освітню діяльність",
    level: "Маркетинг · спеціаліст · 1996",
    number: "Ліцензія ВП-III № 110111",
    publishedTerm: "Видано 23.12.1996; строк дії до 01.07.1999.",
    image: "/documents/licenses/historical/1996-marketing-specialist-license-110111.jpg",
  },
  {
    title: "Ліцензія на освітню діяльність",
    level: "Маркетинг · спеціаліст · 1998",
    number: "Ліцензія ВП-III № 110111",
    publishedTerm: "Видано 17.07.1998; строк дії до 31.12.1999.",
    image: "/documents/licenses/historical/1998-marketing-specialist-license-110111.jpg",
  },
  {
    title: "Маркетинг",
    level: "Спеціаліст · 1999",
    number: "Сертифікат НІ-III № 115002",
    publishedTerm: "Видано 12.08.1999; строк дії до 01.07.2004.",
    image: "/documents/licenses/historical/1999-marketing-specialist-accreditation-115002.jpg",
    previewRotation: 180,
  },
];
