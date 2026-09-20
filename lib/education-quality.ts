export const educationQualityRubrics = [
  {
    id: "monitoring",
    index: "01",
    title: "Результати моніторингу якості освіти",
    description: "Опитування здобувачів, аналіз освітнього процесу та рішення кафедри за результатами моніторингу.",
  },
  {
    id: "programme-discussion",
    index: "02",
    title: "Обговорення змін до ОП",
    description: "Проєкти змін до освітніх програм, пропозиції здобувачів і стейкголдерів та підсумки відкритого обговорення.",
  },
  {
    id: "npp-evaluation",
    index: "03",
    title: "Щорічне оцінювання НПП",
    description: "Матеріали щорічного оцінювання науково-педагогічних працівників і результати професійного розвитку.",
  },
  {
    id: "qualification-works",
    index: "04",
    title: "Кваліфікаційні роботи",
    description: "Бакалаврські й магістерські роботи здобувачів, теми досліджень, автори та наукові керівники.",
  },
] as const;

export type EducationQualityRubricId = (typeof educationQualityRubrics)[number]["id"];

export function normalizeEducationQualityRubricId(value: string, content = ""): EducationQualityRubricId {
  if (educationQualityRubrics.some((rubric) => rubric.id === value)) return value as EducationQualityRubricId;
  const searchable = `${value} ${content}`.toLocaleLowerCase("uk-UA");
  if (searchable.includes("кваліфікац") || searchable.includes("диплом") || searchable.includes("бакалаврськ") || searchable.includes("магістерськ")) return "qualification-works";
  if (searchable.includes("нпп") || searchable.includes("викладач") || searchable.includes("педагогіч")) return "npp-evaluation";
  if (searchable.includes("обговор") || searchable.includes("змін") || searchable.includes("освітн") || searchable.includes("оп ")) return "programme-discussion";
  return "monitoring";
}
