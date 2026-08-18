type AcademicPageMapItem = {
  label: string;
  note: string;
  href: string;
};

export const programmePageMap: AcademicPageMapItem[] = [
  { label: "Спеціальність і програма", note: "код, зміст і результати навчання", href: "#overview" },
  { label: "Рівні освіти", note: "бакалаврат, магістратура або PhD", href: "#education-levels" },
  { label: "Освітня програма", note: "офіційні описи та редакції", href: "#programme-documents" },
  { label: "Навчальні плани", note: "компоненти, кредити й атестація", href: "#curriculum" },
  { label: "Робочі програми", note: "матеріали навчальних дисциплін", href: "#programme-documents" },
  { label: "Вибіркові дисципліни", note: "індивідуальна освітня траєкторія", href: "#electives" },
  { label: "Обговорення програми", note: "пропозиції та зміни до ОП", href: "#quality" },
  { label: "Склад кафедри", note: "викладачі, практики й профілі", href: "#team" },
  { label: "Наукова діяльність", note: "дослідження, гуртки та проєкти", href: "#science" },
  { label: "Партнери", note: "практика і професійне середовище", href: "#practice" },
  { label: "Новини кафедри", note: "події та актуальні матеріали", href: "#department-news" },
  { label: "Якість освіти", note: "опитування й рейтинги викладачів і студентів", href: "#quality" },
];

export function AcademicPageMap({
  kind,
  title = "Усе важливе — в одному порядку",
  items = programmePageMap,
}: {
  kind: string;
  title?: string;
  items?: AcademicPageMapItem[];
}) {
  return <section className="academic-page-map" aria-labelledby="academic-page-map-title">
    <div className="wrap">
      <header>
        <div>
          <div className="idx">Навігація / {kind}</div>
          <h2 id="academic-page-map-title">{title}</h2>
        </div>
        <p>Розділи розташовані у сталій логіці, щоб не шукати програму, документи, команду чи результати оцінювання по різних сторінках.</p>
      </header>
      <nav aria-label={`Розділи сторінки: ${kind}`}>
        {items.map((item, index) => <a href={item.href} key={`${item.label}-${item.href}`}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div><b>{item.label}</b><small>{item.note}</small></div>
          <i aria-hidden="true">↓</i>
        </a>)}
      </nav>
    </div>
  </section>;
}
