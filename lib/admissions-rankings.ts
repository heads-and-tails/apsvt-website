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
const masterRoot = "/documents/admissions/rankings/2026-08-24-master";

export const applicantRankingsNewsSlug = "reitynhovi-spysky-vstupnykiv-bakalavrat-2026";

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

export const masterApplicantRankings: ApplicantRankingGroup[] = [
  {
    programme: "Професійна освіта",
    code: "A5",
    documents: [
      { title: "Денна форма · І курс · список 1", meta: "1 рік 10 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/professional-education-full-time-22-months-recommended.pdf`, pages: 1 },
      { title: "Денна форма · І курс · список 2", meta: "1 рік 10 місяців · окрім рекомендованих адресним розміщенням", href: `${masterRoot}/professional-education-full-time-22-months-other.pdf`, pages: 1 },
      { title: "Заочна форма · І курс · список 1", meta: "1 рік 6 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/professional-education-part-time-18-months-recommended.pdf`, pages: 1 },
      { title: "Заочна форма · І курс · список 2", meta: "1 рік 6 місяців · окрім рекомендованих адресним розміщенням", href: `${masterRoot}/professional-education-part-time-18-months-other.pdf`, pages: 1 },
      { title: "Заочна форма · І курс · список 3", meta: "1 рік 10 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/professional-education-part-time-22-months-recommended.pdf`, pages: 1 },
    ],
  },
  {
    programme: "Психологія",
    code: "C4",
    documents: [
      { title: "Психологія бізнесу та управління · денна форма", meta: "1 рік 6 місяців · окрім рекомендованих адресним розміщенням", href: `${masterRoot}/psychology-business-management-full-time-other.pdf`, pages: 1 },
      { title: "Психологія · заочна форма · список 1", meta: "1 рік 6 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/psychology-part-time-recommended.pdf`, pages: 1 },
      { title: "Психологія · заочна форма · список 2", meta: "1 рік 6 місяців · окрім рекомендованих адресним розміщенням", href: `${masterRoot}/psychology-part-time-other.pdf`, pages: 1 },
      { title: "Клінічна психологія · денна форма · список 1", meta: "1 рік 6 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/clinical-psychology-full-time-recommended.pdf`, pages: 1 },
      { title: "Клінічна психологія · денна форма · список 2", meta: "1 рік 6 місяців · окрім рекомендованих адресним розміщенням", href: `${masterRoot}/clinical-psychology-full-time-other.pdf`, pages: 1 },
      { title: "Клінічна психологія · заочна форма · список 1", meta: "1 рік 6 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/clinical-psychology-part-time-recommended.pdf`, pages: 1 },
      { title: "Клінічна психологія · заочна форма · список 2", meta: "1 рік 6 місяців · окрім рекомендованих адресним розміщенням", href: `${masterRoot}/clinical-psychology-part-time-other.pdf`, pages: 1 },
    ],
  },
  {
    programme: "Фінанси, банківська справа, страхування та фондовий ринок",
    code: "D2",
    documents: [
      { title: "Денна форма · І курс · список 1", meta: "1 рік 6 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/finance-full-time-recommended.pdf`, pages: 1 },
      { title: "Денна форма · І курс · список 2", meta: "1 рік 6 місяців · окрім рекомендованих адресним розміщенням", href: `${masterRoot}/finance-full-time-other.pdf`, pages: 1 },
    ],
  },
  {
    programme: "Менеджмент",
    code: "D3",
    documents: [
      { title: "Денна форма · І курс", meta: "1 рік 6 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/management-full-time-recommended.pdf`, pages: 1 },
      { title: "Заочна форма · І курс", meta: "1 рік 6 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/management-part-time-recommended.pdf`, pages: 1 },
    ],
  },
  {
    programme: "Публічне управління та адміністрування",
    code: "D4",
    documents: [
      { title: "Денна форма · І курс · список 1", meta: "1 рік 6 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/public-administration-full-time-recommended.pdf`, pages: 1 },
      { title: "Денна форма · І курс · список 2", meta: "1 рік 6 місяців · окрім рекомендованих адресним розміщенням", href: `${masterRoot}/public-administration-full-time-other.pdf`, pages: 1 },
      { title: "Заочна форма · І курс", meta: "1 рік 6 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/public-administration-part-time-recommended.pdf`, pages: 1 },
    ],
  },
  {
    programme: "Маркетинг",
    code: "D5",
    documents: [
      { title: "Денна форма · І курс · список 1", meta: "1 рік 6 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/marketing-full-time-recommended.pdf`, pages: 1 },
      { title: "Денна форма · І курс · список 2", meta: "1 рік 6 місяців · окрім рекомендованих адресним розміщенням", href: `${masterRoot}/marketing-full-time-other.pdf`, pages: 1 },
      { title: "Заочна форма · І курс · список 1", meta: "1 рік 6 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/marketing-part-time-recommended.pdf`, pages: 1 },
      { title: "Заочна форма · І курс · список 2", meta: "1 рік 6 місяців · окрім рекомендованих адресним розміщенням", href: `${masterRoot}/marketing-part-time-other.pdf`, pages: 1 },
    ],
  },
  {
    programme: "Право",
    code: "D8",
    documents: [
      { title: "Денна форма · І курс", meta: "1 рік 6 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/law-full-time-recommended.pdf`, pages: 1 },
      { title: "Заочна форма · І курс · список 1", meta: "1 рік 6 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/law-part-time-recommended.pdf`, pages: 1 },
      { title: "Заочна форма · І курс · список 2", meta: "1 рік 6 місяців · окрім рекомендованих адресним розміщенням", href: `${masterRoot}/law-part-time-other.pdf`, pages: 1 },
    ],
  },
  {
    programme: "Соціальна робота та консультування",
    code: "I10",
    documents: [
      { title: "Денна форма · список 1", meta: "1 рік 6 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/social-work-full-time-recommended-list-1.pdf`, pages: 1 },
      { title: "Денна форма · І курс · список 2", meta: "1 рік 6 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/social-work-full-time-recommended-list-2.pdf`, pages: 1 },
      { title: "Денна форма · І курс · список 3", meta: "1 рік 6 місяців · окрім рекомендованих адресним розміщенням", href: `${masterRoot}/social-work-full-time-other.pdf`, pages: 1 },
      { title: "Заочна форма · список 1", meta: "І курс · рекомендовані адресним розміщенням", href: `${masterRoot}/social-work-part-time-recommended-list-1.pdf`, pages: 1 },
      { title: "Заочна форма · І курс · список 2", meta: "1 рік 6 місяців · рекомендовані адресним розміщенням", href: `${masterRoot}/social-work-part-time-recommended-list-2.pdf`, pages: 1 },
      { title: "Заочна форма · І курс · список 3", meta: "1 рік 6 місяців · окрім рекомендованих адресним розміщенням", href: `${masterRoot}/social-work-part-time-other.pdf`, pages: 1 },
    ],
  },
];

export const masterRankingDocumentCount = masterApplicantRankings.reduce(
  (total, group) => total + group.documents.length,
  0,
);
export const applicantRankingDocumentCount = bachelorRankingDocumentCount + masterRankingDocumentCount;
