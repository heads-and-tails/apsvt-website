import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PublicationSearch } from "./PublicationSearch";
import Link from "next/link";
import { getPublicContent as getContentItems } from "@/lib/content";
import { PageDocuments } from "../components/PageDocuments";

export const metadata: Metadata = { title:"Наука і публікації", description:"Пошук наукових публікацій викладачів АПСВТ, профілі Google Scholar та архів Вісника." };
export const dynamic = "force-dynamic";

const marketingPublications = [
  {
    year: "2026",
    kind: "Навчальний посібник",
    title: "Соціально відповідальний маркетинг",
    authors: "Н. В. Писаренко, О. І. Бабічева, О. В. Базарна, Є. С. Даниленко, О. А. Корчинська, Р. Р. Марков, А. Ю. Пекін, Н. М. Середа, Ю. О. Ярмоленко",
    description: "Системне видання про етичні, стратегічні та прикладні засади соціально відповідального маркетингу, корпоративну відповідальність і цифровий моніторинг.",
    pages: "450 сторінок",
    cover: "/images/research/sotsialno-vidpovidalnyi-marketynh-2026-cover.jpg",
    href: "/documents/research/publications/sotsialno-vidpovidalnyi-marketynh-2026.pdf",
    doi: "https://doi.org/10.5281/zenodo.21918708",
  },
  {
    year: "2025",
    kind: "Колективна монографія",
    title: "Воєнний брендинг: формування іміджу армії та держави засобами цифрового маркетингу",
    authors: "Н. В. Писаренко, Ю. О. Ярмоленко, О. А. Корчинська, С. В. Шолудченко, О. І. Бабічева, О. В. Базарна, Є. С. Даниленко, Р. Р. Марков, В. Є. Гоцул",
    description: "Міждисциплінарне дослідження воєнного брендингу, стратегічних комунікацій, цифрових медіа та стійкості держави й суспільства.",
    pages: "355 сторінок",
    cover: "/images/research/voiennyi-brendynh-2025-cover.jpg",
    href: "/documents/research/publications/voiennyi-brendynh-tsyfrovyi-marketynh-2025.pdf",
    doi: "https://doi.org/10.5281/zenodo.17558747",
  },
  {
    year: "2025",
    kind: "Колективна монографія",
    title: "Вплив міжнародного маркетингу на економічну безпеку України в умовах цифрової економіки",
    authors: "Н. В. Писаренко, О. А. Корчинська, Ю. О. Ярмоленко, С. В. Шолудченко, О. І. Бабічева, О. В. Буткевич, Є. О. Стефанюк",
    description: "Дослідження викликів глобального цифрового середовища та маркетингових інструментів, що сприяють зміцненню економічної безпеки України.",
    pages: "313 сторінок",
    cover: "/images/research/mizhnarodnyi-marketynh-2025-cover.jpg",
    href: "/documents/research/publications/mizhnarodnyi-marketynh-ekonomichna-bezpeka-2025.pdf",
    doi: "https://doi.org/10.5281/zenodo.14913927",
  },
] as const;

const marketingMonographs = marketingPublications.filter((publication) => publication.kind === "Колективна монографія");
const marketingTeachingPublications = marketingPublications.filter((publication) => publication.kind === "Навчальний посібник");

const marketingConferenceProceedings = [
  {
    year: "2026",
    edition: "III Міжнародна науково-практична конференція",
    date: "10 березня 2026 року",
    title: "Науковий вимір осмислення та пошуку шляхів розвитку України: маркетинговий, економічний, фінансовий, управлінський та правовий аспекти",
    description: "Міждисциплінарні дослідження актуальних викликів і стратегічних орієнтирів сталого розвитку України в умовах трансформаційних змін.",
    pages: "572 сторінки",
    isbn: "ISBN 978-966-654-907-7",
    doi: "https://doi.org/10.5281/zenodo.19821500",
    cover: "/images/research/conference-proceedings/marketing-conference-2026-cover.jpg",
    href: "/documents/research/conference-proceedings/marketing-conference-proceedings-2026.pdf",
  },
  {
    year: "2025",
    edition: "II Міжнародна науково-практична конференція",
    date: "19 березня 2025 року",
    title: "Науковий вимір осмислення та пошуку оптимальних моделей розвитку України: маркетинговий, економічний, фінансовий, управлінський та правовий аспекти",
    description: "Матеріали про маркетингові, економічні, фінансові, управлінські та правові моделі майбутнього розвитку України.",
    pages: "378 сторінок",
    isbn: "ISBN 978-617-8571-29-0",
    doi: "https://doi.org/10.5281/zenodo.15267086",
    cover: "/images/research/conference-proceedings/marketing-conference-2025-cover.jpg",
    href: "/documents/research/conference-proceedings/marketing-conference-proceedings-2025.pdf",
  },
  {
    year: "2024",
    edition: "Міжнародна науково-практична конференція",
    date: "4–5 березня 2024 року",
    title: "Науковий вимір осмислення та пошуку оптимальних моделей розвитку України: маркетинговий, економічний, фінансовий та управлінський аспекти",
    description: "Збірник досліджень про конкурентоспроможність, економічну й фінансову безпеку, маркетинг і сучасні управлінські підходи.",
    pages: "325 сторінок",
    isbn: "ISBN 978-617-8171-53-7",
    doi: "https://doi.org/10.5281/zenodo.11222359",
    cover: "/images/research/conference-proceedings/marketing-conference-2024-cover.jpg",
    href: "/documents/research/conference-proceedings/marketing-conference-proceedings-2024.pdf",
  },
] as const;

