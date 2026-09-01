"use client";

import { useMemo, useState } from "react";
import type { Post } from "@/lib/data";
import type { ContentItem, ContentKind } from "@/lib/content";
import type { EditorialProfile, Publisher } from "@/lib/auth";
import type { PageDocument } from "@/lib/documents";
import { accessScopeLabel, canEditPage, contentKindPagePath, editorialAccessOptions } from "@/lib/editorial-access";
import { OperationsEditor } from "./OperationsEditor";
import { AccessManager } from "./AccessManager";
import { DocumentManager } from "./DocumentManager";
import { AiEditorialAssistant } from "./AiEditorialAssistant";
import { StudentFinanceManager } from "./StudentFinanceManager";
import type { StudentFinanceAdminData } from "@/lib/student-finance";
import type { DepartmentEntry } from "@/lib/department-content";
import { DepartmentManager } from "./DepartmentManager";
import { requestJson } from "@/lib/client-request";

type FormState = { title: string; excerpt: string; body: string; category: string; imageUrl: string; imageAlt: string; status: "draft" | "published"; featured: boolean; publishedAt: string | null; slug?: string };
type PanelView = "overview" | "assistant" | "news-editor" | "materials" | "departments" | "operations" | "documents" | "finance" | "access";
type NavItem = { id: PanelView; label: string; icon: string; hint: string };

const empty: FormState = { title: "", excerpt: "", body: "", category: "Новини", imageUrl: "", imageAlt: "", status: "draft", featured: false, publishedAt: null };

const viewTitles: Record<PanelView, { eyebrow: string; title: string; description: string }> = {
  overview: { eyebrow: "Робочий центр", title: "Редакційна панель", description: "Усі інструменти сайту в одному місці — без довгої сторінки та зайвої прокрутки." },
  assistant: { eyebrow: "AI-помічник", title: "Розумний імпорт", description: "Передайте файл або фото — помічник визначить розділ і оформить матеріал у стилі сайту." },
  "news-editor": { eyebrow: "Публікації", title: "Новий матеріал", description: "Створіть або відредагуйте новину, оголошення чи історію Академії." },
  materials: { eyebrow: "Архів редакції", title: "Усі публікації", description: "Чернетки й опубліковані матеріали з швидким редагуванням." },
  departments: { eyebrow: "Увесь сайт", title: "Сторінки та матеріали", description: "Обкладинки, тексти, люди, викладачі, партнери, фото й матеріали всіх сторінок." },
  operations: { eyebrow: "Дані сайту", title: "Керування розділами", description: "Події, вступ, вакансії, бібліотека, розклад, наука та кваліфікаційні роботи." },
  documents: { eyebrow: "Файли", title: "Документи сторінок", description: "Завантаження, опис, розподіл за сторінками та контроль публікації." },
  finance: { eyebrow: "Особисті кабінети", title: "Студенти та оплата", description: "Договори, нарахування, платежі, прострочення та повідомлення." },
  access: { eyebrow: "Адміністрування", title: "Користувачі та доступ", description: "Акаунти редакторів, ролі, кафедри та дозволені сторінки." },
};

function PanelNavGroup({ label, items, activeView, onOpen }: { label: string; items: NavItem[]; activeView: PanelView; onOpen: (view: PanelView) => void }) {
  if (!items.length) return null;
  return <div className="panel-nav-group"><small>{label}</small>{items.map((item) => <button className={activeView === item.id ? "active" : ""} type="button" aria-current={activeView === item.id ? "page" : undefined} onClick={() => onOpen(item.id)} key={item.id}><span>{item.icon}</span><div><b>{item.label}</b><i>{item.hint}</i></div></button>)}</div>;
}

