import Link from "next/link";
import type { Post } from "@/lib/data";
const fmt=new Intl.DateTimeFormat("uk-UA",{day:"2-digit",month:"2-digit",year:"numeric"});
export function NewsCard({post}:{post:Post}){const image=post.slug==="open-day-2026"?"/apsvt-students-real.jpg":post.imageUrl;const alt=post.slug==="open-day-2026"?"Студенти Академії біля навчального корпусу":post.imageAlt;return <Link className="news" href={`/news/${post.slug}`}><div className="ph"><img src={image} alt={alt}/></div><div className="in"><span className="date">{fmt.format(new Date(post.publishedAt||post.createdAt))}</span><h3>{post.title}</h3><p>{post.excerpt}</p><span className="cat">{post.category}</span></div></Link>}
