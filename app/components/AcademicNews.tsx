import Link from "next/link";
import { NewsCard } from "@/app/components/NewsCard";
import { getPosts } from "@/lib/data";
import { selectAcademicNews } from "@/lib/academic-news";

export async function AcademicNews({
  slugs,
  title = "Новини напряму",
  eyebrow = "Наука, події та спільнота",
  limit = 3,
  prioritySlugs = [],
}: {
  slugs: string[];
  title?: string;
  eyebrow?: string;
  limit?: number;
  prioritySlugs?: string[];
}) {
  const [posts, priorityPosts] = await Promise.all([
    getPosts({ limit: 60 }),
    prioritySlugs.length ? getPosts({ slugs: prioritySlugs }) : Promise.resolve([]),
  ]);
  const allPosts = [...new Map([...posts, ...priorityPosts].map((post) => [post.id, post])).values()];
  const selected = selectAcademicNews(allPosts, slugs, limit, prioritySlugs);
  if (!selected.length) return null;
  return <section className="academic-news-section"><div className="wrap">
    <div className="sec-head"><div><div className="idx">{eyebrow}</div><h2>{title}</h2></div><Link className="sec-link" href="/news">Усі новини →</Link></div>
    <div className="news-grid">{selected.map((post) => <NewsCard post={post} key={post.id} />)}</div>
  </div></section>;
}
