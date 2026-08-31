import Link from "next/link";

type ProgrammeLink = { code: string; name: string; href: string };
type Department = { title: string; description: string; href: string; programmes: ProgrammeLink[] };
type FacultyGroup = {
  code: string;
  title: string;
  description: string;
  href: string;
  departments: Department[];
};

const faculties: FacultyGroup[] = [
  {
    code: "ФЕСТТ",
    title: "Факультет економіки, соціальних технологій і туризму",
    description: "Економіка, управління, цифрові технології, туризм і гостинність.",
    href: "/departments/economics-social-tourism-faculty",
    departments: [
      { title: "Кафедра фінансів", description: "Фінансовий аналіз, банківська справа, страхування та сталі фінанси.", href: "/departments#finance", programmes: [{ code: "D2", name: "Фінанси", href: "/programs/finance" }] },
      { title: "Кафедра економіки підприємства та менеджменту", description: "Управління організаціями, підприємництво, торгівля й бізнес-аналітика.", href: "/departments#economics-management", programmes: [{ code: "D3", name: "Менеджмент", href: "/programs/management" }, { code: "D7", name: "Торгівля", href: "/programs/trade" }] },
      { title: "Кафедра маркетингу", description: "Ринкова аналітика, бренди, комунікації та digital.", href: "/departments#marketing", programmes: [{ code: "D5", name: "Маркетинг", href: "/programs/marketing" }] },
      { title: "Кафедра спеціальних туристичних дисциплін", description: "Туризм, гостинність, рекреація та створення туристичних продуктів.", href: "/departments#tourism", programmes: [] },
      { title: "Кафедра інтелектуальних систем та цифрових технологій", description: "Інформаційні системи та цифрові освітні технології.", href: "/departments#digital-technologies", programmes: [{ code: "A5", name: "Професійна освіта · PhD", href: "/programs#doctoral-programmes" }] },
      { title: "Кафедра енотехнологій і готельно-ресторанного сервісу", description: "Гостинність, сервіс та еногастрономічна культура.", href: "/departments#hospitality", programmes: [{ code: "Сервіс", name: "Готельно-ресторанний напрям", href: "/news/hospitality-management-lab" }] },
    ],
  },
  {
    code: "ЮФ",
    title: "Юридичний факультет",
    description: "Публічне, приватне й кримінальне право, публічне управління, юридична клініка та криміналістика.",
    href: "/departments/law-faculty",
    departments: [
      { title: "Кафедра конституційного, адміністративного та фінансового права", description: "Публічне, адміністративне, фінансове й муніципальне право.", href: "/departments#public-law", programmes: [{ code: "D8", name: "Право", href: "/programs/law" }] },
      { title: "Кафедра публічного управління та публічної служби", description: "Публічна політика, державна служба та управління громадами.", href: "/departments#public-administration", programmes: [{ code: "D4", name: "Публічне управління", href: "/programs/public-administration" }] },
      { title: "Кафедра цивільного, трудового та господарського права", description: "Приватне право, цивільний процес, трудові права й соціальний діалог.", href: "/departments/private-law", programmes: [{ code: "D8", name: "Право", href: "/programs/law" }] },
      { title: "Кафедра кримінального права, процесу та криміналістики", description: "Кримінальна юстиція, права людини та криміналістична практика.", href: "/departments/criminal-law", programmes: [{ code: "D8", name: "Право", href: "/programs/law" }] },
    ],
  },
  {
    code: "ФПСР",
    title: "Факультет психології та соціального розвитку",
    description: "Психічне здоров’я, психологічне благополуччя, соціальна підтримка та розвиток людини.",
    href: "/departments/psychology-social-development-faculty",
    departments: [
      { title: "Кафедра клінічної психології та психотерапії", description: "Психічне здоров’я, психологічне консультування, діагностика та психотерапевтичні підходи.", href: "/programs/psychology#department", programmes: [{ code: "C4", name: "Психологія · клінічна траєкторія", href: "/programs/psychology" }] },
      { title: "Кафедра психології бізнесу та управління", description: "Організаційна психологія, професійний розвиток, команди та управління змінами.", href: "/programs/psychology#department", programmes: [{ code: "C4", name: "Психологія бізнесу та управління", href: "/programs/psychology" }] },
      { title: "Кафедра соціально-трудових відносин та соціальної роботи", description: "Соціальна політика, підтримка людей і громад, консультування та реабілітація.", href: "/programs/social-work#department", programmes: [{ code: "I10", name: "Соціальна робота та консультування", href: "/programs/social-work" }] },
    ],
  },
  {
    code: "ЗАК",
    title: "Загальноакадемічна підготовка",
    description: "Мовні, гуманітарні та міжкультурні компетентності для студентів усіх спеціальностей.",
    href: "/departments/languages-humanities",
    departments: [
      { title: "Кафедра іноземних мов та гуманітарних дисциплін", description: "Професійні мови, критичне мислення та гуманітарна освіта.", href: "/departments/languages-humanities", programmes: [{ code: "Усі", name: "Освітні програми", href: "/programs" }] },
    ],
  },
];

