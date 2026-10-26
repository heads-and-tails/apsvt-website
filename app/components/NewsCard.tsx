import Link from "next/link";
import type { Post } from "@/lib/data";
import { getEditorialImage } from "@/lib/post-image";
const fmt=new Intl.DateTimeFormat("uk-UA",{day:"2-digit",month:"2-digit",year:"numeric"});
export function NewsCard({post,href,imageFit}:{post:Post;href?:string;imageFit?:"contain"|"cover"}){const image=getEditorialImage(post);return <Link className="news" href={href||`/news/${post.slug}`}>{image.imageUrl && <div className="ph"><img src={image.imageUrl} alt={image.imageAlt} style={imageFit?{objectFit:imageFit}:undefined}/></div>}<div className="in">{!post.hideDate&&<span className="date">{fmt.format(new Date(post.publishedAt||post.createdAt))}</span>}<h3>{post.title}</h3><p>{post.excerpt}</p><span className="cat">{post.category}</span></div></Link>}
