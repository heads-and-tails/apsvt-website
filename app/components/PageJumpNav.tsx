import { Children, type ReactNode } from "react";

export function PageJumpNav({
  ariaLabel,
  className,
  label = "Розділи сторінки",
  children,
}: {
  ariaLabel: string;
  className: string;
  label?: string;
  children: ReactNode;
}) {
  const itemCount = Children.count(children);

  return <details className="page-jump-disclosure">
    <summary>
      <span>Швидка навігація</span>
      <b>{label}</b>
      <small>{itemCount} {itemCount === 1 ? "розділ" : itemCount < 5 ? "розділи" : "розділів"}</small>
      <i aria-hidden="true">+</i>
    </summary>
    <nav className={className} aria-label={ariaLabel}><div className="wrap">{children}</div></nav>
  </details>;
}
