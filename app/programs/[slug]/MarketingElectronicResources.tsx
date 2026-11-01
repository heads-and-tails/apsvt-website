import catalogue from "@/lib/marketing-electronic-resources.json";

export function MarketingElectronicResources() {
  return <div className="marketing-electronic-resources">
    <div className="marketing-electronic-intro">
      <h4>{catalogue.intro[0]}</h4>
      <p>{catalogue.intro[1]}</p>
      <p>{catalogue.intro[2]}</p>
      <p>{catalogue.intro[3]}</p>
      <p>{catalogue.intro[4]}</p>
    </div>
    <div className="marketing-electronic-groups">
      {catalogue.groups.map((group) => <details className="marketing-electronic-group" key={group.title}>
        <summary><strong>{group.title}</strong><p>{group.description}</p><b aria-hidden="true">+</b></summary>
        <div className="marketing-electronic-links">
          {group.items.map((item, index) => item.href
            ? <a className="marketing-electronic-link" href={item.href} target="_blank" rel="noopener noreferrer" key={index}><span>{item.text}</span><b aria-hidden="true">↗</b></a>
            : <h5 key={index}>{item.text}</h5>)}
        </div>
      </details>)}
    </div>
  </div>;
}
