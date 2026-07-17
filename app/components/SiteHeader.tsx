"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ukLinks=[
  ["/about","Про Академію"],["/programs","Програми"],["/admissions","Вступ"],["/people","Люди"],
  ["/international","Міжнародне"],["/research","Наука"],["/facilities","Кампус"],["/events","Події"],["/students","Студенту"],["/news","Новини"],["/contacts","Контакти"],
];
const enLinks=[
  ["/en/about","About"],["/en/programs","Programmes"],["/en/admissions","Admissions"],["/en/people","People"],
  ["/en/international","International"],["/en/research","Research"],["/en/facilities","Campus"],["/en/events","Events"],["/en/students","Students"],["/en/news","News"],["/en/contacts","Contacts"],
];

export function SiteHeader(){const pathname=usePathname();const [open,setOpen]=useState(false);const english=pathname==="/en"||pathname.startsWith("/en/");const links=english?enLinks:ukLinks;const ukPath=english?(pathname.replace(/^\/en/,"")||"/"):pathname;const enPath=english?pathname:`/en${pathname==="/"?"":pathname}`;return <header className="legacy-header"><div className="wrap topbar">
  <Link className="brand" href={english?"/en":"/"} onClick={()=>setOpen(false)}><span className="brand-mark"><i>{english?"A":"А"}</i></span><span className="brand-name">{english?<>Academy of Labour,<br/>Social Relations and Tourism<em>Kyiv · established 1993</em></>:<>Академія праці,<br/>соціальних відносин і туризму<em>Київ · засновано 1993</em></>}</span></Link>
  <nav className={`mainnav ${open?"open":""}`} aria-label={english?"Main navigation":"Головна навігація"}>{links.map(([href,label])=><Link className={pathname===href||pathname.startsWith(`${href}/`)?"active":""} href={href} key={href} onClick={()=>setOpen(false)}>{label}</Link>)}</nav>
  <div className="hdr-right"><Link className="lang-toggle" href={english?ukPath:enPath} aria-label={english?"Українська версія":"English version"}>{english?"UA":"EN"}</Link><Link className="cta hdr-cta" href={english?"/en/admissions":"/admissions"}><span>{english?"Admissions 2026":"Вступ 2026"}</span></Link><button className={`burger ${open?"active":""}`} onClick={()=>setOpen(!open)} aria-label={english?"Menu":"Меню"} aria-expanded={open}><i/><i/><i/></button></div>
  </div></header>}
