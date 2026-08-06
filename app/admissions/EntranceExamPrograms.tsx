import {
  bachelorEntranceExamPrograms,
  bachelorSupplementalProgram,
  phdEntranceExamPrograms,
  type EntranceExamProgram,
} from "@/lib/entrance-exam-programs";

function ProgramDocument({ document, index }: { document: EntranceExamProgram; index: number }) {
  const content = <>
    <span>{String(index + 1).padStart(2, "0")}</span>
    <div><small>{document.meta}</small><h4>{document.title}</h4></div>
    <div className="exam-program-action">
      <small>{document.href ? `PDF · ${document.pages} стор.` : "Матеріал очікується"}</small>
      <b>{document.href ? "Відкрити ↗" : "Незабаром"}</b>
    </div>
  </>;

  return document.href
    ? <a href={document.href} target="_blank" rel="noreferrer">{content}</a>
    : <div className="pending">{content}</div>;
}

export function EntranceExamPrograms() {
  return <section className="exam-programs" id="entrance-programs"><div className="wrap">
    <div className="exam-programs-head">
      <div><div className="idx">06 / Підготовка до вступу</div><h2>Програми вступних<br />випробувань</h2></div>
      <aside><span>2026</span><b>18</b><p>офіційних програм уже доступні для перегляду</p></aside>
    </div>

    <nav className="exam-program-level-nav" aria-label="Програми вступних випробувань за рівнями освіти">
      <a href="#programs-bachelor"><span>01</span><b>Бакалаврат</b><small>Предметні програми</small></a>
      <a href="#programs-master"><span>02</span><b>Магістратура</b><small>Окремий підрозділ</small></a>
      <a href="#programs-phd"><span>03</span><b>Доктор філософії</b><small>Фахові та мовні програми</small></a>
    </nav>

    <article className="exam-program-level" id="programs-bachelor">
      <header><span>01 / Бакалаврат</span><div><h3>Предметні програми для вступників</h3><p>Оберіть предмет і відкрийте затверджену програму співбесіди у форматі PDF.</p></div></header>
      <div className="exam-program-documents">
        {bachelorEntranceExamPrograms.map((document, index) => <ProgramDocument document={document} index={index} key={document.title} />)}
      </div>
      <div className="exam-program-supplement">
        <span>Додатково</span><div><small>{bachelorSupplementalProgram.meta}</small><h4>{bachelorSupplementalProgram.title}</h4></div>
        <a href={bachelorSupplementalProgram.href} target="_blank" rel="noreferrer">PDF · {bachelorSupplementalProgram.pages} стор. ↗</a>
      </div>
    </article>

    <article className="exam-program-level" id="programs-master">
      <header><span>02 / Магістратура</span><div><h3>Програми вступних випробувань</h3><p>Підрозділ підготовлено для фахових програм магістерського рівня.</p></div></header>
      <div className="exam-program-empty"><span>М</span><div><b>Документи готуються до публікації</b><p>Затверджені програми з’являться тут окремими файлами.</p></div></div>
    </article>

    <article className="exam-program-level" id="programs-phd">
      <header><span>03 / Доктор філософії</span><div><h3>Фахові випробування, мови та методологія</h3><p>Програми за спеціальностями, мовні співбесіди й методологія наукових досліджень для вступу до аспірантури.</p></div></header>
      <div className="exam-program-documents phd">
        {phdEntranceExamPrograms.map((document, index) => <ProgramDocument document={document} index={index} key={document.title} />)}
      </div>
    </article>
  </div></section>;
}
