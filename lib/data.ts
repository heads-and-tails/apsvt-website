export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  imageUrl: string;
  imageAlt: string;
  status: "draft" | "published";
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorEmail: string;
};

export type PostInput = Omit<Post, "id" | "slug" | "createdAt" | "updatedAt" | "authorEmail"> & {
  slug?: string;
};

import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { entranceResultsNewsSlug, entranceResultsNewsSlugAugust6, entranceResultsNewsSlugJuly31 } from "@/lib/entrance-results";
import { applicantRankingsNewsSlug } from "@/lib/admissions-rankings";

const IMG = "https://images.unsplash.com";

export const seedPosts: Post[] = [
  {
    id: "seed-entrance-results-2026-08-06",
    slug: entranceResultsNewsSlugAugust6,
    title: "Оприлюднено результати вступних випробувань від 6 серпня 2026 року",
    excerpt: "Приймальна комісія опублікувала результати співбесіди з англійської мови для вступників на магістратуру та відеозапис співбесіди.",
    body: "Приймальна комісія Академії оприлюднила результати вступних випробувань, проведених 6 серпня 2026 року для вступників на магістерські програми. Доступна офіційна PDF-відомість із результатами співбесіди з англійської мови.\n\nРазом із результатами опубліковано відеозапис співбесіди. Переглянути документ і відео можна безпосередньо в цій новині або у розділі «Вступнику» — «Результати вступних випробувань» — «Магістратура».",
    category: "Вступ",
    imageUrl: "/apsvt-regional-students.png",
    imageAlt: "Вступники Академії під час вступної кампанії 2026 року",
    status: "published",
    featured: true,
    publishedAt: "2026-08-10T16:15:00.000Z",
    createdAt: "2026-08-10T16:15:00.000Z",
    updatedAt: "2026-08-10T16:15:00.000Z",
    authorEmail: "editorial@apsvt.local",
  },
  {
    id: "seed-applicant-rankings-2026-08-03",
    slug: applicantRankingsNewsSlug,
    title: "Оприлюднено рейтингові списки вступників на бакалаврат",
    excerpt: "Приймальна комісія опублікувала 25 офіційних рейтингових списків вступників за освітніми програмами Академії.",
    body: "На сайті Академії оприлюднено рейтингові списки вступників на бакалаврат станом на 3 серпня 2026 року. Документи згруповано за освітніми програмами, формами навчання та курсами вступу, щоб кожен вступник міг швидко знайти потрібний список.\n\nУ добірці представлені професійна освіта, економіка та міжнародні економічні відносини, психологія, фінанси, менеджмент, публічне управління та адміністрування, маркетинг, право, соціальна робота та консультування. Усі 25 офіційних PDF доступні без реєстрації у розділі «Вступнику» — «Рейтингові списки вступників».\n\nРекомендуємо перевіряти назву освітньої програми, форму навчання і курс безпосередньо у відповідному PDF. З організаційних питань звертайтеся до Приймальної комісії Академії.",
    category: "Вступ",
    imageUrl: "/apsvt-regional-students.png",
    imageAlt: "Вступники Академії під час вступної кампанії 2026 року",
    status: "published",
    featured: true,
    publishedAt: "2026-08-07T09:00:00.000Z",
    createdAt: "2026-08-07T09:00:00.000Z",
    updatedAt: "2026-08-07T09:00:00.000Z",
    authorEmail: "editorial@apsvt.local",
  },
  {
    id: "seed-entrance-results-2026-07-31",
    slug: entranceResultsNewsSlugJuly31,
    title: "Оприлюднено результати вступних випробувань від 31 липня 2026 року",
    excerpt: "Приймальна комісія опублікувала п’ять офіційних відомостей зі співбесід для вступників.",
    body: "Приймальна комісія Академії оприлюднила результати вступних випробувань, проведених 31 липня 2026 року. На сторінці доступні окремі PDF-відомості зі співбесід з української мови, української літератури, математики, історії України та англійської мови.\n\nВідкрити документи можна безпосередньо в цій новині або у розділі «Вступнику» — «Результати вступних випробувань». Попередні офіційні записи залишаються доступними на сторінці Приймальної комісії.",
    category: "Вступ",
    imageUrl: "/apsvt-regional-students.png",
    imageAlt: "Вступники Академії під час вступної кампанії 2026 року",
    status: "published",
    featured: true,
    publishedAt: "2026-08-03T12:30:00.000Z",
    createdAt: "2026-08-03T12:30:00.000Z",
    updatedAt: "2026-08-03T12:30:00.000Z",
    authorEmail: "editorial@apsvt.local",
  },
  {
    id: "seed-entrance-results-2026-07-29",
    slug: entranceResultsNewsSlug,
    title: "Оприлюднено результати вступних випробувань від 29 липня 2026 року",
    excerpt: "Приймальна комісія опублікувала результати співбесід для вступників на бакалаврат.",
    body: "На сайті Академії оприлюднено результати вступних випробувань для вступників на бакалаврат, проведених 29 липня 2026 року. Доступні окремі відомості зі співбесід з української мови, математики, історії України та англійської мови.\n\nПереглянути й завантажити документи можна безпосередньо нижче або у розділі «Вступнику» — «Результати вступних випробувань». Для кожного предмета розміщено окремий офіційний PDF.",
    category: "Вступ",
    imageUrl: "/apsvt-regional-students.png",
    imageAlt: "Вступники Академії під час вступної кампанії",
    status: "published",
    featured: true,
    publishedAt: "2026-07-31T12:00:00.000Z",
    createdAt: "2026-07-31T12:00:00.000Z",
    updatedAt: "2026-07-31T12:00:00.000Z",
    authorEmail: "editorial@apsvt.local",
  },
  {
    id: "seed-open-day",
    slug: "open-day-2026",
    title: "День відкритих дверей: побачити Академію наживо",
    excerpt: "Знайомство з програмами, командами факультетів і простором, у якому починається професійна траєкторія.",
    body: "Академія відкриває двері для вступників та їхніх родин. Це день без формальних презентацій: можна пройти майбутнім маршрутом студента, поговорити з викладачами та поставити запитання тим, хто вже навчається.\n\nУ програмі — короткі лабораторії спеціальностей, консультації щодо вступу, знайомство з міжнародними можливостями та практичними проєктами. Команда приймальної комісії допоможе скласти персональний план подачі документів.\n\nРеєстрація безкоштовна. Візьміть із собою запитання, а все інше ми покажемо на місці.",
    category: "Вступ",
    imageUrl: "/apsvt-regional-students.png",
    imageAlt: "Студенти біля університету",
    status: "published",
    featured: true,
    publishedAt: "2026-07-14T09:00:00.000Z",
    createdAt: "2026-07-14T09:00:00.000Z",
    updatedAt: "2026-07-14T09:00:00.000Z",
    authorEmail: "vportnaia@kse.org.ua",
  },
  {
    id: "seed-hospitality",
    slug: "hospitality-management-lab",
    title: "Менеджмент гостинності: навчання через реальні сценарії",
    excerpt: "Студенти проєктують сервіс, працюють із гостьовим досвідом і тестують рішення разом з індустрією.",
    body: "Сучасна гостинність починається не з рецепції, а з уміння бачити досвід очима людини. На новому практичному модулі студенти досліджують шлях гостя, економіку сервісу та сталі моделі туризму.\n\nКожна команда отримує реальний виклик: створити концепцію, перевірити її на користувачах і захистити фінансову модель. Викладачі працюють як ментори, а представники індустрії дають зворотний зв’язок.\n\nНайкращі рішення переходять у стажування та партнерські пілоти — саме так навчальна аудиторія стає місцем першого професійного результату.",
    category: "Освіта",
    imageUrl: "/apsvt-event-real.jpg",
    imageAlt: "Команда працює над проєктом",
    status: "published",
    featured: false,
    publishedAt: "2026-07-09T10:30:00.000Z",
    createdAt: "2026-07-09T10:30:00.000Z",
    updatedAt: "2026-07-09T10:30:00.000Z",
    authorEmail: "vportnaia@kse.org.ua",
  },
  {
    id: "seed-partnership",
    slug: "international-partnerships-2026",
    title: "Нові міжнародні партнерства для навчання без кордонів",
    excerpt: "Академія розширює мережу мобільності, спільних досліджень і коротких сертифікатних програм.",
    body: "Міжнародність для нас — це не окрема подія, а частина щоденного навчання. Нова рамкова угода об’єднує студентські обміни, гостьові лекції, спільні дослідження та розробку коротких програм.\n\nПерший цикл присвячений соціальній політиці, зеленим фінансам і розвитку громад. Студенти працюватимуть у міжнародних командах і презентуватимуть результати англійською мовою.\n\nУчасть у проєктах зараховуватиметься як частина індивідуальної освітньої траєкторії.",
    category: "Міжнародне",
    imageUrl: "/apsvt-regional-students.png",
    imageAlt: "Міжнародна робоча зустріч",
    status: "published",
    featured: false,
    publishedAt: "2026-07-08T08:00:00.000Z",
    createdAt: "2026-07-08T08:00:00.000Z",
    updatedAt: "2026-07-08T08:00:00.000Z",
    authorEmail: "vportnaia@kse.org.ua",
  },
  {
    id: "seed-legal-clinic",
    slug: "legal-clinic-real-cases",
    title: "Юридична клініка: перші реальні справи ще до диплома",
    excerpt: "Під супервізією викладачів студенти допомагають людям і вчаться відповідальності професії.",
    body: "У юридичній клініці теорія зустрічається з життям. Студенти аналізують звернення, проводять інтерв’ю, готують правові позиції та пояснюють складне зрозумілою мовою.\n\nКожну справу супроводжує викладач-практик. Це створює безпечне середовище для клієнта і водночас вчить майбутнього юриста професійній етиці, точності та емпатії.\n\nКлініка працює також як простір правопросвіти: команда проводить відкриті заняття для громад і молоді.",
    category: "Студенти",
    imageUrl: "/apsvt-event-real.jpg",
    imageAlt: "Студентка працює з документами",
    status: "published",
    featured: false,
    publishedAt: "2026-06-28T11:00:00.000Z",
    createdAt: "2026-06-28T11:00:00.000Z",
    updatedAt: "2026-06-28T11:00:00.000Z",
    authorEmail: "vportnaia@kse.org.ua",
  },
  {
    id:"seed-marketing-conference-2026",slug:"marketing-research-international-conference-2026",
    title:"Наукова команда маркетингу представила дослідження на міжнародній конференції",
    excerpt:"П’ятеро викладачів кафедри маркетингу долучилися до дискусії про соціально-економічне відновлення держави, регіонів і бізнесу.",
    body:"24 квітня 2026 року професорсько-викладацький склад кафедри маркетингу АПСВТ — Олена Корчинська, Надія Писаренко, Наталія Середа, Олена Базарна та Оксана Жук — взяв участь у ІІІ Міжнародній науково-практичній конференції «Детермінанти соціально-економічного відновлення держави, регіонів та суб’єктів господарювання».\n\nУчасники представили результати досліджень, обговорили інструменти відновлення та обмінялися практиками з колегами з інших закладів освіти. Для студентів такі включення означають доступ до актуального наукового порядку денного й можливість долучатися до наступних дослідницьких проєктів кафедри.",
    category:"Наука",imageUrl:"/apsvt-event-real.jpg",imageAlt:"Міжнародна наукова конференція",status:"published",featured:true,publishedAt:"2026-04-24T12:37:00.000Z",createdAt:"2026-04-24T12:37:00.000Z",updatedAt:"2026-04-24T12:37:00.000Z",authorEmail:"editorial@apsvt.local",
  },
  {
    id:"seed-municipal-law-contest",slug:"best-municipal-law-research-2025",
    title:"Академія провела VI конкурс наукових праць із муніципального права",
    excerpt:"Конкурс об’єднав молодих науковців і практиків навколо рішень для місцевого самоврядування та розвитку громад.",
    body:"3 грудня 2025 року Академія праці, соціальних відносин і туризму підбила підсумки VI Всеукраїнського конкурсу «Краща наукова праця з проблематики муніципального права».\n\nМета конкурсу — підтримати талановитих дослідників і практиків, які працюють із питаннями місцевого самоврядування, прав громад та муніципального розвитку. Роботи учасників оцінювалися за актуальністю, аргументованістю й практичною цінністю запропонованих рішень.\n\nКонкурс продовжує дослідницьку традицію юридичного факультету та відкриває студентам шлях до першої академічної публікації.",
    category:"Наука",imageUrl:`${IMG}/photo-1455390582262-044cdead277a?w=1800&q=90&auto=format&fit=crop`,imageAlt:"Робота над науковим дослідженням",status:"published",featured:false,publishedAt:"2025-12-03T10:19:00.000Z",createdAt:"2025-12-03T10:19:00.000Z",updatedAt:"2025-12-03T10:19:00.000Z",authorEmail:"editorial@apsvt.local",
  },
  {
    id:"seed-student-civic-seminar",slug:"student-civic-activity-seminar-2025",
    title:"Студенти дослідили трансформацію громадської активності молоді",
    excerpt:"Міжвузівський семінар поєднав історичну перспективу, соціальну роботу та живу студентську дискусію.",
    body:"20 лютого 2025 року викладачі та студенти Академії долучилися до міжвузівського семінару «Трансформація громадської активності студентської молоді в історичній ретроспективі».\n\nКоманду АПСВТ представляли завідувачка кафедри соціально-трудових відносин та соціальної роботи Наталія Балашова, професорка гуманітарних дисциплін Ганна Добровольська та студенти другого курсу. Учасники зіставили історичні форми самоорганізації молоді із сучасним волонтерством, громадськими ініціативами та участю студентів у житті громад.\n\nСемінар став простором, де навчальна тема перетворилася на власне дослідницьке питання студентів.",
    category:"Студенти",imageUrl:"/apsvt-students-real.jpg",imageAlt:"Студенти працюють у семінарській групі",status:"published",featured:false,publishedAt:"2025-02-21T18:33:00.000Z",createdAt:"2025-02-21T18:33:00.000Z",updatedAt:"2025-02-21T18:33:00.000Z",authorEmail:"editorial@apsvt.local",
  },
  {
    id:"seed-greenfest-2024",slug:"greenfest-psychology-community-2024",
    title:"«З Україною в серці»: GreenFest кафедри психології",
    excerpt:"Неформальна зустріч допомогла першокурсникам познайомитися, відкрити можливості Академії та відчути силу команди.",
    body:"10 вересня 2024 року кафедра психології провела традиційний GreenFest — зустріч для знайомства та неформального спілкування викладачів і студентів.\n\nКоманда кафедри розповіла про навчальні, наукові та позааудиторні можливості, а інтерактивні завдання допомогли учасникам потренувати співпрацю, взаєморозуміння й довіру. Подія створила безпечний перший крок у нове академічне середовище.\n\nОрганізатори присвятили зустріч єдності спільноти та подякували захисникам і захисницям України за можливість навчатися й зустрічатися наживо.",
    category:"Спільнота",imageUrl:"/apsvt-event-real.jpg",imageAlt:"Студентська спільнота Академії",status:"published",featured:false,publishedAt:"2024-09-10T09:00:00.000Z",createdAt:"2024-09-10T09:00:00.000Z",updatedAt:"2024-09-10T09:00:00.000Z",authorEmail:"editorial@apsvt.local",
  },
  {
    id:"seed-legal-military-service",slug:"legal-guidance-military-service-2024",
    title:"Експерти юридичного факультету пояснили трудові права військовослужбовців",
    excerpt:"Наталія Циганчук підготувала практичні висновки щодо гарантій під час лікування, відновлення та повернення до роботи.",
    body:"Експертка юридичного факультету, кандидатка юридичних наук і заслужена юристка України Наталія Циганчук провела дослідження законодавства про працю та сформувала практичні пояснення для військовослужбовців.\n\nМатеріал стосується прав і гарантій у разі поранення, травми чи необхідності тривалого лікування, а також взаємодії з роботодавцем і документального підтвердження обставин служби.\n\nЦе приклад того, як правнича експертиза Академії працює не лише в аудиторії: викладачі перетворюють складні норми на зрозумілі орієнтири для людей.",
    category:"Право",imageUrl:`${IMG}/photo-1589391886645-d51941baf7fb?w=1800&q=90&auto=format&fit=crop`,imageAlt:"Юридичні документи й робочий стіл",status:"published",featured:false,publishedAt:"2024-05-31T06:56:00.000Z",createdAt:"2024-05-31T06:56:00.000Z",updatedAt:"2024-05-31T06:56:00.000Z",authorEmail:"editorial@apsvt.local",
  },
  {
    id:"seed-municipal-reform-conference",slug:"municipal-reform-european-standards-2023",
    title:"Муніципальну реформу обговорили крізь призму європейських стандартів",
    excerpt:"Всеукраїнська конференція об’єднала Академію, проєкт USAID «ГОВЕРЛА», органи влади, науковців і громадськість.",
    body:"22 грудня 2023 року в Києві відбулася VIII Всеукраїнська науково-практична конференція «Муніципальна реформа в контексті євроінтеграції України: позиція влади, науковців, профспілок та громадськості».\n\nПодію спільно організували проєкт USAID «ГОВЕРЛА» та Академія праці, соціальних відносин і туризму. Учасники обговорили законодавчі зміни, спроможність громад, європейські стандарти місцевої демократії та роль освіти у підготовці управлінців.\n\nМатеріали конференції використовуються в освітніх компонентах права та публічного управління.",
    category:"Публічне управління",imageUrl:`${IMG}/photo-1529107386315-e1a2ed48a620?w=1800&q=90&auto=format&fit=crop`,imageAlt:"Будівля публічної установи",status:"published",featured:false,publishedAt:"2023-12-23T15:05:00.000Z",createdAt:"2023-12-23T15:05:00.000Z",updatedAt:"2023-12-23T15:05:00.000Z",authorEmail:"editorial@apsvt.local",
  },
  {
    id:"seed-community-survey",slug:"territorial-communities-law-survey-2023",
    title:"Академія дослідила законодавчі виклики територіальних громад",
    excerpt:"Розширене опитування представників громад перетворило практичні проблеми місцевого самоврядування на дослідницькі висновки.",
    body:"Академія провела опитування територіальних громад України щодо проблем законодавства в діяльності органів місцевого самоврядування. До дослідження долучилися представники громад із різних регіонів.\n\nУ звіті систематизовано труднощі застосування законодавства, потреби у професійному супроводі та пропозиції щодо вдосконалення муніципального регулювання. Результати стали основою для подальших експертних дискусій, конференцій і студентських досліджень.\n\nПроєкт демонструє приклад прикладної науки, що починається із запиту громади й повертається до неї у формі практичних рекомендацій.",
    category:"Дослідження",imageUrl:`${IMG}/photo-1497366754035-f200968a6e72?w=1800&q=90&auto=format&fit=crop`,imageAlt:"Команда обговорює результати дослідження",status:"published",featured:false,publishedAt:"2023-08-22T17:47:00.000Z",createdAt:"2023-08-22T17:47:00.000Z",updatedAt:"2023-08-22T17:47:00.000Z",authorEmail:"editorial@apsvt.local",
  },
];

