"use client";

import { useMemo, useState } from "react";

type Profile = { name: string; field: string; url: string };
type Publication = { year: string; author: string; title: string; type: string; topic: string; href: string };

const scholarProfilesUk: Profile[] = [
  {name:"Віктор Сухомлин",field:"Публічне управління, зайнятість",url:"https://scholar.google.com/citations?user=Fye2EVwAAAAJ&hl=en"},
  {name:"Ігор Чорнодід",field:"Соціальна економіка, економічна безпека",url:"https://scholar.google.com.ua/citations?user=zoVq-icAAAAJ&hl=uk"},
  {name:"Гліб Пріб",field:"Психіатрія, психологія, психічне здоров’я",url:"https://scholar.google.com.ua/citations?hl=ru&user=kLThYfwAAAAJ"},
  {name:"Людмила Бегеза",field:"Професійний розвиток особистості, психологія",url:"https://scholar.google.com.ua/citations?user=8P5Oe1kAAAAJ&hl=ru"},
  {name:"Олена Карагодіна",field:"Соціальна робота, громадське здоров’я, консультування",url:"https://scholar.google.com.ua/citations?hl=ru&user=bet3y9gAAAAJ"},
  {name:"Володимир Ліпкан",field:"Національна безпека, кримінальне й інформаційне право",url:"https://scholar.google.com.ua/citations?hl=uk&user=mmE8GhkAAAAJ"},
  {name:"Ігор Діордіца",field:"Інформаційне право, кібербезпека, кримінальне право",url:"https://scholar.google.com.ua/citations?user=iaezWoQAAAAJ&hl=uk"},
  {name:"Галина Муляр",field:"Міжнародне судочинство, кримінально-виконавче право",url:"https://scholar.google.com.ua/citations?hl=uk&user=chKXb-QAAAAJ"},
];

const scholarProfilesEn: Profile[] = [
  {name:"Viktor Sukhomlyn",field:"Public administration and employment",url:scholarProfilesUk[0].url},
  {name:"Ihor Chornodid",field:"Social economy and economic security",url:scholarProfilesUk[1].url},
  {name:"Hlib Prib",field:"Psychiatry, psychology and mental health",url:scholarProfilesUk[2].url},
  {name:"Liudmyla Beheza",field:"Professional development and psychology",url:scholarProfilesUk[3].url},
  {name:"Olena Karagodina",field:"Social work, public health and counselling",url:scholarProfilesUk[4].url},
  {name:"Volodymyr Lipkan",field:"National security, criminal and information law",url:scholarProfilesUk[5].url},
  {name:"Ihor Diorditsa",field:"Information law, cybersecurity and criminal law",url:scholarProfilesUk[6].url},
  {name:"Halyna Muliar",field:"International justice and penal law",url:scholarProfilesUk[7].url},
];

