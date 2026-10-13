const qualificationSchedules = [
  {
    year: "2026",
    href: "/documents/marketing/methodical/qualification-master-2026.pdf",
    title: "Графік підготовки та захисту кваліфікаційних робіт за ОПП “Маркетинг” для здобувачів другого (магістерського) рівня вищої освіти набору 2026 року",
  },
  {
    year: "2025",
    href: "/documents/marketing/methodical/qualification-master-2025.pdf",
    title: "Графік підготовки та захисту кваліфікаційних робіт за ОПП “Маркетинг” для здобувачів другого (магістерського) рівня вищої освіти набору 2025 року",
  },
] as const;

export function MarketingMethodicalFolders() {
  return <div className="marketing-methodical-folders">
    <details className="marketing-methodical-folder">
      <summary><span>01</span><strong>Кваліфікаційні роботи</strong><b aria-hidden="true">+</b></summary>
      <div className="marketing-methodical-folder-body">
        <details className="marketing-methodical-subfolder">
          <summary><span>Другий рівень вищої освіти</span><strong>Магістратура</strong><b aria-hidden="true">+</b></summary>
          <div className="marketing-methodical-file-list">
            {qualificationSchedules.map((schedule) => <a href={schedule.href} target="_blank" rel="noreferrer" key={schedule.year}>
              <span>{schedule.year}</span><strong>{schedule.title}</strong><b>PDF ↗</b>
            </a>)}
          </div>
        </details>
      </div>
    </details>
    <details className="marketing-methodical-folder">
      <summary><span>02</span><strong>Графік консультацій викладачів</strong><b aria-hidden="true">+</b></summary>
      <div className="marketing-methodical-file-list">
        <a href="/documents/marketing/methodical/teacher-consultations-2026-2027.pdf" target="_blank" rel="noreferrer">
          <span>2026–2027</span><strong>Графік індивідуальних консультацій викладачів кафедри маркетингу</strong><b>PDF ↗</b>
        </a>
      </div>
    </details>
  </div>;
}
