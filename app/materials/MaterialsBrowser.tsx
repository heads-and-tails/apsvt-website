"use client";
import {useEffect,useMemo,useState} from "react";
type Item={title:string;category:string;date:string;summary:string;href:string};

const VISNYK_ARCHIVE="https://www.socosvita.kiev.ua/publishing/bulletin/issues-list";
const VISNYK_2020_1_2="https://www.socosvita.kiev.ua/Visnyk_1_2_2020";

function resolveMaterialLink(item:Item){
  if(item.href==="/materials/visnyk-1-2-2020-50b2542a1.html")return VISNYK_2020_1_2;
  if(item.href.startsWith("/materials/visnyk-")||item.title.toLowerCase().startsWith("вісник апсвт"))return VISNYK_ARCHIVE;
  return item.href;
}

export function MaterialsBrowser(){const[items,setItems]=useState<Item[]>([]);const[query,setQuery]=useState("");const[category,setCategory]=useState("Усі");const[limit,setLimit]=useState(60);useEffect(()=>{fetch("/materials-index.json").then(r=>r.json()).then(setItems).catch(()=>setItems([]))},[]);const categories=useMemo(()=>["Усі",...Array.from(new Set(items.map(i=>i.category))).sort()], [items]);const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return items.filter(i=>(category==="Усі"||i.category===category)&&(!q||`${i.title} ${i.summary} ${i.category}`.toLowerCase().includes(q)))},[items,query,category]);return <div className="materials-browser"><div className="material-controls"><label>Пошук<input value={query} onChange={e=>{setQuery(e.target.value);setLimit(60)}} placeholder="Назва, тема або слово у змісті"/></label><label>Розділ<select value={category} onChange={e=>{setCategory(e.target.value);setLimit(60)}}>{categories.map(c=><option key={c}>{c}</option>)}</select></label></div><div className="material-count">Знайдено {filtered.length.toLocaleString("uk-UA")} матеріалів</div><div className="material-grid">{filtered.slice(0,limit).map((item,index)=>{const href=resolveMaterialLink(item);const external=href.startsWith("http");return <a href={href} target={external?"_blank":undefined} rel={external?"noreferrer":undefined} className="material-card" key={item.href}><span>{String(index+1).padStart(3,"0")}</span><div><small>{item.category}{item.date?` · ${item.date}`:""}{external?" · Офіційний ресурс":""}</small><h2>{item.title}</h2><p>{item.summary}</p></div><b>{external?"↗":"→"}</b></a>})}</div>{limit<filtered.length&&<button className="load-more" onClick={()=>setLimit(v=>v+60)}>Показати більше</button>}</div>}
