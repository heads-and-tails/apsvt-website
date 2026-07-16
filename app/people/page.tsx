import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = { title: "Люди Академії", description: "Ректор, проректори, декани та керівники освітніх програм АПСВТ." };

const leadership=[
  {name:"Віктор Сухомлин",role:"Ректор",detail:"кандидат наук з державного управління, доцент · Заслужений працівник соціальної сфери України",img:"/viktor-sukhomlyn.jpg",profile:"https://scholar.google.com/citations?user=Fye2EVwAAAAJ&hl=en"},
  {name:"Ігор Чорнодід",role:"Проректор з навчально-педагогічної роботи",detail:"доктор економічних наук, професор",img:"/ihor-chornodid.png",profile:"https://scholar.google.com.ua/citations?user=zoVq-icAAAAJ&hl=uk"},
  {name:"Гліб Пріб",role:"Проректор з наукової роботи",detail:"доктор медичних наук, професор · автор понад 200 наукових і методичних праць",img:"/hlib-prib.jpg",profile:"https://scholar.google.com.ua/citations?hl=ru&user=kLThYfwAAAAJ"},
  {name:"Наталія Гончаренко",role:"Проректорка з міжнародних зв’язків",detail:"кандидатка психологічних наук · міжнародні програми та партнерства",initials:"НГ"},
];

const academic=[
  ["Ярослав Журавель","Декан юридичного факультету","доктор юридичних наук, професор"],
  ["Сергій Шолудченко","Декан факультету економіки, соціальних технологій та туризму","керівник академічної команди факультету"],
  ["Яніна Ткаченко","Завідувачка кафедри фінансів","кандидатка економічних наук, доцентка"],
  ["Надія Писаренко","Завідувачка кафедри маркетингу","кандидатка економічних наук"],
  ["Неля Василець","Завідувачка кафедри економіки підприємства та менеджменту","кандидатка економічних наук"],
  ["Яна Качан","Завідувачка кафедри публічного управління","кандидатка наук з державного управління, доцентка"],
  ["Наталія Балашова","Завідувачка кафедри соціально-трудових відносин та соціальної роботи","кандидатка економічних наук, доцентка"],
  ["Олена Міхо","Керівниця лабораторії «Академія подорожей»","практична підготовка студентів туризму"],
];

export default function Page(){return <main id="top"><SiteHeader />
  <section className="phero"><div className="wrap"><div className="crumb">Головна / Люди</div><h1>Люди<br />Академії</h1><p className="lead">Керівництво, декани, завідувачі кафедр, науковці й практики, які відповідають за якість програм та академічне середовище.</p></div></section><div className="phero-rule" />
  <section><div className="wrap"><div className="sec-head"><div><div className="idx">01 / Керівництво</div><h2>Ректорат</h2></div><Link className="sec-link" href="/research">Наукові профілі →</Link></div><div className="leadership-grid">{leadership.map(person=><article className="leader-card" key={person.name}><div className="leader-photo">{person.img?<img src={person.img} alt={person.name} />:<div className="photo-placeholder"><span>{person.initials}</span><small>Фото готується</small></div>}<span className="leader-role">{person.role}</span></div><div className="leader-info"><h3>{person.name}</h3><p>{person.detail}</p>{person.profile&&<a href={person.profile} target="_blank" rel="noreferrer">Google Scholar ↗</a>}</div></article>)}</div></div></section>
  <section className="soft"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Академічне керівництво</div><h2>Факультети й кафедри</h2></div></div><div className="academic-directory">{academic.map(([name,role,detail],i)=><article key={name}><span>{String(i+1).padStart(2,"0")}</span><div className="initial-tile">{name.split(" ").map(n=>n[0]).join("")}</div><div><h3>{name}</h3><b>{role}</b><p>{detail}</p></div></article>)}</div></div></section>
  <section className="deep-content"><div className="wrap deep-intro"><h2>Викладач поруч</h2><div><p>Академія поєднує науковців і практиків. Викладачі ведуть дослідження, юридичну та психологічну практику, управлінські й міжнародні проєкти.</p><Link className="cta dark" href="/programs"><span>Команди програм</span></Link></div></div></section>
  <SiteFooter /></main>}
