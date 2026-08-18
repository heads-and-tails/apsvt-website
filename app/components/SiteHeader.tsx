"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SiteSearch } from "./SiteSearch";

const ukLinks = [
  ["/about", "Про Академію"],
  ["/programs", "Програми"],
  ["/admissions", "Вступнику"],
  ["/people", "Люди"],
  ["/international", "Міжнародне"],
  ["/research", "Наука"],
  ["/facilities", "Кампус"],
  ["/events", "Події"],
  ["/students", "Студенту"],
  ["/news", "Новини"],
  ["/contacts", "Контакти"],
] as const;

const enLinks = [
  ["/en/about", "About"],
  ["/en/programs", "Programmes"],
  ["/en/admissions", "Admissions"],
  ["/en/people", "People"],
  ["/en/international", "International"],
  ["/en/research", "Research"],
  ["/en/facilities", "Campus"],
  ["/en/events", "Events"],
  ["/en/students", "Students"],
  ["/en/news", "News"],
  ["/en/contacts", "Contacts"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstMenuLink = useRef<HTMLAnchorElement>(null);
  const english = pathname === "/en" || pathname.startsWith("/en/");
  const links = english ? enLinks : ukLinks;
  const ukPath = english ? pathname.replace(/^\/en/, "") || "/" : pathname;
  const enPath = english ? pathname : `/en${pathname === "/" ? "" : pathname}`;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstMenuLink.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1101px)");
    const closeAtDesktopWidth = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    desktop.addEventListener("change", closeAtDesktopWidth);
    return () => desktop.removeEventListener("change", closeAtDesktopWidth);
  }, []);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const openSearch = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if ((event.key === "/" && !typing) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k")) {
        event.preventDefault();
        setOpen(false);
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", openSearch);
    return () => window.removeEventListener("keydown", openSearch);
  }, []);

  return (
    <header className={`legacy-header ${open ? "menu-open" : ""}`}>
      <div className="wrap topbar">
        <Link className="brand" href={english ? "/en" : "/"} onClick={closeMenu}>
          <span className="brand-mark"><i>{english ? "A" : "А"}</i></span>
          <span className="brand-name">
            {english ? <>
              Academy of Labour,<br />Social Relations and Tourism
              <em>Kyiv · established 1993</em>
            </> : <>
              Академія праці,<br />соціальних відносин і туризму
              <em>Київ · засновано 1993</em>
            </>}
          </span>
        </Link>

        <nav className="desktop-mainnav" aria-label={english ? "Main navigation" : "Головна навігація"}>
          {links.map(([href, label]) => (
            <Link
              className={pathname === href || pathname.startsWith(`${href}/`) ? "active" : ""}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>

        <nav
          id="site-navigation"
          className={`mainnav ${open ? "open" : ""}`}
          aria-label={english ? "Main navigation" : "Головна навігація"}
          aria-hidden={!open}
          onClick={(event) => {
            if (event.currentTarget === event.target) closeMenu();
          }}
        >
          <div className="menu-shell wrap">
            <div className="menu-heading">
              <span>{english ? "Explore the Academy" : "Навігація Академією"}</span>
              <b>{english ? "Choose a section" : "Оберіть розділ"}</b>
            </div>
            <div className="menu-grid">
              {links.map(([href, label], index) => (
                <Link
                  className={pathname === href || pathname.startsWith(`${href}/`) ? "active" : ""}
                  href={href}
                  key={href}
                  onClick={closeMenu}
                  ref={index === 0 ? firstMenuLink : undefined}
                  tabIndex={open ? 0 : -1}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{label}</b>
                  <i>↗</i>
                </Link>
              ))}
            </div>
            <div className="menu-footer">
              <span>{english ? "Kyiv · Ukraine" : "Київ · Україна"}</span>
              <Link href={english ? "/en/admissions" : "/admissions"} onClick={closeMenu} tabIndex={open ? 0 : -1}>
                {english ? "Admissions 2026" : "Вступнику 2026"} <b>→</b>
              </Link>
            </div>
          </div>
        </nav>

        <div className="hdr-right">
          <button className="header-search-button" type="button" onClick={() => { setOpen(false); setSearchOpen(true); }} aria-label={english ? "Search the site" : "Пошук по сайту"} aria-haspopup="dialog">
            <span aria-hidden="true">⌕</span><b>{english ? "Search" : "Пошук"}</b>
          </button>
          <Link className="lang-toggle" href={english ? ukPath : enPath} aria-label={english ? "Українська версія" : "English version"} onClick={closeMenu}>
            {english ? "UA" : "EN"}
          </Link>
          <Link className="cta hdr-cta" href={english ? "/en/admissions" : "/admissions"} onClick={closeMenu}>
            <span>{english ? "Admissions 2026" : "Вступнику 2026"}</span>
          </Link>
          <button
            ref={menuButton}
            className={`burger ${open ? "active" : ""}`}
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? (english ? "Close menu" : "Закрити меню") : (english ? "Open menu" : "Відкрити меню")}
            aria-controls="site-navigation"
            aria-haspopup="true"
            aria-expanded={open}
          >
            <span className="menu-button-label" aria-hidden="true">{english ? "Menu" : "Меню"}</span>
            <span className="burger-lines" aria-hidden="true"><i /><i /><i /></span>
          </button>
        </div>
      </div>
      <SiteSearch open={searchOpen} onClose={() => setSearchOpen(false)} english={english} />
    </header>
  );
}
