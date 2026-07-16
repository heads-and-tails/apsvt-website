import Link from "next/link";
import type { Post } from "@/lib/data";

const dateFormat = new Intl.DateTimeFormat("uk-UA", { day: "2-digit", month: "long", year: "numeric" });

export function NewsCard({ post, large = false }: { post: Post; large?: boolean }) {
  return (
    <Link className={`news-card ${large ? "large" : ""}`} href={`/news/${post.slug}`}>
      <div className="news-image"><img src={post.imageUrl} alt={post.imageAlt} /></div>
      <div className="news-copy">
        <div className="news-meta"><span>{post.category}</span><time>{dateFormat.format(new Date(post.publishedAt || post.createdAt))}</time></div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <b>Читати історію <span>→</span></b>
      </div>
    </Link>
  );
}
