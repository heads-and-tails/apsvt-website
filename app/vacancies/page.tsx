import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getPublicContent } from "@/lib/content";
import { academicCompetitionDocument, academicCompetitionDeadline } from "@/lib/academic-competition";

export const metadata: Metadata = {
  title: "Вакансії та конкурси",
  description:
    "Конкурс на заміщення посад науково-педагогічних працівників Академії праці, соціальних відносин і туризму.",
};
export const dynamic = "force-dynamic";

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

type VacancyFaculty = {
  name: string;
  departments: { name: string; roles: { title: string; count: number }[] }[];
};

function groupVacancies(items: Awaited<ReturnType<typeof getPublicContent>>): VacancyFaculty[] {
  const grouped = new Map<string, Map<string, { title: string; count: number }[]>>();
  for (const item of items) {
    const faculty = item.payload.faculty?.trim();
    const department = item.payload.department?.trim();
    const title = item.payload.title?.trim();
    if (!faculty || !department || !title) continue;
    if (!grouped.has(faculty)) grouped.set(faculty, new Map());
    const departments = grouped.get(faculty)!;
    if (!departments.has(department)) departments.set(department, []);
    departments.get(department)!.push({ title, count: Math.max(1, Number(item.payload.count) || 1) });
  }
  return [...grouped].map(([name, departments]) => ({
    name,
    departments: [...departments].map(([department, roles]) => ({ name: department, roles })),
  }));
}

export default async function VacanciesPage() {
  const vacancyItems = await getPublicContent("vacancy");
  const currentCompetitionItems = vacancyItems.filter((item) => item.payload.competition === "2-3");
  const previousCompetitionItems = vacancyItems.filter((item) => item.payload.competition !== "2-3");
  const currentVacancies = groupVacancies(currentCompetitionItems);
  const previousVacancies = groupVacancies(previousCompetitionItems);
  const departmentCount = currentVacancies.reduce((total, faculty) => total + faculty.departments.length, 0);
  const positionCount = currentVacancies.reduce((total, faculty) => total + faculty.departments.reduce((sum, department) => sum + department.roles.reduce((roleSum, role) => roleSum + role.count, 0), 0), 0);
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
                Академія оголосила конкурс №2 і №3 на заміщення посад
                науково-педагогічних працівників. Оберіть підрозділ, перевірте
                перелік документів і подайте заяву до 16 вересня.
              </p>
              <div className="vacancies-hero-actions">
                <a href="#competition-2-3">Переглянути посади ↓</a>
                <a
                  href={academicCompetitionDocument}
                  download
                >
                  Завантажити оголошення ↗
                </a>
              </div>
            </div>

            <aside aria-label="Коротко про конкурс">
              <span>У конкурсному оголошенні</span>
              <b>{positionCount}</b>
              <strong>відкритих посад</strong>
              <dl>
                <div>
                  <dt>Період подання</dt>
                  <dd>До {academicCompetitionDeadline} включно</dd>
                </div>
                <div>
                  <dt>Напрями</dt>
                  <dd>Мови · гуманітарні науки · психологія</dd>
                </div>
                <div>
                  <dt>Підрозділи</dt>
                  <dd>{departmentCount} кафедри</dd>
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

      <section className="vacancy-board" id="competition-2-3">
        <div className="wrap">
          <header className="vacancy-board-head">
            <div>
              <span>01 / Конкурс №2 і №3</span>
              <h2>Актуальні позиції</h2>
            </div>
            <p>
              18 штатних посад у трьох підрозділах. Заяви та документи
              приймаються особисто до 16 вересня 2026 року включно.
            </p>
          </header>

          {currentVacancies.map((faculty, facultyIndex) => (
            <section className="vacancy-faculty" key={faculty.name}>
              <header>
                <span>{String(facultyIndex + 1).padStart(2, "0")}</span>
                <h3>{faculty.name}</h3>
                <b>{faculty.departments.length} {faculty.departments.length === 1 ? "кафедра" : faculty.departments.length < 5 ? "кафедри" : "кафедр"}</b>
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

          <div className="vacancy-archive" id="previous-competition">
            <div>
              <span>Попереднє оголошення</span>
              <h2>Конкурс від 21 липня 2026 року</h2>
              <p>Посади юридичного факультету та факультету економіки, соціальних технологій і туризму. Період подання заяв: 21 липня — 24 серпня 2026 року.</p>
            </div>
            <a href="/documents/vacancies/konkurs-naukovo-pedagogichnyh-pracivnykiv-2025-2026.docx" download>Завантажити попереднє оголошення ↗</a>
          </div>
          <details className="vacancy-previous-list">
            <summary>Переглянути посади попереднього конкурсу <span>+</span></summary>
            {previousVacancies.map((faculty, facultyIndex) => (
              <section className="vacancy-faculty" key={faculty.name}>
                <header>
                  <span>{String(facultyIndex + 1).padStart(2, "0")}</span>
                  <h3>{faculty.name}</h3>
                  <b>{faculty.departments.length} {faculty.departments.length === 1 ? "кафедра" : faculty.departments.length < 5 ? "кафедри" : "кафедр"}</b>
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
                            <span><b>{role.count}</b>{role.count === 1 ? " посада" : role.count < 5 ? " посади" : " посад"}</span>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </details>
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
              Документи за конкурсом №2 і №3 приймаються до 16 вересня 2026 року включно.
              Заяви приймає навчально-методичний відділ: м. Київ,
              вул. Кільцева дорога, 3-А, кабінет №216 або №227.
            </p>
            <small>Академія житлом не забезпечує.</small>
          </div>
          <div className="vacancy-submit-actions">
            <Link href="/contacts">Контакти й маршрут →</Link>
            <a
              href={academicCompetitionDocument}
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
