export const lawFacultyPath = "/departments/law-faculty";

export type FacultySection = { id: string; title: string; children: readonly (readonly [string, string])[] };
// Labels supplied by the faculty. Keep the sections separate.
export const lawFacultyStructure: readonly FacultySection[] = [
  { id: "faculty-about", title: "Про факультет", children: [["general", "Загальна інформація"], ["history", "Історія факультету"], ["mission", "Місія та стратегічні пріоритети"], ["structure", "Структура факультету"]] },
  { id: "faculty-leadership", title: "Керівництво та деканат", children: [["dean", "Декан"], ["deputies", "Заступники декана"], ["office", "Деканат"], ["documents", "Документи"]] },
  { id: "departments", title: "Кафедри", children: [] },
  { id: "faculty-legal-clinic", title: "Юридична клініка «Феміда»", children: [["about", "Про клініку"], ["team", "Керівництво та команда"], ["legal-aid", "Правнича допомога"], ["practice", "Практична підготовка здобувачів"], ["education", "Правопросвітницька діяльність"], ["news", "Новини та заходи"], ["documents", "Документи"], ["contacts", "Контакти"]] },
  { id: "faculty-forensic-lab", title: "Навчальна лабораторія криміналістики", children: [["about", "Про лабораторію"], ["equipment", "Матеріально-технічне забезпечення"], ["education", "Навчальна діяльність"], ["practice", "Практична підготовка здобувачів"], ["science", "Наукова діяльність"], ["events", "Заходи"], ["news", "Новини"], ["documents", "Документи"], ["contacts", "Контакти"]] },
  { id: "faculty-practice-bases", title: "Бази практики", children: [["courts", "Судові органи"], ["prosecution", "Органи прокуратури"], ["police", "Органи Національної поліції"], ["advocacy", "Адвокатські об'єднання та адвокатські бюро"], ["government", "Органи державної влади"], ["local-government", "Органи місцевого самоврядування"], ["legal-companies", "Юридичні компанії"], ["organizations", "Підприємства, установи та організації"], ["other", "Інші установи та організації"]] },
  { id: "faculty-science-clubs", title: "Наукові гуртки", children: [["phoenix", "Історико-правовий гурток «Фенікс»"]] },
  { id: "municipal-law-school", title: "Наукова школа муніципального права", children: [["general", "Загальна інформація"], ["history", "Історія наукової школи"], ["head", "Засновник / науковий керівник"], ["members", "Склад наукової школи"], ["directions", "Наукові напрями"], ["research", "Наукові дослідження"], ["publications", "Публікації"], ["dissertations", "Дисертаційні дослідження"], ["events", "Наукові заходи"], ["cooperation", "Наукова співпраця"], ["achievements", "Досягнення наукової школи"], ["news", "Новини"], ["documents", "Документи"], ["contacts", "Контакти"]] },
  { id: "faculty-council", title: "Вчена рада", children: [["about", "Про Вчену раду"], ["members", "Склад"], ["regulations", "Положення"], ["plan", "План роботи"], ["meetings", "Засідання"], ["decisions", "Рішення та протоколи"]] },
  { id: "faculty-student-government", title: "Студентське самоврядування", children: [["about", "Про студентське самоврядування"], ["council", "Студентська рада"], ["members", "Склад"], ["projects", "Проєкти та ініціативи"], ["news", "Новини та заходи"], ["contacts", "Контакти"]] },
  { id: "law-teachers", title: "Викладачі факультету", children: [] },
  { id: "faculty-programmes", title: "Освітні програми", children: [["bachelor", "Перший (бакалаврський) рівень"], ["master", "Другий (магістерський) рівень"], ["phd", "Третій (освітньо-науковий) рівень"]] },
  { id: "faculty-discussion", title: "Громадське обговорення освітніх програм", children: [["law", "D8 «Право»"], ["public-administration", "D4 «Публічне управління та адміністрування»"]] },
  { id: "faculty-repository", title: "Репозитарій", children: [["law", "D8 «Право»"], ["public-administration", "D4 «Публічне управління та адміністрування»"]] },
  { id: "faculty-documents", title: "Нормативні документи", children: [] },
  { id: "department-news", title: "Новини факультету", children: [] },
];

export const lawFacultySubpages = lawFacultyStructure.flatMap((section) => section.children.map(([id, title]) => ({
  path: `${lawFacultyPath}/${section.id}/${id}`, sectionId: section.id, id, title, parentTitle: section.title,
})));

export const lawFacultyLegacySections: Record<string, string> = {
  "faculty-science": "faculty-science-clubs", "faculty-governance": "faculty-council",
  "faculty-quality": "faculty-documents", "faculty-practice-centres": "faculty-legal-clinic",
};
