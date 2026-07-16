import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = { title: "Освітні програми", description: "Бакалаврські та магістерські програми АПСВТ." };

const programs = [
  { code:"D8", title:"Право", degree:"Бакалавр · Магістр", desc:"Правові системи, соціальна справедливість, юридична клініка та міжнародна практика.", tags:["Право", "Медіація", "LLM"], image:"https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=88&auto=format&fit=crop" },
  { code:"C1", title:"Економіка", degree:"Бакалавр · Магістр", desc:"Аналітика, економіка підприємства, моделювання та рішення для мінливого ринку.", tags:["Аналітика", "Бізнес", "Дані"], image:"https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=88&auto=format&fit=crop" },
  { code:"D3", title:"Менеджмент", degree:"Бакалавр · Магістр", desc:"Управління організаціями, командами, проєктами та інноваційними змінами.", tags:["Лідерство", "Проєкти", "HR"], image:"https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=88&auto=format&fit=crop" },
  { code:"D5", title:"Маркетинг", degree:"Бакалавр · Магістр", desc:"Дослідження аудиторій, бренд-стратегія, цифрові комунікації та креативна економіка.", tags:["Бренд", "Digital", "Стратегія"], image:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=88&auto=format&fit=crop" },
  { code:"I1", title:"Соціальна робота", degree:"Бакалавр · Магістр", desc:"Підтримка людей і громад, соціальна політика та практики стійкості.", tags:["Громади", "Політика", "Допомога"], image:"https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=88&auto=format&fit=crop" },
  { code:"C4", title:"Психологія", degree:"Бакалавр · Магістр", desc:"Психічне здоров’я, організаційна психологія та доказові практики консультування.", tags:["Добробут", "Команди", "Практика"], image:"https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1200&q=88&auto=format&fit=crop" },
  { code:"J3", title:"Туризм і гостинність", degree:"Бакалавр · Магістр", desc:"Сталі подорожі, сервіс-дизайн, подієвий менеджмент та міжнародна індустрія.", tags:["Hospitality", "Сервіс", "Події"], image:"https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1200&q=88&auto=format&fit=crop" },
  { code:"D2", title:"Фінанси", degree:"Бакалавр · Магістр", desc:"Фінансова грамотність, корпоративні фінанси, ризики та зелені інвестиції.", tags:["FinTech", "Ризики", "GreenFin"], image:"https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=88&auto=format&fit=crop" },
];

export default function ProgramsPage(){return <main id="top"><SiteHeader />
  <section className="page-hero compact"><div><span className="kicker blue">Освітні програми</span><h1>Обери не фах.<br />Обери <i>траєкторію.</i></h1><p>Поєднуй дисципліни, практику та міжнародний досвід у програмі, яка відповідає твоїм амбіціям.</p></div></section>
  <section className="program-catalog section-pad"><div className="catalog-intro"><span>8 напрямів</span><p>Кожна програма має базову професійну рамку й простір вибору: сертифікатні модулі, вибіркові курси, проєкти та практику.</p></div><div className="catalog-grid">{programs.map((p,i)=><article className="catalog-card" key={p.title}><div className="catalog-photo"><img src={p.image} alt="" /><span>{p.degree}</span></div><div className="catalog-copy"><div><span>{String(i+1).padStart(2,"0")}</span><b>{p.code}</b></div><h2>{p.title}</h2><p>{p.desc}</p><ul>{p.tags.map(t=><li key={t}>{t}</li>)}</ul><Link href="/admissions#consultation">Отримати консультацію →</Link></div></article>)}</div></section>
  <section className="choice-lab"><div><span className="kicker yellow">Не впевнені?</span><h2>Знайдемо програму<br />за твоїми <i>сильними сторонами.</i></h2></div><div><p>30-хвилинна розмова з консультантом допоможе порівняти програми, формат навчання та кар’єрні сценарії.</p><Link className="button-light" href="/admissions#consultation">Записатися →</Link></div></section><SiteFooter /></main>}
