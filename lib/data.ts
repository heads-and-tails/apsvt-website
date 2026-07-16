import { env } from "cloudflare:workers";

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

const IMG = "https://images.unsplash.com";

export const seedPosts: Post[] = [
  {
    id: "seed-open-day",
    slug: "open-day-2026",
    title: "День відкритих дверей: побачити Академію наживо",
    excerpt: "Знайомство з програмами, командами факультетів і простором, у якому починається професійна траєкторія.",
    body: "Академія відкриває двері для вступників та їхніх родин. Це день без формальних презентацій: можна пройти майбутнім маршрутом студента, поговорити з викладачами та поставити запитання тим, хто вже навчається.\n\nУ програмі — короткі лабораторії спеціальностей, консультації щодо вступу, знайомство з міжнародними можливостями та практичними проєктами. Команда приймальної комісії допоможе скласти персональний план подачі документів.\n\nРеєстрація безкоштовна. Візьміть із собою запитання, а все інше ми покажемо на місці.",
    category: "Вступ",
    imageUrl: `${IMG}/photo-1523050854058-8df90110c9f1?w=1800&q=90&auto=format&fit=crop`,
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
    imageUrl: `${IMG}/photo-1552664730-d307ca884978?w=1800&q=90&auto=format&fit=crop`,
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
    imageUrl: `${IMG}/photo-1521791136064-7986c2920216?w=1800&q=90&auto=format&fit=crop`,
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
    imageUrl: `${IMG}/photo-1573164713988-8665fc963095?w=1800&q=90&auto=format&fit=crop`,
    imageAlt: "Студентка працює з документами",
    status: "published",
    featured: false,
    publishedAt: "2026-06-28T11:00:00.000Z",
    createdAt: "2026-06-28T11:00:00.000Z",
    updatedAt: "2026-06-28T11:00:00.000Z",
    authorEmail: "vportnaia@kse.org.ua",
  },
];

const createTableSql = `CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY NOT NULL, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL,
  excerpt TEXT NOT NULL, body TEXT NOT NULL, category TEXT NOT NULL,
  image_url TEXT NOT NULL, image_alt TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft',
  featured INTEGER NOT NULL DEFAULT 0, published_at TEXT, created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL, author_email TEXT NOT NULL
)`;

function db(): D1Database {
  if (!env.DB) throw new Error("D1_UNAVAILABLE");
  return env.DB;
}

let initialized = false;

export async function ensurePosts(): Promise<void> {
  if (initialized) return;
  const database = db();
  await database.prepare(createTableSql).run();
  await database.prepare("CREATE INDEX IF NOT EXISTS posts_status_published_idx ON posts(status, published_at)").run();
  const count = await database.prepare("SELECT COUNT(*) AS count FROM posts").first<{ count: number }>();
  if (!count?.count) {
    await database.batch(seedPosts.map((post) => database.prepare(
      `INSERT INTO posts (id,slug,title,excerpt,body,category,image_url,image_alt,status,featured,published_at,created_at,updated_at,author_email)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    ).bind(post.id, post.slug, post.title, post.excerpt, post.body, post.category, post.imageUrl, post.imageAlt, post.status, post.featured ? 1 : 0, post.publishedAt, post.createdAt, post.updatedAt, post.authorEmail)));
  }
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

export async function getPosts(options: { includeDrafts?: boolean; limit?: number } = {}): Promise<Post[]> {
  try {
    await ensurePosts();
    const where = options.includeDrafts ? "" : "WHERE status = 'published'";
    const limit = Math.max(1, Math.min(options.limit ?? 50, 100));
    const result = await db().prepare(`SELECT * FROM posts ${where} ORDER BY featured DESC, COALESCE(published_at, created_at) DESC LIMIT ?`).bind(limit).all<Record<string, unknown>>();
    return result.results.map(fromRow);
  } catch {
    return seedPosts.filter((post) => options.includeDrafts || post.status === "published").slice(0, options.limit ?? 50);
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    await ensurePosts();
    const row = await db().prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published'").bind(slug).first<Record<string, unknown>>();
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
  await ensurePosts();
  const now = new Date().toISOString();
  const post: Post = { ...input, id: crypto.randomUUID(), slug: slugify(input.slug || input.title), createdAt: now, updatedAt: now, authorEmail };
  if (post.status === "published" && !post.publishedAt) post.publishedAt = now;
  await db().prepare(`INSERT INTO posts (id,slug,title,excerpt,body,category,image_url,image_alt,status,featured,published_at,created_at,updated_at,author_email) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(post.id, post.slug, post.title, post.excerpt, post.body, post.category, post.imageUrl, post.imageAlt, post.status, post.featured ? 1 : 0, post.publishedAt, post.createdAt, post.updatedAt, post.authorEmail).run();
  return post;
}

export async function updatePost(id: string, input: PostInput, authorEmail: string): Promise<Post | null> {
  await ensurePosts();
  const now = new Date().toISOString();
  const publishedAt = input.status === "published" ? (input.publishedAt || now) : null;
  await db().prepare(`UPDATE posts SET slug=?,title=?,excerpt=?,body=?,category=?,image_url=?,image_alt=?,status=?,featured=?,published_at=?,updated_at=?,author_email=? WHERE id=?`).bind(slugify(input.slug || input.title), input.title, input.excerpt, input.body, input.category, input.imageUrl, input.imageAlt, input.status, input.featured ? 1 : 0, publishedAt, now, authorEmail, id).run();
  const row = await db().prepare("SELECT * FROM posts WHERE id = ?").bind(id).first<Record<string, unknown>>();
  return row ? fromRow(row) : null;
}

export async function deletePost(id: string): Promise<void> {
  await ensurePosts();
  await db().prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
}
