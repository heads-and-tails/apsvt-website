import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div><span className="kicker yellow">Київ · Україна</span><h2>Освіта, що<br /><i>рухає людей.</i></h2></div>
        <div className="footer-contact">
          <p>Потрібна допомога з вибором програми?</p>
          <a href="mailto:pk@socosvita.kiev.ua">pk@socosvita.kiev.ua</a>
          <a href="tel:+380445260664">+38 (044) 526 06 64</a>
        </div>
      </div>
      <div className="footer-grid">
        <div><b>Навігація</b><Link href="/about">Про Академію</Link><Link href="/programs">Освітні програми</Link><Link href="/admissions">Вступ 2026</Link><Link href="/news">Новини й історії</Link></div>
        <div><b>Студентам</b><a href="#services">Розклад і сервіси</a><a href="#international">Мобільність</a><a href="#career">Кар’єрні можливості</a></div>
        <div><b>Академія</b><a href="https://maps.google.com/?q=Кільцева+дорога+3-А+Київ" target="_blank" rel="noreferrer">Кільцева дорога, 3-А</a><span>03187, Київ</span><Link href="/panel">Панель редактора</Link></div>
      </div>
      <div className="footer-bottom"><span>© 1993–2026 АПСВТ</span><span>Вчимося змінювати світ людяно</span><a href="#top">Нагору ↑</a></div>
    </footer>
  );
}
