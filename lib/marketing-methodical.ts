export const marketingMethodicalGroups = [
  { id: "bachelor", title: "Бакалаврат", sections: [
    { id: "marketing-methodical-bachelor-work-programmes", title: "Робочі програми навчальних дисциплін" },
    { id: "marketing-methodical-bachelor-annotations", title: "Анотації навчальних дисциплін" },
    { id: "marketing-methodical-bachelor-recommendations", title: "Методичні рекомендації" },
    { id: "marketing-methodical-bachelor-practice", title: "Практична підготовка" },
    { id: "marketing-methodical-bachelor-coursework", title: "Курсові роботи" },
    { id: "marketing-methodical-bachelor-qualification", title: "Кваліфікаційні роботи та атестація" },
  ] },
  { id: "master", title: "Магістратура", sections: [
    { id: "marketing-methodical-master-work-programmes", title: "Робочі програми навчальних дисциплін" },
    { id: "marketing-methodical-master-annotations", title: "Анотації навчальних дисциплін" },
    { id: "marketing-methodical-master-recommendations", title: "Методичні рекомендації" },
    { id: "marketing-methodical-master-practice", title: "Практична підготовка" },
    { id: "marketing-methodical-master-qualification", title: "Кваліфікаційні роботи та атестація" },
  ] },
  { id: "general", title: "Загальні навчально-методичні матеріали", sections: [
    { id: "marketing-methodical-publications", title: "Навчальні та навчально-методичні видання викладачів кафедри" },
    { id: "marketing-methodical-consultations", title: "Графіки консультацій викладачів" },
    { id: "marketing-methodical-resources", title: "Електронні освітні ресурси" },
  ] },
] as const;

export const marketingMethodicalSectionIds = marketingMethodicalGroups.flatMap((group) => group.sections.map((section) => section.id));
