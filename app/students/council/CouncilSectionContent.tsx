import type { DepartmentEntry } from "@/lib/department-content";
import { DepartmentEditorialContent } from "../../components/DepartmentEditorialContent";
import { DepartmentImages, DepartmentAttachments } from "../../components/DepartmentMedia";
import { EditorialRichText } from "../../components/EditorialRichText";

export function CouncilSectionContent({ entries, representatives }: { entries: DepartmentEntry[]; representatives: boolean }) {
  if (!entries.length) return <p>Матеріали ще не оприлюднено.</p>;
  return <>
    <div className={representatives ? "council-representatives" : "council-copy"}>
      {entries.filter((entry) => entry.entryType === "section").map((entry) => <article className="council-entry" key={entry.id}>
        <DepartmentImages entry={entry} />
        <div><h2>{entry.title}</h2>{entry.summary && <p>{entry.summary}</p>}<EditorialRichText text={entry.body} /><DepartmentAttachments entry={entry} /></div>
      </article>)}
    </div>
    <DepartmentEditorialContent inline entries={entries.filter((entry) => entry.entryType !== "section")} />
  </>;
}
