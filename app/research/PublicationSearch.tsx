"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const scholarProfiles=[
  {name:"Віктор Сухомлин",field:"Публічне управління, зайнятість",url:"https://scholar.google.com/citations?user=Fye2EVwAAAAJ&hl=en",metric:"h-index 2 · 7 цитувань"},
  {name:"Ігор Чорнодід",field:"Соціальна економіка, економічна безпека",url:"https://scholar.google.com.ua/citations?user=zoVq-icAAAAJ&hl=uk",metric:"Scopus · ORCID · Google Scholar"},
  {name:"Гліб Пріб",field:"Психіатрія, психологія, психічне здоров’я",url:"https://scholar.google.com.ua/citations?hl=ru&user=kLThYfwAAAAJ",metric:"200+ наукових і методичних праць"},
];

const publications=[
  {year:"2026",author:"Ігор Чорнодід, Неля Василець, Наталія Головач",title:"Грейдинг і компетентнісно-кваліфікаційний підхід як основа оптимізації систем оплати праці будівельних підприємств",type:"Стаття",topic:"Економіка праці",href:"https://repository.sspu.edu.ua/items/d6f124ae-897f-47f7-9a89-bff4ac7a7c57"},
  {year:"2025",author:"Ігор Чорнодід, Людмила Гуляєва",title:"Європейські ініціативи у сфері соціальної економіки: інструменти, політики та можливості для України",type:"Стаття · DOI",topic:"Соціальна економіка",href:"https://doi.org/10.32782/2524-0072/2025-80-165"},
  {year:"2022",author:"Гліб Пріб, Яна Раєвська, Людмила Бегеза",title:"Соціально-психологічні особливості адаптації особистості в умовах бойових дій",type:"Стаття",topic:"Психологія",href:"https://www.irbis-nbuv.gov.ua/cgi-bin/irbis_nbuv/cgiirbis_64.exe?2_S21P03=FILA%3D&2_S21STR=sntnvusp_2022_33%2872%29_2_19&C21COM=S&I21DBN=LINK&P21DBN=UJRN"},
  {year:"2020",author:"Ігор Чорнодід, Олена Баженова",title:"Умови торгівлі та індустріалізація: реалії в Україні",type:"Стаття",topic:"Економіка",href:"https://scholar.google.com/scholar?q=%D0%A7%D0%BE%D1%80%D0%BD%D0%BE%D0%B4%D1%96%D0%B4+%D0%A3%D0%BC%D0%BE%D0%B2%D0%B8+%D1%82%D0%BE%D1%80%D0%B3%D1%96%D0%B2%D0%BB%D1%96+%D1%82%D0%B0+%D1%96%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D1%96%D0%B0%D0%BB%D1%96%D0%B7%D0%B0%D1%86%D1%96%D1%8F"},
  {year:"2018",author:"Віктор Сухомлин",title:"Ідентифікація проблеми зайнятості у контексті сучасних дослідницьких підходів",type:"Стаття · DOI",topic:"Зайнятість",href:"https://doi.org/10.33990/2070-4038.22.2018.164722"},
  {year:"2014",author:"Ігор Чорнодід",title:"Соціальна конкурентоспроможність національної економіки: сутність, показники та чинники забезпечення",type:"Монографія",topic:"Економіка",href:"https://scholar.google.com/scholar?q=%D0%A1%D0%BE%D1%86%D1%96%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0+%D0%BA%D0%BE%D0%BD%D0%BA%D1%83%D1%80%D0%B5%D0%BD%D1%82%D0%BE%D1%81%D0%BF%D1%80%D0%BE%D0%BC%D0%BE%D0%B6%D0%BD%D1%96%D1%81%D1%82%D1%8C+%D0%A7%D0%BE%D1%80%D0%BD%D0%BE%D0%B4%D1%96%D0%B4"},
  {year:"2020",author:"Колектив авторів АПСВТ",title:"Вісник АПСВТ, 2020, №1–2",type:"Вісник Академії",topic:"Право · соціальна робота",href:"/materials/visnyk-1-2-2020-50b2542a1.html"},
  {year:"2019",author:"Колектив авторів АПСВТ",title:"Вісник АПСВТ, 2019, №4",type:"Вісник Академії",topic:"Економіка · право",href:"/materials/visnyk-4-2019-012fd0cbb.html"},
  {year:"2019",author:"Колектив авторів АПСВТ",title:"Вісник АПСВТ, 2019, №3",type:"Вісник Академії",topic:"Соціальна робота",href:"/materials/visnyk-3-2019-665fcaf31.html"},
  {year:"2018",author:"Колектив авторів АПСВТ",title:"Вісник АПСВТ, 2018, №4",type:"Вісник Академії",topic:"Соціальна робота · ринок праці",href:"/materials/visnyk-4-2018-d95ccb926.html"},
];

export function PublicationSearch(){
  const [query,setQuery]=useState("");const [topic,setTopic]=useState("Усі теми");
  const topics=["Усі теми",...Array.from(new Set(publications.map(p=>p.topic)))];
  const filtered=useMemo(()=>publications.filter(p=>(topic==="Усі теми"||p.topic===topic)&&`${p.title} ${p.author} ${p.year} ${p.topic}`.toLowerCase().includes(query.toLowerCase())),[query,topic]);
  const scholarQuery=`https://scholar.google.com/scholar?q=${encodeURIComponent(query||"Академія праці соціальних відносин і туризму")}`;
  return <section><div className="wrap"><div className="sec-head"><div><div className="idx">01 / Наукові профілі</div><h2>Дослідники</h2></div></div><div className="scholar-profiles">{scholarProfiles.map(p=><a href={p.url} target="_blank" rel="noreferrer" key={p.name}><span>Google Scholar</span><h3>{p.name}</h3><p>{p.field}</p><small>{p.metric}</small><b>↗</b></a>)}</div>
    <div className="research-head"><div><div className="idx">02 / Каталог</div><h2>Пошук публікацій</h2></div><a href={scholarQuery} target="_blank" rel="noreferrer">Шукати також у Google Scholar ↗</a></div>
    <div className="publication-controls"><label>Автор, назва або рік<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Наприклад: Чорнодід, психологія, 2025" /></label><label>Тема<select value={topic} onChange={e=>setTopic(e.target.value)}>{topics.map(t=><option key={t}>{t}</option>)}</select></label></div>
    <p className="publication-count">Знайдено: {filtered.length}</p><div className="publication-list">{filtered.map((p,i)=>{const external=p.href.startsWith("http");const content=<><span>{p.year}</span><div><small>{p.type} · {p.topic}</small><h3>{p.title}</h3><p>{p.author}</p></div><b>→</b></>;return external?<a href={p.href} target="_blank" rel="noreferrer" key={p.title}>{content}</a>:<Link href={p.href} key={p.title}>{content}</Link>})}</div>
  </div></section>;
}
