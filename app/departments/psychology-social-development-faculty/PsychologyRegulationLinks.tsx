import type { PsychologyFacultyRegulation } from "@/lib/psychology-faculty-regulations";

type Props = { documents: readonly PsychologyFacultyRegulation[] };

export function PsychologyRegulationLinks({ documents }: Props) {
  return <div className="programme-document-list">{documents.map((document, index) => <a href={document.href} target="_blank" rel="noreferrer" key={document.href}>
    <span>{String(index + 1).padStart(2, "0")}</span><div><small>PDF</small><h3>{document.title}</h3></div><b>↗</b>
  </a>)}</div>;
}
