import { marketingInteractiveGroups, marketingInteractiveIntroduction, marketingInteractiveSection } from "@/lib/marketing-interactive-resources";

export function MarketingInteractiveResources() {
  const introduction = marketingInteractiveIntroduction;
  return <section id={marketingInteractiveSection.id} className="programme-documents marketing-interactive-resources" aria-label={marketingInteractiveSection.title}>
    <div className="wrap">
      <div className="marketing-interactive-intro">
        {introduction.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p>{introduction.directionsTitle}</p>
        <ul>{introduction.directions.map((direction) => <li key={direction}>{direction}</li>)}</ul>
        <p>{introduction.conclusion}</p>
      </div>
      <div className="marketing-methodical-folders">
        {marketingInteractiveGroups.map((group, index) => <details id={group.id} className="marketing-methodical-folder" key={group.id}>
          <summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{group.title} <small>({group.resources.length})</small></strong><b aria-hidden="true">+</b></summary>
          <div className="marketing-methodical-folder-body">
            <p className="marketing-interactive-description">{group.description}</p>
            <div className="marketing-methodical-file-list">{group.resources.map((resource) => <a href={resource.href} target="_blank" rel="noopener noreferrer" key={resource.number}>
              <span>№ {String(resource.number).padStart(2, "0")}</span><strong>{resource.title}</strong><b aria-hidden="true">↗</b>
            </a>)}</div>
          </div>
        </details>)}
      </div>
    </div>
  </section>;
}
