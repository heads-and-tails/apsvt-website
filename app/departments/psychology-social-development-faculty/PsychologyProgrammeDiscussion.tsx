import styles from "./PsychologyProgrammeDiscussion.module.css";

const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdy9q5cWFUT5B37z0T-BYHesOkzVPwga7s0HW0a1K5PML2feg/viewform?usp=header";
const resultsUrl = "https://docs.google.com/spreadsheets/d/1LvXqlDlwumX9ySv6mYPD2oMNCP__62YDhhQXANhQBAQ/edit?gid=357331125#gid=357331125";

export function PsychologyProgrammeDiscussion({ programmes }: { programmes: readonly string[] }) {
  return <div id="faculty-discussion" className={styles.tree}>
    <details className={styles.folder} data-discussion-folder="psychology">
      <summary><strong>Психологія</strong><b aria-hidden="true">+</b></summary>
      <div className={styles.body}>
        <details className={styles.folder} data-discussion-folder="discussion">
          <summary><strong>Обговорення змін до ОП</strong><b aria-hidden="true">+</b></summary>
          <div className={styles.body}>
            <h3>Громадське обговорення освітніх програм</h3>
            <div className={styles.programmes}>
              {programmes.map((title, index) => <details className={styles.programme} data-discussion-programme={index + 1} key={title}>
                <summary><strong>{title}</strong><b aria-hidden="true">+</b></summary>
                <div className={styles.links}>
                  <a href={formUrl} target="_blank" rel="noreferrer">Обговорення освітніх програм з спеціальності С4 &quot;Психологія&quot; ↗</a>
                  <a href={resultsUrl} target="_blank" rel="noreferrer">С4 Психологія_результати обговорення освітніх програм_АПСВТ ↗</a>
                </div>
              </details>)}
            </div>
          </div>
        </details>
      </div>
    </details>
  </div>;
}
