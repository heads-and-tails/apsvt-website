import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { EditorialRichText } from "@/app/components/EditorialRichText";
import { getPublishedDepartmentEntryById } from "@/lib/department-content";
import { DepartmentImages, DepartmentAttachments } from "@/app/components/DepartmentMedia";
import { departmentPublicationDate } from "@/lib/department-news-date";
import { editorialAccessOptions } from "@/lib/editorial-access";
import { marketingStudentSections } from "@/lib/marketing-student-sections";
import { marketingMobilitySection } from "@/lib/marketing-mobility";
import { marketingTeacherAchievementsSection } from "@/lib/marketing-teacher-achievements";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function pageTitleFor(path: string) {
  return editorialAccessOptions.find((option) => option.value === path)?.label || "Підрозділ Академії";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const entry = await getPublishedDepartmentEntryById(id);
  if (!entry || entry.entryType !== "news") return { title: "Новину не знайдено" };
  return {
    title: entry.title,
    description: entry.summary,
    openGraph: entry.imageUrl ? { title: entry.title, description: entry.summary, type: "article", images: [{ url: entry.imageUrl, alt: entry.imageAlt || entry.title }] } : undefined,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const entry = await getPublishedDepartmentEntryById(id);
  if (!entry || entry.entryType !== "news") notFound();

  const pageTitle = pageTitleFor(entry.pagePath);
  const date = departmentPublicationDate(entry)?.label || "";
  const isMarketingClubNews = entry.pagePath === "/programs/marketing" && entry.sectionId === "science-club";
  const isMarketingRepositoryNews = entry.pagePath === "/programs/marketing" && entry.sectionId === "marketing-repository";
  const isMarketingQualityNews = entry.pagePath === "/programs/marketing" && ["quality", "marketing-quality-discussion"].includes(entry.sectionId);
  const isMarketingMobilityNews = entry.pagePath === "/programs/marketing" && entry.sectionId === marketingMobilitySection.id;
  const isMarketingTeacherAchievementNews = entry.pagePath === "/programs/marketing" && entry.sectionId === marketingTeacherAchievementsSection.id;
  const studentSection = entry.pagePath === "/programs/marketing" ? marketingStudentSections.find((section) => section.id === entry.sectionId) : undefined;
  const returnSection = isMarketingClubNews ? "science-club" : isMarketingRepositoryNews ? "marketing-repository" : isMarketingTeacherAchievementNews ? marketingTeacherAchievementsSection.id : isMarketingMobilityNews ? marketingMobilitySection.id : isMarketingQualityNews ? "quality" : studentSection?.id || "department-news";
  const returnLabel = isMarketingClubNews ? "← До наукового гуртка" : isMarketingRepositoryNews ? "← До репозитарію" : isMarketingTeacherAchievementNews ? "← До здобутків викладачів" : isMarketingMobilityNews ? "← До академічної мобільності" : isMarketingQualityNews ? "← До обговорення ОПП" : studentSection ? `← ${studentSection.title}` : "← До новин підрозділу";

  return <main id="top">
    <SiteHeader englishHref={isMarketingClubNews || isMarketingRepositoryNews || isMarketingMobilityNews || isMarketingTeacherAchievementNews || studentSection ? "/en/news" : undefined} />
    <section className="detail-hero">
      <div className="wrap"><div className="detail-kicker mono">{pageTitle}{date ? ` · ${date}` : ""}</div><h1>{entry.title}</h1>{entry.summary && <p className="detail-deck">{entry.summary}</p>}</div>
    </section>
    <div className="phero-rule" />
    <section className="article-section"><div className="wrap detail-layout">
      <article className="detail-copy">
        {entry.summary && <p className="lede">{entry.summary}</p>}
        <DepartmentImages entry={entry} />
        <EditorialRichText text={entry.body} />
        <DepartmentAttachments entry={entry} />
        <Link className="back-link" href={`${entry.pagePath}#${returnSection}`}>{returnLabel}</Link>
      </article>
      <aside className="detail-aside"><div className="demo-note mono">Про матеріал</div><ul className="detail-facts"><li><b>Підрозділ</b>{pageTitle}</li>{date && <li><b>Опубліковано</b>{date}</li>}</ul></aside>
    </div></section>
    <SiteFooter />
  </main>;
}