export default async function Page(){const resources=await getContentItems("research_resource");return <main id="top"><SiteHeader />
  <section className="phero"><div className="wrap"><div className="crumb">Головна / Наука</div><h1>Наука й<br />публікації</h1><p className="lead">Дослідження Академії, наукові видання, конференції, звіти й документи аспірантури та докторантури.</p></div></section><div className="phero-rule" />
  <section><div className="wrap research-page-intro"><div><div className="idx">01 / Наукова робота</div><h2>Дослідження в Академії</h2></div><p>Наукова робота в Академії проводиться відповідно до законів України «Про освіту», «Про вищу освіту», «Про наукову і науково-технічну діяльність», Порядку підготовки здобувачів ступеня доктора філософії та доктора наук, Стратегії розвитку Академії, планів наукових досліджень факультетів і кафедр та індивідуальних планів науково-педагогічних працівників, аспірантів і докторантів.</p></div></section>
  <PublicationSearch />
  <section className="marketing-publications" id="marketing-publications"><div className="wrap"><div className="marketing-publications-head"><div><div className="idx">03 / Наука і видання</div><h2>Видання кафедри маркетингу</h2></div><p>Монографії, навчальні видання та збірники конференцій, підготовлені кафедрою. Повні тексти доступні для читання у форматі PDF, а DOI ведуть до постійних записів видань.</p></div><div className="marketing-publication-subhead"><span>01</span><div><h3>Монографії, підготовлені викладачами кафедри</h3><p>Колективні наукові праці викладачів кафедри маркетингу.</p></div></div><div className="marketing-publications-grid">{marketingMonographs.map((publication)=><article className="marketing-publication-card" key={publication.title}><a className="marketing-publication-cover" href={publication.href} target="_blank" rel="noreferrer" aria-label={`Відкрити PDF: ${publication.title}`}><img src={publication.cover} alt={`Обкладинка видання «${publication.title}»`} /></a><div className="marketing-publication-body"><div className="marketing-publication-meta"><span>{publication.year}</span><small>{publication.kind}</small></div><h3>{publication.title}</h3><p className="marketing-publication-authors">{publication.authors}</p><p>{publication.description}</p><div className="marketing-publication-footer"><span>{publication.pages}</span><div><a href={publication.href} target="_blank" rel="noreferrer">Відкрити PDF ↗</a><a href={publication.doi} target="_blank" rel="noreferrer">DOI ↗</a></div></div></div></article>)}</div><div className="marketing-publication-subhead"><span>02</span><div><h3>Навчальні видання кафедри</h3><p>Посібники для студентів і викладачів із повним текстом у форматі PDF.</p></div></div><div className="marketing-publications-grid">{marketingTeachingPublications.map((publication)=><article className="marketing-publication-card" key={publication.title}><a className="marketing-publication-cover" href={publication.href} target="_blank" rel="noreferrer" aria-label={`Відкрити PDF: ${publication.title}`}><img src={publication.cover} alt={`Обкладинка видання «${publication.title}»`} /></a><div className="marketing-publication-body"><div className="marketing-publication-meta"><span>{publication.year}</span><small>{publication.kind}</small></div><h3>{publication.title}</h3><p className="marketing-publication-authors">{publication.authors}</p><p>{publication.description}</p><div className="marketing-publication-footer"><span>{publication.pages}</span><div><a href={publication.href} target="_blank" rel="noreferrer">Відкрити PDF ↗</a><a href={publication.doi} target="_blank" rel="noreferrer">DOI ↗</a></div></div></div></article>)}</div><div className="marketing-publication-subhead marketing-conference-subhead"><span>03</span><div><h3>Збірники матеріалів конференцій</h3><p>Три послідовні випуски міжнародної конференції кафедри за 2024–2026 роки.</p></div></div><div className="marketing-conference-grid">{marketingConferenceProceedings.map((publication)=><article className="marketing-conference-card" key={publication.year}><a className="marketing-conference-cover" href={publication.href} target="_blank" rel="noreferrer" aria-label={`Відкрити збірник за ${publication.year} рік`}><img src={publication.cover} alt={`Титульна сторінка збірника конференції ${publication.year} року`} /></a><div className="marketing-conference-body"><div className="marketing-publication-meta"><span>{publication.year}</span><small>{publication.edition}</small></div><h3>{publication.title}</h3><p>{publication.description}</p><dl><div><dt>Дата</dt><dd>{publication.date}</dd></div><div><dt>Обсяг</dt><dd>{publication.pages}</dd></div><div><dt>Видання</dt><dd>{publication.isbn}</dd></div></dl><div className="marketing-publication-footer"><span>Київ · АПСВТ</span><div><a href={publication.href} target="_blank" rel="noreferrer">Відкрити PDF ↗</a><a href={publication.doi} target="_blank" rel="noreferrer">DOI ↗</a></div></div></div></article>)}</div><Link className="marketing-department-link" href="/programs/marketing">Кафедра маркетингу →</Link></div></section>
  <section className="soft research-resources"><div className="wrap"><div className="sec-head"><div><div className="idx">04 / Ресурси Академії</div><h2>Для дослідження</h2></div><p>Журнали, репозитарії та академічні бази для навчання, викладання й дослідницької роботи.</p></div><div className="research-resource-grid">{resources.map(({id,payload})=><a href={payload.url} target={payload.url.startsWith("http")?"_blank":undefined} rel={payload.url.startsWith("http")?"noreferrer":undefined} key={id}><span>{payload.year}</span><small>{payload.category}</small><h3>{payload.title}</h3><p>{payload.description}</p><b>↗</b></a>)}<a href="/documents/archive/old-site/conference-proceedings-2025.pdf" target="_blank" rel="noreferrer"><span>2025</span><small>Збірник конференції</small><h3>Матеріали міжнародної конференції</h3><p>377 сторінок досліджень про моделі розвитку України.</p><b>↗</b></a><a href="/documents/archive/old-site/research-report-2017-2018.pdf" target="_blank" rel="noreferrer"><span>2017/18</span><small>Архівний звіт</small><h3>Наукова робота Академії</h3><p>Напрями досліджень, публікації та наукові заходи навчального року.</p><b>↗</b></a></div><Link className="sec-link restored-all-link" href="/documents#research">Усі наукові й методичні документи →</Link></div></section>
  <section className="research-portals"><div className="wrap portal-grid"><Link href="/research/academy-work"><span>01</span><div><small>Звіти й теми НДР</small><h2>Наукова робота Академії</h2><p>Звіти за 2024–2025 роки та документи науково-дослідної теми про ринок праці.</p></div><b>→</b></Link><Link href="/research/postgraduate-doctoral"><span>02</span><div><small>Програми докторів філософії · Вступ 2026</small><h2>Аспірантура та докторантура</h2><p>Накази, строки вступних випробувань і затверджена вартість навчання.</p></div><b>→</b></Link><Link href="/research/conferences"><span>03</span><div><small>Наукові події</small><h2>Конференції Академії</h2><p>Архів 2023–2026 років, інформаційні листи, програми та збірники матеріалів.</p></div><b>→</b></Link><Link href="/research/journals"><span>04</span><div><small>Видавнича діяльність</small><h2>Наукові видання</h2><p>Науковий вісник АПСВТ, тематичні серії, архів номерів і правила для авторів.</p></div><b>→</b></Link><Link href="/research/theses"><span>05</span><div><small>Студентський репозитарій</small><h2>Кваліфікаційні роботи</h2><p>Бакалаврські та магістерські роботи з пошуком за програмою, роком і науковим керівником.</p></div><b>→</b></Link></div></section>
  <PageDocuments pagePath="/research" />
  <SiteFooter /></main>}
