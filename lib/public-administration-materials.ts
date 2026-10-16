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
  }
];

export function getPublicAdministrationPublication(id: string) {
  return publicAdministrationPublications.find(programme => programme.id === id);
}