const createTableSql = `CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY NOT NULL, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL,
  excerpt TEXT NOT NULL, body TEXT NOT NULL, category TEXT NOT NULL,
  image_url TEXT NOT NULL, image_alt TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft',
  featured INTEGER NOT NULL DEFAULT 0, published_at TEXT, created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL, author_email TEXT NOT NULL
)`;

async function db(): Promise<D1Database | null> {
  try {
    const moduleName = "cloudflare:workers";
    const { env } = await import(/* webpackIgnore: true */ moduleName);
    return env.DB ?? null;
  } catch {
    return null;
  }
}

let initialized = false;

export async function ensurePosts(): Promise<void> {
  if (initialized) return;
  const database = await db();
  if (!database) return;
  await database.prepare(createTableSql).run();
  await database.prepare("CREATE INDEX IF NOT EXISTS posts_status_published_idx ON posts(status, published_at)").run();
  await database.batch(seedPosts.map((post) => database.prepare(
      `INSERT OR IGNORE INTO posts (id,slug,title,excerpt,body,category,image_url,image_alt,status,featured,published_at,created_at,updated_at,author_email)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    ).bind(post.id, post.slug, post.title, post.excerpt, post.body, post.category, post.imageUrl, post.imageAlt, post.status, post.featured ? 1 : 0, post.publishedAt, post.createdAt, post.updatedAt, post.authorEmail)));
  const regionalPhotoUpdates = seedPosts.filter((post) => post.imageUrl.startsWith("/")).map((post) =>
    database.prepare("UPDATE posts SET image_url = ?, image_alt = ? WHERE id = ? AND image_url LIKE 'https://images.unsplash.com/%'").bind(post.imageUrl, post.imageAlt, post.id),
  );
  if (regionalPhotoUpdates.length) await database.batch(regionalPhotoUpdates);
  initialized = true;
}

function fromRow(row: Record<string, unknown>): Post {
  return {
    id: String(row.id), slug: String(row.slug), title: String(row.title), excerpt: String(row.excerpt),
    body: String(row.body), category: String(row.category), imageUrl: String(row.image_url),
    imageAlt: String(row.image_alt), status: row.status === "published" ? "published" : "draft",
    featured: Boolean(row.featured), publishedAt: row.published_at ? String(row.published_at) : null,
    createdAt: String(row.created_at), updatedAt: String(row.updated_at), authorEmail: String(row.author_email),
  };
}

function toSupabaseRow(post: Post) {
  return {
    id: post.id, slug: post.slug, title: post.title, excerpt: post.excerpt, body: post.body,
    category: post.category, image_url: post.imageUrl, image_alt: post.imageAlt, status: post.status,
    featured: post.featured, published_at: post.publishedAt, created_at: post.createdAt,
    updated_at: post.updatedAt, author_email: post.authorEmail,
  };
}

let supabaseSeeded = false;
async function ensureSupabasePosts(): Promise<void> {
  if (supabaseSeeded || !isSupabaseConfigured()) return;
  const admin = createSupabaseAdmin();
  const { data, error } = await admin.from("editorial_posts").select("id").limit(1);
  if (error) throw error;
  if (!data?.length) {
    const inserted = await admin.from("editorial_posts").upsert(seedPosts.map(toSupabaseRow), { onConflict: "id" });
    if (inserted.error) throw inserted.error;
  } else {
    const required = seedPosts.filter((post) => post.slug === entranceResultsNewsSlug || post.slug === entranceResultsNewsSlugJuly31 || post.slug === entranceResultsNewsSlugAugust6 || post.slug === applicantRankingsNewsSlug);
    const inserted = await admin.from("editorial_posts").upsert(required.map(toSupabaseRow), { onConflict: "id", ignoreDuplicates: true });
    if (inserted.error) throw inserted.error;
  }
  supabaseSeeded = true;
}

export async function getPosts(options: { includeDrafts?: boolean; limit?: number } = {}): Promise<Post[]> {
  if (isSupabaseConfigured()) {
    try {
      await ensureSupabasePosts();
      const client = options.includeDrafts ? createSupabaseAdmin() : createSupabasePublicClient();
      const limit = Math.max(1, Math.min(options.limit ?? 50, 100));
      let query = client.from("editorial_posts").select("*");
      if (!options.includeDrafts) query = query.eq("status", "published");
      const { data, error } = await query.order("featured", { ascending: false }).order("published_at", { ascending: false, nullsFirst: false }).limit(limit);
      if (error) throw error;
      if (data?.length) return data.map((row) => fromRow(row as Record<string, unknown>)).filter((post) => post.category !== "__byteslab_workspace__");
    } catch {
      // Keep the public site available with bundled editorial content.
    }
  }
  try {
    await ensurePosts();
    const database = await db();
    if (!database) throw new Error("D1_UNAVAILABLE");
    const where = options.includeDrafts ? "" : "WHERE status = 'published'";
    const limit = Math.max(1, Math.min(options.limit ?? 50, 100));
    const result = await database.prepare(`SELECT * FROM posts ${where} ORDER BY featured DESC, COALESCE(published_at, created_at) DESC LIMIT ?`).bind(limit).all<Record<string, unknown>>();
    return result.results.map(fromRow).filter((post) => post.category !== "__byteslab_workspace__");
  } catch {
    return seedPosts.filter((post) => options.includeDrafts || post.status === "published").slice(0, options.limit ?? 50);
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await createSupabasePublicClient().from("editorial_posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
      if (error) throw error;
      if (data) return fromRow(data as Record<string, unknown>);
    } catch {
      // Fall back to bundled content during a temporary backend outage.
    }
  }
  try {
    await ensurePosts();
    const database = await db();
    if (!database) throw new Error("D1_UNAVAILABLE");
    const row = await database.prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published'").bind(slug).first<Record<string, unknown>>();
    return row ? fromRow(row) : null;
  } catch {
    return seedPosts.find((post) => post.slug === slug && post.status === "published") ?? null;
  }
}

export function slugify(value: string): string {
  const map: Record<string, string> = { а:"a",б:"b",в:"v",г:"h",ґ:"g",д:"d",е:"e",є:"ye",ж:"zh",з:"z",и:"y",і:"i",ї:"yi",й:"i",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ь:"",ю:"yu",я:"ya" };
  return value.toLowerCase().split("").map((letter) => map[letter] ?? letter).join("").normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || `article-${Date.now()}`;
}

export async function createPost(input: PostInput, authorEmail: string): Promise<Post> {
  if (isSupabaseConfigured()) {
    await ensureSupabasePosts();
    const now = new Date().toISOString();
    const post: Post = { ...input, id: crypto.randomUUID(), slug: slugify(input.slug || input.title), createdAt: now, updatedAt: now, authorEmail };
    if (post.status === "published" && !post.publishedAt) post.publishedAt = now;
    const { data, error } = await createSupabaseAdmin().from("editorial_posts").insert(toSupabaseRow(post)).select("*").single();
    if (error) throw error;
    return fromRow(data as Record<string, unknown>);
  }
  await ensurePosts();
  const database = await db();
  if (!database) throw new Error("PERSISTENCE_UNAVAILABLE");
  const now = new Date().toISOString();
  const post: Post = { ...input, id: crypto.randomUUID(), slug: slugify(input.slug || input.title), createdAt: now, updatedAt: now, authorEmail };
  if (post.status === "published" && !post.publishedAt) post.publishedAt = now;
  await database.prepare(`INSERT INTO posts (id,slug,title,excerpt,body,category,image_url,image_alt,status,featured,published_at,created_at,updated_at,author_email) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(post.id, post.slug, post.title, post.excerpt, post.body, post.category, post.imageUrl, post.imageAlt, post.status, post.featured ? 1 : 0, post.publishedAt, post.createdAt, post.updatedAt, post.authorEmail).run();
  return post;
}

export async function updatePost(id: string, input: PostInput, authorEmail: string): Promise<Post | null> {
  if (isSupabaseConfigured()) {
    const now = new Date().toISOString();
    const publishedAt = input.status === "published" ? (input.publishedAt || now) : null;
    const { data, error } = await createSupabaseAdmin().from("editorial_posts").update({
      slug: slugify(input.slug || input.title), title: input.title, excerpt: input.excerpt, body: input.body,
      category: input.category, image_url: input.imageUrl, image_alt: input.imageAlt, status: input.status,
      featured: input.featured, published_at: publishedAt, updated_at: now, author_email: authorEmail,
    }).eq("id", id).select("*").maybeSingle();
    if (error) throw error;
    return data ? fromRow(data as Record<string, unknown>) : null;
  }
  await ensurePosts();
  const database = await db();
  if (!database) throw new Error("PERSISTENCE_UNAVAILABLE");
  const now = new Date().toISOString();
  const publishedAt = input.status === "published" ? (input.publishedAt || now) : null;
  await database.prepare(`UPDATE posts SET slug=?,title=?,excerpt=?,body=?,category=?,image_url=?,image_alt=?,status=?,featured=?,published_at=?,updated_at=?,author_email=? WHERE id=?`).bind(slugify(input.slug || input.title), input.title, input.excerpt, input.body, input.category, input.imageUrl, input.imageAlt, input.status, input.featured ? 1 : 0, publishedAt, now, authorEmail, id).run();
  const row = await database.prepare("SELECT * FROM posts WHERE id = ?").bind(id).first<Record<string, unknown>>();
  return row ? fromRow(row) : null;
}

export async function deletePost(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await createSupabaseAdmin().from("editorial_posts").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  await ensurePosts();
  const database = await db();
  if (!database) throw new Error("PERSISTENCE_UNAVAILABLE");
  await database.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
}
