import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DepartmentImages } from "@/app/components/DepartmentMedia";
import { EditorialRichText } from "@/app/components/EditorialRichText";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { getPublicAdministrationAnnouncement, publicAdministrationAnnouncements, publicAdministrationBachelorPath } from "@/lib/public-administration-announcements";
import "./programme-discussion.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return publicAdministrationAnnouncements.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getPublicAdministrationAnnouncement((await params).slug);
  return article ? { title: `${article.title} · ${article.dateLabel}`, description: article.paragraphs[0], openGraph: { type: "article", title: article.title, description: article.paragraphs[0] } } : { title: "Матеріал не знайдено" };
}

export default async function ProgrammeDiscussionPage({ params }: Props) {
  const article = getPublicAdministrationAnnouncement((await params).slug);
  if (!article) notFound();
  return <main id="top"><SiteHeader />
    <section className="phero programme-discussion-hero"><div className="wrap">
      <nav className="crumb" aria-label="Навігаційний ланцюжок"><Link href="/news/archive">Архів новин</Link> / <time dateTime={article.date}>{article.dateLabel}</time></nav>
      <h1>{article.title}</h1>
    </div></section><div className="phero-rule" />
    <section className="article-section"><article className="wrap detail-copy historical-programme-article">
      <EditorialRichText text={article.paragraphs.join("\n\n")} />
      <p><a href={article.projectHref} target="_blank" rel="noopener noreferrer">Проєкт ОПП «Публічне управління та адміністрування» · {article.date.slice(0, 4)} · PDF ↗</a></p>
      <DepartmentImages entry={{ images: article.images }} />
      <nav className="programme-discussion-navigation" aria-label="Пов’язані матеріали">
        <Link className="back-link" href={publicAdministrationBachelorPath}>← Матеріали бакалаврської програми</Link>
        <Link className="back-link" href="/news/archive">← Архів новин</Link>
      </nav>
    </article></section><SiteFooter />
  </main>;
}
