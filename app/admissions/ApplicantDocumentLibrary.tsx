import { getPublicDocuments } from "@/lib/documents";

type AdmissionDocument = {
  number: string;
  order: number;
  category: string;
  title: string;
  description: string;
  pages: number;
  href: string;
  featured?: boolean;
};

const documents: AdmissionDocument[] = [
  {
    number: "01",
    order: 10,
    category: "Правила прийому",
    title: "Правила прийому на навчання до АПСВТ у 2026 році",
    description: "Основний документ вступної кампанії: умови, строки, конкурсні пропозиції, порядок подання заяв і зарахування.",
    pages: 73,
    href: "/documents/admissions/01-pravyla-pryiomu-apsvt-2026.pdf",
    featured: true,
  },
  {
    number: "02",
    order: 20,
    category: "Положення",
    title: "Положення про Приймальну комісію АПСВТ",
    description: "Організація роботи, повноваження та відповідальність Приймальної комісії Академії.",
    pages: 16,
    href: "/documents/admissions/02-polozhennia-pro-pryimalnu-komisiiu.pdf",
  },
  {
    number: "03",
    order: 30,
    category: "Положення",
    title: "Положення про комісії для проведення вступних випробувань",
    description: "Порядок утворення та роботи предметних, фахових і інших комісій вступної кампанії.",
    pages: 7,
    href: "/documents/admissions/03-polozhennia-pro-komisii-vstupnykh-vyprobuvan.pdf",
  },
  {
    number: "04",
    order: 40,
    category: "Порядок",
    title: "Дії Приймальної комісії в умовах загроз",
    description: "Алгоритми безпечної та безперервної роботи під час надзвичайних ситуацій і загроз.",
    pages: 5,
    href: "/documents/admissions/04-poriadok-dii-pk-v-umovakh-zahroz.pdf",
  },
  {
    number: "05",
    order: 50,
    category: "Порядок",
    title: "Забезпечення інклюзивності вступної кампанії",
    description: "Умови доступності та рівної участі вступників з особливими освітніми потребами.",
    pages: 6,
    href: "/documents/admissions/05-poriadok-inkliuzyvnosti-vstupnoi-kampanii.pdf",
  },
  {
    number: "06",
    order: 60,
    category: "Порядок",
    title: "Зберігання робіт вступників",
    description: "Правила обліку, зберігання та доступу до письмових робіт вступних випробувань.",
    pages: 5,
    href: "/documents/admissions/06-poriadok-zberihannia-robit-vstupnykiv.pdf",
  },
  {
    number: "07",
    order: 70,
    category: "Порядок",
    title: "Організація прийому іноземців до АПСВТ",
    description: "Особливості вступу іноземців та осіб без громадянства на навчання в Академії.",
    pages: 6,
    href: "/documents/admissions/07-poriadok-pryiomu-inozemtsiv.pdf",
  },
  {
    number: "08",
    order: 80,
    category: "Порядок",
    title: "Проведення вступних випробувань в АПСВТ",
    description: "Організаційні правила, вимоги до учасників і процедура оцінювання результатів.",
    pages: 15,
    href: "/documents/admissions/08-poriadok-provedennia-vstupnykh-vyprobuvan.pdf",
  },
  {
    number: "09",
    order: 90,
    category: "Порядок",
    title: "Акредитація представників суб’єктів медіа",
    description: "Умови присутності та роботи представників медіа під час вступної кампанії.",
    pages: 4,
    href: "/documents/admissions/09-poriadok-akredytatsii-media.pdf",
  },
  {
    number: "10",
    order: 100,
    category: "Порядок",
    title: "Подання і розгляд апеляцій",
    description: "Строки, форма звернення та процедура перегляду результатів вступних випробувань.",
    pages: 6,
    href: "/documents/admissions/10-poriadok-podannia-apeliatsii.pdf",
  },
  {
    number: "11",
    order: 110,
    category: "Додаток",
    title: "Додаток 8 — вступні випробування з використанням дистанційних технологій",
    description: "Організація та проведення вступних випробувань у дистанційному форматі.",
    pages: 7,
    href: "/documents/admissions/11-dodatok-8.pdf",
  },
];

export async function ApplicantDocumentLibrary() {
  const managed = await getPublicDocuments("/admissions");
  const used = new Set<string>();
  const merged = documents.map((document) => {
    const replacement = managed.find((item) => item.sortOrder === document.order);
    if (!replacement) return document;
    used.add(replacement.id);
    return {
      ...document,
      category: replacement.category || document.category,
      title: replacement.title || document.title,
      description: replacement.description || document.description,
      href: replacement.fileUrl,
      pages: 0,
    };
  });
  const additions: AdmissionDocument[] = managed.filter((item) => !used.has(item.id)).map((item) => ({
    number: "",
    order: item.sortOrder,
    category: item.category,
    title: item.title,
    description: item.description,
    pages: 0,
    href: item.fileUrl,
  }));
  const appendix = merged.filter((document) => document.order === 110);
  const ordered = [...merged.filter((document) => document.order !== 110), ...additions]
    .sort((a, b) => a.order - b.order)
    .concat(appendix)
    .map((document, index) => ({ ...document, number: String(index + 1).padStart(2, "0") }));

  return <section className="admission-rules" id="admission-rules"><div className="wrap">
    <div className="admission-rules-head">
      <div><div className="idx">07 / Офіційні документи</div><h2>Правила прийому<br />та нормативні документи</h2></div>
      <div className="admission-rules-note"><b>Вступ 2026</b><p>Документи розміщено в офіційній послідовності: правила, положення, порядки та додаток.</p><span>11 PDF · 150 сторінок</span></div>
    </div>
    <div className="admission-document-list">
      {ordered.map((document) => <a className={document.featured ? "featured" : ""} href={document.href} target="_blank" rel="noreferrer" key={`${document.order}-${document.href}`}>
        <span className="admission-document-number">{document.number}</span>
        <div className="admission-document-copy"><small>{document.category}</small><h3>{document.title}</h3><p>{document.description}</p></div>
        <div className="admission-document-meta"><span>{document.pages ? `PDF · ${document.pages} ${document.pages === 1 ? "сторінка" : document.pages < 5 ? "сторінки" : "сторінок"}` : "Файл · оновлено редакцією"}</span><b>Відкрити <i>↗</i></b></div>
      </a>)}
    </div>
    <div className="admission-documents-help"><span>?</span><div><b>Не знаєте, який документ потрібен?</b><p>Напишіть Приймальній комісії — команда підкаже правило або порядок саме для вашої ситуації.</p></div><a href="#consultation">Поставити запитання →</a></div>
  </div></section>;
}
