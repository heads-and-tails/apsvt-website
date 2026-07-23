import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PageDocuments } from "../components/PageDocuments";

export const metadata: Metadata = { title:"Міжнародні можливості", description:"Erasmus+, подвійний диплом, міжнародні проєкти та партнерства АПСВТ." };
export const dynamic = "force-dynamic";

const opportunities=[
  {n:"01",title:"Erasmus+ · Jean Monnet",text:"Європейські студії, відкриті курси та дослідницькі модулі. У 2025 році Академія реалізовувала GreenFinEDU та ECONOMY4ALL для студентів і аспірантів.",tag:"Навчання · дослідження"},
  {n:"02",title:"Подвійний диплом",text:"Паралельне навчання в АПСВТ і партнерському європейському закладі з перезарахуванням профільних дисциплін та дипломної роботи.",tag:"Україна · Польща"},
  {n:"03",title:"Навчання у Ченстохові",text:"Для соціальної роботи та споріднених напрямів доступна програма з Вищою лінгвістичною школою у Ченстохові. Передбачені очні заняття та стажування.",tag:"Мобільність"},
  {n:"04",title:"Міжнародна Академія Гостинності",text:"Додаткові професійні компетентності для студентів туризму: екскурсійна справа, готельно-ресторанний сервіс та практична підготовка.",tag:"Туризм · гостинність"},
  {n:"05",title:"Міжнародні правничі програми",text:"LLM, партнерські юридичні проєкти, гостьові лектори та співпраця з організаціями правової допомоги для програм Право і Міжнародне право.",tag:"Право"},
  {n:"06",title:"Нові партнерства",text:"У 2026 році Академія розширила освітню й наукову співпрацю з університетами Азербайджану, зосередившись на обмінах, спільних дослідженнях та підготовці фахівців.",tag:"Україна · Азербайджан"},
];

export default function Page(){return <main id="top"><SiteHeader />
  <section className="phero img international-hero"><div className="bgi"><img src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1900&q=92&auto=format&fit=crop" alt="Міжнародна студентська мобільність" /></div><div className="wrap"><div className="crumb">Головна / Міжнародне</div><h1>Світ відкритий<br />до співпраці</h1><p className="lead">Подвійні дипломи, Erasmus+, європейські студії, мобільність, міжнародна практика та спільні дослідження.</p></div></section><div className="phero-rule" />
  <section><div className="wrap"><div className="sec-head"><div><div className="idx">01 / Можливості</div><h2>Ваш міжнародний маршрут</h2></div></div><div className="opportunity-grid">{opportunities.map(o=><article key={o.n}><span>{o.n}</span><small>{o.tag}</small><h3>{o.title}</h3><p>{o.text}</p></article>)}</div></div></section>
  <section className="intl-band"><div className="wrap"><div><div className="idx">02 / Як долучитися</div><h2>Від ідеї до мобільності</h2></div><div className="intl-steps"><p><b>01</b>Оберіть програму й перевірте доступні формати.</p><p><b>02</b>Підготуйте мотивацію та підтвердження знання мови.</p><p><b>03</b>Узгодьте дисципліни й індивідуальний навчальний план.</p><p><b>04</b>Отримайте супровід міжнародного відділу.</p></div></div></section>
  <section className="soft"><div className="wrap split"><div className="copy"><div className="idx">03 / Подвійний диплом</div><h2>Два академічні середовища</h2><p className="lead">Програма не перериває навчання в Україні та дозволяє паралельно здобувати освіту у партнерському європейському закладі.</p><p>Доступність напряму, мова, формат і фінансування залежать від поточного набору.</p><Link className="cta dark" href="/contacts"><span>Запитати міжнародний відділ</span></Link></div><div className="international-facts"><div><b>2</b><span>дипломи</span></div><div><b>EU</b><span>навчальні модулі</span></div><div><b>30+</b><span>партнерських контактів</span></div><div><b>1</b><span>узгоджений план</span></div></div></div></section>
  <PageDocuments pagePath="/international" />
  <SiteFooter /></main>}
