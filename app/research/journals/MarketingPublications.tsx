import Link from "next/link";

const publications = [
  {
    year: "2026",
    kind: "Навчальний посібник",
    title: "Соціально відповідальний маркетинг",
    authors:
      "Н. В. Писаренко, О. І. Бабічева, О. В. Базарна, Є. С. Даниленко, О. А. Корчинська, Р. Р. Марков, А. Ю. Пекін, Н. М. Середа, Ю. О. Ярмоленко",
    description:
      "Системне видання про етичні, стратегічні та прикладні засади соціально відповідального маркетингу, корпоративну відповідальність і цифровий моніторинг.",
    pages: "450 сторінок",
    cover:
      "/images/research/sotsialno-vidpovidalnyi-marketynh-2026-cover.jpg",
    href: "/documents/research/publications/sotsialno-vidpovidalnyi-marketynh-2026.pdf",
    doi: "https://doi.org/10.5281/zenodo.21918708",
  },
  {
    year: "2025",
    kind: "Колективна монографія",
    title:
      "Воєнний брендинг: формування іміджу армії та держави засобами цифрового маркетингу",
    authors:
      "Н. В. Писаренко, Ю. О. Ярмоленко, О. А. Корчинська, С. В. Шолудченко, О. І. Бабічева, О. В. Базарна, Є. С. Даниленко, Р. Р. Марков, В. Є. Гоцул",
    description:
      "Міждисциплінарне дослідження воєнного брендингу, стратегічних комунікацій, цифрових медіа та стійкості держави й суспільства.",
    pages: "355 сторінок",
    cover: "/images/research/voiennyi-brendynh-2025-cover.jpg",
    href: "/documents/research/publications/voiennyi-brendynh-tsyfrovyi-marketynh-2025.pdf",
    doi: "https://doi.org/10.5281/zenodo.17558747",
  },
  {
    year: "2025",
    kind: "Колективна монографія",
    title:
      "Вплив міжнародного маркетингу на економічну безпеку України в умовах цифрової економіки",
    authors:
      "Н. В. Писаренко, О. А. Корчинська, Ю. О. Ярмоленко, С. В. Шолудченко, О. І. Бабічева, О. В. Буткевич, Є. О. Стефанюк",
    description:
      "Дослідження викликів глобального цифрового середовища та маркетингових інструментів, що сприяють зміцненню економічної безпеки України.",
    pages: "313 сторінок",
    cover: "/images/research/mizhnarodnyi-marketynh-2025-cover.jpg",
    href: "/documents/research/publications/mizhnarodnyi-marketynh-ekonomichna-bezpeka-2025.pdf",
    doi: "https://doi.org/10.5281/zenodo.14913927",
  },
] as const;

const monographs = publications.filter(
  (publication) => publication.kind === "Колективна монографія",
);
const teachingPublications = publications.filter(
  (publication) => publication.kind === "Навчальний посібник",
);

const conferenceProceedings = [
  {
    year: "2026",
    edition: "III Міжнародна науково-практична конференція",
    date: "10 березня 2026 року",
    title:
      "Науковий вимір осмислення та пошуку шляхів розвитку України: маркетинговий, економічний, фінансовий, управлінський та правовий аспекти",
    description:
      "Міждисциплінарні дослідження актуальних викликів і стратегічних орієнтирів сталого розвитку України в умовах трансформаційних змін.",
    pages: "572 сторінки",
    isbn: "ISBN 978-966-654-907-7",
    doi: "https://doi.org/10.5281/zenodo.19821500",
    cover:
      "/images/research/conference-proceedings/marketing-conference-2026-cover.jpg",
    href: "/documents/research/conference-proceedings/marketing-conference-proceedings-2026.pdf",
  },
  {
    year: "2025",
    edition: "II Міжнародна науково-практична конференція",
    date: "19 березня 2025 року",
    title:
      "Науковий вимір осмислення та пошуку оптимальних моделей розвитку України: маркетинговий, економічний, фінансовий, управлінський та правовий аспекти",
    description:
      "Матеріали про маркетингові, економічні, фінансові, управлінські та правові моделі майбутнього розвитку України.",
    pages: "378 сторінок",
    isbn: "ISBN 978-617-8571-29-0",
    doi: "https://doi.org/10.5281/zenodo.15267086",
    cover:
      "/images/research/conference-proceedings/marketing-conference-2025-cover.jpg",
    href: "/documents/research/conference-proceedings/marketing-conference-proceedings-2025.pdf",
  },
  {
    year: "2024",
    edition: "Міжнародна науково-практична конференція",
    date: "4–5 березня 2024 року",
    title:
      "Науковий вимір осмислення та пошуку оптимальних моделей розвитку України: маркетинговий, економічний, фінансовий та управлінський аспекти",
    description:
      "Збірник досліджень про конкурентоспроможність, економічну й фінансову безпеку, маркетинг і сучасні управлінські підходи.",
    pages: "325 сторінок",
    isbn: "ISBN 978-617-8171-53-7",
    doi: "https://doi.org/10.5281/zenodo.11222359",
    cover:
      "/images/research/conference-proceedings/marketing-conference-2024-cover.jpg",
    href: "/documents/research/conference-proceedings/marketing-conference-proceedings-2024.pdf",
  },
] as const;

