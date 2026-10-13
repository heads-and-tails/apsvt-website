import Link from "next/link";

const discussionNews = [
  { date: "12 березня 2026", href: "/news/obhovorennia-opp-marketynh-12-bereznia-2026" },
  { date: "17 травня 2026", href: "/news/obhovorennia-opp-marketynh-17-travnia-2026" },
] as const;

function MasterDiscussion() {
  return <>
    <article className="marketing-stakeholder-call" id="marketing-stakeholder-call">
      <small>Опитування щодо удосконалення ОПП</small>
      <h3>Шановні стейкхолдери!</h3>
      <p>Кафедра маркетингу Академії праці, соціальних відносин і туризму запрошує роботодавців, представників професійної та академічної спільноти, здобувачів вищої освіти, випускників та інших заінтересованих осіб долучитися до обговорення та удосконалення освітньо-професійної програми «Маркетинг» другого (магістерського) рівня вищої освіти за спеціальністю D5 «Маркетинг».</p>
      <p>Для кафедри важливо враховувати думку стейкхолдерів щодо актуальності змісту освітньої програми, її відповідності сучасним тенденціям розвитку маркетингової науки і практики, потребам ринку праці, цифровим трансформаціям та вимогам до професійних компетентностей сучасного фахівця з маркетингу.</p>
      <p>Просимо Вас долучитися до опитування одним зі зручних способів: відповісти на запитання Google-форми; або заповнити анкету та надіслати її на електронну адресу кафедри: <a href="mailto:academi.marketing2023@gmail.com">academi.marketing2023@gmail.com</a>. Ваші оцінки, зауваження та пропозиції будуть розглянуті проєктною (робочою) групою ОПП «Маркетинг» та використані під час моніторингу, перегляду й подальшого удосконалення освітньої програми.</p>
      <p>Особливо цінними для нас є Ваші пропозиції щодо актуальних професійних компетентностей, змісту освітніх компонентів, практичної підготовки здобувачів, використання сучасних цифрових технологій та інструментів, а також перспективних напрямів розвитку маркетингу.</p>
      <p>Щиро дякуємо за співпрацю та внесок у підвищення якості підготовки майбутніх фахівців з маркетингу!</p>
      <footer><strong>Надія Писаренко</strong><span>завідувач кафедри маркетингу · +380 99 961 05 97 · <a href="mailto:nadezda_pisarenko@ukr.net">nadezda_pisarenko@ukr.net</a></span></footer>
      <div className="marketing-form-pending"><b>Google-форма</b><span>Посилання буде додано одразу після створення форми в акаунті кафедри.</span></div>
    </article>
    <div className="marketing-programme-links">
      {discussionNews.map((item, index) => <Link href={item.href} key={item.href}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <div><small>Оголошення</small><strong>Обговорення ОПП «Маркетинг» · {item.date}</strong></div>
        <b>→</b>
      </Link>)}
    </div>
  </>;
}

function QualityLevel({master}:{master:boolean}) {
  return <details className="marketing-quality-level">
    <summary><span>{master ? "02" : "01"}</span><strong>{master ? "Магістратура" : "Бакалаврат"}</strong><b aria-hidden="true">+</b></summary>
    {master ? <div className="marketing-quality-level-body">
      <p>Звернення «Шановні стейкхолдери!» розміщено нижче в розділі «Обговорення змін до ОПП» без повторення тексту.</p>
      <div className="marketing-programme-links">
        <a href="/documents/marketing/stakeholders/anketa-stakeholderiv-mahistr-2026.pdf" target="_blank" rel="noreferrer"><span>01</span><div><small>Анкета · PDF</small><strong>Анкета для стейкхолдерів</strong></div><b>↗</b></a>
        <a href="/documents/marketing/stakeholders/propozytsii-stakeholderiv-mahistr-2026.pdf" target="_blank" rel="noreferrer"><span>02</span><div><small>Обговорення ОПП · PDF</small><strong>Таблиця пропозицій стейкхолдерів та результатів їх розгляду</strong></div><b>↗</b></a>
      </div>
    </div> : <p className="marketing-quality-empty">У цьому підрозділі матеріали ще не розміщено.</p>}
  </details>;
}

export function MarketingQuality() {
  return <section className="marketing-quality" id="quality"><div className="wrap">
    <header className="marketing-quality-head"><div className="idx">04 / Якість освіти</div><h2>Якість освіти</h2></header>
    <div className="marketing-quality-folders">
      <details className="marketing-quality-folder">
        <summary><span>01</span><strong>Результати моніторингу якості освіти</strong><b aria-hidden="true">+</b></summary>
        <div className="marketing-quality-folder-body"><QualityLevel master={false} /><QualityLevel master /></div>
      </details>
      <details className="marketing-quality-folder" id="marketing-quality-discussion">
        <summary><span>02</span><strong>Обговорення змін до ОПП</strong><b aria-hidden="true">+</b></summary>
        <div className="marketing-quality-folder-body">
          <details className="marketing-quality-level"><summary><span>01</span><strong>Бакалаврат</strong><b aria-hidden="true">+</b></summary><p className="marketing-quality-empty">У цьому підрозділі матеріали ще не розміщено.</p></details>
          <details className="marketing-quality-level"><summary><span>02</span><strong>Магістратура</strong><b aria-hidden="true">+</b></summary><div className="marketing-quality-level-body"><MasterDiscussion /></div></details>
        </div>
      </details>
    </div>
  </div></section>;
}