function PanelOverview({ posts, documents, departmentEntries, canManageNews, canManageDepartment, canManageOperations, isAdmin, open }: { posts: Post[]; documents: PageDocument[]; departmentEntries: DepartmentEntry[]; canManageNews: boolean; canManageDepartment: boolean; canManageOperations: boolean; isAdmin: boolean; open: (view: PanelView) => void }) {
  const drafts = posts.filter((post) => post.status === "draft").length;
  const actions = [
    { id: "assistant" as const, icon: "AI", title: "Передати матеріал помічнику", text: "Word, PDF або фото → готова структурована чернетка", show: true, accent: true },
    { id: "news-editor" as const, icon: "+", title: "Створити публікацію", text: "Новина, оголошення, подія або важлива історія", show: canManageNews },
    { id: "departments" as const, icon: "WEB", title: "Оновити сторінку", text: "Тексти, обкладинки, люди, партнери, фото та матеріали", show: canManageDepartment },
    { id: "documents" as const, icon: "PDF", title: "Додати документ", text: "Призначити файл потрібній сторінці й категорії", show: true },
    { id: "operations" as const, icon: "↗", title: "Оновити розділ", text: "Розклад, вступ, вакансії, бібліотека або наука", show: canManageOperations },
    { id: "access" as const, icon: "ID", title: "Додати редактора", text: "Створити акаунт і призначити потрібні сторінки", show: isAdmin },
  ].filter((item) => item.show);
  return <section className="panel-overview" aria-label="Огляд редакційної панелі">
    <div className="panel-welcome"><div><span>Швидкий старт</span><h2>Що потрібно зробити?</h2><p>Оберіть дію. Відкриється лише потрібний інструмент, а не вся панель одразу.</p></div><button type="button" onClick={() => open("assistant")}><b>AI</b><span>Надіслати файл помічнику</span><i>→</i></button></div>
    <div className="panel-action-grid">{actions.map((action) => <button className={action.accent ? "accent" : ""} type="button" onClick={() => open(action.id)} key={action.id}><span>{action.icon}</span><div><b>{action.title}</b><p>{action.text}</p></div><i>→</i></button>)}</div>
    <div className="panel-overview-grid">
      <article><span>Стан контенту</span><h3>Редакційний огляд</h3><dl><div><dt>Опубліковано</dt><dd>{posts.length - drafts}</dd></div><div><dt>Чернетки</dt><dd>{drafts}</dd></div><div><dt>Документи</dt><dd>{documents.length}</dd></div><div><dt>Додано через панель</dt><dd>{departmentEntries.length}</dd></div></dl></article>
      <article><span>Останні матеріали</span><h3>Нещодавно змінено</h3><div className="panel-recent">{posts.slice(0, 4).map((post) => <button type="button" onClick={() => open("materials")} key={post.id}><div><b>{post.title}</b><small>{post.category} · {post.status === "published" ? "опубліковано" : "чернетка"}</small></div><i>→</i></button>)}{posts.length === 0 && <p>Матеріалів ще немає. Створіть перший за допомогою AI.</p>}</div></article>
    </div>
  </section>;
}

