import Link from "next/link";
import type { Post } from "@/lib/data";
const fmt=new Intl.DateTimeFormat("uk-UA",{day:"2-digit",month:"2-digit",year:"numeric"});
export function NewsCard({post}:{post:Post}){return <Link className="news" href={`/news/${post.slug}`}><div className="ph"><img src={post.imageUrl} alt={post.imageAlt}/></div><div className="in"><span className="date">{fmt.format(new Date(post.publishedAt||post.createdAt))}</span><h3>{post.title}</h3><p>{post.excerpt}</p><span className="cat">{post.category}</span></div></Link>}
