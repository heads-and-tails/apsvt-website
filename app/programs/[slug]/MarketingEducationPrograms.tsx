import { ProgrammeCurriculumPlan } from "@/app/components/ProgrammeCurriculumPlan";

const programmeFolder = "https://drive.google.com/drive/folders/1dcgVBio_3E2kyrMCDS-neHA2SDEBT3pr?usp=drive_link";

export function MarketingEducationPrograms() {
  return <section className="marketing-programmes" id="curriculum">
    <div className="wrap">
      <header className="marketing-programmes-head">
        <div><div className="idx">03 / Освітні програми</div><h2>Оберіть рівень освіти</h2></div>
        <p>Матеріали бакалаврату й магістратури розділено. Відкрийте потрібний блок, щоб побачити документи цього рівня. Опитування та обговорення ОПП розміщено в окремому розділі «Якість освіти».</p>
      </header>

      <div className="marketing-programme-levels">
        <details>
          <summary><span>01</span><div><small>Перший рівень вищої освіти</small><strong>Бакалаврат</strong></div><b aria-hidden="true">+</b></summary>
          <div className="marketing-programme-body">
            <div className="marketing-programme-copy">
              <h3>ОПП «Маркетинг» · бакалавр</h3>
              <p>Офіційні матеріали освітньо-професійної програми спеціальності D5 «Маркетинг» першого (бакалаврського) рівня вищої освіти.</p>
            </div>
            <div className="marketing-programme-links">
              <a href="/documents/official-programmes/d5-marketing-bachelor.pdf" target="_blank" rel="noreferrer"><span>01</span><div><small>Офіційний документ · PDF</small><strong>ОПП D5 «Маркетинг» · бакалавр</strong></div><b>↗</b></a>
              <a href={programmeFolder} target="_blank" rel="noreferrer"><span>02</span><div><small>Матеріали кафедри</small><strong>Освітньо-професійна програма та матеріали до обговорення</strong></div><b>↗</b></a>
            </div>
            <ProgrammeCurriculumPlan slug="marketing" code="D5" title="Маркетинг" sectionId="marketing-bachelor-curriculum" />
          </div>
        </details>

        <details>
          <summary><span>02</span><div><small>Другий рівень вищої освіти</small><strong>Магістратура</strong></div><b aria-hidden="true">+</b></summary>
          <div className="marketing-programme-body">
            <div className="marketing-programme-copy">
              <h3>ОПП «Маркетинг» · магістр</h3>
              <p>Офіційні матеріали освітньо-професійної програми спеціальності D5 «Маркетинг» другого (магістерського) рівня вищої освіти.</p>
            </div>
            <div className="marketing-programme-links">
              <a href="/documents/marketing/programmes/opp-marketing-master-2026.pdf" target="_blank" rel="noreferrer"><span>01</span><div><small>Магістратура · 2026 · PDF</small><strong>Освітньо-професійна програма «Маркетинг» 2026 року</strong></div><b>↗</b></a>
              <a href="/documents/marketing/programmes/opp-marketing-master-2025.pdf" target="_blank" rel="noreferrer"><span>02</span><div><small>Магістратура · 2025 · PDF</small><strong>Освітньо-професійна програма «Маркетинг» 2025 року</strong></div><b>↗</b></a>
              <a href={programmeFolder} target="_blank" rel="noreferrer"><span>03</span><div><small>Матеріали кафедри</small><strong>Освітньо-професійна програма та матеріали до обговорення</strong></div><b>↗</b></a>
            </div>
          </div>
        </details>
      </div>
    </div>
  </section>;
}
