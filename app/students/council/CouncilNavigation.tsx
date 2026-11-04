import Link from "next/link";
import { studentCouncilPath, studentCouncilSections } from "@/lib/student-council";

export function CouncilNavigation({ current }: { current?: string }) {
  return <nav className="wrap faculty-subpage-links council-navigation" aria-label="Розділи студентської ради">
    {studentCouncilSections.map(({ id, label }) => <Link href={`${studentCouncilPath}/${id}`} aria-current={current === id ? "page" : undefined} key={id}>{label}<span aria-hidden="true">→</span></Link>)}
  </nav>;
}
