type GrantProject = {
  index: string;
  acronym: string;
  number: string;
  period: string;
  title: string;
  description: string;
  results: readonly string[];
  href?: string;
  action?: string;
};

const grantProjects: readonly GrantProject[] = [
  {
    index: "01",
    acronym: "GreenFinEDU",
    number: "101126681",
    period: "2023–2026",
    title: "Європейська зелена політика та сталі фінанси",
    description:
      "Адаптація випускників українських університетів до роботи на ринку праці в умовах переходу до сталої економіки.",
    results: [
      "60-годинний поглиблений онлайн-курс для бакалаврів і магістрів",
      "Базовий інтенсивний курс для аспірантів і студентів заочної форми",
      "Літня школа, вебінари та відкриті навчальні матеріали",
    ],
    href: "#greenfinedu",
    action: "Матеріали GreenFinEDU",
  },
  {
    index: "02",
    acronym: "ECONOMY4ALL",
    number: "101127204",
    period: "2023–2026",
    title: "Політика ЄС щодо соціальної економіки",
    description:
      "Зайнятість, соціальні питання та інклюзивне підприємництво у фокусі освітнього модуля Жан Моне.",
    results: [
      "50-годинний поглиблений курс для бакалаврів і магістрів",
      "Базовий онлайн-курс для аспірантів усіх спеціальностей",
      "Безоплатні курси й літня онлайн-школа у межах реалізації 2025 року",
    ],
  },
  {
    index: "03",
    acronym: "Jean Monnet",
    number: "575275-EPP-1-2016-1-UA-EPPJMO-MODULE",
    period: "2016–2019",
    title: "Фінансовий сектор ЄС як рушій сталого розвитку",
    description:
      "Європейська інтеграція, реформи та перспективи мережевої економіки — перший модуль Жан Моне Академії.",
    results: [
      "Авторський курс для денної та заочної форм навчання",
      "Дослідження сталих практик європейської банківської справи",
      "Підсумкова конференція: 146 учасників із 8 країн",
    ],
    href: "/materials/2022-9798424bb.html",
    action: "Результати досліджень",
  },
] as const;

const archivedResults = [
  {
    year: "2016",
    type: "Старт проєкту",
    title: "АПСВТ — серед переможців конкурсу Erasmus+ Жан Моне",
    description:
      "Архівне повідомлення про отримання гранту та початок створення авторського курсу з європейських студій.",
    href: "/materials/1815-f3476bd99.html",
    action: "Читати повідомлення",
  },
  {
    year: "2019",
    type: "Наукові результати",
    title: "Кращі сталі практики європейської банківської справи",
    description:
      "Збережений перелік статей, розділів монографій і матеріалів, підготовлених у межах модуля Жан Моне.",
    href: "/materials/2022-9798424bb.html",
    action: "Переглянути дослідження",
  },
  {
    year: "2019",
    type: "Підсумковий звіт",
    title: "Звітна міжнародна конференція про фінансовий сектор ЄС",
    description:
      "Підсумки реалізації проєкту, доповідь координаторки, програма та відомості про 146 учасників із восьми країн.",
    href: "/materials/conference-06-06-19-eacf33800.html",
    action: "Відкрити звітний матеріал",
  },
  {
    year: "2017/18",
    type: "Інституційний звіт",
    title: "Звіт з наукової роботи Академії",
    description:
      "Супровідний архівний звіт про дослідження, публікації та наукові заходи Академії у період реалізації гранту.",
    href: "/documents/archive/old-site/research-report-2017-2018.pdf",
    action: "Завантажити PDF",
  },
] as const;

export function GrantProjectsArchive() {
  return <section className="grant-projects-archive" id="grants"><div className="wrap">
    <div className="grant-projects-head">
      <div>
        <div className="idx">02.1 / Erasmus+ · архів проєктів</div>
        <h2>Гранти та<br />результати</h2>
      </div>
      <div>
        <p>Інформацію відновлено зі старої версії сайту Академії та впорядковано за проєктами. Тут зібрано мету грантів, етапи реалізації, освітні результати, дослідження й звітні матеріали.</p>
        <span>Архів охоплює 2016–2026 роки</span>
      </div>
    </div>

    <div className="grant-projects-facts" aria-label="Коротко про грантові проєкти">
      <div><b>3</b><span>модулі Жан Моне</span></div>
      <div><b>10</b><span>років проєктної історії</span></div>
      <div><b>146</b><span>учасників звітної конференції</span></div>
    </div>

    <div className="grant-projects-grid">
      {grantProjects.map((project) => <article key={project.number}>
        <div className="grant-project-top"><span>{project.index}</span><small>{project.period}</small></div>
        <p className="grant-project-programme">Erasmus+ · Jean Monnet Module</p>
        <h3>{project.acronym}</h3>
        <code>№ {project.number}</code>
        <h4>{project.title}</h4>
        <p>{project.description}</p>
        <ul>{project.results.map((result) => <li key={result}>{result}</li>)}</ul>
        {project.href ? <a href={project.href}>{project.action ?? "Відкрити матеріали"} <span aria-hidden="true">&#8599;</span></a> : <span className="grant-project-status">Матеріали реалізації збережено в архіві</span>}
      </article>)}
    </div>

    <div className="grant-results-head">
      <div><span>Збережено на сайті</span><h3>Звіти й результати</h3></div>
      <p>Кожен матеріал відкривається окремо. Архівні сторінки збережено у читабельному форматі, а науковий звіт доступний як PDF.</p>
    </div>
    <div className="grant-results-list">
      {archivedResults.map((result, index) => <a href={result.href} key={`${result.year}-${result.title}`} target={result.href.endsWith(".pdf") ? "_blank" : undefined} rel={result.href.endsWith(".pdf") ? "noreferrer" : undefined}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <time>{result.year}</time>
        <div><small>{result.type}</small><h4>{result.title}</h4><p>{result.description}</p></div>
        <b>{result.action} &#8599;</b>
      </a>)}
    </div>
    <p className="grant-archive-note">Інституційний науковий звіт подано як супровідне джерело за відповідний період; він не є окремим фінансовим звітом грантового проєкту.</p>
  </div></section>;
}
