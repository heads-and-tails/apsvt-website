import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const metadata:Metadata={title:"Історії Академії",description:"Реальні студентські, викладацькі й дослідницькі історії АПСВТ."};
const stories=[
  {title:"GreenFest: перший день у спільноті",desc:"Як кафедра психології знайомить студентів, відкриває можливості й формує команду.",image:"https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1500&q=90&auto=format&fit=crop",slug:"greenfest-psychology-community-2024",cat:"Студентське життя"},
  {title:"Дослідження, що допомагає громадам",desc:"Опитування територіальних громад перетворило практичні законодавчі проблеми на рекомендації.",image:"https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1300&q=90&auto=format&fit=crop",slug:"territorial-communities-law-survey-2023",cat:"Прикладна наука"},
  {title:"Громадська активність очима студентів",desc:"Міжвузівський семінар поєднав історію, соціальну роботу та сучасне волонтерство.",image:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1300&q=90&auto=format&fit=crop",slug:"student-civic-activity-seminar-2025",cat:"Студенти"},
  {title:"Право, яке працює для людини",desc:"Викладачка юридичного факультету пояснює трудові гарантії військовослужбовців.",image:"https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=1300&q=90&auto=format&fit=crop",slug:"legal-guidance-military-service-2024",cat:"Експертність"},
  {title:"Перша наукова робота",desc:"Конкурс із муніципального права відкриває молодим дослідникам шлях до публікації.",image:"https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1300&q=90&auto=format&fit=crop",slug:"best-municipal-law-research-2025",cat:"Наука"},
  {title:"Міжнародна розмова про відновлення",desc:"Команда маркетингу представила дослідження на міжнародній конференції 2026 року.",image:"https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1300&q=90&auto=format&fit=crop",slug:"marketing-research-international-conference-2026",cat:"Міжнародне"},
];

export default function Page(){return <main id="top"><SiteHeader />
  <section className="phero img"><div className="bgi"><img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=1800&q=92&auto=format&fit=crop" alt="Студентська команда" /></div><div className="wrap"><div className="crumb">Головна / Історії</div><h1>Справжні<br />історії</h1><p className="lead">Люди, дослідження й ініціативи з архіву Академії — без вигаданих кейсів.</p></div></section><div className="phero-rule" />
  <section><div className="wrap"><div className="sec-head"><div><div className="idx">01 / Академія в дії</div><h2>Досвід, який залишається</h2></div></div><div className="story-grid">{stories.map((story,i)=><Link className={`story ${i===0?"feat":""}`} href={`/news/${story.slug}`} key={story.slug}><div className="ph"><img src={story.image} alt="" /></div><span className="cat">{story.cat}</span><h3>{story.title}</h3><p>{story.desc}</p><span className="more">→</span></Link>)}</div></div></section>
  <SiteFooter /></main>}
