import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { EditorialRichText } from "@/app/components/EditorialRichText";
import { getPublishedDepartmentEntryById } from "@/lib/department-content";
import { editorialAccessOptions } from "@/lib/editorial-access";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function formatDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("uk-UA", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

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
  const date = formatDate(entry.date);
  const heroImage = entry.imageUrl || "/apsvt-students-real.jpg";

  return <main id="top">
    <SiteHeader />
    <section className="detail-hero image">
      <div className="detail-hero-bg"><img src={heroImage} alt={entry.imageAlt || entry.title} /></div>
      <div className="wrap"><div className="detail-kicker mono">{pageTitle}{date ? ` · ${date}` : ""}</div><h1>{entry.title}</h1>{entry.summary && <p className="detail-deck">{entry.summary}</p>}</div>
    </section>
    <div className="phero-rule" />
    <section className="article-section"><div className="wrap detail-layout">
      <article className="detail-copy">
        {entry.summary && <p className="lede">{entry.summary}</p>}
        <EditorialRichText text={entry.body} />
        <Link className="back-link" href={`${entry.pagePath}#department-news`}>← До новин підрозділу</Link>
      </article>
      <aside className="detail-aside"><div className="demo-note mono">Про матеріал</div><ul className="detail-facts"><li><b>Підрозділ</b>{pageTitle}</li>{date && <li><b>Опубліковано</b>{date}</li>}<li><b>Автор</b>Редакція АПСВТ</li></ul></aside>
    </div></section>
    <SiteFooter />
  </main>;
}
