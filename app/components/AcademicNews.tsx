import Link from "next/link";
import { NewsCard } from "@/app/components/NewsCard";
import { getPosts } from "@/lib/data";
import { selectAcademicNews } from "@/lib/academic-news";

export async function AcademicNews({
  slugs,
  title = "Новини напряму",
  eyebrow = "Наука, події та спільнота",
}: {
  slugs: string[];
  title?: string;
  eyebrow?: string;
}) {
  const posts = await getPosts({ limit: 60 });
  const selected = selectAcademicNews(posts, slugs, 3);
  if (!selected.length) return null;
  return <section className="academic-news-section"><div className="wrap">
    <div className="sec-head"><div><div className="idx">{eyebrow}</div><h2>{title}</h2></div><Link className="sec-link" href="/news">Усі новини →</Link></div>
    <div className="news-grid">{selected.map((post) => <NewsCard post={post} key={post.id} />)}</div>
  </div></section>;
}
