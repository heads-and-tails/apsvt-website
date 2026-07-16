import Link from "next/link";

export function SiteHeader({ inverse = false }: { inverse?: boolean }) {
  return (
    <header className={`site-header ${inverse ? "inverse" : ""}`}>
      <Link className="brand" href="/" aria-label="АПСВТ — головна">
        <span className="brand-mark">АП</span>
        <span className="brand-name">Академія праці,<br />соціальних відносин і туризму</span>
      </Link>
      <nav aria-label="Головна навігація">
        <Link href="/about">Академія</Link>
        <Link href="/programs">Програми</Link>
        <Link href="/admissions">Вступ</Link>
        <Link href="/news">Медіа</Link>
      </nav>
      <Link className="header-action" href="/admissions#consultation">Консультація <span>↗</span></Link>
    </header>
  );
}
