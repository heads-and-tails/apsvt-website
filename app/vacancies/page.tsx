import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Вакансії та конкурси",
  description:
    "Конкурс на заміщення посад науково-педагогічних працівників Академії праці, соціальних відносин і туризму.",
};

const faculties = [
  {
    name: "Юридичний факультет",
    departments: [
      {
        name: "Кафедра цивільного, трудового та господарського права",
        roles: [{ title: "Доцент", count: 3 }],
      },
      {
        name: "Кафедра конституційного, адміністративного та фінансового права",
        roles: [
          { title: "Завідувач кафедри", count: 1 },
          { title: "Доцент", count: 2 },
        ],
      },
      {
        name: "Кафедра кримінального права, процесу та криміналістики",
        roles: [
          { title: "Професор", count: 1 },
          { title: "Доцент", count: 2 },
        ],
      },
    ],
  },
  {
    name: "Факультет економіки, соціальних технологій та туризму",
    departments: [
      {
        name: "Кафедра економіки підприємства та менеджменту",
        roles: [
          { title: "Доцент", count: 4 },
          { title: "Старший викладач", count: 1 },
          { title: "Викладач", count: 1 },
        ],
      },
      {
        name: "Кафедра фінансів",
        roles: [
          { title: "Завідувач кафедри", count: 1 },
          { title: "Доцент", count: 1 },
        ],
      },
      {
        name: "Кафедра маркетингу",
        roles: [{ title: "Доцент", count: 3 }],
      },
      {
        name: "Кафедра інтелектуальних систем та цифрових технологій",
        roles: [
          { title: "Професор", count: 1 },
          { title: "Доцент", count: 1 },
        ],
      },
      {
        name: "Кафедра психології",
        roles: [{ title: "Доцент", count: 2 }],
      },
      {
        name: "Кафедра соціально-трудових відносин та соціальної роботи",
        roles: [
          { title: "Завідувач кафедри", count: 1 },
          { title: "Доцент", count: 1 },
        ],
      },
    ],
  },
] as const;

const externalDocuments = [
  "Заява про участь у конкурсі на ім’я ректора Академії.",
  "Заповнений особовий листок з обліку кадрів.",
  "Дві фотокартки розміром 4 × 6 см.",
  "Засвідчені копії документів про повну вищу освіту, науковий ступінь, вчене звання та стажування.",
  "Засвідчена копія паспорта громадянина України.",
  "Довідка з основного місця роботи (за наявності) та відомості про науково-педагогічний стаж у закладах вищої освіти.",
  "Список наукових праць та винаходів за останні п’ять років.",
  "Інформація про підготовку науково-педагогічних кадрів.",
];

const internalDocuments = [
  "Заява про участь у конкурсі на ім’я ректора Академії.",
  "Список наукових праць та винаходів за останні п’ять років.",
  "Копія документа про стажування або звіт зі стажування протягом терміну попереднього контракту.",
  "Комплексний звіт визначеної форми про роботу протягом терміну попереднього контракту.",
];

export default function VacanciesPage() {
  return (
    <main id="top">
      <SiteHeader />

      <section className="vacancies-hero">
        <div className="wrap">
          <div className="crumb">Головна / Вакансії та конкурси</div>
          <div className="vacancies-hero-grid">
            <div>
              <span className="vacancies-kicker">Приєднуйтеся до команди АПСВТ</span>
              <h1>Шукаємо<br /><em>викладачів</em></h1>
              <p>
                Академія оголосила конкурс на заміщення посад
                науково-педагогічних працівників. Оберіть кафедру, перевірте
                перелік документів і порядок подання заяви.
              </p>
              <div className="vacancies-hero-actions">
                <a href="#positions">Переглянути посади ↓</a>
                <a
                  href="/documents/vacancies/konkurs-naukovo-pedagogichnyh-pracivnykiv-2025-2026.docx"
                  download
                >
                  Завантажити оголошення ↗
                </a>
              </div>
            </div>

            <aside aria-label="Коротко про конкурс">
              <span>У конкурсному оголошенні</span>
              <b>9</b>
              <strong>кафедр</strong>
              <dl>
                <div>
                  <dt>Напрями</dt>
                  <dd>Право · економіка · соціальні технології</dd>
                </div>
                <div>
                  <dt>Формат подання</dt>
                  <dd>Особисто до навчально-методичного відділу</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="vacancy-status">
        <div className="wrap">
          <span>Важливо</span>
          <div>
            <b>Термін, зазначений у наданому оголошенні: до 24.08.2025 включно.</b>
            <p>
              Перед поданням документів уточніть актуальність прийому заяв у
              навчально-методичному відділі Академії.
            </p>
          </div>
          <a href="mailto:info@socosvita.kiev.ua">Уточнити інформацію →</a>
        </div>
      </section>

      <section className="vacancy-board" id="positions">
        <div className="wrap">
          <header className="vacancy-board-head">
            <div>
              <span>01 / Відкриті позиції</span>
              <h2>Оберіть кафедру</h2>
            </div>
            <p>
              Посади та кількість штатних одиниць відтворено з наданого
              конкурсного оголошення. Для участі необхідно подати документи
              особисто.
            </p>
          </header>

          {faculties.map((faculty, facultyIndex) => (
            <section className="vacancy-faculty" key={faculty.name}>
              <header>
                <span>{String(facultyIndex + 1).padStart(2, "0")}</span>
                <h3>{faculty.name}</h3>
                <b>{faculty.departments.length} кафедр</b>
              </header>
              <div className="vacancy-departments">
                {faculty.departments.map((department, departmentIndex) => (
                  <article className="vacancy-department" key={department.name}>
                    <div className="vacancy-department-title">
                      <span>{String(departmentIndex + 1).padStart(2, "0")}</span>
                      <h4>{department.name}</h4>
                    </div>
                    <div className="vacancy-roles">
                      {department.roles.map((role) => (
                        <div className="vacancy-role" key={role.title}>
                          <strong>{role.title}</strong>
                          <span>
                            <b>{role.count}</b>
                            {role.count === 1 ? " посада" : role.count < 5 ? " посади" : " посад"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="vacancy-apply">
        <div className="wrap">
          <header className="vacancy-apply-head">
            <div>
              <span>02 / Документи</span>
              <h2>Як взяти участь</h2>
            </div>
            <p>
              Комплект залежить від того, чи працює кандидат в Академії.
              Підготуйте документи за відповідним переліком.
            </p>
          </header>

          <div className="vacancy-checklists">
            <article>
              <span>Зовнішнім кандидатам</span>
              <h3>Якщо ви не працюєте в Академії</h3>
              <ol>
                {externalDocuments.map((item, index) => (
                  <li key={item}>
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </article>
            <article>
              <span>Працівникам АПСВТ</span>
              <h3>Якщо ви вже працюєте в Академії</h3>
              <ol>
                {internalDocuments.map((item, index) => (
                  <li key={item}>
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </div>
      </section>

      <section className="vacancy-submit">
        <div className="wrap">
          <div>
            <span>03 / Подання заяви</span>
            <h2>Особисто в Академії</h2>
            <p>
              Заяви приймає навчально-методичний відділ: м. Київ,
              вул. Кільцева дорога, 3-А, кабінет №216 або №227.
            </p>
            <small>Академія житлом не забезпечує.</small>
          </div>
          <div className="vacancy-submit-actions">
            <Link href="/contacts">Контакти й маршрут →</Link>
            <a
              href="/documents/vacancies/konkurs-naukovo-pedagogichnyh-pracivnykiv-2025-2026.docx"
              download
            >
              Завантажити оригінал .DOCX ↗
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
