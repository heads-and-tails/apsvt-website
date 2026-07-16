import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { NewsCard } from "../components/NewsCard";
import { getPosts } from "@/lib/data";

export const metadata: Metadata = { title: "Медіа", description: "Новини, історії та ідеї спільноти АПСВТ." };

export const dynamic = "force-dynamic";

export default async function NewsPage(){
  const posts=await getPosts({limit:60});
  const featured=posts.find(p=>p.featured) || posts[0];
  const rest=posts.filter(p=>p.id!==featured?.id);
  return <main id="top"><SiteHeader />
    <section className="page-hero compact media-hero"><div><span className="kicker blue">Новини · Історії · Ідеї</span><h1>Академія<br /><i>говорить.</i></h1><p>Про людей, дослідження, партнерства й рішення, які народжуються у нашій спільноті.</p></div></section>
    {featured && <section className="featured-story section-pad"><NewsCard post={featured} large /></section>}
    <section className="media-grid section-pad">{rest.map(post=><NewsCard key={post.id} post={post} />)}</section>
    <section className="media-subscribe"><div><span className="kicker yellow">Щотижневий дайджест</span><h2>Одна пошта.<br />Найважливіше <i>за тиждень.</i></h2></div><form action="mailto:info@socosvita.kiev.ua" method="post"><input type="email" required placeholder="you@example.com" aria-label="Email" /><button type="submit">Підписатися →</button></form></section>
    <SiteFooter /></main>
}