const publicationsUk: Publication[] = [
  {year:"2026",author:"Н. В. Писаренко, О. І. Бабічева, О. В. Базарна, Є. С. Даниленко, О. А. Корчинська, Р. Р. Марков, А. Ю. Пекін, Н. М. Середа, Ю. О. Ярмоленко",title:"Соціально відповідальний маркетинг",type:"Навчальний посібник · PDF · DOI",topic:"Маркетинг · соціальна відповідальність",href:"/documents/research/publications/sotsialno-vidpovidalnyi-marketynh-2026.pdf"},
  {year:"2025",author:"Н. В. Писаренко, Ю. О. Ярмоленко, О. А. Корчинська, С. В. Шолудченко, О. І. Бабічева, О. В. Базарна, Є. С. Даниленко, Р. Р. Марков, В. Є. Гоцул",title:"Воєнний брендинг: формування іміджу армії та держави засобами цифрового маркетингу",type:"Колективна монографія · PDF · DOI",topic:"Маркетинг · стратегічні комунікації",href:"/documents/research/publications/voiennyi-brendynh-tsyfrovyi-marketynh-2025.pdf"},
  {year:"2025",author:"Н. В. Писаренко, О. А. Корчинська, Ю. О. Ярмоленко, С. В. Шолудченко, О. І. Бабічева, О. В. Буткевич, Є. О. Стефанюк",title:"Вплив міжнародного маркетингу на економічну безпеку України в умовах цифрової економіки",type:"Колективна монографія · PDF · DOI",topic:"Маркетинг · економічна безпека",href:"/documents/research/publications/mizhnarodnyi-marketynh-ekonomichna-bezpeka-2025.pdf"},
  {year:"2026",author:"За редакцією Людмили Бегези, Наталії Максимової, Катерини Мілютіної",title:"Методи діагностики та психологічного супроводу життєдіяльності особистості в умовах стресу",type:"Колективна монографія · PDF · DOI",topic:"Психологія · психічне здоров’я",href:"/documents/research/publications/metody-diahnostyky-ta-psykholohichnoho-suprovodu-2026.pdf"},
  {year:"2026",author:"Ігор Чорнодід, Неля Василець, Наталія Головач",title:"Грейдинг і компетентнісно-кваліфікаційний підхід як основа оптимізації систем оплати праці будівельних підприємств",type:"Стаття",topic:"Економіка праці",href:"https://repository.sspu.edu.ua/items/d6f124ae-897f-47f7-9a89-bff4ac7a7c57"},
  {year:"2025",author:"Ігор Чорнодід, Людмила Гуляєва",title:"Європейські ініціативи у сфері соціальної економіки: інструменти, політики та можливості для України",type:"Стаття · DOI",topic:"Соціальна економіка",href:"https://doi.org/10.32782/2524-0072/2025-80-165"},
  {year:"2022",author:"Гліб Пріб, Яна Раєвська, Людмила Бегеза",title:"Соціально-психологічні особливості адаптації особистості в умовах бойових дій",type:"Стаття",topic:"Психологія",href:""},
  {year:"2020",author:"Ігор Чорнодід, Олена Баженова",title:"Умови торгівлі та індустріалізація: реалії в Україні",type:"Стаття",topic:"Економіка",href:"https://scholar.google.com/scholar?q=%D0%A7%D0%BE%D1%80%D0%BD%D0%BE%D0%B4%D1%96%D0%B4+%D0%A3%D0%BC%D0%BE%D0%B2%D0%B8+%D1%82%D0%BE%D1%80%D0%B3%D1%96%D0%B2%D0%BB%D1%96+%D1%82%D0%B0+%D1%96%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D1%96%D0%B0%D0%BB%D1%96%D0%B7%D0%B0%D1%86%D1%96%D1%8F"},
  {year:"2018",author:"Віктор Сухомлин",title:"Ідентифікація проблеми зайнятості у контексті сучасних дослідницьких підходів",type:"Стаття",topic:"Зайнятість",href:""},
  {year:"2014",author:"Ігор Чорнодід",title:"Соціальна конкурентоспроможність національної економіки: сутність, показники та чинники забезпечення",type:"Монографія",topic:"Економіка",href:"https://scholar.google.com/scholar?q=%D0%A1%D0%BE%D1%86%D1%96%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0+%D0%BA%D0%BE%D0%BD%D0%BA%D1%83%D0%B5%D0%BD%D1%82%D0%BE%D1%81%D0%BF%D1%80%D0%BE%D0%BC%D0%BE%D0%B6%D0%BD%D1%96%D1%81%D1%82%D1%8C+%D0%A7%D0%BE%D1%80%D0%BD%D0%BE%D0%B4%D1%96%D0%B4"},
  {year:"2020",author:"Колектив авторів АПСВТ",title:"Вісник АПСВТ, 2020, №1–2",type:"Вісник Академії · PDF",topic:"Право · соціальна робота",href:"https://www.socosvita.kiev.ua/sites/default/files/Visnyk_1-2_2020.pdf"},
  {year:"2019",author:"Колектив авторів АПСВТ",title:"Вісник АПСВТ, 2019, №4",type:"Вісник Академії · PDF",topic:"Економіка · право",href:"https://www.socosvita.kiev.ua/sites/default/files/Visnyk_4_2019.pdf"},
  {year:"2019",author:"Колектив авторів АПСВТ",title:"Вісник АПСВТ, 2019, №3",type:"Вісник Академії · PDF",topic:"Соціальна робота",href:"https://www.socosvita.kiev.ua/sites/default/files/Visnyk_3_2019.pdf"},
  {year:"2018",author:"Колектив авторів АПСВТ",title:"Вісник АПСВТ, 2018, №4",type:"Вісник Академії · PDF",topic:"Соціальна робота · ринок праці",href:"https://www.socosvita.kiev.ua/sites/default/files/Visnyk_4_2018.pdf"},
];

