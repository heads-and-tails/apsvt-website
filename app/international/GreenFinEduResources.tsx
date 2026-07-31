import { greenFinEduCollections, greenFinEduFiles } from "@/lib/academy-resources";

export function GreenFinEduResources() {
  return <section className="greenfinedu" id="greenfinedu"><div className="wrap">
    <div className="greenfinedu-intro">
      <div><div className="idx">02 / Erasmus+ · Jean Monnet</div><span className="greenfinedu-code">Проєкт № 101126681</span><h2>GreenFinEDU</h2></div>
      <div><p className="lead">«Європейська зелена політика та сталі фінанси: адаптація випускників українських університетів до роботи на ринку праці в умовах переходу до сталої економіки».</p><p>Модуль працює у 2023–2026 роках і поєднує курси для студентів, літню школу для фахівців, відкриті вебінари та навчальні матеріали про політику ЄС і сталі фінанси.</p></div>
    </div>
    <div className="greenfinedu-facts">
      <div><b>36</b><span>місяців реалізації</span></div><div><b>3</b><span>формати навчання</span></div><div><b>2023–2026</b><span>період проєкту</span></div>
    </div>
    <div className="greenfinedu-resource-head"><div><span>Ключові файли</span><h3>Програми та презентація</h3></div><p>Відібрані офіційні матеріали збережено на сайті Академії для стабільного доступу.</p></div>
    <div className="greenfinedu-files">{greenFinEduFiles.map((file, index) => <a href={file.href} target="_blank" rel="noreferrer" key={file.title}>
      <span>{String(index + 1).padStart(2, "0")}</span><small>{file.format}</small><h4>{file.title}</h4><p>{file.description}</p><b>Завантажити ↗</b>
    </a>)}</div>
    <div className="greenfinedu-resource-head collections"><div><span>Повні колекції</span><h3>Архів навчальних матеріалів</h3></div><p>Розклади й великі тематичні добірки відкриваються у вихідних папках Google Drive.</p></div>
    <div className="greenfinedu-collections">{greenFinEduCollections.map((collection) => <a href={collection.href} target="_blank" rel="noreferrer" key={collection.title}><h4>{collection.title}</h4><p>{collection.description}</p><b>Відкрити колекцію ↗</b></a>)}</div>
  </div></section>;
}
