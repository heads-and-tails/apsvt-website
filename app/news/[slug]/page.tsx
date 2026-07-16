import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { getPostBySlug, getPosts } from "@/lib/data";
import { NewsCard } from "../../components/NewsCard";

export const dynamic = "force-dynamic";

type Props={params:Promise<{slug:string}>};

export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const post=await getPostBySlug(slug);return post?{title:post.title,description:post.excerpt,openGraph:{title:post.title,description:post.excerpt,images:[post.imageUrl]}}:{title:"Матеріал не знайдено"}}

export default async function ArticlePage({params}:Props){
  const {slug}=await params;const post=await getPostBySlug(slug);if(!post)notFound();
  const related=(await getPosts({limit:8})).filter(p=>p.id!==post.id).slice(0,3);
  const date=new Intl.DateTimeFormat("uk-UA",{day:"2-digit",month:"long",year:"numeric"}).format(new Date(post.publishedAt||post.createdAt));
  return <main id="top"><SiteHeader />
    <article className="article-page"><header className="article-head"><Link href="/news">← Усі матеріали</Link><div className="article-meta"><span>{post.category}</span><time>{date}</time><span>6 хв читання</span></div><h1>{post.title}</h1><p>{post.excerpt}</p></header>
      <div className="article-cover"><img src={post.imageUrl} alt={post.imageAlt} /></div>
      <div className="article-layout"><aside><span>Поділитися</span><a href={`mailto:?subject=${encodeURIComponent(post.title)}`}>Email</a><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`/news/${post.slug}`)}`} target="_blank" rel="noreferrer">LinkedIn</a></aside><div className="article-body">{post.body.split(/\n\n+/).map((paragraph,index)=>index===0?<p className="lead" key={index}>{paragraph}</p>:<p key={index}>{paragraph}</p>)}<blockquote>Освіта стає цінною тоді, коли нове знання переходить у відповідальну дію.</blockquote><div className="article-author"><span>АП</span><div><b>Редакція АПСВТ</b><p>Історії академічної спільноти</p></div></div></div></div>
    </article>
    <section className="related-news section-pad"><div className="section-heading"><div><span className="kicker blue">Читайте далі</span><h2>Ще з<br /><i>Академії.</i></h2></div></div><div className="media-grid compact-grid">{related.map(p=><NewsCard key={p.id} post={p}/>)}</div></section><SiteFooter /></main>
}
