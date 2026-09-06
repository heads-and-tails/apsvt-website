export type PsychologyDepartment = {
  slug: string;
  title: string;
  code: "C4" | "I10";
  programmeTitle: string;
  programmeHref: string;
  summary: string;
  focus: string[];
  teamIds: string[];
  headId?: string;
  newsSlug: "psychology" | "social-work";
};

export const psychologyDepartments: PsychologyDepartment[] = [
  {
    slug: "clinical-psychology",
    title: "Кафедра клінічної психології та психотерапії",
    code: "C4",
    programmeTitle: "Психологія",
    programmeHref: "/programs/psychology",
    summary: "Кафедра об’єднує підготовку з психічного здоров’я, психодіагностики, психологічного консультування, реабілітації та психотерапевтичних підходів.",
    focus: ["клінічна психологія", "психодіагностика", "психотерапія", "психологічна реабілітація"],
    teamIds: ["volodymyr-bilous", "olena-karahodina", "rostyslav-abdriakhimov", "svitlana-bondar-consulting", "olena-morozova", "olha-yakovenko"],
    newsSlug: "psychology",
  },
  {
    slug: "business-psychology",
    title: "Кафедра психології бізнесу та управління",
    code: "C4",
    programmeTitle: "Психологія бізнесу та управління",
    programmeHref: "/programs/psychology",
    summary: "Кафедра працює з організаційною психологією, професійним розвитком, командами, лідерством, комунікаціями та управлінням змінами.",
    focus: ["організаційна психологія", "психологія праці", "лідерство", "професійний розвиток"],
    teamIds: ["liudmyla-beheza", "hlib-prib", "kateryna-miliutina", "olesia-borets", "mariia-zhytynska", "tetiana-lapinska", "olha-yakovenko"],
    newsSlug: "psychology",
  },
  {
    slug: "social-work",
    title: "Кафедра соціально-трудових відносин та соціальної роботи",
    code: "I10",
    programmeTitle: "Соціальна робота та консультування",
    programmeHref: "/programs/social-work",
    summary: "Кафедра забезпечує підготовку у сфері соціальної роботи, соціально-трудових відносин, консультування та підтримки людей і громад.",
    focus: ["соціальна робота", "консультування", "соціальна політика", "соціально-трудові відносини"],
    teamIds: ["nataliia-balashova", "valentyn-teslenko", "nataliia-serohina", "mykola-sudakov", "albert-prib"],
    headId: "nataliia-balashova",
    newsSlug: "social-work",
  },
];

export function getPsychologyDepartment(slug: string) {
  return psychologyDepartments.find((department) => department.slug === slug);
}
