import { FinanceMasterDocuments } from "./FinanceDocuments";

const requiredCourses = [
  ["Фінансовий менеджмент", "1–2 семестр"],
  ["Ринок фінансових послуг", "1 семестр"],
  ["Мікро- та макропруденційне регулювання банківської діяльності", "2 семестр"],
  ["Інвестиційний менеджмент", "3 семестр"],
  ["Податковий менеджмент", "1 семестр"],
  ["Аналіз фінансових ринків", "1 семестр"],
  ["Проєктне фінансування", "1 семестр"],
  ["Управління ефективністю розвитку підприємства", "1 семестр"],
  ["Страховий менеджмент", "2 семестр"],
];

const electiveGroups = [
  { title: "Бізнес-стратегії та фінансове планування", courses: ["Стратегії продажів", "Продакт менеджмент", "Прогнозування та планування бюджету"] },
  { title: "Проєктне та грантове фінансування", courses: ["Проектно-кошторисні розрахунки", "Грантове фінансування", "Фінанси некомерційних організацій"] },
  { title: "Управління ризиками та фінансова безпека", courses: ["Ризик менеджмент", "Фінансовий моніторинг", "FinTech: етика та ризики"] },
  { title: "Фінансові технології, моделі та аналітика", courses: ["Розробка моделей та аналіз даних на Python", "Фінансова математика", "Актуарні розрахунки", "Технології блокчейн у фінансах"] },
  { title: "Державні фінанси та макроекономіка", courses: ["Управління державним боргом", "Макроекономічний аналіз і монетарна політика", "Бюджетний менеджмент"] },
];

export function FinanceMasterProgramme() {
  return <section className="finance-master-programme" id="finance-master"><div className="wrap">
    <header className="law-curriculum-head"><div><div className="idx">Магістр / структура програми</div><h2>Магістерська траєкторія</h2></div><p>Магістерська програма спрямована на формування системних компетентностей у сфері управління фінансами, функціонування фінансових ринків, інвестиційної та страхової діяльності, оподаткування й регулювання банківського сектору.</p></header>
    <div className="law-curriculum-stats" aria-label="Структура магістерської програми у цифрах"><div><b>90</b><span>кредитів ЄКТС</span></div><div><b>1,5</b><span>року навчання</span></div><div><b>27</b><span>кредитів на вибір</span></div><div><b>3</b><span>етапи практики й атестації</span></div></div>
    <FinanceMasterDocuments />
    <div className="curriculum-block-heading"><div><span>02 / Обов’язкова частина</span><h3>Фахова фінансова підготовка</h3></div><p>Освітні компоненти, обов’язкові для всіх здобувачів магістерської програми.</p></div>
    <div className="law-curriculum-groups"><details><summary><span>01</span><div><small>Обов’язкові дисципліни</small><h3>Перелік і період навчання</h3></div><b>1–3 семестр</b><i>+</i></summary><div className="law-curriculum-table programme-curriculum-table"><div className="law-curriculum-table-head"><span>№</span><span>Освітній компонент</span><span>Період</span><span>Статус</span></div>{requiredCourses.map(([name, period], index) => <div className="law-curriculum-row programme-curriculum-row" key={name}><span>{String(index + 1).padStart(2, "0")}</span><b>{name}</b><strong>{period}</strong><small>обов’язкова</small></div>)}</div></details></div>
    <div className="law-curriculum-choice"><div className="law-curriculum-choice-intro"><div className="idx">03 / Дисципліни за вибором</div><h3>Вибіркові <em>дисципліни</em></h3><p>На індивідуальну траєкторію відведено <b>27 кредитів ЄКТС</b>. Перегляньте тематичні групи дисциплін.</p></div><div className="law-curriculum-track-list">{electiveGroups.map((group, index) => <article key={group.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h4>{group.title}</h4><ul>{group.courses.map((course) => <li key={course}>{course}</li>)}</ul></div></article>)}</div></div>
  </div></section>;
}