const otherUnits = [
  { title: "Управління і якість", description: "Ректорат, Вчена рада та внутрішня система якості.", href: "/people" },
  { title: "Наука й аспірантура", description: "Дослідження, фахові видання, конференції та програми PhD.", href: "/research" },
  { title: "Міжнародна діяльність", description: "Erasmus+, подвійні дипломи та партнерські проєкти.", href: "/international" },
  { title: "Сервіси Академії", description: "Вступ, бібліотека, кампус, гуртожиток і студентська підтримка.", href: "/facilities" },
];

function departmentNoun(count: number) {
  const lastTwoDigits = count % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "кафедр";
  const lastDigit = count % 10;
  if (lastDigit === 1) return "кафедра";
  if (lastDigit >= 2 && lastDigit <= 4) return "кафедри";
  return "кафедр";
}

export function AcademyStructure() {
  const departmentCount = faculties.reduce((total, faculty) => total + faculty.departments.length, 0);

  return <section className="academy-structure" id="structure"><div className="wrap">
    <div className="academy-structure-head">
      <div><div className="idx">02 / Структура Академії</div><h2>Від Академії<br />до програми</h2></div>
      <p>Уся освітня структура на одній сторінці: спочатку факультет, у ньому кафедри, а в кожній кафедрі — прямі посилання на програми.</p>
    </div>

    <div className="structure-academy-root">
      <div className="structure-academy-logo"><img src="/brand/apsvt-official-logo.png" alt="Офіційна емблема АПСВТ" /></div>
      <div><small>Рівень 0 · Академія</small><h3>Академія праці, соціальних відносин і туризму</h3><p>Освітня, наукова та професійна спільнота у Києві з 1993 року.</p></div>
      <Link href="/about">Про Академію →</Link>
    </div>

    <div className="structure-levels" aria-label="Як читати структуру">
      <div><span>01</span><b>Факультет</b><small>об’єднує споріднені напрями</small></div><i>→</i>
      <div><span>02</span><b>Кафедра</b><small>відповідає за викладання і практику</small></div><i>→</i>
      <div><span>03</span><b>Програма</b><small>ваша освітня траєкторія</small></div>
    </div>

    <div className="structure-faculties">
      {faculties.map((faculty, facultyIndex) => <details key={faculty.code}>
        <summary>
          <span>{String(facultyIndex + 1).padStart(2, "0")}</span>
          <strong>{faculty.code}</strong>
          <div><small>Факультет / підрозділ</small><h3>{faculty.title}</h3><p>{faculty.description}</p></div>
          <b>{faculty.departments.length}<small> {departmentNoun(faculty.departments.length)}</small></b>
          <i aria-hidden="true">+</i>
        </summary>
        <div className="structure-faculty-body">
          <div className="structure-faculty-actions"><span>{faculty.departments.length} {departmentNoun(faculty.departments.length)} · прямі посилання на програми</span><Link href={faculty.href}>Сторінка факультету →</Link></div>
          <div className="structure-departments">
            {faculty.departments.map((department, departmentIndex) => <article key={department.title}>
              <span>{String(departmentIndex + 1).padStart(2, "0")}</span>
              <div><small>Кафедра</small><h4><Link href={department.href}>{department.title}</Link></h4><p>{department.description}</p>
                <nav aria-label={`Програми: ${department.title}`}>{department.programmes.map((programme) => <Link href={programme.href} key={`${department.title}-${programme.code}`}><b>{programme.code}</b><span>{programme.name}</span><i>↗</i></Link>)}</nav>
              </div>
            </article>)}
          </div>
        </div>
      </details>)}
    </div>

    <div className="structure-directory-link"><div><span>{departmentCount}</span><p>кафедр і навчальних осередків у повному каталозі</p></div><Link href="/departments">Відкрити каталог кафедр →</Link></div>

    <div className="structure-other"><div className="structure-other-head"><span>Інші частини Академії</span><p>Управління, наука, міжнародна робота та сервіси не заховані всередині факультетів.</p></div><div>{otherUnits.map((unit) => <Link href={unit.href} key={unit.title}><small>Підрозділ</small><h3>{unit.title}</h3><p>{unit.description}</p><b>→</b></Link>)}</div></div>
  </div></section>;
}
