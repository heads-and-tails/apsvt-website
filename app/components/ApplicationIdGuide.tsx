import styles from "./ApplicationIdGuide.module.css";

export function ApplicationIdGuide({ english = false, number = "01" }: { english?: boolean; number?: string }) {
  return <details className={styles.guide} id="application-id">
    <summary><span>{number}</span>{english ? "How do I find my Study in Ukraine Application ID?" : "Як знайти ID заяви на порталі «Study in Ukraine»?"}<b>+</b></summary>
    <div className={styles.body}>
      <p>{english
        ? "Provide your unique Application ID so that the Academy’s admissions team and international office can check the status of your application."
        : "Для того щоб Приймальна комісія та міжнародний відділ Академії могли оперативно перевірити статус Вашої заяви, Вам необхідно надати її унікальний номер (ID)."}</p>
      <ol>
        <li>{english ? "Sign in to your personal account on the " : "Увійдіть у свій персональний кабінет на "}<a href="https://apply.studyinukraine.gov.ua/home" target="_blank" rel="noreferrer">{english ? "Study in Ukraine portal" : "порталі Study in Ukraine"}</a>.</li>
        <li>{english ? "Open “My Applications” in your account menu." : "У головному меню особистого кабінету оберіть розділ «My Applications» (Мої заяви)."}</li>
        <li>{english ? "Find your application to the Academy of Labour, Social Relations and Tourism (APSVT / Academy Kyiv)." : "У переліку надісланих запитів знайдіть заяву, яку Ви подавали до Академії праці, соціальних відносин і туризму (APSVT / Academy Kyiv)."}</li>
        <li>{english ? "Copy the numeric or alphanumeric code next to the Academy’s name, marked “Application ID” or “№”." : "Поруч із назвою Академії скопіюйте унікальний цифровий або буквено-цифровий код, позначений як Application ID або №."}</li>
      </ol>
      <p>{english ? "Email this number to " : "Скопіюйте цей номер та надішліть його електронною поштою на "}<a href="mailto:inz@socosvita.kiev.ua">inz@socosvita.kiev.ua</a>{english ? ", or attach a screenshot of your account showing your application." : " або зробіть скриншот екрана Вашого кабінету, де видно Вашу заяву, та додайте його до листа."}</p>
    </div>
  </details>;
}
