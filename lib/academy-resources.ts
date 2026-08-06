export type DoctoralProgramme = {
  code: string;
  title: string;
  description: string;
  href: string;
  pages: number;
  department: string;
  relatedProgramSlug?: string;
};

export const doctoralProgrammes: DoctoralProgramme[] = [
  {
    code: "A5",
    title: "Професійна освіта (за спеціалізаціями)",
    description: "Освітньо-наукова програма третього рівня вищої освіти, 2025 рік.",
    href: "/documents/programmes/phd/2025/a5-professional-education.pdf",
    pages: 26,
    department: "Міждисциплінарна освітньо-наукова програма",
  },
  {
    code: "C1",
    title: "Економіка та міжнародні економічні відносини",
    description: "Освітньо-наукова програма «Економіка» для підготовки докторів філософії, 2025 рік.",
    href: "/documents/programmes/phd/2025/c1-economics.pdf",
    pages: 17,
    department: "Кафедра економіки підприємства та менеджменту",
    relatedProgramSlug: "management",
  },
  {
    code: "C4",
    title: "Психологія",
    description: "Освітньо-наукова програма третього рівня вищої освіти, 60 кредитів ЄКТС, 2025 рік.",
    href: "/documents/programmes/phd/2025/c4-psychology.pdf",
    pages: 19,
    department: "Кафедра психології",
    relatedProgramSlug: "psychology",
  },
  {
    code: "D4",
    title: "Публічне управління та адміністрування",
    description: "Освітньо-наукова програма третього рівня вищої освіти, започаткована у 2025 році.",
    href: "/documents/programmes/phd/2025/d4-public-administration.pdf",
    pages: 17,
    department: "Кафедра публічного управління та адміністрування",
    relatedProgramSlug: "public-administration",
  },
];

export const doctoralFacilities = {
  title: "Відомості про засоби провадження освітньої діяльності",
  description: "Кадрове, матеріально-технічне та інформаційне забезпечення програм A5, C1, C4 і D4.",
  href: "/documents/programmes/phd/2025/educational-facilities.pdf",
  pages: 21,
};

export const greenFinEduFiles = [
  {
    format: "PPTX",
    title: "Презентація проєкту GreenFinEDU",
    description: "Модуль Жан Моне Erasmus+ № 101126681: мета, команда, навчальні активності та очікувані результати.",
    href: "/documents/international/greenfinedu/project-presentation.pptx",
  },
  {
    format: "DOCX",
    title: "Програма презентації проєкту",
    description: "Двомовна програма офіційної презентації модуля GreenFinEDU.",
    href: "/documents/international/greenfinedu/project-launch-agenda.docx",
  },
  {
    format: "DOCX",
    title: "Базовий інтенсивний курс",
    description: "«Європейська зелена угода: як зробити фінанси сталими?» для студентів заочної форми.",
    href: "/documents/international/greenfinedu/intensive-course-programme.docx",
  },
  {
    format: "DOCX",
    title: "Поглиблений онлайн-курс",
    description: "Курс зі сталої фінансової політики ЄС для бакалаврів і магістрів денної форми.",
    href: "/documents/international/greenfinedu/advanced-online-course-programme.docx",
  },
  {
    format: "DOCX",
    title: "Програма літньої школи",
    description: "Курс для викладачів, публічних службовців, професійних груп і громадянського суспільства.",
    href: "/documents/international/greenfinedu/summer-school-programme.docx",
  },
] as const;

export const greenFinEduCollections = [
  {
    title: "Розклад курсів 2023–2024",
    description: "Інтенсивний, поглиблений онлайн-курс і літня школа.",
    href: "https://drive.google.com/drive/folders/1JpmnLMSq0gKnGqMldqaS7yav-qLXPbDh",
  },
  {
    title: "Презентації поглибленого курсу",
    description: "12 тематичних презентацій для денної форми навчання.",
    href: "https://drive.google.com/drive/folders/1bVidu-P7uN8Ta_DddikrsKSbP9X07E7K",
  },
  {
    title: "Презентації базового курсу",
    description: "12 тематичних презентацій для заочної форми навчання.",
    href: "https://drive.google.com/drive/folders/1KPN51SXSxQ_ioXkGf3a7rikHi_KuziFq",
  },
  {
    title: "Презентації літньої школи",
    description: "12 тематичних матеріалів для фахівців і громадськості.",
    href: "https://drive.google.com/drive/folders/164vo0o7_Hc7GVUpab7tw1NLnFdnGfSYE",
  },
  {
    title: "Матеріали вебінару GreenFinEDU",
    description: "Презентація, програма та запрошення до першого тематичного вебінару.",
    href: "https://docs.google.com/presentation/d/1qE1jLZtPN3ejMuLREqpw-Ys3pCbbeGwJ/edit",
  },
] as const;

export const academyDriveCollections = {
  graduationPhotos: "https://drive.google.com/drive/folders/1r_Xh39mHDwiC6StjeKPpsTq9f-Lh_16X?usp=sharing",
};
