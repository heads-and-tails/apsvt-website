"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links=[
  ["/about","Про Академію"],["/programs","Програми"],["/admissions","Вступ"],["/people","Люди"],
  ["/international","Міжнародне"],["/research","Наука"],["/stories","Історії"],["/events","Події"],["/students","Студенту"],["/news","Новини"],["/contacts","Контакти"],
];

export function SiteHeader(){const pathname=usePathname();const [open,setOpen]=useState(false);return <header className="legacy-header"><div className="wrap topbar">
  <Link className="brand" href="/" onClick={()=>setOpen(false)}><span className="brand-mark"><i>А</i></span><span className="brand-name">Академія праці,<br/>соціальних відносин і туризму<em>Київ · засновано 1993</em></span></Link>
  <nav className={`mainnav ${open?"open":""}`} aria-label="Головна навігація">{links.map(([href,label])=><Link className={pathname===href?"active":""} href={href} key={href} onClick={()=>setOpen(false)}>{label}</Link>)}</nav>
  <div className="hdr-right"><Link className="cta hdr-cta" href="/admissions"><span>Вступ 2026</span></Link><button className={`burger ${open?"active":""}`} onClick={()=>setOpen(!open)} aria-label="Меню" aria-expanded={open}><i/><i/><i/></button></div>
  </div></header>}
