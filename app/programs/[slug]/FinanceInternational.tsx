import { GreenFinEduResources } from "@/app/international/GreenFinEduResources";
import { DepartmentEditorialContent } from "@/app/components/DepartmentEditorialContent";
import type { DepartmentEntry } from "@/lib/department-content";

export { financeProjectSections } from "@/lib/editorial-sections";

export function FinanceInternational({ entries }: { entries: DepartmentEntry[] }) {
  const sectionEntries = (id: string) => entries.filter((entry) => entry.sectionId === id && !["hero", "override"].includes(entry.entryType));
  return <div id="international">
    <section className="intl-band finance-international"><div className="wrap">
      <div><div className="idx">03 / Міжнародні проєкти</div><h2>Erasmus + проєкти кафедри</h2></div>
      <nav className="finance-project-links" aria-label="Erasmus + проєкти кафедри">
        <a href="#greenfinedu">Jean Monnet GreenFinEDU<span aria-hidden="true">↓</span></a>
        <a href="#eu-financial-sector">Jean Monnet  The EU Financial Sector<span aria-hidden="true">↓</span></a>
      </nav>
    </div></section>
    <DepartmentEditorialContent entries={sectionEntries("international")} />
    <GreenFinEduResources />
    <DepartmentEditorialContent entries={sectionEntries("greenfinedu")} />
    <section className="greenfinedu finance-eu-project" id="eu-financial-sector"><div className="wrap">
      <div className="greenfinedu-intro">
        <div><div className="idx">Erasmus+ · Jean Monnet</div><span className="greenfinedu-code">№ 575275</span><h2>The EU Financial Sector</h2></div>
        <div><p className="lead">«Фінансовий сектор ЄС як драйвер сталого розвитку: європейська інтеграція, реформа політики та перспективи мережевої економіки»</p><p>The EU Financial Sector as a Driver of Sustainable Development</p></div>
      </div>
      <div className="greenfinedu-facts"><div><b>36</b><span>місяців реалізації</span></div><div><b>3</b><span>формати навчання</span></div><div><b>2016-2019</b><span>період проєкту</span></div></div>
      <DepartmentEditorialContent entries={sectionEntries("eu-financial-sector")} />
      <section id="eu-financial-sector-about" className="finance-project-materials"><h3>Про проєкт</h3><DepartmentEditorialContent entries={sectionEntries("eu-financial-sector-about")} /></section>
      <section id="eu-financial-sector-documents" className="finance-project-materials"><h3>Програми та презентація</h3><DepartmentEditorialContent entries={sectionEntries("eu-financial-sector-documents")} /></section>
    </div></section>
  </div>;
}
