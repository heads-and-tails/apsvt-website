export type AcademicProfileLink = {
  label: string;
  href: string;
};

export type MarketingTeamMember = {
  name: string;
  role: string;
  image: string;
  summary: string;
  education: string;
  interests: string[];
  profiles: AcademicProfileLink[];
  lead?: boolean;
};

export const marketingTeam: MarketingTeamMember[] = [
  {
    name: "Надія Писаренко",
    role: "завідувачка кафедри маркетингу, кандидатка економічних наук, доцентка",
    image: "/people/marketing/nadiia-pysarenko.webp",
    summary: "Координує освітню, наукову й методичну роботу кафедри, модернізацію програм D5 «Маркетинг» та співпрацю з бізнесом і професійними спільнотами.",
    education: "Кандидатка економічних наук (2019), доцентка кафедри маркетингу (2025), магістр маркетингу АПСВТ.",
    interests: ["міжнародний маркетинг", "нейромаркетинг", "цифровий брендинг", "Big Data та ШІ в маркетингу"],
    profiles: [
      { label: "ORCID", href: "https://orcid.org/0000-0002-5851-1976" },
      { label: "Google Scholar", href: "https://scholar.google.com/citations?user=XPXWMO4AAAAJ" },
      { label: "Scopus", href: "https://www.scopus.com/authid/detail.uri?authorId=59773042700" },
      { label: "Web of Science", href: "https://www.webofscience.com/wos/author/record/KWC-1686-2024" },
    ],
    lead: true,
  },
  {
    name: "Олена Корчинська",
    role: "докторка економічних наук, професорка, старша наукова співробітниця",
    image: "/people/marketing/olena-korchynska.webp",
    summary: "Поєднує маркетингові й економічні дослідження з цифровою трансформацією, міжнародними освітніми програмами та підготовкою молодих науковців.",
    education: "Випускниця факультету кібернетики КНУ імені Тараса Шевченка; докторка економічних наук, професорка кафедри маркетингу.",
    interests: ["цифрова трансформація", "екологічний маркетинг", "сталий менеджмент", "економічне моделювання"],
    profiles: [
      { label: "ORCID", href: "https://orcid.org/0000-0003-2822-5634" },
      { label: "Google Scholar", href: "https://scholar.google.com/citations?user=xGmHaQIAAAAJ" },
      { label: "Scopus", href: "https://www.scopus.com/authid/detail.uri?authorId=57262405400" },
      { label: "Web of Science", href: "https://www.webofscience.com/wos/author/record/Q-3016-2016" },
    ],
  },
  {
    name: "Юлія Ярмоленко",
    role: "докторка економічних наук, професорка",
    image: "/people/marketing/yuliia-yarmolenko.webp",
    summary: "Досліджує управління, мотивацію та інвестиційні напрями, а також інтегрує лідерські й проєктні підходи у маркетингове управління.",
    education: "Магістр маркетингу АПСВТ; освіта у сфері управління суспільним розвитком.",
    interests: ["лідерство", "мотивація", "корпоративна соціальна відповідальність", "нейромаркетинг"],
    profiles: [],
  },
  {
    name: "Наталія Середа",
    role: "кандидатка економічних наук, доцентка",
    image: "/people/marketing/nataliia-sereda.webp",
    summary: "Розвиває практикоорієнтоване навчання, стратегічне й маркетингове управління та залучає студентів до дослідницьких проєктів.",
    education: "Кандидатка економічних наук, доцентка; фахова підготовка з менеджменту, авіаційного виробництва та маркетингу.",
    interests: ["стратегічне управління", "маркетингові стратегії", "сталий маркетинг", "логістичне управління"],
    profiles: [
      { label: "ORCID", href: "https://orcid.org/0000-0002-5639-0795" },
      { label: "Google Scholar", href: "https://scholar.google.com/citations?user=iv0mWEMAAAAJ" },
      { label: "Scopus", href: "https://www.scopus.com/authid/detail.uri?authorId=57223357148" },
      { label: "Web of Science", href: "https://www.webofscience.com/wos/author/record/AAL-2549-2021" },
    ],
  },
  {
    name: "Олена Бабічева",
    role: "кандидатка економічних наук, доцентка",
    image: "/people/marketing/olena-babicheva.webp",
    summary: "Формує у студентів навички дослідження ринку, маркетингової аналітики та обґрунтування стратегічних управлінських рішень.",
    education: "Кандидатка економічних наук, доцентка кафедри маркетингу; економістка-організаторка сільського господарства.",
    interests: ["стратегічний маркетинг", "міжнародний маркетинг", "маркетингова аналітика", "прогнозування ринку"],
    profiles: [
      { label: "ORCID", href: "https://orcid.org/0000-0003-3786-0226" },
      { label: "Google Scholar", href: "https://scholar.google.com/citations?user=tQQzUSNDvFAC" },
      { label: "Scopus", href: "https://www.scopus.com/authid/detail.uri?authorId=57261528900" },
    ],
  },
  {
    name: "Сергій Шолудченко",
    role: "кандидат економічних наук, доцент, декан факультету",
    image: "/people/marketing/serhii-sholudchenko.webp",
    summary: "Поєднує розвиток економічної освіти з практикою управління якістю, партнерствами з роботодавцями та сучасними моделями менеджменту.",
    education: "Кандидат економічних наук, доцент; декан факультету економіки, соціальних технологій та туризму.",
    interests: ["управління якістю", "стандарти ISO", "модель EFQM", "стратегічний розвиток підприємств"],
    profiles: [
      { label: "ORCID", href: "https://orcid.org/0000-0001-6247-1471" },
    ],
  },
  {
    name: "Ольга Базарна",
    role: "докторка філософії (PhD) з економіки, доцентка",
    image: "/people/marketing/olha-bazarna.webp",
    summary: "Інтегрує digital, Big Data, SMM і green marketing у навчання, розвиває міжнародні проєкти та зв’язок досліджень із потребами громад і бізнесу.",
    education: "Докторка філософії з економіки; освіта у сферах публічного управління, менеджменту та екології.",
    interests: ["зелений маркетинг", "маркетинг у соцмережах", "товарна політика", "сталий регіональний розвиток"],
    profiles: [
      { label: "ORCID", href: "https://orcid.org/0000-0001-9561-8687" },
      { label: "Web of Science", href: "https://www.webofscience.com/wos/author/record/MIO-8385-2025" },
    ],
  },
  {
    name: "Роберт Марков",
    role: "кандидат економічних наук, доцент",
    image: "/people/marketing/robert-markov.webp",
    summary: "Інтегрує реальні маркетингові кейси у навчання та досліджує комунікації й стратегії в умовах суспільних і безпекових викликів.",
    education: "Фахівець з міжнародної економіки та менеджменту; кандидат економічних наук.",
    interests: ["соціально відповідальний маркетинг", "маркетингові комунікації", "маркетингові стратегії", "маркетинг розподілення"],
    profiles: [
      { label: "ORCID", href: "https://orcid.org/0000-0001-9421-8083" },
    ],
  },
  {
    name: "Оксана Жук",
    role: "старша викладачка кафедри маркетингу",
    image: "/people/marketing/oksana-zhuk.webp",
    summary: "Поєднує теоретичну підготовку з прикладною маркетинговою аналітикою та підтримує студентські дослідження й публікації.",
    education: "Магістр економіки за спеціальністю «Облік і аудит», КНУ імені Тараса Шевченка.",
    interests: ["digital marketing", "поведінка споживача", "B2B та агромаркетинг", "соціальна відповідальність бізнесу"],
    profiles: [
      { label: "ORCID", href: "https://orcid.org/0000-0001-8290-1993" },
      { label: "Google Scholar", href: "https://scholar.google.com/citations?user=OBjeyVwAAAAJ" },
    ],
  },
  {
    name: "Євген Даниленко",
    role: "кандидат економічних наук, доцент",
    image: "/people/marketing/yevhen-danylenko.webp",
    summary: "Навчає студентів створювати вебсайти, рекламні матеріали й кампанії та працювати з цифровою аналітикою й інструментами онлайн-просування.",
    education: "Фахівець з маркетингу; кандидат економічних наук.",
    interests: ["цифровий маркетинг", "інтернет-реклама й аналітика", "електронна комерція", "штучний інтелект у маркетингу"],
    profiles: [
      { label: "ORCID", href: "https://orcid.org/0000-0001-8787-1105" },
      { label: "Google Scholar", href: "https://scholar.google.com/citations?user=t-bOknEAAAAJ" },
      { label: "Web of Science", href: "https://www.webofscience.com/wos/author/record/E-3751-2018" },
    ],
  },
];
