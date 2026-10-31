import { getPublicDocuments, type PageDocument } from "@/lib/documents";

function fileSize(value: number): string {
  if (!value) return "";
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} КБ`;
  return `${(value / (1024 * 1024)).toFixed(1)} МБ`;
}

type PageDocumentsProps = {
  pagePath: string;
  documents?: PageDocument[];
  emptyMessage?: string;
  includeCategoryPrefixes?: string[];
  excludeCategoryPrefixes?: string[];
  title?: string;
  description?: string;
  showEmptyTitle?: boolean;
};

export async function PageDocuments({ pagePath, documents: suppliedDocuments, emptyMessage, includeCategoryPrefixes = [], excludeCategoryPrefixes = [], title = "Файли та офіційні матеріали", description = "Актуальні документи, додані редакцією Академії.", showEmptyTitle = false }: PageDocumentsProps) {
  const matchesPrefix = (category: string, prefixes: string[]) => prefixes.some((prefix) => category.toLocaleLowerCase("uk-UA").startsWith(prefix.toLocaleLowerCase("uk-UA")));
  const documents = (suppliedDocuments ?? await getPublicDocuments(pagePath)).filter((document) =>
    document.status === "published" && (!includeCategoryPrefixes.length || matchesPrefix(document.category, includeCategoryPrefixes))
      && (!excludeCategoryPrefixes.length || !matchesPrefix(document.category, excludeCategoryPrefixes)),
  );
  if (!documents.length) return emptyMessage ? <section className="page-documents"><div className="wrap">{showEmptyTitle && <div className="sec-head"><h2>{title}</h2></div>}<p className="academic-empty-state">{emptyMessage}</p></div></section> : null;

  return <section className="page-documents"><div className="wrap">
    <div className="sec-head"><div><div className="idx">Документи сторінки</div><h2>{title}</h2></div><p>{description}</p></div>
    <div className="page-document-grid">{documents.map((document) => <a href={document.fileUrl} target="_blank" rel="noreferrer" key={document.id}>
      <span>{document.category}</span><h3>{document.title}</h3>{document.description && <p>{document.description}</p>}
      <small>{document.fileName}{fileSize(document.fileSize) ? ` · ${fileSize(document.fileSize)}` : ""}</small><b>Відкрити ↗</b>
    </a>)}</div>
  </div></section>;
}
