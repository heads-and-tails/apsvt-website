import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { EnglishFooter } from "@/app/components/EnglishFooter";
import { MaterialsBrowser } from "@/app/materials/MaterialsBrowser";
import { PublicationSearch } from "@/app/research/PublicationSearch";
import { BookCatalogue } from "@/app/facilities/library/BookCatalogue";

const leadership = [
  {name:"Viktor Sukhomlyn",role:"Rector",detail:"PhD in Public Administration, Associate Professor · Honoured Worker of the Social Sphere of Ukraine",img:"/viktor-sukhomlyn.jpg",profile:"https://scholar.google.com/citations?user=Fye2EVwAAAAJ&hl=en"},
  {name:"Ihor Chornodid",role:"Vice-Rector for Academic Affairs",detail:"Doctor of Economics, Professor",img:"/ihor-chornodid.png",profile:"https://scholar.google.com.ua/citations?user=zoVq-icAAAAJ&hl=uk"},
  {name:"Hlib Prib",role:"Vice-Rector for Research",detail:"Doctor of Medical Sciences, Professor · author of more than 200 research and methodological works",img:"/hlib-prib.jpg",profile:"https://scholar.google.com.ua/citations?hl=ru&user=kLThYfwAAAAJ"},
  {name:"Nataliia Honcharenko",role:"Vice-Rector for International Relations",detail:"PhD in Psychology · international programmes and partnerships",initials:"NH"},
];

const facultyGroups = [
  {name:"Faculty of Economics, Social Technologies and Tourism",code:"FESTT",people:[
    ["Ihor Chornodid","Professor of Economics and Management","Doctor of Economics · social economy and economic security"],
    ["Tetiana Kaminska","Professor of Finance","Doctor of Economics · financial systems and management"],
    ["Vira Kutsenko","Professor of Marketing","Doctor of Economics · social economy and development"],
    ["Liudmyla Beheza","Head of the Department of Psychology","Doctor of Psychology, Professor · professional development"],
    ["Hlib Prib","Professor of Psychology","Doctor of Medical Sciences, Professor · mental health and psychology"],
    ["Olena Karagodina","Professor of Social Work","Doctor of Medical Sciences · social psychiatry and counselling"],
    ["Viktor Spivak","Professor of Social Sciences and Humanities","Doctor of Political Sciences · global studies and political sociology"],
    ["Hanna Dobrovolska","Professor of Humanities","Doctor of History · civil society and trade-union history"],
  ]},
  {name:"Faculty of Law",code:"LAW",people:[
    ["Yaroslav Zhuravel","Dean, Professor of Public Law","Doctor of Law · municipal and administrative law"],
    ["Yurii Onishchyk","Professor of Public Law","Financial, tax, customs and European Union law"],
    ["Olena Maidannyk","Professor of Public Law","Constitutional and parliamentary law"],
    ["Viktor Kravchenko","Professor of Public Law","Electoral law and constitutional procedure"],
    ["Volodymyr Lipkan","Professor of Criminal Law","Doctor of Law · national security and criminal procedure"],
    ["Ihor Diorditsa","Professor of Criminal Law","Doctor of Law · information law and security"],
    ["Halyna Muliar","Professor of Criminal Law","Doctor of Law · international justice"],
    ["Vasyl Bontlab","Professor of Civil and Labour Law","Doctor of Law · civil procedure"],
    ["Liudmyla Raietska","Professor of Law","PhD in Law · financial and banking law"],
  ]},
];

export function EnglishPeoplePage() {
  return <main id="top" className="english-page"><SiteHeader />
    <section className="phero"><div className="wrap"><div className="crumb">Home / Leadership · Faculty · Researchers</div><h1>People of the Academy</h1><p className="lead">Meet the rector, academic leaders, faculty heads, researchers and practitioners responsible for programme quality and the learning environment.</p></div></section><div className="phero-rule" />
    <section><div className="wrap"><div className="sec-head"><div><div className="idx">01 / Leadership</div><h2>Rectorate</h2></div><Link className="sec-link" href="/en/research">Research profiles →</Link></div><div className="leadership-grid">{leadership.map((person) => <article className="leader-card" key={person.name}><div className="leader-photo">{person.img ? <img src={person.img} alt={person.name} /> : <div className="photo-placeholder" aria-label={person.name}><span>{person.initials}</span></div>}<span className="leader-role">{person.role}</span></div><div className="leader-info"><h3>{person.name}</h3><p>{person.detail}</p>{person.profile && <a href={person.profile} target="_blank" rel="noreferrer">Google Scholar ↗</a>}</div></article>)}</div></div></section>
    <section className="soft"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Academic staff</div><h2>Researchers by faculty</h2></div><Link className="sec-link" href="/en/research">Search publications →</Link></div><div className="faculty-groups">{facultyGroups.map((group) => <section className="faculty-group" key={group.code}><div className="faculty-group-head"><span>{group.code}</span><h3>{group.name}</h3><b>{group.people.length} professors</b></div><div className="professor-list">{group.people.map(([name,role,detail],index) => <article key={name}><span>{String(index + 1).padStart(2,"0")}</span><div className="initial-tile">{name.split(" ").map((part) => part[0]).join("")}</div><div><h4>{name}</h4><b>{role}</b><p>{detail}</p></div></article>)}</div></section>)}</div></div></section>
    <section className="deep-content"><div className="wrap deep-intro"><h2>Faculty within reach</h2><div><p>Academy lecturers combine research and professional practice in law, psychology, public administration, business and social services.</p><Link className="cta dark" href="/en/programs"><span>Programme teams</span></Link></div></div></section>
    <EnglishFooter />
  </main>;
}

