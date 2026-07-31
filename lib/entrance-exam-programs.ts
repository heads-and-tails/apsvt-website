export type EntranceExamProgram = {
  title: string;
  meta: string;
  href?: string;
  pages?: number;
  programSlug?: string;
};

const bachelorBase = "/documents/admissions/exam-programs/2026/bachelor";
const phdBase = "/documents/admissions/exam-programs/2026/phd";

export const bachelorEntranceExamPrograms: EntranceExamProgram[] = [
  { title: "Українська мова", meta: "Програма співбесіди НМТ", href: `${bachelorBase}/ukrainian-language.pdf`, pages: 15 },
  { title: "Математика", meta: "Програма співбесіди НМТ", href: `${bachelorBase}/mathematics.pdf`, pages: 9 },
  { title: "Історія України", meta: "Програма співбесіди НМТ", href: `${bachelorBase}/history-of-ukraine.pdf`, pages: 12 },
  { title: "Англійська мова", meta: "Файл буде додано після надходження" },
  { title: "Німецька мова", meta: "Програма співбесіди НМТ", href: `${bachelorBase}/german-language.pdf`, pages: 8 },
  { title: "Біологія", meta: "Програма співбесіди НМТ", href: `${bachelorBase}/biology.pdf`, pages: 12 },
  { title: "Фізика", meta: "Програма співбесіди НМТ", href: `${bachelorBase}/physics.pdf`, pages: 10 },
  { title: "Хімія", meta: "Програма співбесіди НМТ", href: `${bachelorBase}/chemistry.pdf`, pages: 11 },
  { title: "Географія", meta: "Файл буде додано після надходження" },
  { title: "Українська література", meta: "Програма співбесіди НМТ", href: `${bachelorBase}/ukrainian-literature.pdf`, pages: 10 },
];

export const bachelorSupplementalProgram: EntranceExamProgram = {
  title: "Українська мова як іноземна",
  meta: "Для іноземних громадян та осіб без громадянства",
  href: `${bachelorBase}/ukrainian-as-foreign-language.pdf`,
  pages: 14,
};

export const phdEntranceExamPrograms: EntranceExamProgram[] = [
  { title: "A5 Професійна освіта (за спеціалізаціями)", meta: "Фахове вступне випробування", href: `${phdBase}/professional-education.pdf`, pages: 24 },
  { title: "D8 Право", meta: "Фахове вступне випробування", href: `${phdBase}/law.pdf`, pages: 25, programSlug: "law" },
  { title: "D4 Публічне управління та адміністрування", meta: "Фахове вступне випробування", href: `${phdBase}/public-administration.pdf`, pages: 22, programSlug: "public-administration" },
  { title: "C1 Економіка та міжнародні економічні відносини", meta: "Фахове вступне випробування", href: `${phdBase}/economics-international-relations.pdf`, pages: 15 },
  { title: "C4 Психологія", meta: "Фахове вступне випробування", href: `${phdBase}/psychology.pdf`, pages: 27, programSlug: "psychology" },
  { title: "Іноземна мова (англійська)", meta: "Програма співбесіди", href: `${phdBase}/foreign-language-english.pdf`, pages: 9 },
  { title: "Іноземна мова (німецька)", meta: "Програма співбесіди", href: `${phdBase}/foreign-language-german.pdf`, pages: 8 },
  { title: "Методологія наукових досліджень", meta: "Файл очікується від Приймальної комісії" },
];

const sharedPhdPrograms = phdEntranceExamPrograms.filter((item) =>
  item.title.startsWith("Іноземна мова") || item.title.startsWith("Методологія"),
);

export function getProgramPageEntranceExams(slug: string) {
  const specialty = phdEntranceExamPrograms.find((item) => item.programSlug === slug);
  return specialty ? [specialty, ...sharedPhdPrograms] : [];
}
