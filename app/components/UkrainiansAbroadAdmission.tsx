const documentGroups = [
  {
    number: "01",
    title: "Основні документи",
    items: [
      "Паспорт: ID-картка або закордонний паспорт",
      "Реєстраційний номер облікової картки платника податків (РНОКПП)",
      "Військово-обліковий документ — для військовозобов’язаних; електронний документ у «Резерв+» або скан паперового документа",
    ],
  },
  {
    number: "02",
    title: "Освітні документи",
    items: [
      "Свідоцтво про повну загальну середню освіту та додаток з оцінками",
      "Сертифікат НМТ 2026 або результати 2023–2025 років — якщо їх приймають чинні Правила для обраної конкурсної пропозиції",
      "Для іноземного атестата: результати національних іспитів країни навчання та документ про визнання освіти в Україні",
    ],
  },
  {
    number: "03",
    title: "За особливої підстави",
    items: [
      "Мотиваційний лист — окремо до кожної заяви",
      "Посвідчення закордонного українця — якщо вступаєте за цією категорією",
      "Документи, що підтверджують право на пільгу або спеціальну квоту",
    ],
  },
  {
    number: "04",
    title: "Додатково",
    items: [
      "Кольорова цифрова фотокартка 3 × 4 см",
      "Медична довідка — лише для окремих спеціальностей після уточнення у Приймальній комісії",
      "Оригінали або належно засвідчені копії документів — на етапі зарахування",
    ],
  },
];

type UkrainiansAbroadAdmissionProps = {
  index: string;
};

export function UkrainiansAbroadAdmission({ index }: UkrainiansAbroadAdmissionProps) {
  return <section className="ukrainians-abroad" id="ukrainians-abroad"><div className="wrap">
    <header className="ukrainians-abroad-head">
      <div><div className="idx">{index} / Українцям за кордоном</div><h2>Вступайте<br />дистанційно</h2></div>
      <div><p>Якщо ви перебуваєте за межами України, основний маршрут вступу до АПСВТ можна пройти онлайн — від подання документів до підтвердження вибору.</p><span>Алгоритм вступу · 2026</span></div>
    </header>

    <div className="ukrainians-abroad-route" aria-label="Дистанційний маршрут вступу">
      <article><span>01</span><div><small>Подання</small><h3>Створіть електронний кабінет</h3><p>Заповніть дані вступника, додайте конкурсні пропозиції АПСВТ і завантажте скановані копії документів.</p></div></article>
      <article><span>02</span><div><small>Перевірка</small><h3>Підготуйте повний пакет</h3><p>Перелік залежить від рівня освіти, документа про освіту та наявності спеціальних умов участі.</p></div></article>
      <article><span>03</span><div><small>Зарахування</small><h3>Підпишіть заяву онлайн</h3><p>Заяву про зарахування можна підписати дистанційно за допомогою «Дія.Підпис».</p></div></article>
    </div>

    <div className="ukrainians-abroad-docs">
      {documentGroups.map((group) => <article key={group.number}>
        <header><span>{group.number}</span><h3>{group.title}</h3></header>
        <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
      </article>)}
    </div>

    <div className="ukrainians-abroad-note">
      <div><small>Зверніть увагу</small><h3>Перевірте персональний перелік перед поданням</h3><p>Вимоги можуть уточнюватися чинними Правилами прийому та залежать від вашої освітньої траєкторії. Власники посвідчення закордонного українця можуть мати право на спеціальні умови, якщо вони передбачені у 2026 році.</p></div>
      <nav aria-label="Корисні посилання для вступника за кордоном">
        <a href="https://cabinet.edbo.gov.ua/" target="_blank" rel="noreferrer"><small>Офіційна подача</small><b>Електронний кабінет вступника ↗</b></a>
        <a href="https://vste.sk/economic-and-business-ethics.html" target="_blank" rel="noreferrer"><small>Партнерська можливість</small><b>Economic and Business Ethics ↗</b></a>
        <a href="mailto:inz@socosvita.kiev.ua"><small>Допомога АПСВТ</small><b>inz@socosvita.kiev.ua</b></a>
      </nav>
    </div>
  </div></section>;
}
