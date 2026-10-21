import type { Metadata } from "next";
import Link from "next/link";
import { EnglishFooter } from "@/app/components/EnglishFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { getPosts } from "@/lib/data";
import { englishPosts } from "@/lib/english-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "News and stories", description: "Academy news, research, events and community stories." };

export default async function NewsPage() {
  const originals = await getPosts({ limit: englishPosts.length, slugs: englishPosts.map((post) => post.slug) });
  const dateSettings = new Map(originals.map((post) => [post.slug, post.hideDate]));
  const format = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return <main id="top" className="english-page"><SiteHeader />
    <section className="phero"><div className="wrap"><div className="crumb">Home / News</div><h1>News and<br />stories</h1><p className="lead">Education, research, international partnerships and the people of the Academy.</p></div></section>
    <div className="phero-rule" />
    <section><div className="wrap"><div className="news-grid">{englishPosts.map((post) => <Link className="news" href={`/en/news/${post.slug}`} key={post.slug}>
      {post.imageUrl && <div className="ph"><img src={post.imageUrl} alt={post.imageAlt} /></div>}
      <div className="in">{!dateSettings.get(post.slug) && <span className="date">{format.format(new Date(post.publishedAt || post.createdAt))}</span>}<h3>{post.title}</h3><p>{post.excerpt}</p><span className="cat">{post.category}</span></div>
    </Link>)}</div></div></section><EnglishFooter />
  </main>;
}
