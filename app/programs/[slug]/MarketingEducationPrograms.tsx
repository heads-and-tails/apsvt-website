import Link from "next/link";
import { ProgrammeCurriculumPlan } from "@/app/components/ProgrammeCurriculumPlan";

const programmeFolder = "https://drive.google.com/drive/folders/1dcgVBio_3E2kyrMCDS-neHA2SDEBT3pr?usp=drive_link";

const discussionNews = [
  { date: "12 березня 2026", href: "/news/obhovorennia-opp-marketynh-12-bereznia-2026" },
  { date: "17 травня 2026", href: "/news/obhovorennia-opp-marketynh-17-travnia-2026" },
] as const;

function DiscussionLinks() {
  return <div className="marketing-programme-links">
    {discussionNews.map((item, index) => <Link href={item.href} key={item.href}>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <div><small>Оголошення</small><strong>Обговорення ОПП «Маркетинг» · {item.date}</strong></div>
      <b>→</b>
    </Link>)}
  </div>;
}

export function MarketingEducationPrograms() {
  return <section className="marketing-programmes" id="curriculum">
    <div className="wrap">
      <header className="marketing-programmes-head">
        <div><div className="idx">03 / Освітні програми</div><h2>Оберіть рівень освіти</h2></div>
        <p>Матеріали бакалаврату й магістратури розділено. Відкрийте потрібний блок, щоб побачити тільки документи та оголошення цього рівня.</p>
      </header>

      <div className="marketing-programme-levels">
        <details>
          <summary><span>01</span><div><small>Перший рівень вищої освіти</small><strong>Бакалаврат</strong></div><b aria-hidden="true">+</b></summary>
          <div className="marketing-programme-body">
            <div className="marketing-programme-copy">
              <h3>ОПП «Маркетинг» · бакалавр</h3>
              <p>Офіційні матеріали освітньо-професійної програми спеціальності D5 «Маркетинг» першого (бакалаврського) рівня вищої освіти.</p>
            </div>
            <div className="marketing-programme-links">
              <a href="/documents/official-programmes/d5-marketing-bachelor.pdf" target="_blank" rel="noreferrer"><span>01</span><div><small>Офіційний документ · PDF</small><strong>ОПП D5 «Маркетинг» · бакалавр</strong></div><b>↗</b></a>
              <a href={programmeFolder} target="_blank" rel="noreferrer"><span>02</span><div><small>Матеріали кафедри</small><strong>Освітньо-професійна програма та матеріали до обговорення</strong></div><b>↗</b></a>
            </div>
            <DiscussionLinks />
            <ProgrammeCurriculumPlan slug="marketing" code="D5" title="Маркетинг" sectionId="marketing-bachelor-curriculum" />
          </div>
        </details>

        <details>
          <summary><span>02</span><div><small>Другий рівень вищої освіти</small><strong>Магістратура</strong></div><b aria-hidden="true">+</b></summary>
          <div className="marketing-programme-body">
            <div className="marketing-programme-copy">
              <h3>ОПП «Маркетинг» · магістр</h3>
              <p>Офіційні матеріали освітньо-професійної програми спеціальності D5 «Маркетинг» другого (магістерського) рівня вищої освіти.</p>
            </div>
            <div className="marketing-programme-links">
              <a href="/documents/official-programmes/d5-marketing-master.pdf" target="_blank" rel="noreferrer"><span>01</span><div><small>Офіційний документ · PDF</small><strong>ОПП D5 «Маркетинг» · магістр</strong></div><b>↗</b></a>
              <a href="/documents/marketing/stakeholders/propozytsii-stakeholderiv-mahistr-2026.pdf" target="_blank" rel="noreferrer"><span>02</span><div><small>Обговорення ОПП · PDF</small><strong>Таблиця пропозицій стейкхолдерів та результатів їх розгляду</strong></div><b>↗</b></a>
              <a href="/documents/marketing/stakeholders/anketa-stakeholderiv-mahistr-2026.pdf" target="_blank" rel="noreferrer"><span>03</span><div><small>Анкета · PDF</small><strong>Анкета для стейкхолдерів</strong></div><b>↗</b></a>
              <a href={programmeFolder} target="_blank" rel="noreferrer"><span>04</span><div><small>Матеріали кафедри</small><strong>Освітньо-професійна програма та матеріали до обговорення</strong></div><b>↗</b></a>
            </div>

            <article className="marketing-stakeholder-call">
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

            <DiscussionLinks />
          </div>
        </details>
      </div>
    </div>
  </section>;
}