const publicationsEn: Publication[] = [
  {year:"2026",author:"N. Pysarenko, O. Babicheva, O. Bazarna, Y. Danylenko, O. Korchynska, R. Markov, A. Pekin, N. Sereda, Y. Yarmolenko",title:"Socially Responsible Marketing",type:"Textbook · PDF · DOI",topic:"Marketing · social responsibility",href:publicationsUk[0].href},
  {year:"2025",author:"N. Pysarenko, Y. Yarmolenko, O. Korchynska, S. Sholudchenko, O. Babicheva, O. Bazarna, Y. Danylenko, R. Markov, V. Hotsul",title:"Military Branding: Shaping the Image of the Army and the State through Digital Marketing",type:"Collective monograph · PDF · DOI",topic:"Marketing · strategic communications",href:publicationsUk[1].href},
  {year:"2025",author:"N. Pysarenko, O. Korchynska, Y. Yarmolenko, S. Sholudchenko, O. Babicheva, O. Butkevych, Y. Stefaniuk",title:"The Influence of International Marketing on Ukraine’s Economic Security in the Digital Economy",type:"Collective monograph · PDF · DOI",topic:"Marketing · economic security",href:publicationsUk[2].href},
  {year:"2026",author:"Edited by Liudmyla Beheza, Nataliia Maksymova and Kateryna Miliutina",title:"Methods of diagnostics and psychological support of individual life activity under stress",type:"Collective monograph · PDF · DOI",topic:"Psychology · mental health",href:publicationsUk[3].href},
  {year:"2026",author:"Ihor Chornodid, Nelia Vasylets, Nataliia Holovach",title:"Grading and a competency-qualification approach to optimising remuneration systems in construction companies",type:"Article",topic:"Labour economics",href:publicationsUk[4].href},
  {year:"2025",author:"Ihor Chornodid, Liudmyla Huliaieva",title:"European social-economy initiatives: instruments, policies and opportunities for Ukraine",type:"Article · DOI",topic:"Social economy",href:publicationsUk[5].href},
  {year:"2022",author:"Hlib Prib, Yana Raievska, Liudmyla Beheza",title:"Social and psychological adaptation of the individual under conditions of hostilities",type:"Article",topic:"Psychology",href:""},
  {year:"2020",author:"Ihor Chornodid, Olena Bazhenova",title:"Terms of trade and industrialisation: realities in Ukraine",type:"Article",topic:"Economics",href:publicationsUk[7].href},
  {year:"2018",author:"Viktor Sukhomlyn",title:"Identifying the employment problem in contemporary research approaches",type:"Article",topic:"Employment",href:""},
  {year:"2014",author:"Ihor Chornodid",title:"Social competitiveness of the national economy: essence, indicators and enabling factors",type:"Monograph",topic:"Economics",href:publicationsUk[9].href},
  {year:"2020",author:"APSVT author collective",title:"APSVT Scientific Bulletin, 2020, No. 1–2",type:"Academy journal",topic:"Law · Social work",href:publicationsUk[10].href},
  {year:"2019",author:"APSVT author collective",title:"APSVT Scientific Bulletin, 2019, No. 4",type:"Academy journal",topic:"Economics · Law",href:publicationsUk[11].href},
  {year:"2019",author:"APSVT author collective",title:"APSVT Scientific Bulletin, 2019, No. 3",type:"Academy journal",topic:"Social work",href:publicationsUk[12].href},
  {year:"2018",author:"APSVT author collective",title:"APSVT Scientific Bulletin, 2018, No. 4",type:"Academy journal",topic:"Social work · Labour market",href:publicationsUk[13].href},
];

export function PublicationSearch({ language = "uk" }: { language?: "uk" | "en" }) {
  const english = language === "en";
  const profiles = english ? scholarProfilesEn : scholarProfilesUk;
  const publications = english ? publicationsEn : publicationsUk;
  const allTopics = english ? "All topics" : "Усі теми";
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState(allTopics);
  const topics = [allTopics, ...Array.from(new Set(publications.map((publication) => publication.topic)))];
  const filtered = useMemo(() => publications.filter((publication) => (topic === allTopics || publication.topic === topic) && `${publication.title} ${publication.author} ${publication.year} ${publication.topic}`.toLowerCase().includes(query.toLowerCase())), [query, topic, allTopics, publications]);
  const scholarQuery = `https://scholar.google.com/scholar?q=${encodeURIComponent(query || (english ? "Academy of Labour Social Relations and Tourism" : "Академія праці соціальних відносин і туризму"))}`;

  return <section><div className="wrap">
    <div className="sec-head"><div><div className="idx">01 / {english ? "Research profiles" : "Наукові профілі"}</div><h2>{english ? "Researchers" : "Дослідники"}</h2></div></div>
    <div className="scholar-profiles">{profiles.map((profile) => <a href={profile.url} target="_blank" rel="noreferrer" key={profile.name}><span>Google Scholar</span><h3>{profile.name}</h3><p>{profile.field}</p><small>{english ? "Open profile ↗" : "Відкрити профіль ↗"}</small><b>↗</b></a>)}</div>
    <div className="research-head"><div><div className="idx">02 / {english ? "Catalogue" : "Каталог"}</div><h2>{english ? "Publication search" : "Пошук публікацій"}</h2></div><a href={scholarQuery} target="_blank" rel="noreferrer">{english ? "Search Google Scholar too ↗" : "Шукати також у Google Scholar ↗"}</a></div>
    <div className="publication-controls"><label>{english ? "Author, title or year" : "Автор, назва або рік"}<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={english ? "For example: Chornodid, psychology, 2025" : "Наприклад: Чорнодід, психологія, 2025"} /></label><label>{english ? "Topic" : "Тема"}<select value={topic} onChange={(event) => setTopic(event.target.value)}>{topics.map((item) => <option key={item}>{item}</option>)}</select></label></div>
    <div className="publication-list">{filtered.map((publication) => { const content = <><span>{publication.year}</span><div><small>{publication.type} · {publication.topic}</small><h3>{publication.title}</h3><p>{publication.author}</p></div>{publication.href && <b>↗</b>}</>; return publication.href ? <a href={publication.href} target="_blank" rel="noreferrer" key={publication.title}>{content}</a> : <article key={publication.title}>{content}</article>; })}</div>
  </div></section>;
}
