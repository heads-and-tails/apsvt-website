import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getPublicContent } from "@/lib/content";
import { academicCompetitionDocument, deanCompetitionDeadline, deanCompetitionDocument } from "@/lib/academic-competition";

export const metadata: Metadata = {
  title: "Вакансії та конкурси",
  description:
    "Конкурс на заміщення посад науково-педагогічних працівників Академії праці, соціальних відносин і туризму.",
};
export const dynamic = "force-dynamic";

const qualificationRequirements = [
  "Вища освіта відповідного напряму підготовки (магістр або спеціаліст).",
  "Науковий ступінь доктора наук або доктора філософії (кандидата наук).",
  "Вчене звання професора або доцента.",
  "Науково-педагогічний стаж не менше 5 років.",
  "Досконале володіння українською мовою.",
];

const requiredDocuments = [
  "Заява про участь у конкурсі на ім’я ректора Академії.",
  "Паспорт громадянина України та засвідчена відповідно до чинного законодавства копія.",
  "Заповнений особовий листок з обліку кадрів.",
  "Дві фотокартки розміром 4 × 6 см.",
  "Документи про повну вищу освіту, науковий ступінь і вчене звання та їхні засвідчені копії.",
  "Документи, які підтверджують володіння державною мовою відповідно до вимог законодавства.",
  "Довідка з основного місця роботи для осіб, які не є працівниками Академії (за наявності).",
  "Відомості про науково-педагогічний стаж у закладах вищої освіти.",
  "Досягнення у професійній діяльності за останні п’ять років, зокрема список наукових праць та винаходів.",
  "Копії документів про стажування та підвищення кваліфікації за останні п’ять років.",
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
  const previousVacancies = groupVacancies(vacancyItems.filter((item) => item.payload.competition === "2-3"));
  return (
    <main id="top">
      <SiteHeader />

      <section className="vacancies-hero">
        <div className="wrap">
          <div className="crumb">Головна / Вакансії та конкурси</div>
          <div className="vacancies-hero-grid">
            <div>
              <span className="vacancies-kicker">Конкурс на заміщення посади</span>
              <h1>Шукаємо<br /><em>декана</em></h1>
              <p>
                Академія оголосила конкурс на посаду декана факультету психології та
                соціального розвитку. Документи приймаються до {deanCompetitionDeadline} включно.
              </p>
              <div className="vacancies-hero-actions">
                <a href="#competition-dean-2026">Переглянути посаду ↓</a>
                <a
                  href={deanCompetitionDocument}
                  download
                >
                  Завантажити оголошення ↗
                </a>
              </div>
            </div>

            <aside aria-label="Коротко про конкурс">
              <span>У конкурсному оголошенні</span>
              <b>1</b>
              <strong>відкрита посада</strong>
              <dl>
                <div>
                  <dt>Період подання</dt>
                  <dd>До {deanCompetitionDeadline} включно</dd>
                </div>
                <div>
                  <dt>Напрями</dt>
                  <dd>Психологія та соціальний розвиток</dd>
                </div>
                <div>
                  <dt>Підрозділ</dt>
                  <dd>Факультет психології та соціального розвитку</dd>
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

      <section className="vacancy-board" id="competition-dean-2026">
        <div className="wrap">
          <header className="vacancy-board-head">
            <div>
              <span>01 / Конкурс №3</span>
              <h2>Актуальна посада</h2>
            </div>
            <p>
              Одна штатна посада декана факультету психології та соціального розвитку.
              Заяви та документи приймаються особисто до {deanCompetitionDeadline} включно.
            </p>
          </header>
          <section className="vacancy-faculty">
            <header>
              <span>01</span>
              <h3>Факультет психології та соціального розвитку</h3>
              <b>1 посада</b>
            </header>
            <div className="vacancy-departments">
              <article className="vacancy-department">
                <div className="vacancy-department-title"><span>01</span><h4>Декан факультету</h4></div>
                <div className="vacancy-roles"><div className="vacancy-role"><strong>Декан факультету</strong><span><b>1</b> посада</span></div></div>
              </article>
            </div>
          </section>

          <div className="vacancy-archive" id="competition-2-3">
            <div>
              <span>Попереднє оголошення</span>
              <h2>Конкурс №2 і №3</h2>
              <p>Попередній конкурс на 18 посад кафедри української та іноземних мов і гуманітарних наук і факультету психології та соціального розвитку. Подання заяв завершилося 16 вересня 2026 року.</p>
            </div>
            <a href={academicCompetitionDocument} download>Завантажити попереднє оголошення ↗</a>
          </div>
          <details className="vacancy-previous-list" id="previous-competition">
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
          <div className="vacancy-archive">
            <div>
              <span>Архів</span>
              <h2>Конкурс від 21 липня 2026 року</h2>
              <p>Посади юридичного факультету та факультету економіки, соціальних технологій і туризму. Період подання заяв: 21 липня — 24 серпня 2026 року.</p>
            </div>
            <a href="/documents/vacancies/konkurs-naukovo-pedagogichnyh-pracivnykiv-2025-2026.docx" download>Завантажити оголошення ↗</a>
          </div>
        </div>
      </section>

      <section className="vacancy-apply">
        <div className="wrap">
          <header className="vacancy-apply-head">
            <div>
              <span>02 / Вимоги та документи</span>
              <h2>Умови участі</h2>
            </div>
            <p>
              Вимоги до посади та перелік документів наведено в оголошенні,
              надісланому Академією. Оригінал доступний для завантаження.
            </p>
          </header>

          <div className="vacancy-checklists">
            <article>
              <span>Посада декана</span>
              <h3>Кваліфікаційні вимоги</h3>
              <ol>
                {qualificationRequirements.map((item, index) => (
                  <li key={item}>
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </article>
            <article>
              <span>Для претендентів</span>
              <h3>Документи для участі</h3>
              <ol>
                {requiredDocuments.map((item, index) => (
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
              Документи на посаду декана факультету психології та соціального розвитку
              приймаються до {deanCompetitionDeadline} включно.
              Заяви приймає навчально-методичний відділ: м. Київ,
              вул. Кільцева дорога, 3-А, кабінет №216 або №227.
            </p>
            <small>Академія житлом не забезпечує.</small>
          </div>
          <div className="vacancy-submit-actions">
            <Link href="/contacts">Контакти й маршрут →</Link>
            <a
              href={deanCompetitionDocument}
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
