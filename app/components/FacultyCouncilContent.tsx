import Link from "next/link";
import { getPublishedDepartmentEntries } from "@/lib/department-content";
import { departmentImages } from "@/lib/department-media";
import { lawFacultySubpages } from "@/lib/law-faculty-structure";
import { DepartmentEditorialContent } from "./DepartmentEditorialContent";
import { PageDocuments } from "./PageDocuments";

export async function FacultyCouncilContent() {
  const pages = lawFacultySubpages.filter((page) => page.sectionId === "faculty-council");
  const published = (await getPublishedDepartmentEntries())
    .filter((entry) => pages.some((page) => page.path === entry.pagePath) && !["hero", "override"].includes(entry.entryType))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.createdAt.localeCompare(b.createdAt));

  return <div className="faculty-council-materials" data-editorial-rendered="true">
    {pages.map((page) => {
      const entries = published.filter((entry) => entry.pagePath === page.path);
      return <section className="faculty-council-part" aria-labelledby={`council-${page.id}-title`} key={page.path}>
        <header className="wrap faculty-council-part-head">
          <h3 id={`council-${page.id}-title`}>{page.title}</h3>
          <Link href={page.path}>Відкрити підрозділ →</Link>
        </header>
        <div className="wrap"><DepartmentEditorialContent inline entries={entries} /></div>
        <PageDocuments pagePath={page.path} emptyMessage={!entries.length ? "Матеріали ще не оприлюднено." : undefined} />
        {entries.some((entry) => departmentImages(entry).length) && <nav className="wrap department-authored-files" aria-label={`Оригінали матеріалів: ${page.title}`}>
          {entries.flatMap((entry) => departmentImages(entry).map((image, index) => <a href={image.url} target="_blank" rel="noopener noreferrer" key={`${entry.id}-${index}`}>Відкрити оригінал: {entry.title} ↗</a>))}
        </nav>}
      </section>;
    })}
  </div>;
}
