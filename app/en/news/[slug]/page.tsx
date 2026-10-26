import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EnglishFooter } from "@/app/components/EnglishFooter";
import { EditorialRichText } from "@/app/components/EditorialRichText";
import { SiteHeader } from "@/app/components/SiteHeader";
import { getPostBySlug } from "@/lib/data";
import { englishPosts } from "@/lib/english-content";
import { empowerEastKickoffNewsSlug } from "@/lib/empower-east-news";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = englishPosts.find((item) => item.slug === slug);
  return post ? { title: post.title, description: post.excerpt } : { title: "Article not found" };
}

export default async function NewsArticle({ params }: Props) {
  const { slug } = await params;
  if (slug === empowerEastKickoffNewsSlug) redirect(`/news/${slug}`);
  const post = englishPosts.find((item) => item.slug === slug);
  if (!post) notFound();
  const original = await getPostBySlug(slug);
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(post.publishedAt || post.createdAt));

  return <main id="top" className="english-page"><SiteHeader />
    <section className="detail-hero"><div className="wrap"><Link className="back-link" href="/en/news">← All news</Link><div className="detail-kicker mono">{post.category}{!original?.hideDate && ` · ${date}`}</div><h1>{post.title}</h1><p className="detail-deck">{post.excerpt}</p></div></section>
    {post.imageUrl && <div className="article-cover"><img src={post.imageUrl} alt={post.imageAlt} /></div>}
    <section className="article-section"><div className="wrap detail-layout"><article className="detail-copy"><EditorialRichText text={post.body} language="en" /></article><aside className="detail-aside"><div className="panel"><h3>Discover APSVT</h3><ul><li><span className="y">Study</span><Link href="/en/programs">Degree programmes</Link></li><li><span className="y">Apply</span><Link href="/en/admissions">Admissions 2026</Link></li><li><span className="y">Meet</span><Link href="/en/events">Academy events</Link></li></ul></div></aside></div></section>
    <EnglishFooter />
  </main>;
}