export function PanelEditor({ initialPosts, initialContent, initialDocuments, initialDepartmentEntries, publisher, initialProfiles, initialStudentFinance }: { initialPosts: Post[]; initialContent: ContentItem[]; initialDocuments: PageDocument[]; initialDepartmentEntries: DepartmentEntry[]; publisher: Publisher; initialProfiles: EditorialProfile[]; initialStudentFinance: StudentFinanceAdminData }) {
  const [posts, setPosts] = useState(initialPosts);
  const [form, setForm] = useState<FormState>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [activeView, setActiveView] = useState<PanelView>("overview");
  const published = useMemo(() => posts.filter((post) => post.status === "published").length, [posts]);
  const canManageNews = canEditPage(publisher, "/news");
  const allowedKinds = Object.entries(contentKindPagePath).filter(([, path]) => canEditPage(publisher, path)).map(([kind]) => kind) as ContentKind[];
  const canManageDepartment = editorialAccessOptions.some((option) => option.group !== "all" && canEditPage(publisher, option.value));
  const scopeLabel = accessScopeLabel(publisher.accessScopes);
  const isAdmin = publisher.role === "admin";
  const activeTitle = viewTitles[activeView];

  const primaryNav: NavItem[] = [
    { id: "overview", label: "Огляд", icon: "01", hint: "Робочий центр" },
    { id: "assistant", label: "AI-помічник", icon: "AI", hint: "Файл → сторінка" },
  ];
  const contentNav: NavItem[] = [
    ...(canManageNews ? [{ id: "news-editor" as const, label: "Новий матеріал", icon: "+", hint: "Новина або оголошення" }, { id: "materials" as const, label: "Публікації", icon: "Н", hint: `${posts.length} матеріалів` }] : []),
    ...(canManageDepartment ? [{ id: "departments" as const, label: "Сторінки", icon: "WEB", hint: "Увесь контент сайту" }] : []),
    ...(allowedKinds.length ? [{ id: "operations" as const, label: "Розділи сайту", icon: "Р", hint: "Події, вступ, розклад" }] : []),
    { id: "documents", label: "Документи", icon: "D", hint: `${initialDocuments.length} файлів` },
  ];
  const adminNav: NavItem[] = [
    ...(isAdmin ? [{ id: "finance" as const, label: "Студенти й оплата", icon: "₴", hint: "Договори та платежі" }, { id: "access" as const, label: "Користувачі", icon: "ID", hint: "Ролі та доступ" }] : []),
  ];

  function open(view: PanelView) { setActiveView(view); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function change<K extends keyof FormState>(key: K, value: FormState[K]) { setForm((current) => ({ ...current, [key]: value })); }
  function edit(post: Post) { setEditing(post.id); setForm({ title: post.title, excerpt: post.excerpt, body: post.body, category: post.category, imageUrl: post.imageUrl, imageAlt: post.imageAlt, status: post.status, featured: post.featured, publishedAt: post.publishedAt, slug: post.slug }); open("news-editor"); }
  function reset() { setEditing(null); setForm(empty); setMessage(""); }
  async function upload(file: File) {
    setBusy(true);
    setMessage("Завантажуємо фото…");
    const data = new FormData();
    data.append("file", file);
    try {
      const result = await requestJson<{ url: string }>("/api/uploads", { method: "POST", body: data }, 45_000);
      change("imageUrl", result.url);
      if (!form.imageAlt) change("imageAlt", file.name.replace(/[-_]/g, " "));
      setMessage("Фото готове");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не вдалося завантажити фото");
    } finally {
      setBusy(false);
    }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const requestedStatus = submitter?.value === "published" ? "published" : "draft";
    const requiredFields = [
      { name: "title", label: "заголовок", value: form.title },
      { name: "excerpt", label: "короткий опис", value: form.excerpt },
      { name: "body", label: "текст статті", value: form.body },
    ];
    const missingFields = requiredFields.filter((field) => !field.value.trim());
    if (missingFields.length) {
      setMessage(`Заповніть обов’язкові поля: ${missingFields.map((field) => field.label).join(", ")}.`);
      const firstMissing = event.currentTarget.elements.namedItem(missingFields[0].name);
      if (firstMissing instanceof HTMLElement) {
        firstMissing.focus();
        firstMissing.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    const payload: FormState = {
      ...form,
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      body: form.body.trim(),
      status: requestedStatus,
      publishedAt: requestedStatus === "published" ? form.publishedAt : null,
    };
    setBusy(true);
    setMessage(requestedStatus === "published" ? "Публікуємо матеріал…" : "Зберігаємо чернетку…");
    try {
      const result = await requestJson<Post>(editing ? `/api/posts/${editing}` : "/api/posts", {
        method: editing ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      setPosts((current) => editing ? current.map((post) => post.id === editing ? result : post) : [result, ...current]);
      setMessage(result.status === "published" ? "Матеріал опубліковано" : "Чернетку збережено");
      setEditing(null);
      setForm(empty);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не вдалося зберегти матеріал");
    } finally {
      setBusy(false);
    }
  }
  async function remove(id: string) { if (!confirm("Видалити цей матеріал?")) return; setBusy(true); const response = await fetch(`/api/posts/${id}`, { method: "DELETE" }); if (response.ok) { setPosts((current) => current.filter((post) => post.id !== id)); setMessage("Матеріал видалено"); } else setMessage("Не вдалося видалити"); setBusy(false); }

  return <div className="panel-shell panel-shell-v2">
    <aside className="panel-side panel-side-v2"><div className="panel-brand"><span>АП</span><b>Редакційна<br />панель</b></div><nav aria-label="Розділи редакційної панелі"><PanelNavGroup label="Головне" items={primaryNav} activeView={activeView} onOpen={open} /><PanelNavGroup label="Контент" items={contentNav} activeView={activeView} onOpen={open} /><PanelNavGroup label="Адміністрування" items={adminNav} activeView={activeView} onOpen={open} /><div className="panel-nav-group panel-nav-links"><small>Інструменти</small><a href="/panel/scheduler"><span>PL</span><div><b>Планувальник</b><i>Розклад занять</i></div></a><a href="/panel/workspace"><span>BW</span><div><b>BytesLab × Академія</b><i>Робочий простір</i></div></a></div></nav><div className="panel-user"><span>{isAdmin ? "Адміністратор" : scopeLabel}</span><b>{publisher.displayName}</b><form action="/auth/signout" method="post"><button type="submit">Вийти</button></form></div></aside>
    <main className="panel-main panel-main-v2">
      <header className="panel-top panel-top-v2"><div><span>{activeTitle.eyebrow} · {isAdmin ? "повний доступ" : scopeLabel}</span><h1>{editing && activeView === "news-editor" ? "Редагувати матеріал" : activeTitle.title}</h1><p>{activeTitle.description}</p></div><div className="panel-header-actions"><a href="/documents/editorial-panel-guide.pdf" target="_blank">Інструкція ↗</a><a className="primary" href="/" target="_blank">Відкрити сайт ↗</a></div></header>
      <div className="panel-kpis"><div><span>Опубліковано</span><b>{published}</b><i>новин і оголошень</i></div><div><span>Документи</span><b>{initialDocuments.length}</b><i>завантажено через панель</i></div><div><span>Додано через панель</span><b>{initialDepartmentEntries.length}</b><i>карток і замін на сторінках</i></div><button type="button" onClick={() => open("assistant")}><span>Швидка дія</span><b>Передати файл AI</b><i>→</i></button></div>

      {activeView === "overview" && <PanelOverview posts={posts} documents={initialDocuments} departmentEntries={initialDepartmentEntries} canManageNews={canManageNews} canManageDepartment={canManageDepartment} canManageOperations={allowedKinds.length > 0} isAdmin={isAdmin} open={open} />}
      {activeView === "assistant" && <AiEditorialAssistant publisher={publisher} />}
      {activeView === "news-editor" && canManageNews && <form className="editor" id="editor" noValidate onSubmit={submit}>
        <section className="editor-fields">
          <p className="editor-required-note">Поля із позначкою <b>*</b> обов’язкові для чернетки та публікації.</p>
          <label>Заголовок *<input name="title" required value={form.title} onChange={(event) => change("title", event.target.value)} placeholder="Сильний і зрозумілий заголовок" /></label>
          <label>Категорія<select value={form.category} onChange={(event) => change("category", event.target.value)}><option>Новини</option><option>Вступ</option><option>Освіта</option><option>Наука</option><option>Міжнародне</option><option>Студенти</option><option>Події</option></select></label>
          <label>Короткий опис *<textarea name="excerpt" required rows={3} value={form.excerpt} onChange={(event) => change("excerpt", event.target.value)} placeholder="1–2 речення для картки матеріалу" /></label>
          <label>Текст статті *<textarea name="body" required className="body-editor" rows={16} value={form.body} onChange={(event) => change("body", event.target.value)} placeholder={"Перший абзац — головна думка.\n\nНовий абзац починайте після порожнього рядка."} /></label>
          <label className="toggle"><input type="checkbox" checked={form.featured} onChange={(event) => change("featured", event.target.checked)} /><span>Показувати як головний матеріал</span></label>
        </section>
        <aside className="editor-media">
          <div className="upload-box">{form.imageUrl ? <img src={form.imageUrl} alt="Попередній перегляд" /> : <div><b>Фото матеріалу</b><p>JPG, PNG або WebP · до 8 МБ</p></div>}<label className="upload-button">{busy ? "Зачекайте…" : "Обрати фото"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} /></label></div>
          <label>Альтернативний опис<input value={form.imageAlt} onChange={(event) => change("imageAlt", event.target.value)} placeholder="Що зображено на фото" /></label>
          <label>Або URL зображення<input type="url" value={form.imageUrl} onChange={(event) => change("imageUrl", event.target.value)} placeholder="https://…" /></label>
          <div className="publish-box">
            <p aria-live="polite">{message || "Збережіть матеріал як чернетку для перевірки або опублікуйте його одразу."}</p>
            <div className="publish-actions">
              <button className="secondary draft-action" disabled={busy} type="submit" name="status" value="draft">{busy ? "Зачекайте…" : "Зберегти як чернетку"}</button>
              <button disabled={busy} type="submit" name="status" value="published">{busy ? "Зачекайте…" : "Опублікувати зараз"}</button>
            </div>
            {editing && <button className="secondary" type="button" onClick={reset}>Скасувати редагування</button>}
          </div>
        </aside>
      </form>}
      {activeView === "materials" && canManageNews && <section className="materials panel-materials" id="materials"><div className="materials-head"><div><span>Архів редакції</span><h2>Усі матеріали</h2><p>Редагуйте чернетки, перевіряйте опубліковані матеріали або створіть новий.</p></div><button type="button" onClick={() => { reset(); open("news-editor"); }}>+ Новий</button></div><div className="material-list">{posts.map((post) => <article key={post.id}><div className="material-thumb"><img src={post.imageUrl || "/apsvt-students-real.jpg"} alt="" /></div><div><span>{post.category} · {post.status === "published" ? "Опубліковано" : "Чернетка"}</span><h3>{post.title}</h3><p>{post.excerpt}</p></div><div className="material-actions"><button onClick={() => edit(post)}>Редагувати</button>{post.status === "published" && <a href={`/news/${post.slug}`} target="_blank">Переглянути ↗</a>}<button className="danger" onClick={() => void remove(post.id)}>Видалити</button></div></article>)}</div></section>}
      {activeView === "departments" && canManageDepartment && <DepartmentManager initialEntries={initialDepartmentEntries} publisher={publisher} />}
      {activeView === "operations" && allowedKinds.length > 0 && <OperationsEditor initialContent={initialContent} allowedKinds={allowedKinds} />}
      {activeView === "documents" && <DocumentManager initialDocuments={initialDocuments} publisher={publisher} />}
      {activeView === "finance" && isAdmin && <StudentFinanceManager initialData={initialStudentFinance} />}
      {activeView === "access" && isAdmin && <AccessManager initialProfiles={initialProfiles} currentUserId={publisher.id} />}
    </main>
  </div>;
}
