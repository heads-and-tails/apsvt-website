import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { BookCatalogue } from "./BookCatalogue";
import { getPublicContent as getContentItems } from "@/lib/content";
import { PageDocuments } from "../../components/PageDocuments";

export const metadata: Metadata = {
  title: "Бібліотека",
  description:
    "Фонд, читальні зали, електронний каталог і режим роботи бібліотеки АПСВТ.",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const books = (await getContentItems("library_book")).map(
    (item) => item.payload,
  ) as import("./BookCatalogue").LibraryBook[];

  return (
    <main id="top">
      <SiteHeader />
      <section className="phero img">
        <div className="bgi">
          <img src="/apsvt-library.jpg" alt="Бібліотека Академії" />
        </div>
        <div className="wrap">
          <div className="crumb">Кампус / Бібліотека</div>
          <h1>
            Знання у
            <br />
            відкритому доступі
          </h1>
          <p className="lead">
            Книжковий фонд, періодика, навчально-методичні комплекси й простір для
            зосередженої роботи.
          </p>
        </div>
      </section>
      <div className="phero-rule" />

      <section>
        <div className="wrap">
          <div className="library-stats">
            <article>
              <b>70 000+</b>
              <span>примірників книг</span>
            </article>
            <article>
              <b>1 517</b>
              <span>навчально-методичних комплексів</span>
            </article>
            <article>
              <b>50</b>
              <span>назв періодики у фонді</span>
            </article>
            <article>
              <b>1993</b>
              <span>рік заснування бібліотеки</span>
            </article>
          </div>
        </div>
      </section>

      <section className="soft">
        <div className="wrap detail-layout">
          <div className="detail-copy">
            <div className="idx">01 / Про бібліотеку</div>
            <h2>Разом з Академією від 1993 року</h2>
            <p className="lede">
              Історія бібліотеки веде свій відлік з 1993 року, коли за ініціативою
              Федерації профспілок України була створена Академія праці і соціальних
              відносин.
            </p>
            <p>
              Фонди укомплектовані сучасними навчальними, науковими, довідковими,
              методичними і періодичними виданнями з усіх дисциплін, які вивчаються в
              Академії відповідно до навчальних програм і тематики наукових
              досліджень.
            </p>
            <p>
              Щорічно до бібліотеки надходить більше тисячі примірників книг,
              включаючи видання викладачів Академії. Бібліотека обслуговує до двох
              тисяч студентів і викладачів та є навчально-допоміжним, інформаційним і
              культурно-виховним підрозділом Академії.
            </p>
          </div>
          <aside className="detail-aside">
            <div className="panel">
              <h3>Режим роботи</h3>
              <ul>
                <li>
                  <span className="y">Пн–Чт</span>08:45–17:45
                </li>
                <li>
                  <span className="y">Пт</span>08:45–16:30
                </li>
                <li>
                  <span className="y">Сб–Нд</span>вихідні
                </li>
                <li>
                  <span className="y">Адреса</span>Кільцева дорога, 3-Б, м. Київ
                </li>
                <li>
                  <span className="y">Тел.</span>
                  <a href="tel:+380445260723">(044) 526-07-23</a>
                </li>
              </ul>
            </div>
            <p className="aside-hint">
              Останнє число місяця — санітарний день. Години роботи можуть
              змінюватися під час канікул.
            </p>
          </aside>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="idx">02 / До послуг читачів</div>
              <h2>Фонд і сервіси</h2>
            </div>
            <p>
              Читальні зали, абонемент і каталоги допомагають працювати з фондом у
              зручному форматі.
            </p>
          </div>
          <div className="rows">
            <div className="row">
              <span className="rnum">01</span>
              <div>
                <h3>Абонемент і читальні зали</h3>
                <p>
                  Працюють абонемент, книжковий читальний зал і читальний зал
                  періодики.
                </p>
              </div>
            </div>
            <div className="row">
              <span className="rnum">02</span>
              <div>
                <h3>Відкритий доступ</h3>
                <p>
                  Книги у читальному залі розташовані відповідно до структури ББК,
                  періодичні видання — в алфавітному порядку.
                </p>
              </div>
            </div>
            <div className="row">
              <span className="rnum">03</span>
              <div>
                <h3>Періодика і брошури</h3>
                <p>
                  У фонді близько 50 назв періодичних видань і понад 250 брошур;
                  щорічна передплата охоплює близько 30 назв періодики.
                </p>
              </div>
            </div>
            <div className="row">
              <span className="rnum">04</span>
              <div>
                <h3>Каталоги та картотеки</h3>
                <p>
                  Для пошуку матеріалів доступні карткові й електронні каталоги та
                  картотеки.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="soft">
        <div className="wrap detail-layout">
          <div className="detail-copy">
            <div className="idx">03 / Електронні ресурси</div>
            <h2>Онлайн-бібліотека ЦУЛ</h2>
            <p className="lede">
              Академія надає доступ до навчальної літератури онлайн-бібліотеки
              «Центр учбової літератури».
            </p>
            <p>
              <a
                className="sec-link"
                href="https://www.culonline.com.ua/"
                target="_blank"
                rel="noreferrer"
              >
                Перейти до онлайн-бібліотеки ЦУЛ ↗
              </a>
            </p>
          </div>
          <aside className="detail-aside">
            <div className="panel">
              <h3>Дані доступу</h3>
              <ul>
                <li>
                  <span className="y">Логін</span>apsvt
                </li>
                <li>
                  <span className="y">Пароль</span>library
                </li>
              </ul>
            </div>
            <p className="aside-hint">
              Дані оприлюднені на попередній версії офіційного сайту Академії.
            </p>
          </aside>
        </div>
      </section>

      <section id="catalogue">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="idx">04 / Електронний каталог</div>
              <h2>Знайти книгу</h2>
            </div>
            <p>
              Шукайте за назвою, автором, тематикою або бібліотечним шифром. Нові
              позиції додає бібліотека через редакційну панель.
            </p>
          </div>
          <BookCatalogue books={books} />
        </div>
      </section>

      <section className="soft">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="idx">05 / Архів</div>
              <h2>Попередня версія сторінки</h2>
            </div>
            <p>
              Оригінальний матеріал збережено без змін для перевірки джерела й
              історії оновлень.
            </p>
          </div>
          <a className="sec-link" href="/materials/library-f63a8eafd.html">
            Відкрити архівний матеріал «Бібліотека» →
          </a>
        </div>
      </section>

      <PageDocuments pagePath="/facilities/library" />
      <SiteFooter />
    </main>
  );
}