function PublicationCards({
  items,
}: {
  items: typeof monographs | typeof teachingPublications;
}) {
  return (
    <div className="marketing-publications-grid">
      {items.map((publication) => (
        <article className="marketing-publication-card" key={publication.title}>
          <a
            className="marketing-publication-cover"
            href={publication.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Відкрити PDF: ${publication.title}`}
          >
            <img
              src={publication.cover}
              alt={`Обкладинка видання «${publication.title}»`}
            />
          </a>
          <div className="marketing-publication-body">
            <div className="marketing-publication-meta">
              <span>{publication.year}</span>
              <small>{publication.kind}</small>
            </div>
            <h3>{publication.title}</h3>
            <p className="marketing-publication-authors">{publication.authors}</p>
            <p>{publication.description}</p>
            <div className="marketing-publication-footer">
              <span>{publication.pages}</span>
              <div>
                <a href={publication.href} target="_blank" rel="noreferrer">
                  Відкрити PDF ↗
                </a>
                <a href={publication.doi} target="_blank" rel="noreferrer">
                  DOI ↗
                </a>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function MarketingPublications() {
  return (
    <section className="marketing-publications" id="marketing-publications">
      <div className="wrap">
        <div className="marketing-publications-head">
          <div>
            <div className="idx">01 / Видання кафедри</div>
            <h2>Наукові праці кафедри маркетингу</h2>
          </div>
          <p>
            Монографії, навчальний посібник і три повні збірники матеріалів
            конференцій кафедри. Усі шість видань доступні безпосередньо у PDF.
          </p>
        </div>

        <div className="marketing-publication-subhead">
          <span>01</span>
          <div>
            <h3>Монографії, підготовлені викладачами кафедри</h3>
            <p>Дві колективні наукові праці викладачів кафедри маркетингу.</p>
          </div>
        </div>
        <PublicationCards items={monographs} />

        <div className="marketing-publication-subhead">
          <span>02</span>
          <div>
            <h3>Навчальні видання кафедри</h3>
            <p>Посібник для студентів і викладачів із повним текстом у PDF.</p>
          </div>
        </div>
        <PublicationCards items={teachingPublications} />

        <div className="marketing-publication-subhead marketing-conference-subhead">
          <span>03</span>
          <div>
            <h3>Збірники матеріалів конференцій</h3>
            <p>
              Усі три випуски міжнародної конференції кафедри за 2024, 2025 і
              2026 роки.
            </p>
          </div>
        </div>
        <div className="marketing-conference-grid">
          {conferenceProceedings.map((publication) => (
            <article className="marketing-conference-card" key={publication.year}>
              <a
                className="marketing-conference-cover"
                href={publication.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Відкрити збірник за ${publication.year} рік`}
              >
                <img
                  src={publication.cover}
                  alt={`Титульна сторінка збірника конференції ${publication.year} року`}
                />
              </a>
              <div className="marketing-conference-body">
                <div className="marketing-publication-meta">
                  <span>{publication.year}</span>
                  <small>{publication.edition}</small>
                </div>
                <h3>{publication.title}</h3>
                <p>{publication.description}</p>
                <dl>
                  <div>
                    <dt>Дата</dt>
                    <dd>{publication.date}</dd>
                  </div>
                  <div>
                    <dt>Обсяг</dt>
                    <dd>{publication.pages}</dd>
                  </div>
                  <div>
                    <dt>Видання</dt>
                    <dd>{publication.isbn}</dd>
                  </div>
                </dl>
                <div className="marketing-publication-footer">
                  <span>Київ · АПСВТ</span>
                  <div>
                    <a href={publication.href} target="_blank" rel="noreferrer">
                      Відкрити PDF ↗
                    </a>
                    <a href={publication.doi} target="_blank" rel="noreferrer">
                      DOI ↗
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <Link className="marketing-department-link" href="/programs/marketing">
          Кафедра маркетингу →
        </Link>
      </div>
    </section>
  );
}
