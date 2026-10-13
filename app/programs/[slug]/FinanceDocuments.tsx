const documentBase = "/documents/programmes/finance";

const bachelorPlans = [
  { course: "1 курс", files: [{ label: "Денна форма · 2026", file: "bachelor-fulltime-2026.pdf" }], pending: "Заочна форма · 2026 — документ готується" },
  { course: "2 курс", files: [{ label: "Денна форма · 2025", file: "bachelor-fulltime-2025.pdf" }, { label: "Заочна форма · 2025", file: "bachelor-parttime-2025.pdf" }] },
  { course: "3 курс", files: [{ label: "Денна форма · 2024", file: "bachelor-fulltime-2024.pdf" }, { label: "Заочна форма · 2024", file: "bachelor-parttime-2024.pdf" }] },
  { course: "4 курс", files: [{ label: "Заочна форма · 2023", file: "bachelor-parttime-2023.pdf" }], pending: "Денна форма · 2023 — документ готується" },
];

export function FinanceBachelorDocuments() {
  return <section className="finance-plan-documents" aria-labelledby="finance-bachelor-documents-title">
    <div className="curriculum-block-heading">
      <div><span>02 / Освітня програма · Навчальні плани</span><h3 id="finance-bachelor-documents-title">Документи бакалаврату</h3></div>
      <p>Відкрийте потрібний курс, щоб переглянути навчальні плани за формою навчання. Можна відкрити кілька курсів одночасно.</p>
    </div>
    <p className="finance-plan-pending">Освітня програма бакалавра готується до оприлюднення кафедрою.</p>
    <div className="finance-plan-course-list">
      {bachelorPlans.map(({ course, files, pending }, index) => <details key={course}>
        <summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{course}</strong><small>{files.length} {files.length === 1 ? "документ" : "документи"}</small><b aria-hidden="true">+</b></summary>
        <div className="finance-plan-course-files">
          {files.map(({ label, file }) => <a href={`${documentBase}/${file}`} target="_blank" rel="noreferrer" key={file}>{label}<span>PDF ↗</span></a>)}
          {pending && <p>{pending}</p>}
        </div>
      </details>)}
    </div>
  </section>;
}

export function FinanceMasterDocuments() {
  return <section className="finance-plan-documents" aria-labelledby="finance-master-documents-title">
    <div className="curriculum-block-heading">
      <div><span>01 / Освітня програма · Навчальні плани</span><h3 id="finance-master-documents-title">Документи магістратури</h3></div>
      <p>Освітня програма та навчальні плани, надіслані кафедрою фінансів.</p>
    </div>
    <div className="finance-plan-course-files finance-master-document-links">
      <a href={`${documentBase}/master-programme-2025.pdf`} target="_blank" rel="noreferrer">Освітньо-професійна програма магістра · 2025 <span>PDF ↗</span></a>
    </div>
    <div className="finance-plan-course-list">
      <details><summary><span>01</span><strong>1 курс</strong><small>2 документи</small><b aria-hidden="true">+</b></summary>
        <div className="finance-plan-course-files">
          <a href={`${documentBase}/master-fulltime-2025.pdf`} target="_blank" rel="noreferrer">Денна форма · 2025 <span>PDF ↗</span></a>
          <a href={`${documentBase}/master-parttime-2025.pdf`} target="_blank" rel="noreferrer">Заочна форма · 2025 <span>PDF ↗</span></a>
        </div>
      </details>
      <details><summary><span>02</span><strong>2 курс</strong><small>1 документ</small><b aria-hidden="true">+</b></summary>
        <div className="finance-plan-course-files">
          <a href={`${documentBase}/master-parttime-2025.pdf`} target="_blank" rel="noreferrer">Заочна форма · 2025 <span>PDF ↗</span></a>
        </div>
      </details>
    </div>
  </section>;
}
