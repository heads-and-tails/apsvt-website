import Link from "next/link";
import type { DepartmentEntry } from "@/lib/department-content";
import { marketingMonitoringCallId, marketingMonitoringEntries } from "@/lib/marketing-monitoring";
import { DepartmentEditorialContent } from "@/app/components/DepartmentEditorialContent";
import { DepartmentImages, DepartmentAttachments } from "@/app/components/DepartmentMedia";
import { EditorialRichText } from "@/app/components/EditorialRichText";
import "./marketing-monitoring.css";

function MonitoringMaterials({ entries }: { entries: DepartmentEntry[] }) {
  return <div data-editorial-rendered="true">
    {entries.filter((entry) => ["section", "quality"].includes(entry.entryType)).map((entry) => <article className="marketing-stakeholder-call" id={entry.id === marketingMonitoringCallId ? "marketing-stakeholder-call" : undefined} key={entry.id}>
      {entry.summary && <small>{entry.summary}</small>}<h3>{entry.title}</h3>
      <DepartmentImages entry={entry} /><EditorialRichText text={entry.body} /><DepartmentAttachments entry={entry} />
    </article>)}
    <div className="marketing-programme-links">{entries.filter((entry) => entry.entryType === "material").map((entry, index) => {
      const content = <><span>{String(index + 1).padStart(2, "0")}</span><div>{entry.summary && <small>{entry.summary}</small>}<strong>{entry.title}</strong>{entry.fileName && entry.fileName !== entry.title && <small>{entry.fileName}</small>}</div><b aria-hidden="true">↗</b></>;
      return entry.fileUrl.startsWith("/news/") ? <Link href={entry.fileUrl} key={entry.id}>{content}</Link> : <a href={entry.fileUrl} target="_blank" rel="noopener noreferrer" key={entry.id}>{content}</a>;
    })}</div>
    <DepartmentEditorialContent inline entries={entries.filter((entry) => !["section", "quality", "material"].includes(entry.entryType))} />
  </div>;
}

export function MarketingMonitoring({ entries }: { entries: DepartmentEntry[] }) {
  const general = marketingMonitoringEntries(entries, "marketing-quality-monitoring");
  return <details className="marketing-quality-folder" id="marketing-quality-monitoring">
    <summary><span>01</span><strong>Результати моніторингу якості освіти</strong><b aria-hidden="true">+</b></summary>
    <div className="marketing-quality-folder-body">
      {general.length > 0 && <MonitoringMaterials entries={general} />}
      {[["marketing-monitoring-bachelor", "Бакалаврат"], ["marketing-monitoring-master", "Магістратура"]].map(([sectionId, title], index) => {
        const materials = marketingMonitoringEntries(entries, sectionId);
        return <details className="marketing-quality-level" id={sectionId} key={sectionId}>
          <summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><b aria-hidden="true">+</b></summary>
          <div className="marketing-quality-level-body">{materials.length > 0 ? <MonitoringMaterials entries={materials} /> : <p className="marketing-quality-empty">У цьому підрозділі матеріали ще не розміщено.</p>}</div>
        </details>;
      })}
    </div>
  </details>;
}
