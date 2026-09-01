export type EntranceResultDocument = {
  title: string;
  href: string;
  pages: number;
};

export const entranceResultsNewsSlug = "rezultaty-vstupnykh-vyprobuvan-29-lypnia-2026";
export const entranceResultsNewsSlugJuly31 = "rezultaty-vstupnykh-vyprobuvan-31-lypnia-2026";
export const entranceResultsNewsSlugAugust6 = "rezultaty-vstupnykh-vyprobuvan-6-serpnia-2026";
export const masterInterviewVideo = "https://apsvt-academy.ikucha.chatgpt.site/media/admissions/results/2026-08-06/english-interview.mp4";

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

export const masterEntranceResultsAugust6: EntranceResultDocument[] = [
  {
    title: "Співбесіда з англійської мови",
    href: "/documents/admissions/results/2026-08-06/english-interview-master.pdf",
    pages: 2,
  },
];

export const masterEntranceResultsAugust7: EntranceResultDocument[] = [
  {
    title: "Фаховий іспит з управління та адміністрування",
    href: "/documents/admissions/results/2026-08-07/public-administration.pdf",
    pages: 1,
  },
  {
    title: "Фаховий іспит із соціальної роботи та консультування",
    href: "/documents/admissions/results/2026-08-07/social-work-counselling.pdf",
    pages: 1,
  },
  {
    title: "Фаховий іспит із психології",
    href: "/documents/admissions/results/2026-08-07/psychology.pdf",
    pages: 1,
  },
  {
    title: "Фаховий іспит із права",
    href: "/documents/admissions/results/2026-08-07/law.pdf",
    pages: 1,
  },
  {
    title: "Фаховий іспит із менеджменту",
    href: "/documents/admissions/results/2026-08-07/management.pdf",
    pages: 1,
  },
  {
    title: "Фаховий іспит із маркетингу",
    href: "/documents/admissions/results/2026-08-07/marketing.pdf",
    pages: 1,
  },
];

export const masterEntranceResultsAugust18: EntranceResultDocument[] = [
  {
    title: "Співбесіда з англійської мови",
    href: "/documents/admissions/results/2026-08-18/english-language-interview.pdf",
    pages: 2,
  },
];

export const masterEntranceResultsAugust19: EntranceResultDocument[] = [
  {
    title: "Фаховий іспит з управління та адміністрування",
    href: "/documents/admissions/results/2026-08-19/public-administration.pdf",
    pages: 1,
  },
  {
    title: "Фаховий іспит із психології",
    href: "/documents/admissions/results/2026-08-19/psychology.pdf",
    pages: 1,
  },
  {
    title: "Фаховий іспит із права",
    href: "/documents/admissions/results/2026-08-19/law.pdf",
    pages: 1,
  },
  {
    title: "Фаховий іспит із менеджменту",
    href: "/documents/admissions/results/2026-08-19/management.pdf",
    pages: 1,
  },
  {
    title: "Фаховий іспит із маркетингу",
    href: "/documents/admissions/results/2026-08-19/marketing.pdf",
    pages: 1,
  },
  {
    title: "Фаховий іспит з психології для спеціальності I10 «Соціальна робота та консультування»",
    href: "/documents/admissions/results/2026-08-19/social-work-counselling.pdf",
    pages: 1,
  },
];

export function getEntranceResultDocumentsForNews(slug: string): EntranceResultDocument[] | null {
  if (slug === entranceResultsNewsSlugAugust6) return masterEntranceResultsAugust6;
  if (slug === entranceResultsNewsSlugJuly31) return bachelorEntranceResultsJuly31;
  if (slug === entranceResultsNewsSlug) return bachelorEntranceResults;
  return null;
}
