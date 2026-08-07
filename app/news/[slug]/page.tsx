import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { getPostBySlug, getPosts } from "@/lib/data";
import { getEditorialImage } from "@/lib/post-image";
import { getEntranceResultDocumentsForNews } from "@/lib/entrance-results";
import { applicantRankingsNewsSlug, bachelorApplicantRankings, bachelorRankingDocumentCount } from "@/lib/admissions-rankings";
import { NewsCard } from "../../components/NewsCard";
import { EditorialRichText } from "../../components/EditorialRichText";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Матеріал не знайдено" };
  const image = getEditorialImage(post);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article", images: [{ url: image.imageUrl, alt: image.imageAlt }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [image.imageUrl] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = (await getPosts({ limit: 6 })).filter((item) => item.id !== post.id).slice(0, 3);
  const date = new Intl.DateTimeFormat("uk-UA", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(post.publishedAt || post.createdAt));
  const heroImage = getEditorialImage(post);
  const entranceResultDocuments = getEntranceResultDocumentsForNews(post.slug);
  const isApplicantRankingsNews = post.slug === applicantRankingsNewsSlug;

  return <main id="top">
    <SiteHeader />
    <section className="detail-hero image">
      <div className="detail-hero-bg"><img src={heroImage.imageUrl} alt={heroImage.imageAlt} /></div>
      <div className="wrap"><div className="detail-kicker mono">{post.category} · {date}</div><h1>{post.title}</h1><p className="detail-deck">{post.excerpt}</p></div>
    </section>
    <div className="phero-rule" />
    <section className="article-section"><div className="wrap detail-layout">
      <article className="detail-copy">
        <p className="lede">{post.excerpt}</p>
        <EditorialRichText text={post.body} />
        {entranceResultDocuments && <div className="news-result-files">
          <span>Результати за предметами</span>
          {entranceResultDocuments.map((document, index) => <a href={document.href} target="_blank" rel="noreferrer" key={document.href}>
            <b>{String(index + 1).padStart(2, "0")}</b><strong>{document.title}</strong><small>PDF · відкрити ↗</small>
          </a>)}
          <Link href="/admissions#entrance-results">Усі результати у розділі «Вступнику» →</Link>
        </div>}
        {isApplicantRankingsNews && <div className="news-result-files news-ranking-files">
          <span>{`${bachelorRankingDocumentCount} рейтингових списків за програмами`}</span>
          {bachelorApplicantRankings.map((group) => <Link href="/admissions#applicant-rankings" key={group.code}>
            <b>{group.code}</b><strong>{group.programme}</strong><small>{`${group.documents.length} PDF · переглянути →`}</small>
          </Link>)}
          <Link href="/admissions#applicant-rankings">Відкрити всі рейтингові списки у розділі «Вступнику» →</Link>
        </div>}
        <blockquote>Освіта стає цінною тоді, коли знання переходить у відповідальну дію.</blockquote>
        <Link className="back-link" href="/news">← До всіх новин</Link>
      </article>
      <aside className="detail-aside"><div className="demo-note mono">Про матеріал</div><ul className="detail-facts"><li><b>Категорія</b>{post.category}</li><li><b>Опубліковано</b>{date}</li><li><b>Автор</b>Редакція АПСВТ</li></ul></aside>
    </div></section>
    {related.length > 0 && <section className="soft"><div className="wrap"><div className="sec-head"><div><div className="idx">Читайте далі</div><h2>Ще з Академії</h2></div></div><div className="news-grid">{related.map((item) => <NewsCard post={item} key={item.id} />)}</div></div></section>}
    <SiteFooter />
  </main>;
}
