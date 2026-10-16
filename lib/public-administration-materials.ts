export type ProgrammeMaterial = { title: string; href: string; format: "PDF" | "DOC" | "DOCX"; sha256: string };
export type ProgrammePublication = {
  id: string;
  facts: { label: string; value: string }[];
  currentDocument: ProgrammeMaterial;
  groups: { id: string; title: string; collapsed?: boolean; files: ProgrammeMaterial[] }[];
};

export const publicAdministrationPublications: ProgrammePublication[] = [
  {
    "id": "d4-public-administration-phd",
    "facts": [
      {
        "label": "Гарант ОНП",
        "value": "Васильєва Наталія Вікторівна — доктор наук з державного управління, професор."
      },
      {
        "label": "Акредитація",
        "value": "Ще не проводилася. Попередньо запланована на 2029 рік."
      }
    ],
    "currentDocument": {
      "title": "Освітньо-наукова програма · 2025",
      "href": "/documents/programmes/phd/2025/d4-public-administration.pdf",
      "format": "PDF",
      "sha256": "41f0047621fa1549e66aa275c83fa821765cb4d4987669742733f7077ba42ee2"
    },
    "groups": [
      {
        "id": "curricula",
        "title": "Навчальні плани",
        "files": [
          {
            "title": "Навчальний план · денна форма · 2025–2026",
            "href": "/documents/programmes/public-administration/phd/curriculum-full-time-2025-2026.pdf",
            "format": "PDF",
            "sha256": "d36156e8aa744b500c29f49a59f2eb01ea5a045535c2fc8e6042f047e1310d10"
          },
          {
            "title": "Навчальний план · заочна форма · 2025–2026",
            "href": "/documents/programmes/public-administration/phd/curriculum-part-time-2025-2026.pdf",
            "format": "PDF",
            "sha256": "3484d31e5ac4a64b391a1d5a880bae67da52c678f4181e99c886052f5b4c8591"
          }
        ]
      },
      {
        "id": "programme-team",
        "title": "Гарант і група забезпечення ОП",
        "files": [
          {
            "title": "Група забезпечення ОНП · відповідність ліцензійним умовам",
            "href": "/documents/programmes/public-administration/phd/teaching-team-qualifications.doc",
            "format": "DOC",
            "sha256": "d830933a818c30a98c669d95f24978a4bccf72a2fc7b9d704c842683dda48f9e"
          }
        ]
      },
      {
        "id": "drafts",
        "title": "Проєктні матеріали · 2025",
        "collapsed": true,
        "files": [
          {
            "title": "Проєкт освітньо-наукової програми · 2025",
            "href": "/documents/programmes/public-administration/phd/draft-programme-2025.pdf",
            "format": "PDF",
            "sha256": "7a3817ec10c7b8c5025b75e62fc5e47056a801016aadec9a830d2a595c66e3a3"
          },
          {
            "title": "Проєкт навчального плану · денна форма · 2025",
            "href": "/documents/programmes/public-administration/phd/draft-curriculum-full-time-2025.pdf",
            "format": "PDF",
            "sha256": "f1758d2871f46523bbea10d837ee546e378c6f180a86262d628a1735caa8a9d4"
          },
          {
            "title": "Проєкт навчального плану · заочна форма · 2025",
            "href": "/documents/programmes/public-administration/phd/draft-curriculum-part-time-2025.pdf",
            "format": "PDF",
            "sha256": "a3f48f68fcfad2eedf103611000f5fe59083d43c3f1b61ee7bef2d75dcbca425"
          }
        ]
      }
    ]
  },
  {
    "id": "d4-public-administration-master",
    "facts": [
      {
        "label": "Гарант ОПП",
        "value": "Міщенко Катерина Семенівна — кандидат наук з державного управління, доцент."
      },
      {
        "label": "Ідентифікатор ОП у ЄДЕБО",
        "value": "56066"
      },
      {
        "label": "Акредитація",
        "value": "Сертифікат № 6830 від 26.12.2023 діє до 01.07.2029. Наступна акредитація запланована на липень 2029 року."
      }
    ],
    "currentDocument": {
      "title": "Освітньо-професійна програма · 2025–2026",
      "href": "/documents/programmes/public-administration/master/programme-2025-2026.pdf",
      "format": "PDF",
      "sha256": "b86fd3e1113096540dea1677adedf3b22e74593b0cbb18e79f6fed17708bdf4a"
    },
    "groups": [
      {
        "id": "curricula",
        "title": "Навчальні плани",
        "files": [
          {
            "title": "Навчальний план · денна форма · 2025–2026",
            "href": "/documents/programmes/public-administration/master/curriculum-full-time-2025-2026.pdf",
            "format": "PDF",
            "sha256": "f013d6acd0ec22464c590d7d9a788adcf506293e21cd14e2e7a5357ed1d5bbe2"
          },
          {
            "title": "Навчальний план · заочна форма · 2025–2026",
            "href": "/documents/programmes/public-administration/master/curriculum-part-time-2025-2026.pdf",
            "format": "PDF",
            "sha256": "6dacea295af4ef50c00b804547190777a0ec3e28710c911f92b8c3cbe8be6e8f"
          }
        ]
      },
      {
        "id": "practice",
        "title": "Практична підготовка",
        "files": [
          {
            "title": "Робоча програма переддипломної практики",
            "href": "/documents/programmes/public-administration/master/pre-diploma-practice.pdf",
            "format": "PDF",
            "sha256": "ea7799642439ab83d7e1a510e7685be636a6a99594525908690a8dece5bec8e2"
          },
          {
            "title": "Бази практики",
            "href": "/documents/programmes/public-administration/practice-bases.pdf",
            "format": "PDF",
            "sha256": "940e0e23ae558d669ad6dfd41fd5115e8673793fa90b505564031025812ee582"
          }
        ]
      },
      {
        "id": "thesis",
        "title": "Магістерська (кваліфікаційна) робота",
        "files": [
          {
            "title": "Методичні рекомендації до написання магістерської роботи",
            "href": "/documents/programmes/public-administration/master/thesis-guidelines.pdf",
            "format": "PDF",
            "sha256": "803f07799368b6257a8c9c2a09feb7126abc55e0652d35abf0c6fd4f6586adbf"
          },
          {
            "title": "Перелік тем магістерських робіт",
            "href": "/documents/programmes/public-administration/master/thesis-topics.pdf",
            "format": "PDF",
            "sha256": "ee40d84071c6ee17c82565d762c25a5f86097cea88986ca573dd16ac0f991230"
          },
          {
            "title": "Заява про вибір теми та керівника магістерської роботи",
            "href": "/documents/programmes/public-administration/master/thesis-application.pdf",
            "format": "PDF",
            "sha256": "ca75d000628b3b5c47a9d423be67206cba891139710dfd89532bef21f0a8e4e4"
          }
        ]
      },
      {
        "id": "accreditation",
        "title": "Акредитація",
        "files": [
          {
            "title": "Сертифікат про акредитацію № 6830",
            "href": "/documents/programmes/public-administration/master/accreditation-certificate-6830.pdf",
            "format": "PDF",
            "sha256": "52cf1d3aba85e2e3175e00a53ddac29ac969733947cf2046c2e575b3770fb52f"
          }
        ]
      }
    ]
  }
];

export function getPublicAdministrationPublication(id: string) {
  return publicAdministrationPublications.find(programme => programme.id === id);
}
