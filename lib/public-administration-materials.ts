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
  },
  {
    "id": "d4-public-administration-bachelor",
    "facts": [
      {
        "label": "Гарант ОПП",
        "value": "Качан Яна Віталіївна — кандидат наук з державного управління."
      },
      {
        "label": "Ідентифікатор ОП у ЄДЕБО",
        "value": "56065"
      },
      {
        "label": "Акредитація",
        "value": "Умовна (відкладена). Сертифікат № 20649 від 22.04.2026 діє до 21.04.2027. Наступна акредитація запланована на березень 2027 року."
      }
    ],
    "currentDocument": {
      "title": "Освітньо-професійна програма · 2025–2026",
      "href": "/documents/programmes/public-administration/bachelor/programme-2025-2026.pdf",
      "format": "PDF",
      "sha256": "4ca9b9207b40561adc7d2b1ef0a87c35074096cb7e669f835ee2b134d403ae31"
    },
    "groups": [
      {
        "id": "curricula",
        "title": "Навчальні плани · 2025–2026",
        "files": [
          {
            "title": "Навчальний план · денна форма · 2025–2026",
            "href": "/documents/programmes/public-administration/bachelor/curriculum-full-time-2025-2026.pdf",
            "format": "PDF",
            "sha256": "9c80874cfb83ff38891eb6cf05ad1db2d42a5b551afaf99a546540639574ae97"
          },
          {
            "title": "Навчальний план · заочна форма · 2025–2026",
            "href": "/documents/programmes/public-administration/bachelor/curriculum-part-time-2025-2026.pdf",
            "format": "PDF",
            "sha256": "7fb240f3f726d2225ff3f18df76fda2af8e5e9ff72ec4b78ca71e3e8c7e4e796"
          }
        ]
      },
      {
        "id": "accreditation",
        "title": "Акредитація",
        "files": [
          {
            "title": "Сертифікат про умовну (відкладену) акредитацію № 20649",
            "href": "/documents/programmes/public-administration/bachelor/accreditation-certificate-20649.pdf",
            "format": "PDF",
            "sha256": "375bf477f614a1f3e58af011c734e9cb3cb6cdd43d6c7175a1636070c804f4f9"
          }
        ]
      },
      {
        "id": "mandatory-programmes",
        "title": "Робочі програми · обов’язкові дисципліни",
        "collapsed": true,
        "files": [
          {
            "title": "Євроінтеграція, міжнародне публічне управління та безпека · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/ievrointehratsiia-mizhnarodne-publichne-upravlinnia-ta-bezpeka-rp-51233bc4.pdf",
            "format": "PDF",
            "sha256": "51233bc4b8637c3c48991288354bfca6b5e449c7c0d3a33a481eff33aee45de4"
          },
          {
            "title": "Інновації у сфері публічного управління · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/innovatsii-u-sferi-publichnoho-upravlinnia-rp-219a8810.pdf",
            "format": "PDF",
            "sha256": "219a88105b1b8354a058472314e091c7b79b727ed29d97bec296df2290f78f76"
          },
          {
            "title": "Іноземна мова · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/inozemna-mova-rp-6c9436d6.pdf",
            "format": "PDF",
            "sha256": "6c9436d64425dae9638c89af7e00249c5b0c63ed01f87354de1e2f291e8a3864"
          },
          {
            "title": "Інформаційно-комунікаційні технології · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/informatsiino-komunikatsiini-tekhnolohii-rp-a50e9faa.pdf",
            "format": "PDF",
            "sha256": "a50e9faa1255c64ad1bca7e56ea9c2526ed9915f94bee3382df3bbcd1ba7d958"
          },
          {
            "title": "Історія публічного управління · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/istoriia-publichnoho-upravlinnia-rp-22d76a8c.pdf",
            "format": "PDF",
            "sha256": "22d76a8c9d02c058f9a19d90f53c889ed0f52a99253c6d6cea68aee885cd0c99"
          },
          {
            "title": "Історія української державності · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/istoriia-ukrainskoi-derzhavnosti-rp-3901e394.pdf",
            "format": "PDF",
            "sha256": "3901e394494df5600e7adcb744d835546b4a91cde600667288ed9787dd7d0d6a"
          },
          {
            "title": "Адміністративне право · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/administratyvne-pravo-rp-870455eb.pdf",
            "format": "PDF",
            "sha256": "870455eb8e48e790c71afeef658a518e7baa14c70ccb201ccfdf0c1656405121"
          },
          {
            "title": "Академічні студії та доброчесність · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/akademichni-studii-ta-dobrochesnist-rp-b193fb76.pdf",
            "format": "PDF",
            "sha256": "b193fb7633c5d05dec7937ef26c4e70b8e60d2825b1a1885e39febbf629fad5a"
          },
          {
            "title": "Вступ до фаху · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/vstup-do-fakhu-rp-68a67072.pdf",
            "format": "PDF",
            "sha256": "68a6707220c865fe797e46eb9cf0c1496ee7053c36cd83dc0a4cc55bcc5bac33"
          },
          {
            "title": "Електронні послуги · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/elektronni-posluhy-rp-fbb3c4eb.pdf",
            "format": "PDF",
            "sha256": "fbb3c4eb81b5899258cf67dd7129b4901925db72716d433e48bec2ab3c438d8c"
          },
          {
            "title": "Етика публічної служби · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/etyka-publichnoi-sluzhby-rp-6bcb73aa.pdf",
            "format": "PDF",
            "sha256": "6bcb73aa92d3e4bc87b93ab947484b349550a015267df9f0d03c40da62be7f2c"
          },
          {
            "title": "Кадрова політика і державна служба · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/kadrova-polityka-i-derzhavna-sluzhba-rp-253d1007.pdf",
            "format": "PDF",
            "sha256": "253d1007ca993877007cc4bf6889dd544b79d8b8d11336a9a07a8fdd1d40b10e"
          },
          {
            "title": "Конституційне право · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/konstytutsiine-pravo-rp-be207dfc.pdf",
            "format": "PDF",
            "sha256": "be207dfcb6e43e7e752b376249479615fa66f4dc7a1bf1de2a3f9584946af210"
          },
          {
            "title": "Методи прийняття управлінських рішень · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/metody-pryiniattia-upravlinskykh-rishen-rp-21e26ca0.pdf",
            "format": "PDF",
            "sha256": "21e26ca0f1a61d4262849600dc48246e53e0ddc9f20b6b77b4d6521a9d7fadf0"
          },
          {
            "title": "Міжнародне публічне право · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/mizhnarodne-publichne-pravo-rp-6eefa272.pdf",
            "format": "PDF",
            "sha256": "6eefa2722ee9f74403ea9b4dd0427d1d0733eee5eacfec3ba6603faa8cfef3dc"
          },
          {
            "title": "Національна безпека України · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/natsionalna-bezpeka-ukrainy-rp-b78cf190.pdf",
            "format": "PDF",
            "sha256": "b78cf190b506172d85847694384467c8d448a4f1b27053ee14c96d4487cfac9b"
          },
          {
            "title": "Організаційно-правові засади запобігання корупції · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/orhanizatsiino-pravovi-zasady-zapobihannia-koruptsii-rp-823123bc.pdf",
            "format": "PDF",
            "sha256": "823123bc2c2a95f9c21e9384dc2f1531d7a10cc9fafc6a0096efa30cad15ab7d"
          },
          {
            "title": "Організаційно-правові засади публічного управління соціально-економічною сферою · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/orhanizatsiino-pravovi-zasady-publichnoho-upravlinnia-sotsialno-ekonomichnoiu-sferoiu-8700c2a6.pdf",
            "format": "PDF",
            "sha256": "8700c2a61649786c937c735c8571ae3bd3eb26a6e6db62a55fc13e2e101493da"
          },
          {
            "title": "Основи антикризового управління · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/osnovy-antykryzovoho-upravlinnia-rp-6762a3bf.pdf",
            "format": "PDF",
            "sha256": "6762a3bf09f66da447128232128499f8a468cf790b2cf43d28096a656868f327"
          },
          {
            "title": "Основи державної політики у сфері зайнятості · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/osnovy-derzhavnoi-polityky-u-sferi-zainiatosti-rp-eb09ef74.pdf",
            "format": "PDF",
            "sha256": "eb09ef74eecbe112e0264e4c863a7312afded72f4e6d5605a131f7d040d82ee9"
          },
          {
            "title": "Основи електронного урядування · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/osnovy-elektronnoho-uriaduvannia-rp-11c6e5b0.pdf",
            "format": "PDF",
            "sha256": "11c6e5b006e88d7f24fa13b5a21265b88cb7fb5137c7af3f3cca71a81b200e89"
          },
          {
            "title": "Основи написання наукових робіт · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/osnovy-napysannia-naukovykh-robit-rp-81cf769a.pdf",
            "format": "PDF",
            "sha256": "81cf769a146f937afef0db627d235b4cecc0492a9ddaa11438c15796f2834373"
          },
          {
            "title": "Основи національної безпека України · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/osnovy-natsionalnoi-bezpeka-ukrainy-rp-49183579.pdf",
            "format": "PDF",
            "sha256": "491835798ff6e9ec47569da5225e341ee1d51d381cfa019b44a18eb877c8deb1"
          },
          {
            "title": "Основи публічного управління та адміністрування · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/osnovy-publichnoho-upravlinnia-ta-administruvannia-rp-ec5382b7.pdf",
            "format": "PDF",
            "sha256": "ec5382b7898f425c511945e1aa8c51c75c2c09699166851cc95c0348fe89b3a0"
          },
          {
            "title": "Основи територіальної організації влади · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/osnovy-terytorialnoi-orhanizatsii-vlady-rp-a657ea11.pdf",
            "format": "PDF",
            "sha256": "a657ea11b64bafbb08d0424b231fa525231505d80b3dc2936cbd246dcc232b56"
          },
          {
            "title": "Політико-управлінські відносини · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/polityko-upravlinski-vidnosyny-rp-e4aaae7b.pdf",
            "format": "PDF",
            "sha256": "e4aaae7b1b08e046e1f2a69af1bf3dbe68146281b4978c7bf169793a44b187a0"
          },
          {
            "title": "Проблеми забезпечення якості та контроль у державних інституціях · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/problemy-zabezpechennia-iakosti-ta-kontrol-u-derzhavnykh-instytutsiiakh-rp-295ee2a1.pdf",
            "format": "PDF",
            "sha256": "295ee2a1f7f7777396b7809637e3d7fa0211536567614cd4c1275bd40ebb2a3b"
          },
          {
            "title": "Профспілки в умовах соціальних трансформацій · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/profspilky-v-umovakh-sotsialnykh-transformatsii-rp-235d6e5c.pdf",
            "format": "PDF",
            "sha256": "235d6e5cee95a04a9d427ce35aeed01f152492e4b5d6f8eba6c9dc3b8640b951"
          },
          {
            "title": "Публічні комунікації та зв’язки з громадськістю · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/publichni-komunikatsii-ta-zv-iazky-z-hromadskistiu-rp-522a2e00.pdf",
            "format": "PDF",
            "sha256": "522a2e004e2e6ee19ac56f25f0bfb7bf4888633d8b06cbc108b54464c0a02fbd"
          },
          {
            "title": "Світова та українська культура і мистецтво · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/svitova-ta-ukrainska-kultura-i-mystetstvo-rp-b385f848.pdf",
            "format": "PDF",
            "sha256": "b385f848ef5c78e750bb7ffc0248d43c3fc7297e0a8aeb8cb94ad8ad84e393cc"
          },
          {
            "title": "Соціальна політика · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/sotsialna-polityka-rp-84647008.pdf",
            "format": "PDF",
            "sha256": "846470088cc10d75da416b1cddde0908eb8f36147fd651529810411bc37a3041"
          },
          {
            "title": "Соціально-політичні студії · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/sotsialno-politychni-studii-rp-e38b6237.pdf",
            "format": "PDF",
            "sha256": "e38b6237d6eb56974ddf928c9277b26e8b73d20b03ab9d1d2c59b78dedeeaeca"
          },
          {
            "title": "Сталий розвиток в публічному управлінні · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/stalyi-rozvytok-v-publichnomu-upravlinni-rp-71cc0302.pdf",
            "format": "PDF",
            "sha256": "71cc03022ae49676297e3aaf4b282502eea898e37bb2f54bde3908b840671745"
          },
          {
            "title": "Стратегічне управління · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/stratehichne-upravlinnia-rp-503f1ad7.pdf",
            "format": "PDF",
            "sha256": "503f1ad7ea8a5ff7f9655a232f60a620447086887b43d7bec662958e9a92811e"
          },
          {
            "title": "Теорія демократії та базові інститути демократичного суспільства · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/teoriia-demokratii-ta-bazovi-instytuty-demokratychnoho-suspilstva-rp-2e40db9b.pdf",
            "format": "PDF",
            "sha256": "2e40db9bfdd8be04285484b1fc500490aea647e660f875394aa70facebb06679"
          },
          {
            "title": "Теорія держави і права · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/teoriia-derzhavy-i-prava-rp-d12bf76e.pdf",
            "format": "PDF",
            "sha256": "d12bf76ed5756f30f939a7f5df06b15a2e9662afcc5738677eb20d5f4f579993"
          },
          {
            "title": "Теорія управління змінами · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/teoriia-upravlinnia-zminamy-rp-616b384d.pdf",
            "format": "PDF",
            "sha256": "616b384d19ab954f1eb886e307c9430f16916a46df1d43284476be4cc7677171"
          },
          {
            "title": "Українська мова за професійним спрямуванням · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/ukrainska-mova-za-profesiinym-spriamuvanniam-rp-175e2e74.pdf",
            "format": "PDF",
            "sha256": "175e2e743abb7fcf9c1b89cdc1212bc01699ba7b413b6459704cbed9944c5764"
          },
          {
            "title": "Філософія · РП",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-programmes/filosofiia-rp-359ff5b9.pdf",
            "format": "PDF",
            "sha256": "359ff5b94bb6828b720c35133217c12e037e154c1f18ba71cfbe852d83c89f98"
          }
        ]
      },
      {
        "id": "mandatory-annotations",
        "title": "Анотації · обов’язкові дисципліни",
        "collapsed": true,
        "files": [
          {
            "title": "Євроінтеграція, міжнародне публічне управління та безпека · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/ievrointehratsiia-mizhnarodne-publichne-upravlinnia-ta-bezpeka-anotatsiia-317923b6.pdf",
            "format": "PDF",
            "sha256": "317923b6a69578e9a0181d1fc94bf96ca9c286bfb9086f867ee953ca4f66e4a2"
          },
          {
            "title": "Інновації у сфері публічного управління · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/innovatsii-u-sferi-publichnoho-upravlinnia-anotatsiia-57bee9a8.pdf",
            "format": "PDF",
            "sha256": "57bee9a826eb187c60d1ce7314a73e40881e5f7af2655550c390f702fc062ea6"
          },
          {
            "title": "Іноземна мова · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/inozemna-mova-anotatsiia-cb4b8166.pdf",
            "format": "PDF",
            "sha256": "cb4b8166d72009fdf60363f1ee111b381298add59ea382142638133ba58bc036"
          },
          {
            "title": "Інформаційно-комунікаційні технології · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/informatsiino-komunikatsiini-tekhnolohii-anotatsiia-e9ace4ec.pdf",
            "format": "PDF",
            "sha256": "e9ace4ec923c574c770f352708ccc0a7c55d32c78a2171330371b27fbf8aa91f"
          },
          {
            "title": "Історія публічного управління · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/istoriia-publichnoho-upravlinnia-anotatsiia-8e30415d.pdf",
            "format": "PDF",
            "sha256": "8e30415d0721a89314d1747669f4ad3548a2eb603dd7ffa501b76a9a2993ffa8"
          },
          {
            "title": "Історія української державності · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/istoriia-ukrainskoi-derzhavnosti-anotatsiia-f22be680.pdf",
            "format": "PDF",
            "sha256": "f22be6805d03d9fd26f31afec03d4207def39be14b670cd08f25a7ff0abfc682"
          },
          {
            "title": "Адміністративне право · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/administratyvne-pravo-anotatsiia-33e67680.pdf",
            "format": "PDF",
            "sha256": "33e676807d8972b598b2d118030abe5531ea47d54ebc8362f5d7bec08dbc0291"
          },
          {
            "title": "Академічні студії та доброчесність · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/akademichni-studii-ta-dobrochesnist-anotatsiia-7187a0fb.pdf",
            "format": "PDF",
            "sha256": "7187a0fb4a87ac46386af8760dd0f2be6068e3ee3e921b9ca419203c880667ef"
          },
          {
            "title": "Вступ до фаху · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/vstup-do-fakhu-anotatsiia-966da351.pdf",
            "format": "PDF",
            "sha256": "966da351bc5bfbd3c180a176551d188e60d5ee79c8e1a66f17e202911d155034"
          },
          {
            "title": "Електронні послуги · Анотація · 2022",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/elektronni-posluhy-anotatsiia-2022-7ba62b7d.pdf",
            "format": "PDF",
            "sha256": "7ba62b7deba7bdb1c29c20e0e5af4274e512a37ae2cbc1f93a002ead4a0b20bc"
          },
          {
            "title": "Етика публічної служби · Анотацiя",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/etyka-publichnoi-sluzhby-anotatsiia-111e2f9b.pdf",
            "format": "PDF",
            "sha256": "111e2f9be8aa526f422a7e6d02042e20ac48d75ba2e97930cecd5eecc5e4473f"
          },
          {
            "title": "Кадрова політика і державна служба · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/kadrova-polityka-i-derzhavna-sluzhba-anotatsiia-a58c8863.pdf",
            "format": "PDF",
            "sha256": "a58c8863271af44956d01b86d1c3792e283823f6a9b348c1de0c217f1a1c22df"
          },
          {
            "title": "Конституційне право · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/konstytutsiine-pravo-anotatsiia-2e98428a.pdf",
            "format": "PDF",
            "sha256": "2e98428abbbf3f097c0a0e36f0e093ccc1192dbeac08361719af783864bd9521"
          },
          {
            "title": "Методи прийняття управлінських рішень · Анотацiя",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/metody-pryiniattia-upravlinskykh-rishen-anotatsiia-89440942.pdf",
            "format": "PDF",
            "sha256": "894409426b442b42fb9c0f051c8d90262196ff589674376fdc65fe409f04d5a7"
          },
          {
            "title": "Міжнародне публічне право · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/mizhnarodne-publichne-pravo-anotatsiia-cfe0450a.pdf",
            "format": "PDF",
            "sha256": "cfe0450a28fbbead595523b442cf8d046eccc8295dbcfa054f34a16450f24665"
          },
          {
            "title": "Національна безпека · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/natsionalna-bezpeka-anotatsiia-146af01b.pdf",
            "format": "PDF",
            "sha256": "146af01bc6c409847756aa20fb5647482ecedd5e99e7614d943c0072c12aecf9"
          },
          {
            "title": "Організаційно-правові засади запобігання корупції · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/orhanizatsiino-pravovi-zasady-zapobihannia-koruptsii-anotatsiia-f1055e83.pdf",
            "format": "PDF",
            "sha256": "f1055e836ec6ca13f2ce027b282786be13f79f34a68b013df64aaf539413e13e"
          },
          {
            "title": "Основи антикризового управління · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/osnovy-antykryzovoho-upravlinnia-anotatsiia-6950f8f8.pdf",
            "format": "PDF",
            "sha256": "6950f8f8c492e995c46d8d19a95f751f4733699b1d76e829689c3f172be1ce32"
          },
          {
            "title": "Основи державної політики у сфері зайнятості · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/osnovy-derzhavnoi-polityky-u-sferi-zainiatosti-anotatsiia-14c1bd9b.pdf",
            "format": "PDF",
            "sha256": "14c1bd9b3016801523f197727ed50417c4ab83d1dd72875712069ca9a5e31ac4"
          },
          {
            "title": "Основи електронного урядування · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/osnovy-elektronnoho-uriaduvannia-anotatsiia-3e3715a4.pdf",
            "format": "PDF",
            "sha256": "3e3715a44d3f4b77ea0147deb2c5a8945c903c19d60ed828822aaec97cd615de"
          },
          {
            "title": "Основи написання наукових робіт · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/osnovy-napysannia-naukovykh-robit-anotatsiia-c1f01432.pdf",
            "format": "PDF",
            "sha256": "c1f014324eec2702b3741e0b54b50f5d63012452a12edd12d85ad3af44323119"
          },
          {
            "title": "Основи національної безпека України · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/osnovy-natsionalnoi-bezpeka-ukrainy-anotatsiia-ffdf22d9.pdf",
            "format": "PDF",
            "sha256": "ffdf22d9fe72bf4208f2bc6007e0fdc9985bbee2214e0880a22c2bc1337176b0"
          },
          {
            "title": "Основи публічного управління та адміністрування · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/osnovy-publichnoho-upravlinnia-ta-administruvannia-anotatsiia-6f01039b.pdf",
            "format": "PDF",
            "sha256": "6f01039b8d4bfcb5ea6625af33999a93476b7eb5f80a79e304c45c097003f9ee"
          },
          {
            "title": "Основи територіальної організації влади · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/osnovy-terytorialnoi-orhanizatsii-vlady-anotatsiia-d215e2d6.pdf",
            "format": "PDF",
            "sha256": "d215e2d67deb9c600378ba662912a3c468fd2662277f7e5710c9073141fba51e"
          },
          {
            "title": "Проблеми забезпечення якості та контроль у державних інституціях · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/problemy-zabezpechennia-iakosti-ta-kontrol-u-derzhavnykh-instytutsiiakh-anotatsiia-330d6fdd.pdf",
            "format": "PDF",
            "sha256": "330d6fdd8f8230a370a0e5541bff78d16568f5076d67ef185b4e47a998d40ddf"
          },
          {
            "title": "Профспілки в умовах соціальних трансформацій · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/profspilky-v-umovakh-sotsialnykh-transformatsii-anotatsiia-3e19d3c3.pdf",
            "format": "PDF",
            "sha256": "3e19d3c358f06124542ebfe88c0d2078717c66363328288cc7595aee8ccb71d9"
          },
          {
            "title": "Публічні комунікації та зв’язки з громадськістю · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/publichni-komunikatsii-ta-zv-iazky-z-hromadskistiu-anotatsiia-d5aa6fed.pdf",
            "format": "PDF",
            "sha256": "d5aa6fed48161fe2d1b904f514f2fae4f14211bf50d6b826d99a248b97350d8a"
          },
          {
            "title": "Світова та українська культура і мистецтво · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/svitova-ta-ukrainska-kultura-i-mystetstvo-anotatsiia-ffa99fad.pdf",
            "format": "PDF",
            "sha256": "ffa99fad41253f157338d4ff739a33fbf1db322d4c9b39fbc5604443c077a1cc"
          },
          {
            "title": "Соціальна політика в Україні · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/sotsialna-polityka-v-ukraini-anotatsiia-a9e30abf.pdf",
            "format": "PDF",
            "sha256": "a9e30abf9ca3084f94b388156651d2ea92576479afac21783b804d12f97bb119"
          },
          {
            "title": "Соціально-політичні студії · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/sotsialno-politychni-studii-anotatsiia-6e083e79.pdf",
            "format": "PDF",
            "sha256": "6e083e79cd0bf8cb3e5b6a03d0ca6b43c56342212b39e0b73cd6972d4cf532ed"
          },
          {
            "title": "Сталий розвиток в публічному управлінні · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/stalyi-rozvytok-v-publichnomu-upravlinni-anotatsiia-3a819615.pdf",
            "format": "PDF",
            "sha256": "3a8196153c4be8f4c3e1cf8ec59886a48ce9e56e58354e53bedffbcf2be17949"
          },
          {
            "title": "Стратегічне управління · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/stratehichne-upravlinnia-anotatsiia-885d0c64.pdf",
            "format": "PDF",
            "sha256": "885d0c64a5169c9dd239d964589b0c24d7d4972d50f2d85a30b4cc764d5aabec"
          },
          {
            "title": "Теорія демократії та базові інститути демократичного суспільства · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/teoriia-demokratii-ta-bazovi-instytuty-demokratychnoho-suspilstva-anotatsiia-a4243f33.pdf",
            "format": "PDF",
            "sha256": "a4243f338a5d99569b021ff7aba2c18d155a36b3b0e3191593052f55f19a7a2c"
          },
          {
            "title": "Теорія держави і права · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/teoriia-derzhavy-i-prava-anotatsiia-997e7c52.pdf",
            "format": "PDF",
            "sha256": "997e7c52564e0a57553689ff17472a3dba0d7aaa9c5feeaa56cb0850e9f502fd"
          },
          {
            "title": "Теорія управління змінами · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/teoriia-upravlinnia-zminamy-anotatsiia-445c1cc4.pdf",
            "format": "PDF",
            "sha256": "445c1cc45ee1632c6449481c43917e56472efa4c2877c059be1e9ab5fcfd7107"
          },
          {
            "title": "Українська мова за професійним спрямуванням · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/ukrainska-mova-za-profesiinym-spriamuvanniam-anotatsiia-09b3ca31.pdf",
            "format": "PDF",
            "sha256": "09b3ca31653bdd8a808c1ceb18f279b6056f04fec269e2f81e8e7de084e8a467"
          },
          {
            "title": "Філософія · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/mandatory-annotations/filosofiia-anotatsiia-349f2ef2.pdf",
            "format": "PDF",
            "sha256": "349f2ef209a8ec62361014d9461e7085fee4566063c78c0a4d179309892d51e4"
          }
        ]
      },
      {
        "id": "elective-annotations",
        "title": "Анотації · вибіркові дисципліни",
        "collapsed": true,
        "files": [
          {
            "title": "HR-менеджмент · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/hr-menedzhment-anotatsiia-de11a362.pdf",
            "format": "PDF",
            "sha256": "de11a362f0c3d274253ec7c2209c58647d0655d51b7b2bc0d7acdbca906853de"
          },
          {
            "title": "Євроінтеграційні процеси · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/ievrointehratsiini-protsesy-anotatsiia-01a29435.pdf",
            "format": "PDF",
            "sha256": "01a29435d02662321ea1bf4084bf980d7c061fe6ca3ec990360b1c7ff8553b94"
          },
          {
            "title": "Іміджелогія (етика, діловий етикет, риторика, основи самопрезентації, корпоративна культура) · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/imidzhelohiia-etyka-dilovyi-etyket-rytoryka-osnovy-samoprezentatsii-korporatyvna-kult-f99ccbed.pdf",
            "format": "PDF",
            "sha256": "f99ccbedd97087786e0c5e8d86091a3c145bc94f7276897ae680b9ce4ef8debb"
          },
          {
            "title": "Інформаційна політика · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/informatsiina-polityka-anotatsiia-2526e355.pdf",
            "format": "PDF",
            "sha256": "2526e355a05d3b319f74128481b0b1845d62f91f5e9bb073588d992987781bc2"
          },
          {
            "title": "Бенчмаркінг в публічному управлінні · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/benchmarkinh-v-publichnomu-upravlinni-anotatsiia-1634e662.pdf",
            "format": "PDF",
            "sha256": "1634e66254a9a4aa02b61b6e14f8da0f922f125aea4b9796e7bef41321f8d65a"
          },
          {
            "title": "Глобалістика · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/hlobalistyka-anotatsiia-c07960f0.pdf",
            "format": "PDF",
            "sha256": "c07960f090f4dfdcbd7bccca96d100630de533b0800345e937a87db1e1dc507b"
          },
          {
            "title": "Децентралізація та розвиток місцевого самоврядування · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/detsentralizatsiia-ta-rozvytok-mistsevoho-samovriaduvannia-anotatsiia-02967e96.pdf",
            "format": "PDF",
            "sha256": "02967e96e4930a6e137ae6d00c488363d9c506b925a14246f445e23b642ffeec"
          },
          {
            "title": "Документознавство · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/dokumentoznavstvo-anotatsiia-d19a2fff.pdf",
            "format": "PDF",
            "sha256": "d19a2fffdfc5f82b107b3209352a6e455fc93e51adaffed225d7a9411ff5a21e"
          },
          {
            "title": "Доступ до публічної інформації · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/dostup-do-publichnoi-informatsii-anotatsiia-4b996997.pdf",
            "format": "PDF",
            "sha256": "4b996997bdea364c46d47cbae918d1992ca074d9a61bf37ad0be9541593b2fd1"
          },
          {
            "title": "Друга іноземна мова · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/druha-inozemna-mova-anotatsiia-1a31b8d7.pdf",
            "format": "PDF",
            "sha256": "1a31b8d7b8064302bd937ee6682bcdcb07ef3e133338592fbedd44ec91977e4f"
          },
          {
            "title": "Ділова іноземна мова · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/dilova-inozemna-mova-anotatsiia-60add3a6.pdf",
            "format": "PDF",
            "sha256": "60add3a65e15d29334a89039b6fd490f69a37c51e66bdfb0e136fdf93554a334"
          },
          {
            "title": "Конфліктологія · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/konfliktolohiia-anotatsiia-42356acd.pdf",
            "format": "PDF",
            "sha256": "42356acd1b0b22618164b8d61ef653479f91891ae8dbd40b115f162c198d97c8"
          },
          {
            "title": "Концептуальні засади реформ публічної сфери · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/kontseptualni-zasady-reform-publichnoi-sfery-anotatsiia-d456e60e.pdf",
            "format": "PDF",
            "sha256": "d456e60e7580285c48225e37110cf5da482cccbc4984e83b2a0389868fb907f1"
          },
          {
            "title": "Кібербезпека · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/kiberbezpeka-anotatsiia-9389e9b9.pdf",
            "format": "PDF",
            "sha256": "9389e9b901b4787d2ed74bda26d3097cd121aa7471d08466338c12a5d99c7ce1"
          },
          {
            "title": "Лідерство та керівництво · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/liderstvo-ta-kerivnytstvo-anotatsiia-cebb6083.pdf",
            "format": "PDF",
            "sha256": "cebb60836849e4221726c856100f5cba8675b70de96bbf24111193c1c9f59782"
          },
          {
            "title": "Муніципальне управління · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/munitsypalne-upravlinnia-anotatsiia-ae6a6209.pdf",
            "format": "PDF",
            "sha256": "ae6a620941a62f9ce6e9edf2165fa008a57a057851caa58512f76af5d27550b3"
          },
          {
            "title": "Ораторське мистецтво · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/oratorske-mystetstvo-anotatsiia-575d0964.pdf",
            "format": "PDF",
            "sha256": "575d09640747b1a34f5fc37d2c4129dc3c115c52ae8a3dccddee3138a47120b7"
          },
          {
            "title": "Організація кадрової роботи · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/orhanizatsiia-kadrovoi-roboty-anotatsiia-9b28cab2.pdf",
            "format": "PDF",
            "sha256": "9b28cab23f30edf7488390aa6f7fd97cd205dae4396f21a2f32fd99ed140ba9c"
          },
          {
            "title": "Основи державної політики та політичного розвитку · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/osnovy-derzhavnoi-polityky-ta-politychnoho-rozvytku-anotatsiia-ceb2d87e.pdf",
            "format": "PDF",
            "sha256": "ceb2d87e0bb3781e7d2591ab6f068e4b2f7eef003f305a10eb8d192d81b82758"
          },
          {
            "title": "Основи охорони праці · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/osnovy-okhorony-pratsi-anotatsiia-091a6c74.pdf",
            "format": "PDF",
            "sha256": "091a6c74e88295a2ce6343ebe5f1d08cfde0ddf89e53db83d8a01550d6c0125f"
          },
          {
            "title": "Основи становлення публічної служби в Україні · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/osnovy-stanovlennia-publichnoi-sluzhby-v-ukraini-anotatsiia-78325209.pdf",
            "format": "PDF",
            "sha256": "78325209730dbf1c245e8df6572ddf91d70249ff16d356580031a66344d8b204"
          },
          {
            "title": "Політичні інститути та процеси прийняття політичних рішень · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/politychni-instytuty-ta-protsesy-pryiniattia-politychnykh-rishen-anotatsiia-062a21b1.pdf",
            "format": "PDF",
            "sha256": "062a21b183b845e64d06b1177925f01e9cd03e51b5dd6d22fb9cbf22f1016931"
          },
          {
            "title": "Правове регулювання зайнятості населення · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/pravove-rehuliuvannia-zainiatosti-naselennia-anotatsiia-fb79c5e0.pdf",
            "format": "PDF",
            "sha256": "fb79c5e0c0e58e7a87feea3ae98c4ebc8331f010d7affd86c6472c9f79793b41"
          },
          {
            "title": "Складання адміністративно · ресурсних документів · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/skladannia-administratyvno-resursnykh-dokumentiv-anotatsiia-e7bef0ff.pdf",
            "format": "PDF",
            "sha256": "e7bef0ffc9c0b4a49498290df9897700f4b4aaf868d733eb13c7ce3e3b3277e7"
          },
          {
            "title": "Служба в органах місцевого самоврядування · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/sluzhba-v-orhanakh-mistsevoho-samovriaduvannia-anotatsiia-ccae14a7.pdf",
            "format": "PDF",
            "sha256": "ccae14a757e5792498c483e059bbb96594108b7b711d947b1bc2db09fbb395b0"
          },
          {
            "title": "Соціальна політика (соціальний захист, соціальний діалог, профспілки в громадському просторі) · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/sotsialna-polityka-sotsialnyi-zakhyst-sotsialnyi-dialoh-profspilky-v-hromadskomu-pros-26d2689e.pdf",
            "format": "PDF",
            "sha256": "26d2689ed1ea893abb8748263740318a884e9c29334f220a1ef07d6d6a6d2fe9"
          },
          {
            "title": "Соціальна психологія · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/sotsialna-psykholohiia-anotatsiia-fca26031.pdf",
            "format": "PDF",
            "sha256": "fca26031749e6c9b195c0f0658facdca00b51f9c26d2d88f4a4f7dadd22de3fd"
          },
          {
            "title": "Соціальний захист населення · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/sotsialnyi-zakhyst-naselennia-anotatsiia-728b7b96.pdf",
            "format": "PDF",
            "sha256": "728b7b96bbf6892d46bc116afea4619b418509deef950312a06e479c1eb2479c"
          },
          {
            "title": "Стратегічне планування розвитку територій · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/stratehichne-planuvannia-rozvytku-terytorii-anotatsiia-1fa239e0.pdf",
            "format": "PDF",
            "sha256": "1fa239e0b05673423acad1039c7f6acbe4dc4752d003c13f94d5be581ef0656c"
          },
          {
            "title": "Управління неурядовими організаціями · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/upravlinnia-neuriadovymy-orhanizatsiiamy-anotatsiia-097f4579.pdf",
            "format": "PDF",
            "sha256": "097f45796d01ef2344f854957bcee3ccf2d9c3ea202869b32c153bcd7d8a2de3"
          },
          {
            "title": "Управління персоналом та людськими ресурсами в публічних органах влади · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/upravlinnia-personalom-ta-liudskymy-resursamy-v-publichnykh-orhanakh-vlady-anotatsiia-8ff767ce.pdf",
            "format": "PDF",
            "sha256": "8ff767ced4742707438bbc93dcba1057eb47ca2a01fecf60d8ff2611620b7895"
          },
          {
            "title": "Управління соціальними конфліктами · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/upravlinnia-sotsialnymy-konfliktamy-anotatsiia-3fc230b7.pdf",
            "format": "PDF",
            "sha256": "3fc230b7dfd3680bad7d8ff1bd6edfa75c8ef556a1c2c3e5762313c2e75b49da"
          },
          {
            "title": "Управлінський консалтинг · Анотація",
            "href": "/documents/programmes/public-administration/bachelor/elective-annotations/upravlinskyi-konsaltynh-anotatsiia-0233a026.pdf",
            "format": "PDF",
            "sha256": "0233a026428eea3474365d68fdc217d903e283ca0b07d786157a205e86fafe90"
          }
        ]
      },
      {
        "id": "practice",
        "title": "Практична підготовка",
        "collapsed": false,
        "files": [
          {
            "title": "Бази практик ПУА",
            "href": "/documents/programmes/public-administration/practice-bases.pdf",
            "format": "PDF",
            "sha256": "940e0e23ae558d669ad6dfd41fd5115e8673793fa90b505564031025812ee582"
          },
          {
            "title": "Робоча програма \"виробнича практика\" 3 курс ПУА",
            "href": "/documents/programmes/public-administration/bachelor/practice/robocha-prohrama-vyrobnycha-praktyka-3-kurs-pua-6862cb68.pdf",
            "format": "PDF",
            "sha256": "6862cb68072e526eaf40fefceb6a172886d77f6dc86d89b4c20acb27631613a5"
          },
          {
            "title": "Робоча програма \"навчальна практика\" 2 курс ПУА",
            "href": "/documents/programmes/public-administration/bachelor/practice/robocha-prohrama-navchalna-praktyka-2-kurs-pua-7c4cf8d3.pdf",
            "format": "PDF",
            "sha256": "7c4cf8d354a35e00250dd86a0be53acf6f16954a0387955597276be408d10faf"
          },
          {
            "title": "Робоча програма \"переддипломна практика\" 4 курс ПУА",
            "href": "/documents/programmes/public-administration/bachelor/practice/robocha-prohrama-pereddyplomna-praktyka-4-kurs-pua-c8e81fcd.pdf",
            "format": "PDF",
            "sha256": "c8e81fcd8a48bda4ad002b33fb07bc46891d45d3522a0f99511a665d35192e71"
          }
        ]
      },
      {
        "id": "thesis",
        "title": "Бакалаврська (кваліфікаційна) робота",
        "collapsed": false,
        "files": [
          {
            "title": "Заява про вибір теми та керівника бакалаврської роботи",
            "href": "/documents/programmes/public-administration/bachelor/thesis/zaiava-vybir-temy-ta-kerivnyka-bak-276f8ee4.pdf",
            "format": "PDF",
            "sha256": "276f8ee470de5a8d6e7493c49fcc2fe75a21bd8b7574030b1f9cffda6a30c8fe"
          },
          {
            "title": "Методичні рекомендації до підготовки і написання бакалаврських робіт",
            "href": "/documents/programmes/public-administration/bachelor/thesis/metodychni-rekomendatsii-do-pidhotovky-i-napysannia-bakalavrskykh-robit-5f1226cc.pdf",
            "format": "PDF",
            "sha256": "5f1226ccce348c3b69daa317f2a2bcef0f8b25f985c4a73671f4ad55bd89ce2e"
          },
          {
            "title": "Теми бакалаврських робіт · 2026",
            "href": "/documents/programmes/public-administration/bachelor/thesis/temy-bak-robit-2026-27b9c22d.pdf",
            "format": "PDF",
            "sha256": "27b9c22def11bbc475b1e850debe1beb17f1a4febe33678bfc3a9587495ad8c2"
          }
        ]
      },
      {
        "id": "final-examination",
        "title": "Атестаційний екзамен",
        "collapsed": false,
        "files": [
          {
            "title": "Орієнтовний перелік питань до атестаційного екзамену",
            "href": "/documents/programmes/public-administration/bachelor/final-examination/oriientovnyi-perelik-pytan-do-atestatsiinoho-ekzamenu-pua-bak-7f89200f.pdf",
            "format": "PDF",
            "sha256": "7f89200f88680dc8e361f37b786ea57877371b8d33da8268d97385bf8eec5ca9"
          },
          {
            "title": "Програма атестаційного екзамену",
            "href": "/documents/programmes/public-administration/bachelor/final-examination/prohrama-atestatsiinoho-ekzamenu-pua-b237aa36.pdf",
            "format": "PDF",
            "sha256": "b237aa3625af951cc342496dfc8faa3d0c590d17f9a7145847cbcbce73e36be0"
          }
        ]
      },
      {
        "id": "coursework",
        "title": "Курсові роботи",
        "collapsed": true,
        "files": [
          {
            "title": "2 курс Публічні комунікації та звязки з громадськістю",
            "href": "/documents/programmes/public-administration/bachelor/coursework/2-kurs-publichni-komunikatsii-ta-zviazky-z-hromadskistiu-8a26070f.pdf",
            "format": "PDF",
            "sha256": "8a26070f2e72e711611537af9e18500e066ae753213fbc4ffbe378ffd9797fe2"
          },
          {
            "title": "3 курс Іновації в публічному управлінні 25-26",
            "href": "/documents/programmes/public-administration/bachelor/coursework/3-kurs-inovatsii-v-publichnomu-upravlinni-25-26-1fc9c3be.pdf",
            "format": "PDF",
            "sha256": "1fc9c3be8097c4bc7c4cf0e98728eb963df367b3beb3765081881f8d73e9d23d"
          },
          {
            "title": "3 курс Основи територіальної організації влади 25-26 н.р",
            "href": "/documents/programmes/public-administration/bachelor/coursework/3-kurs-osnovy-terytorialnoi-orhanizatsii-vlady-25-26-n-r-e3753fd2.pdf",
            "format": "PDF",
            "sha256": "e3753fd2fa21085e2ca777bdd9c29a2fe25207da0361ac777e203805308056a8"
          },
          {
            "title": "Методичні рекомендації до підготовки і написання курсових робіт БАК · ПУА",
            "href": "/documents/programmes/public-administration/bachelor/coursework/metodychni-rekomendatsii-do-pidhotovky-i-napysannia-kursovykh-robit-bak-pua-45b07e38.pdf",
            "format": "PDF",
            "sha256": "45b07e380db85bc156ed04300ef051e917c2ed50e2fc2b14559244d2beb419b9"
          },
          {
            "title": "Заява про вибір керівника курсової роботи",
            "href": "/documents/programmes/public-administration/bachelor/coursework/zaiava-vybir-kerivnyka-kursovoi-bak-1af406b5.pdf",
            "format": "PDF",
            "sha256": "1af406b5eea384aa2ccb660492d4fe317a461e48fe031302134205b6e4b564f1"
          }
        ]
      },
      {
        "id": "programme-discussion-records",
        "title": "Витяги засідань · обговорення ОПП",
        "collapsed": true,
        "files": [
          {
            "title": "07.03.2024 · Витяг №3 з протоколу № 10 · (обговорення ОП)",
            "href": "/documents/programmes/public-administration/bachelor/programme-discussion-records/07-03-2024-vytiah-3-z-protokolu-10-obhovorennia-op-453efd3f.pdf",
            "format": "PDF",
            "sha256": "453efd3ffedd830749da726e59988fbd7d7420e01cec4cb26edc6a61bb38c42d"
          },
          {
            "title": "07.03.2024 · Витяг №4 з протоколу № 10 (обговорення НП)",
            "href": "/documents/programmes/public-administration/bachelor/programme-discussion-records/07-03-2024-vytiah-4-z-protokolu-10-obhovorennia-np-d48b658d.pdf",
            "format": "PDF",
            "sha256": "d48b658d0e514c79619bfd869b62d308ad824f44c6f7f94ba2b98c0a2ae78784"
          },
          {
            "title": "18.04.2023 · Витяг №1 з протоколу № 9 · (обговорення ОП)",
            "href": "/documents/programmes/public-administration/bachelor/programme-discussion-records/18-04-2023-vytiah-1-z-protokolu-9-obhovorennia-op-887a09d5.pdf",
            "format": "PDF",
            "sha256": "887a09d5c7c7f22ad1ae62df51ec74d0897c12fd4157b8aab7867b8f033adf14"
          },
          {
            "title": "19.05.2025 · Витяг · № 1 з протоколу №8 · (обговорення ОП)",
            "href": "/documents/programmes/public-administration/bachelor/programme-discussion-records/19-05-2025-vytiah-1-z-protokolu-8-obhovorennia-op-c26b249d.pdf",
            "format": "PDF",
            "sha256": "c26b249d3de3171edcac73b78a07dc6c968bd403dc2f0ac4346b166ed7c4701a"
          }
        ]
      },
      {
        "id": "student-survey-records",
        "title": "Витяги засідань · анкетування здобувачів",
        "collapsed": true,
        "files": [
          {
            "title": "07.03.2024 · Витяг №1 з протоколу № 10 · (анкетування БАК)",
            "href": "/documents/programmes/public-administration/bachelor/student-survey-records/07-03-2024-vytiah-1-z-protokolu-10-anketuvannia-bak-17554859.pdf",
            "format": "PDF",
            "sha256": "17554859301d6a702b58c22dcac4360a2034c93023627ea914f3bd3a1a076926"
          },
          {
            "title": "16.03.2023 · Витяг №2 з протоколу № 7 · (анкетування Бак)",
            "href": "/documents/programmes/public-administration/bachelor/student-survey-records/16-03-2023-vytiah-2-z-protokolu-7-anketuvannia-bak-742d3c9c.pdf",
            "format": "PDF",
            "sha256": "742d3c9c4b3ea980b300b310bea3c5c1d6be757351c9882433132ec961bf38fe"
          },
          {
            "title": "24.04.2026 · Витяг №3 з протоколу № 8 · (анкетування Бак)",
            "href": "/documents/programmes/public-administration/bachelor/student-survey-records/24-04-2026-vytiah-3-z-protokolu-8-anketuvannia-bak-a47e179c.pdf",
            "format": "PDF",
            "sha256": "a47e179c0161c46122a3f6bc1187da3685714f885dbde809eb60e39a1067ca3d"
          },
          {
            "title": "25.04.2025 · Витяг №1 з протоколу № 8 · (анкетування Бак)",
            "href": "/documents/programmes/public-administration/bachelor/student-survey-records/25-04-2025-vytiah-1-z-protokolu-8-anketuvannia-bak-e02a9f37.pdf",
            "format": "PDF",
            "sha256": "e02a9f374fa08bb31a5b1635598c6ac8aa5cc28fd17d274d4099d74514fee4b6"
          },
          {
            "title": "31.08.2023 · Витяг №2 з протоколу № 12 (анкетування БАК)",
            "href": "/documents/programmes/public-administration/bachelor/student-survey-records/31-08-2023-vytiah-2-z-protokolu-12-anketuvannia-bak-24f72c84.pdf",
            "format": "PDF",
            "sha256": "24f72c849389e7975587352d8d012a11308eff4a1cc72a7523acce81161595be"
          }
        ]
      },
      {
        "id": "archive-2024",
        "title": "Архів · 2024–2025 · програма, навчальні плани та рецензії",
        "collapsed": true,
        "files": [
          {
            "title": "Навчальний план · денна форма · 2024–2025",
            "href": "/documents/programmes/public-administration/bachelor/archive-2024/np-pua-bak-denna-2024-24aa84ac.pdf",
            "format": "PDF",
            "sha256": "24aa84ace8e96ad8fd1325c185e5659f8bf3dae23831fcdacc92aad378824d02"
          },
          {
            "title": "Навчальний план · заочна форма · 2024–2025",
            "href": "/documents/programmes/public-administration/bachelor/archive-2024/np-pua-bak-zaochna-2024-286f5475.pdf",
            "format": "PDF",
            "sha256": "286f547500c6e141737a993f22b0f77ee9af78b16f9cb8c7d6b319407bba859b"
          },
          {
            "title": "Освітньо-професійна програма · 2024–2025",
            "href": "/documents/programmes/public-administration/bachelor/archive-2024/opp-281-pua-bakalavry-2024-efafeeb2.pdf",
            "format": "PDF",
            "sha256": "efafeeb2a45a4d5ba02188bb1d853ffa45145389d371b8b14471d6412bc35260"
          },
          {
            "title": "Рецензія ОПП БАК Василишин",
            "href": "/documents/programmes/public-administration/bachelor/archive-2024/retsenziia-opp-bak-vasylyshyn-91977585.pdf",
            "format": "PDF",
            "sha256": "919775855e53ec0c31c0a2cdef704c15d811a80e482901245af8dabd3698987a"
          },
          {
            "title": "Рецензія ОПП БАК Давиденко",
            "href": "/documents/programmes/public-administration/bachelor/archive-2024/retsenziia-opp-bak-davydenko-eb525494.pdf",
            "format": "PDF",
            "sha256": "eb525494c3fa7c4e5fe1c00db744b1cb3e3702ea7c25adb8de95001a4e531e20"
          },
          {
            "title": "Рецензія ОПП БАК Дегтярьова",
            "href": "/documents/programmes/public-administration/bachelor/archive-2024/retsenziia-opp-bak-dehtiarova-a55812b4.pdf",
            "format": "PDF",
            "sha256": "a55812b4402bf32f8067d3a8dfba3affc9683095e15c0d2a2375f7efa9aeed53"
          },
          {
            "title": "Рецензія ОПП БАК Дзюрах",
            "href": "/documents/programmes/public-administration/bachelor/archive-2024/retsenziia-opp-bak-dziurakh-516df67d.pdf",
            "format": "PDF",
            "sha256": "516df67dc0dc292e75a4cdd2acd45984f7e21f8383f3a70d929721f58c1d6335"
          },
          {
            "title": "Рецензія ОПП БАК Килиба",
            "href": "/documents/programmes/public-administration/bachelor/archive-2024/retsenziia-opp-bak-kylyba-3d2a1b97.pdf",
            "format": "PDF",
            "sha256": "3d2a1b97b9e7f7b5379a7ceea16085b89556efcefae58b32cfc4c938059f95c5"
          },
          {
            "title": "Рецензія ОПП БАК Масик",
            "href": "/documents/programmes/public-administration/bachelor/archive-2024/retsenziia-opp-bak-masyk-d1cbe88d.pdf",
            "format": "PDF",
            "sha256": "d1cbe88de342c28deed90c59fa6ad5312f3bc9754d4c30c476f614554f50077b"
          },
          {
            "title": "Рецензія на ОПП БАК Семенюк",
            "href": "/documents/programmes/public-administration/bachelor/archive-2024/retsenziia-na-opp-bak-semeniuk-53320f69.pdf",
            "format": "PDF",
            "sha256": "53320f697c5e459c5a17e497d605967fc9f25aec387f94888059edb0b17f9d23"
          },
          {
            "title": "Рецензія на ОПП БАК Хвостіков",
            "href": "/documents/programmes/public-administration/bachelor/archive-2024/retsenziia-na-opp-bak-khvostikov-85522d2c.pdf",
            "format": "PDF",
            "sha256": "85522d2c80afc68746e83bf03da74833795795bd7704fe3c718045ab8af8d647"
          }
        ]
      },
      {
        "id": "archive-2023",
        "title": "Архів · 2023–2024 · програма та навчальні плани",
        "collapsed": true,
        "files": [
          {
            "title": "Навчальний план · денна форма · 2023–2024",
            "href": "/documents/programmes/public-administration/bachelor/archive-2023/np-pua-bak-denna-2023-396e2055.pdf",
            "format": "PDF",
            "sha256": "396e20557c6be4e17a2edaeebe3ca11cddb95d349ad5ced64b650397e3e85d3e"
          },
          {
            "title": "Навчальний план · заочна форма · 2023–2024",
            "href": "/documents/programmes/public-administration/bachelor/archive-2023/np-pua-bak-zaochna-2023-6339fe5d.pdf",
            "format": "PDF",
            "sha256": "6339fe5dd85c19ac2372a3a946601c5a62405cc89042126797a20fe7fced99d1"
          },
          {
            "title": "Освітньо-професійна програма · 2023–2024",
            "href": "/documents/programmes/public-administration/bachelor/archive-2023/opp-281-pua-bakalavry-2023-02c07914.pdf",
            "format": "PDF",
            "sha256": "02c07914df72c84411aa75f678fe924099857e5a6c4f9c6dea9bb7c1554e5308"
          }
        ]
      },
      {
        "id": "drafts",
        "title": "Проєкти ОПП · 2023, 2024, 2025",
        "collapsed": true,
        "files": [
          {
            "title": "Проєкт освітньо-професійної програми · 2023",
            "href": "/documents/programmes/public-administration/bachelor/drafts/proiekt-opp-281-pua-bakalavry-2023-d2f2b8db.pdf",
            "format": "PDF",
            "sha256": "d2f2b8db29882b85ffa7ddc25cea96af63416230ce8d61dcb60f16b35c4790f4"
          },
          {
            "title": "Проєкт освітньо-професійної програми · 2024",
            "href": "/documents/programmes/public-administration/bachelor/drafts/proiekt-opp-281-pua-bakalavry-2024-4a36f5c1.pdf",
            "format": "PDF",
            "sha256": "4a36f5c147598d328211307ccf7dac8c11a22e80002ea6a1a9f25fa50c43975a"
          },
          {
            "title": "Проєкт освітньо-професійної програми · 2025",
            "href": "/documents/programmes/public-administration/bachelor/drafts/proiekt-opp-d4-pua-bakalavry-2025-2386f48b.pdf",
            "format": "PDF",
            "sha256": "2386f48b6835bf65bb4bd699a7459f7cefd6f1261b46b66a61c3ac690c745984"
          }
        ]
      }
    ]
  }
];

export function getPublicAdministrationPublication(id: string) {
  return publicAdministrationPublications.find(programme => programme.id === id);
}
