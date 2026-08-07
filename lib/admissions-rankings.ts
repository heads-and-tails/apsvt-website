export type ApplicantRankingDocument = {
  title: string;
  meta: string;
  href: string;
  pages?: number;
};

export type ApplicantRankingGroup = {
  programme: string;
  code: string;
  documents: ApplicantRankingDocument[];
};

const root = "/documents/admissions/rankings/2026-08-03";

export const bachelorApplicantRankings: ApplicantRankingGroup[] = [
  {
    programme: "Професійна освіта",
    code: "A5",
    documents: [
      { title: "Денна форма · І курс · список 1", meta: "3 роки 10 місяців", href: `${root}/professional-education-full-time-first-year-list-1.pdf` },
      { title: "Денна форма · І курс · список 2", meta: "Окремий рейтинговий список", href: `${root}/professional-education-full-time-first-year-list-2.pdf` },
      { title: "Заочна форма · І курс", meta: "3 роки 10 місяців", href: `${root}/professional-education-part-time-first-year.pdf` },
    ],
  },
  {
    programme: "Економіка та міжнародні економічні відносини",
    code: "C1",
    documents: [
      { title: "Денна форма · І курс", meta: "Контрактна пропозиція", href: `${root}/economics-full-time-first-year.pdf` },
      { title: "Заочна форма · І курс", meta: "3 роки 10 місяців", href: `${root}/economics-part-time-first-year.pdf` },
      { title: "Заочна форма · ІІ курс", meta: "2 роки 10 місяців", href: `${root}/economics-part-time-second-year.pdf` },
    ],
  },
  {
    programme: "Психологія",
    code: "C4",
    documents: [
      { title: "Денна форма · І курс", meta: "Контрактна пропозиція", href: `${root}/psychology-full-time-first-year.pdf` },
      { title: "Заочна форма · І курс", meta: "3 роки 10 місяців", href: `${root}/psychology-part-time-first-year.pdf` },
      { title: "Заочна форма · скорочений строк", meta: "2 роки 10 місяців", href: `${root}/psychology-part-time-shortened.pdf` },
    ],
  },
  {
    programme: "Фінанси, банківська справа, страхування та фондовий ринок",
    code: "D2",
    documents: [
      { title: "Денна форма · І курс", meta: "Контрактна пропозиція", href: `${root}/finance-full-time-first-year.pdf` },
      { title: "Заочна форма · І курс", meta: "3 роки 10 місяців", href: `${root}/finance-part-time-first-year.pdf` },
    ],
  },
  {
    programme: "Менеджмент",
    code: "D3",
    documents: [
      { title: "Денна форма · І курс · список 1", meta: "Окремий рейтинговий список", href: `${root}/management-full-time-first-year-list-1.pdf` },
      { title: "Денна форма · І курс · список 2", meta: "Окремий рейтинговий список", href: `${root}/management-full-time-first-year-list-2.pdf` },
      { title: "Заочна форма · І курс · список 1", meta: "Окремий рейтинговий список", href: `${root}/management-part-time-first-year-list-1.pdf` },
      { title: "Заочна форма · І курс · список 2", meta: "Окремий рейтинговий список", href: `${root}/management-part-time-first-year-list-2.pdf` },
    ],
  },
  {
    programme: "Публічне управління та адміністрування",
    code: "D4",
    documents: [
      { title: "Денна форма · І курс", meta: "Контрактна пропозиція", href: `${root}/public-administration-full-time-first-year.pdf` },
      { title: "Заочна форма · І курс", meta: "3 роки 10 місяців", href: `${root}/public-administration-part-time-first-year.pdf` },
    ],
  },
  {
    programme: "Маркетинг",
    code: "D5",
    documents: [
      { title: "Денна форма · І курс", meta: "2 сторінки", href: `${root}/marketing-full-time-first-year.pdf`, pages: 2 },
      { title: "Заочна форма · І курс", meta: "3 роки 10 місяців", href: `${root}/marketing-part-time-first-year.pdf` },
    ],
  },
  {
    programme: "Право",
    code: "D8",
    documents: [
      { title: "Денна форма · І курс", meta: "Контрактна пропозиція", href: `${root}/law-full-time-first-year.pdf` },
      { title: "Денна форма · ІІ курс", meta: "2 роки 10 місяців", href: `${root}/law-full-time-second-year.pdf` },
      { title: "Заочна форма · І курс", meta: "3 роки 10 місяців", href: `${root}/law-part-time-first-year.pdf` },
      { title: "Заочна форма · ІІ курс", meta: "2 роки 10 місяців", href: `${root}/law-part-time-second-year.pdf` },
    ],
  },
  {
    programme: "Соціальна робота та консультування",
    code: "I10",
    documents: [
      { title: "Денна форма · І курс", meta: "Контрактна пропозиція", href: `${root}/social-work-full-time-first-year.pdf` },
      { title: "Заочна форма · І курс", meta: "3 роки 10 місяців", href: `${root}/social-work-part-time-first-year.pdf` },
    ],
  },
];

export const bachelorRankingDocumentCount = bachelorApplicantRankings.reduce(
  (total, group) => total + group.documents.length,
  0,
);
