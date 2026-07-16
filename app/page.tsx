import Link from "next/link";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { NewsCard } from "./components/NewsCard";
import { getPosts } from "@/lib/data";

const programs = [
  { code: "D8", title: "Право", text: "Право, соціальна справедливість і практика у юридичній клініці.", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=88&auto=format&fit=crop" },
  { code: "C1", title: "Економіка", text: "Аналітика, підприємництво та рішення для нової економіки.", image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=88&auto=format&fit=crop" },
  { code: "D3", title: "Менеджмент", text: "Лідерство, команди й управління змінами через реальні кейси.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=88&auto=format&fit=crop" },
  { code: "J3", title: "Туризм", text: "Гостинність, сталий туризм і міжнародна індустрія в дії.", image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1200&q=88&auto=format&fit=crop" },
];

export default async function Home() {
  const posts = await getPosts({ limit: 3 });
  return (
    <main id="top">
      <SiteHeader inverse />
      <section className="hero">
        <div className="hero-gridline" />
        <div className="hero-copy">
          <span className="kicker yellow">Академія у Києві · з 1993 року</span>
          <h1>Знання<br />для <i>людей</i><br />і змін.</h1>
          <div className="hero-bottom"><p>Університет, де право, економіка, соціальна робота й туризм зустрічаються з реальним світом.</p><Link className="round-link" href="/programs">Обрати<br />програму <span>↗</span></Link></div>
        </div>
        <div className="hero-visual">
          <img className="hero-image" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1800&q=92&auto=format&fit=crop" alt="Студентська команда працює разом" />
          <div className="hero-stamp"><b>33</b><span>роки освіти<br />з людським виміром</span></div>
          <div className="hero-note">Київ<br />50.3684° N<br />30.4549° E</div>
        </div>
      </section>
      <div className="ticker" aria-label="Напрями Академії"><div>ПРАВО · ЕКОНОМІКА · МЕНЕДЖМЕНТ · СОЦІАЛЬНА РОБОТА · ПСИХОЛОГІЯ · ТУРИЗМ · ФІНАНСИ · <span>ОСВІТА, ЩО ДІЄ</span> · ПРАВО · ЕКОНОМІКА ·</div></div>

      <section className="manifesto section-pad">
        <span className="section-index">01 / ІДЕЯ</span>
        <div><span className="kicker blue">Не просто диплом</span><h2>Тут освіта стає<br /><i>особистою дією.</i></h2></div>
        <div className="manifesto-copy"><p>Ми будуємо навчання навколо людини: її запитань, таланту та майбутньої професійної відповідальності.</p><p>Невеликі групи, викладачі-практики, міжнародні проєкти й робота з реальними викликами — щоб знання мало результат ще до випуску.</p><Link className="text-link" href="/about">Дізнатися про Академію →</Link></div>
      </section>

      <section className="program-section section-pad">
        <div className="section-heading"><div><span className="kicker">Освітні траєкторії</span><h2>Програми для<br /><i>реального світу.</i></h2></div><Link className="pill-link" href="/programs">Усі програми ↗</Link></div>
        <div className="program-grid">{programs.map((program, index) => <Link href="/programs" className="program-card" key={program.title}><div className="program-image"><img src={program.image} alt="" /></div><div className="program-top"><span>{String(index + 1).padStart(2, "0")}</span><b>{program.code}</b></div><h3>{program.title}</h3><p>{program.text}</p><span className="card-arrow">↗</span></Link>)}</div>
      </section>

      <section className="experience">
        <div className="experience-image"><img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1800&q=92&auto=format&fit=crop" alt="Студенти працюють у навчальній лабораторії" /><span>Кампус · Київ</span></div>
        <div className="experience-copy"><span className="kicker yellow">Досвід АПСВТ</span><h2>Навчатися.<br />Досліджувати.<br /><i>Впливати.</i></h2><div className="stats"><div><b>30+</b><span>міжнародних партнерств</span></div><div><b>12</b><span>освітніх напрямів</span></div><div><b>1:12</b><span>викладачів до студентів</span></div></div><Link className="button-light" href="/admissions">План вступу 2026 →</Link></div>
      </section>

      <section className="news-section section-pad">
        <div className="section-heading"><div><span className="kicker blue">Жива Академія</span><h2>Останнє<br /><i>з медіа.</i></h2></div><Link className="pill-link dark" href="/news">Усі матеріали ↗</Link></div>
        <div className="home-news">{posts.map((post, index) => <NewsCard key={post.id} post={post} large={index === 0} />)}</div>
      </section>

      <section className="admission-call">
        <div><span className="kicker yellow">Вступ 2026</span><h2>Твій наступний<br />крок — <i>зараз.</i></h2></div>
        <div><p>Отримай персональну консультацію, порівняй програми та склади зрозумілий план вступу.</p><Link className="round-link yellow-round" href="/admissions">Почати<br />вступ <span>↗</span></Link></div>
      </section>
      <SiteFooter />
    </main>
  );
}