export function EnglishResearchPage() {
  return <main id="top" className="english-page"><SiteHeader />
    <section className="phero"><div className="wrap"><div className="crumb">Home / Research</div><h1>Research and publications</h1><p className="lead">Search Academy authors, topics and years across Google Scholar profiles, faculty publications and the Scientific Bulletin archive.</p></div></section><div className="phero-rule" />
    <section className="research-portals"><div className="wrap portal-grid"><Link href="/en/research/journals"><span>01</span><div><small>Publishing</small><h2>Academic journals</h2><p>The APSVT Scientific Bulletin, thematic issues, archive access and guidance for authors.</p></div><b>→</b></Link><Link href="/en/research/conferences"><span>02</span><div><small>Research events</small><h2>Conferences</h2><p>Programmes, participation routes and proceedings from Academy research events.</p></div><b>→</b></Link></div></section>
    <PublicationSearch language="en" />
    <EnglishFooter />
  </main>;
}

export function EnglishMaterialsPage() {
  return <main id="top" className="english-page"><SiteHeader />
    <section className="phero"><div className="wrap"><div className="crumb">Home / Materials</div><h1>Academy materials</h1><p className="lead">The complete searchable collection of programme information, research resources, institutional documents and archived publications.</p></div></section><div className="phero-rule" />
    <section><div className="wrap"><MaterialsBrowser language="en" /></div></section>
    <EnglishFooter />
  </main>;
}

export function EnglishLibraryPage() {
  return <main id="top" className="english-page"><SiteHeader />
    <section className="phero img"><div className="bgi"><img src="/apsvt-library.jpg" alt="Academy library" /></div><div className="wrap"><div className="crumb">Campus / Library</div><h1>Knowledge in open access</h1><p className="lead">Books, periodicals, teaching collections and a focused place for independent study.</p></div></section><div className="phero-rule" />
    <section><div className="wrap"><div className="library-stats"><article><b>70,000+</b><span>book copies</span></article><article><b>1,517</b><span>teaching collections</span></article><article><b>50</b><span>periodical titles</span></article><article><b>1993</b><span>library established</span></article></div></div></section>
    <section className="soft"><div className="wrap detail-layout"><div className="detail-copy"><div className="idx">01 / Services</div><h2>Work at your own pace</h2><p className="lede">The collection supports every Academy discipline with teaching, research, reference and methodological publications.</p><div className="rows"><div className="row"><span className="rnum">01</span><div><h3>Open reading room</h3><p>Books are arranged by subject and periodicals alphabetically.</p></div></div><div className="row"><span className="rnum">02</span><div><h3>Loans</h3><p>Borrow eligible teaching publications for work outside the reading room.</p></div></div><div className="row"><span className="rnum">03</span><div><h3>Catalogues</h3><p>Search the card and electronic catalogues by author, title, subject or shelfmark.</p></div></div></div></div><aside className="detail-aside"><div className="panel"><h3>Opening hours</h3><ul><li><span className="y">Mon–Thu</span>08:45–17:45</li><li><span className="y">Fri</span>08:45–16:30</li><li><span className="y">Sat–Sun</span>closed</li><li><span className="y">Address</span>3-B Kiltseva Road</li><li><span className="y">Phone</span><a href="tel:+380445260723">+38 (044) 526-07-23</a></li></ul></div><p className="aside-hint">The last day of each month is a maintenance day. Opening hours may change during academic breaks.</p></aside></div></section>
    <section id="catalogue"><div className="wrap"><div className="sec-head"><div><div className="idx">02 / Electronic catalogue</div><h2>Find a book</h2></div><p>Search by title, author, subject or library shelfmark.</p></div><BookCatalogue language="en" /></div></section>
    <EnglishFooter />
  </main>;
}
