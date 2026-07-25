import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PageDocuments } from "../components/PageDocuments";

export const metadata: Metadata = { title: "Люди Академії", description: "Ректор, проректори, декани та керівники освітніх програм АПСВТ." };

const leadership=[
  {name:"Віктор Сухомлин",role:"Ректор",detail:"кандидат наук з державного управління, доцент · Заслужений працівник соціальної сфери України",img:"/viktor-sukhomlyn.jpg",profile:"https://scholar.google.com/citations?user=Fye2EVwAAAAJ&hl=en"},
  {name:"Ігор Чорнодід",role:"Проректор з навчально-педагогічної роботи",detail:"доктор економічних наук, професор",img:"/ihor-chornodid.png",profile:"https://scholar.google.com.ua/citations?user=zoVq-icAAAAJ&hl=uk"},
  {name:"Гліб Пріб",role:"Проректор з наукової роботи",detail:"доктор медичних наук, професор · автор понад 200 наукових і методичних праць",img:"/hlib-prib.jpg",profile:"https://scholar.google.com.ua/citations?hl=ru&user=kLThYfwAAAAJ"},
  {name:"Наталія Гончаренко",role:"Проректорка з міжнародних зв’язків",detail:"кандидатка психологічних наук · міжнародні програми та партнерства",initials:"НГ"},
];

const facultyGroups=[
  {name:"Факультет економіки, соціальних технологій та туризму",code:"ФЕСТТ",people:[
    ["Ігор Чорнодід","Професор кафедри економіки та менеджменту","доктор економічних наук · соціальна економіка та економічна безпека"],
    ["Тетяна Камінська","Професорка кафедри фінансів","докторка економічних наук · фінансові системи та управління"],
    ["Віра Куценко","Професорка кафедри маркетингу","докторка економічних наук · соціальна економіка та розвиток"],
    ["Людмила Бегеза","Завідувачка кафедри психології","докторка психологічних наук, професорка · професійний розвиток особистості"],
    ["Гліб Пріб","Професор кафедри психології","доктор медичних наук, професор · психічне здоров’я та психологія"],
    ["Олена Карагодіна","Професорка соціальної роботи","докторка медичних наук · соціальна психіатрія та консультування"],
    ["Віктор Співак","Професор соціогуманітарних дисциплін","доктор політичних наук · глобалістика та соціологія політики"],
    ["Ганна Добровольська","Професорка гуманітарних дисциплін","докторка історичних наук · громадянське суспільство та історія профспілок"],
  ]},
  {name:"Юридичний факультет",code:"ЮФ",people:[
    ["Ярослав Журавель","Декан, професор кафедри публічного права","доктор юридичних наук · муніципальне й адміністративне право"],
    ["Юрій Оніщик","Професор кафедри публічного права","фінансове, податкове, митне право та право ЄС"],
    ["Олена Майданник","Професорка кафедри публічного права","конституційне і парламентське право"],
    ["Віктор Кравченко","Професор кафедри публічного права","виборче право та конституційний процес"],
    ["Володимир Ліпкан","Професор кримінального права","доктор юридичних наук · національна безпека та кримінальний процес"],
    ["Ігор Діордіца","Професор кримінального права","доктор юридичних наук · інформаційне право і безпека"],
    ["Галина Муляр","Професорка кримінального права","докторка юридичних наук · міжнародне судочинство"],
    ["Василь Бонтлаб","Професор цивільного і трудового права","доктор юридичних наук · цивільний процес"],
    ["Людмила Раєцька","Професорка юридичного факультету","кандидатка юридичних наук · фінансове та банківське право"],
  ]},
];

export default function Page(){return <main id="top"><SiteHeader />
  <section className="phero"><div className="wrap"><div className="crumb">Головна / Люди</div><h1>Люди<br />Академії</h1><p className="lead">Керівництво, декани, завідувачі кафедр, науковці й практики, які відповідають за якість програм та академічне середовище.</p></div></section><div className="phero-rule" />
  <section><div className="wrap"><div className="sec-head"><div><div className="idx">01 / Керівництво</div><h2>Ректорат</h2></div><Link className="sec-link" href="/research">Наукові профілі →</Link></div><div className="leadership-grid">{leadership.map(person=><article className="leader-card" key={person.name}><div className="leader-photo">{person.img?<img src={person.img} alt={person.name} />:<div className="photo-placeholder" aria-label={person.name}><span>{person.initials}</span></div>}<span className="leader-role">{person.role}</span></div><div className="leader-info"><h3>{person.name==="Наталія Гончаренко"?<>Наталія <span className="leader-surname">Гончаренко</span></>:person.name}</h3><p>{person.detail}</p>{person.profile&&<a href={person.profile} target="_blank" rel="noreferrer">Google Scholar ↗</a>}</div></article>)}</div></div></section>
  <section className="soft"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Професорський склад</div><h2>Дослідники за факультетами</h2></div><Link className="sec-link" href="/research">Пошук публікацій →</Link></div><div className="faculty-groups">{facultyGroups.map(group=><section className="faculty-group" key={group.code}><div className="faculty-group-head"><span>{group.code}</span><h3>{group.name}</h3><b>{group.people.length} професорів</b></div><div className="professor-list">{group.people.map(([name,role,detail],i)=><article key={name}><span>{String(i+1).padStart(2,"0")}</span><div className="initial-tile">{name.split(" ").map(n=>n[0]).join("")}</div><div><h4>{name}</h4><b>{role}</b><p>{detail}</p></div></article>)}</div></section>)}</div></div></section>
  <section className="deep-content"><div className="wrap deep-intro"><h2>Викладач поруч</h2><div><p>Академія поєднує науковців і практиків. Викладачі ведуть дослідження, юридичну та психологічну практику, управлінські й міжнародні проєкти.</p><Link className="cta dark" href="/programs"><span>Команди програм</span></Link></div></div></section>
  <PageDocuments pagePath="/people" />
  <SiteFooter /></main>}
