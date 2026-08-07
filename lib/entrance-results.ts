export type EntranceResultDocument = {
  title: string;
  href: string;
  pages: number;
};

export const entranceResultsNewsSlug = "rezultaty-vstupnykh-vyprobuvan-29-lypnia-2026";
export const entranceResultsNewsSlugJuly31 = "rezultaty-vstupnykh-vyprobuvan-31-lypnia-2026";

export const bachelorEntranceResults: EntranceResultDocument[] = [
  {
    title: "Співбесіда з української мови",
    href: "/documents/admissions/results/2026-07-29/ukrainian-language.pdf",
    pages: 2,
  },
  {
    title: "Співбесіда з математики",
    href: "/documents/admissions/results/2026-07-29/mathematics.pdf",
    pages: 2,
  },
  {
    title: "Співбесіда з історії України",
    href: "/documents/admissions/results/2026-07-29/history-of-ukraine.pdf",
    pages: 2,
  },
  {
    title: "Співбесіда з англійської мови",
    href: "/documents/admissions/results/2026-07-29/english-language.pdf",
    pages: 1,
  },
];

export const bachelorEntranceResultsJuly31: EntranceResultDocument[] = [
  {
    title: "Співбесіда з української мови",
    href: "/documents/admissions/results/2026-07-31/ukrainian-language.pdf",
    pages: 1,
  },
  {
    title: "Співбесіда з української літератури",
    href: "/documents/admissions/results/2026-07-31/ukrainian-literature.pdf",
    pages: 1,
  },
  {
    title: "Співбесіда з математики",
    href: "/documents/admissions/results/2026-07-31/mathematics.pdf",
    pages: 1,
  },
  {
    title: "Співбесіда з історії України",
    href: "/documents/admissions/results/2026-07-31/history-of-ukraine.pdf",
    pages: 1,
  },
  {
    title: "Співбесіда з англійської мови",
    href: "/documents/admissions/results/2026-07-31/english-language.pdf",
    pages: 1,
  },
];

export function getEntranceResultDocumentsForNews(slug: string): EntranceResultDocument[] | null {
  if (slug === entranceResultsNewsSlugJuly31) return bachelorEntranceResultsJuly31;
  if (slug === entranceResultsNewsSlug) return bachelorEntranceResults;
  return null;
}
