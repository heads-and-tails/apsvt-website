import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { documentCategories, officialDocuments } from "@/lib/official-documents";

export const metadata: Metadata = {
  title: "Відновлений архів документів",
  description: "Добірка важливих документів Академії, відновлених із файлового архіву попередньої версії сайту socosvita.kiev.ua.",
};

const restoredDocuments = officialDocuments.filter((document) =>
  document.href.startsWith("/documents/archive/old-site/"),
);

const restoredGroups = documentCategories
  .map((category) => ({
    ...category,
    documents: restoredDocuments.filter((document) => document.category === category.id),
  }))
  .filter((category) => category.documents.length > 0);

const totalPages = restoredDocuments.reduce((sum, document) => sum + (document.pages || 0), 0);

export default function Page() {
  return <main id="top">
    <SiteHeader />
    <section className="archive-hero">
      <div className="wrap">
        <div className="crumb">Головна / Документи / Відновлений архів</div>
        <div className="archive-hero-grid">
          <div>
            <span>Архів старої версії socosvita.kiev.ua</span>
            <h1>Важливі файли.<br /><em>Знову доступні.</em></h1>
            <p>Ми відібрали та повернули на сайт нормативні, методичні й наукові матеріали зі старого файлового сховища Академії. Файли розміщені локально на новому сайті й більше не залежать від застарілих посилань.</p>
            <div className="archive-hero-actions">
              <a className="cta" href="#archive-groups"><span>Переглянути добірку</span></a>
              <Link className="archive-back" href="/documents">Повний каталог документів →</Link>
            </div>
          </div>
          <aside>
            <span>Відновлено</span>
            <b>{restoredDocuments.length}</b>
            <p>важливий файл</p>
            <div><strong>{restoredGroups.length}</strong><small>тематичних напрямів</small></div>
            <div><strong>{totalPages}</strong><small>сторінок матеріалів</small></div>
          </aside>
        </div>
      </div>
    </section>

    <section className="archive-note">
      <div className="wrap">
        <span>Як читати архів</span>
        <p>Позначка «архів / довідково» означає, що документ збережено для історії та зручного доступу. Перед офіційним застосуванням архівної редакції варто перевірити, чи не була вона замінена новішим документом.</p>
      </div>
    </section>

    <section className="archive-groups" id="archive-groups">
      <div className="wrap">
        {restoredGroups.map((group) => <section className="archive-group" key={group.id}>
          <header>
            <span>{group.number}</span>
            <div><h2>{group.title}</h2><p>{group.description}</p></div>
            <b>{String(group.documents.length).padStart(2, "0")}</b>
          </header>
          <div className="archive-file-grid">
            {group.documents.map((document, index) => <a href={document.href} target="_blank" rel="noreferrer" key={document.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div className="archive-file-meta">
                <small>PDF</small>
                {document.updated && <small>{document.updated}</small>}
                {document.pages && <small>{document.pages} {document.pages === 1 ? "сторінка" : "сторінок"}</small>}
              </div>
              <h3>{document.title}</h3>
              <p>{document.description}</p>
              <strong>Відкрити файл ↗</strong>
            </a>)}
          </div>
        </section>)}
      </div>
    </section>

    <section className="archive-footer-cta">
      <div className="wrap">
        <div><span>Усі чинні й довідкові матеріали</span><h2>Шукаєте інший документ?</h2></div>
        <Link className="cta" href="/documents#catalogue"><span>Перейти до каталогу</span></Link>
      </div>
    </section>
    <SiteFooter />
  </main>;
}
