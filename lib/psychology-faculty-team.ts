export type PsychologyFacultyMember = {
  name: string;
  role: string;
  summary: string;
  image: string;
  interests: string[];
  profiles?: { label: string; href: string }[];
  lead?: boolean;
};

export const psychologyFacultyTeam: PsychologyFacultyMember[] = [
  {
    name: "Наталія Балашова",
    role: "завідувачка кафедри, кандидатка економічних наук, доцентка",
    summary: "Координує академічну команду й розвиває культуру професійної соціальної роботи, у якій знання стають інструментом підтримки людини.",
    image: "/people/psychology-faculty/nataliia-balashova.png",
    interests: ["соціальна робота", "професійний розвиток", "академічна якість"],
    profiles: [{ label: "Google Scholar", href: "https://scholar.google.com/citations?hl=ru&user=evhGWMUAAAAJ" }],
    lead: true,
  },
  {
    name: "Людмила Бегеза",
    role: "докторка психологічних наук, професорка",
    summary: "Досліджує професійний розвиток особистості, психологію праці та підготовку кар’єрних радників.",
    image: "/people/psychology-faculty/liudmyla-beheza.jpg",
    interests: ["психологія праці", "кар’єрне консультування", "професійний розвиток"],
    profiles: [{ label: "Google Scholar", href: "https://scholar.google.com.ua/citations?user=8P5Oe1kAAAAJ&hl=ru" }],
  },
  {
    name: "Гліб Пріб",
    role: "доктор медичних наук, професор",
    summary: "Досліджує психічне здоров’я, медико-соціальну експертизу та психологічну реабілітацію; автор понад 200 наукових і методичних праць.",
    image: "/people/psychology-faculty/hlib-prib.jpg",
    interests: ["психічне здоров’я", "реабілітація", "медико-соціальна експертиза"],
    profiles: [{ label: "Google Scholar", href: "https://scholar.google.com.ua/citations?hl=ru&user=kLThYfwAAAAJ" }],
  },
  {
    name: "Катерина Мілютіна",
    role: "докторка психологічних наук, професорка",
    summary: "Поєднує клінічну психологію, психодіагностику, математичну статистику, психологію персоналу та наративну психотерапію.",
    image: "/people/psychology-faculty/kateryna-miliutina.png",
    interests: ["клінічна психологія", "психодіагностика", "наративна психотерапія"],
  },
  {
    name: "Олена Карагодіна",
    role: "докторка медичних наук, професорка",
    summary: "Працює з темами соціальної психіатрії, етики досліджень у сфері психічного здоров’я та психосоціальної допомоги вразливим групам.",
    image: "/people/psychology-faculty/olena-karahodina.png",
    interests: ["соціальна психіатрія", "етика досліджень", "психосоціальна допомога"],
    profiles: [{ label: "Google Scholar", href: "https://scholar.google.com.ua/citations?hl=ru&user=bet3y9gAAAAJ" }],
  },
  {
    name: "Ростислав Абдряхімов",
    role: "доктор медичних наук, професор",
    summary: "Розвиває комунікативні навички у клінічній і бізнес-психології, міжнародні дослідницькі проєкти та адаптацію освітніх стандартів до європейських критеріїв.",
    image: "/people/psychology-faculty/rostyslav-abdriakhimov.png",
    interests: ["клінічна комунікація", "бізнес-психологія", "міжнародні проєкти"],
  },
  {
    name: "Володимир Білоус",
    role: "кандидат медичних наук",
    summary: "Працює з діагностикою та корекцією психічних розладів, психологією стресу й травми, психосоматикою та сучасними методами психотерапії.",
    image: "/people/psychology-faculty/volodymyr-bilous.jpg",
    interests: ["ПТСР і резильєнтність", "психосоматика", "психотерапія"],
  },
  {
    name: "Світлана Бондар",
    role: "докторка філософії (PhD) зі спеціальності C4 «Психологія»",
    summary: "Поєднує психологічне консультування й тренінгові технології з організаційною, клінічною та військовою психологією, досліджує психічні й поведінкові розлади в умовах війни.",
    image: "/people/psychology-faculty/svitlana-bondar.png",
    interests: ["консультування", "організаційна психологія", "військова психологія"],
  },
  {
    name: "Олеся Борець",
    role: "докторка філософії (PhD) зі спеціальності C4 «Психологія»",
    summary: "Досліджує емоційний інтелект і життєстійкість, підтримку вразливих груп, групову динаміку та профілактику емоційного вигорання.",
    image: "/people/psychology-faculty/olesia-borets.png",
    interests: ["життєстійкість", "групова динаміка", "профілактика вигорання"],
  },
  {
    name: "Олена Морозова",
    role: "кандидатка психологічних наук",
    summary: "Працює з життєвими стратегіями подружжя, віктимною поведінкою та наративною експозиційною терапією; долучена до волонтерських психологічних проєктів.",
    image: "/people/psychology-faculty/olena-morozova.jpg",
    interests: ["сімейна психологія", "віктимна поведінка", "експозиційна терапія"],
  },
  {
    name: "Марія Житинська",
    role: "кандидатка педагогічних наук, доцентка",
    summary: "Розвиває навчання і дослідження у сферах соціальної роботи, геронтології, психології та інклюзії.",
    image: "/people/psychology-faculty/mariia-zhytynska.jpg",
    interests: ["соціальна робота", "геронтологія", "інклюзія"],
  },
  {
    name: "Валентин Тесленко",
    role: "доктор педагогічних наук, професор",
    summary: "Формує освітній простір, у якому педагогічна майстерність, науковий пошук і гуманістичні цінності підтримують професійний розвиток майбутніх фахівців.",
    image: "/people/psychology-faculty/valentyn-teslenko.jpg",
    interests: ["педагогічна майстерність", "освітнє середовище", "гуманістичні цінності"],
    profiles: [{ label: "Google Scholar", href: "https://scholar.google.com/citations?hl=ru&user=xY2AJ8wAAAAJ" }],
  },
  {
    name: "Наталія Серьогіна",
    role: "докторка наук з державного управління, професорка",
    summary: "Поєднує дослідження державного управління та соціальної політики з підготовкою рішень для підвищення якості життя суспільства.",
    image: "/people/psychology-faculty/nataliia-serohina.jpg",
    interests: ["державне управління", "соціальна політика", "якість життя"],
    profiles: [{ label: "Google Scholar", href: "https://scholar.google.com/citations?hl=ru&user=cqEwVQ8AAAAJ" }],
  },
  {
    name: "Микола Судаков",
    role: "кандидат соціологічних наук, доцент",
    summary: "Розвиває соціологічне мислення та дослідницьку культуру здобувачів для глибокого розуміння суспільних процесів і вирішення соціальних проблем.",
    image: "/people/psychology-faculty/mykola-sudakov.jpg",
    interests: ["соціологія", "дослідницька культура", "соціальні проблеми"],
    profiles: [{ label: "Google Scholar", href: "https://scholar.google.com/citations?hl=ru&user=uWIAVjgAAAAJ" }],
  },
  {
    name: "Альберт Пріб",
    role: "доцент, доктор філософії з підприємництва, торгівлі та біржової діяльності",
    summary: "Розвиває практичні компетентності, професійну етику й соціальну відповідальність майбутніх фахівців соціальної сфери.",
    image: "/people/psychology-faculty/albert-prib.jpg",
    interests: ["практичні компетентності", "професійна етика", "соціальна відповідальність"],
    profiles: [{ label: "ORCID", href: "https://orcid.org/0000-0002-0441-5532" }],
  },
];
