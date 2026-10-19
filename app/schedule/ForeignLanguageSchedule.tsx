const schedulePath = "/documents/schedule/ukrainian-as-foreign-language-2026-27.pdf";

export function ForeignLanguageSchedule() {
  return (
    <section className="soft" id="ukrainian-language-foreign-students">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <div className="idx">Для іноземних студентів / I семестр 2026–2027</div>
            <h2>Українська мова як іноземна</h2>
          </div>
          <p>Розклад занять за київським часом. I семестр триватиме до 30.01.2027 р.</p>
        </div>
        <div className="detail-layout">
          <div className="detail-copy">
            <h3 style={{ fontSize: "clamp(22px, 2.4vw, 32px)", lineHeight: 1.18, marginBottom: 24 }}>ОБОВ&apos;ЯЗКОВА ВИМОГА: Курс української мови та допуск до екзаменаційної сесії</h3>
            <p>Шановні студенти!</p>
            <p>Офіційно нагадуємо, що вивчення курсу «Українська мова як іноземна» є ОБОВ&apos;ЯЗКОВОЮ академічною вимогою. Оскільки державною мовою навчання в Академії є українська, володіння нею є необхідною умовою для вашого подальшого навчання та освітнього прогресу.</p>
            <p>Успішне завершення цієї програми та складання сесії є єдиною підставою для отримання Офіційного Сертифіката про рівень володіння мовою, який підтверджує вашу відповідність мовній політиці закладу.</p>
            <h3 style={{ fontSize: "clamp(20px, 2vw, 27px)", lineHeight: 1.2, margin: "32px 0 16px" }}>⚠️ Суворі правила сертифікації та допуску до іспитів</h3>
            <ol style={{ paddingLeft: 24, marginBottom: 28, lineHeight: 1.65 }}>
              <li><strong>Обов&apos;язкове тестування:</strong> Щоб отримати допуск до фінальних зимових іспитів, ви повинні спочатку виконати та успішно скласти всі попередні тести курсу.</li>
              <li><strong>Умовний допуск до сесії:</strong> Допуск до фінальних іспитів є суворо обов&apos;язковим за умови успішного складання цих тестів. Студенти, які не наберуть прохідний бал, не будуть допущені до сесії.</li>
              <li><strong>Видача сертифіката:</strong> Офіційний сертифікат видається <em>виключно</em> тим студентам, які не мають заборгованостей, склали проміжні тести та успішно пройшли фінальну зимову екзаменаційну сесію.</li>
              <li><strong>Оголошення результатів:</strong> Ваші результати тестування та фінальний статус допуску будуть опубліковані на платформі Moodle, щойно оцінки завантажать у систему.</li>
            </ol>
            <p>З повагою, Адміністрація курсу</p>
          </div>
          <aside style={{ background: "var(--cobalt)", color: "var(--paper)", borderTop: "6px solid var(--gold)", padding: 28, alignSelf: "start" }}>
            <h3 style={{ fontSize: "clamp(25px, 2.2vw, 31px)", marginBottom: 18 }}>Розклад занять</h3>
            <p style={{ color: "#e0e7ff", fontSize: 15, marginBottom: 28 }}>Українська мова як іноземна · I семестр 2026–2027 н. р.</p>
            <a className="cta" href={schedulePath} target="_blank" rel="noreferrer"><span>Відкрити розклад (PDF) ↗</span></a>
          </aside>
        </div>
      </div>
    </section>
  );
}
