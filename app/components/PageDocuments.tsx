import { getPublicDocuments } from "@/lib/documents";

function fileSize(value: number): string {
  if (!value) return "";
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} КБ`;
  return `${(value / (1024 * 1024)).toFixed(1)} МБ`;
}

export async function PageDocuments({ pagePath }: { pagePath: string }) {
  const documents = await getPublicDocuments(pagePath);
  if (!documents.length) return null;

  return <section className="page-documents"><div className="wrap">
    <div className="sec-head"><div><div className="idx">Документи сторінки</div><h2>Файли та офіційні матеріали</h2></div><p>Актуальні документи, додані редакцією Академії.</p></div>
    <div className="page-document-grid">{documents.map((document) => <a href={document.fileUrl} target="_blank" rel="noreferrer" key={document.id}>
      <span>{document.category}</span><h3>{document.title}</h3>{document.description && <p>{document.description}</p>}
      <small>{document.fileName}{fileSize(document.fileSize) ? ` · ${fileSize(document.fileSize)}` : ""}</small><b>Відкрити ↗</b>
    </a>)}</div>
  </div></section>;
}
