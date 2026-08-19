"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SiteSearch } from "./SiteSearch";

type NavItem = {
  href: string;
  label: string;
  children: readonly { href: string; label: string }[];
};

const ukLinks: readonly NavItem[] = [
  { href: "/about", label: "Академія", children: [
    { href: "/about", label: "Про Академію" }, { href: "/about#structure", label: "Структура" },
    { href: "/departments", label: "Факультети й кафедри" }, { href: "/about/licenses", label: "Ліцензії та акредитація" },
    { href: "/vacancies", label: "Вакансії" }, { href: "/news", label: "Новини" }, { href: "/contacts", label: "Контакти" },
  ] },
  { href: "/programs", label: "Освіта", children: [
    { href: "/programs", label: "Усі програми" }, { href: "/programs/law", label: "Право" },
    { href: "/programs/public-administration", label: "Публічне управління" }, { href: "/programs/psychology", label: "Психологія" },
    { href: "/programs/finance", label: "Фінанси" }, { href: "/programs/marketing", label: "Маркетинг" },
    { href: "/programs/management", label: "Менеджмент" }, { href: "/programs/social-work", label: "Соціальна робота" },
  ] },
  { href: "/admissions", label: "Вступнику", children: [
    { href: "/admissions#route", label: "Як вступити" }, { href: "/admissions#dates", label: "Ключові дати" },
    { href: "/tuition", label: "Вартість і оплата" }, { href: "/admissions#entrance-exams", label: "Розклад випробувань" },
    { href: "/admissions#entrance-programs", label: "Програми випробувань" }, { href: "/admissions#entrance-results", label: "Результати" },
    { href: "/admissions#applicant-rankings", label: "Рейтингові списки" }, { href: "/admissions#consultation", label: "Консультація" },
  ] },
  { href: "/research/postgraduate-doctoral", label: "Аспірантура", children: [
    { href: "/research/postgraduate-doctoral", label: "Огляд і вибір рівня" },
    { href: "/research/postgraduate-doctoral#phd", label: "Аспірантура · PhD" },
    { href: "/research/postgraduate-doctoral#doctoral", label: "Докторантура · доктор наук" },
    { href: "/research/postgraduate-doctoral#programmes", label: "Програми й спеціальності" },
    { href: "/research/postgraduate-doctoral#admission", label: "Вступ 2026" },
    { href: "/research/postgraduate-doctoral#cost", label: "Вартість навчання" },
    { href: "/research/postgraduate-doctoral#documents", label: "Офіційні документи" },
  ] },
  { href: "/people", label: "Люди", children: [
    { href: "/people", label: "Команда Академії" }, { href: "/departments", label: "Кафедри" },
    { href: "/departments/law-faculty", label: "Юридичний факультет" }, { href: "/departments/economics-social-tourism-faculty", label: "Факультет економіки й туризму" },
    { href: "/students/council", label: "Студентська рада" },
  ] },
  { href: "/international", label: "Міжнародне", children: [
    { href: "/international#partners", label: "Партнери" }, { href: "/international#international-opportunities", label: "Міжнародні можливості" },
    { href: "/international#ukrainians-abroad", label: "Українцям за кордоном" }, { href: "/international#foreign-applicants", label: "Іноземним вступникам" },
    { href: "/international#international-contact", label: "Контакти відділу" },
  ] },
  { href: "/research", label: "Наука", children: [
    { href: "/research", label: "Дослідження" },
    { href: "/research/conferences", label: "Конференції" }, { href: "/research/journals", label: "Наукові видання" },
    { href: "/research/journals/visnyk", label: "Вісник АПСВТ" }, { href: "/research/theses", label: "Кваліфікаційні роботи" },
  ] },
  { href: "/facilities", label: "Кампус", children: [
    { href: "/facilities", label: "Кампус і сервіси" }, { href: "/facilities/campus", label: "Навчальний простір" },
    { href: "/facilities/library", label: "Бібліотека" }, { href: "/facilities/dormitory", label: "Гуртожиток" },
    { href: "/events", label: "Події" },
  ] },
  { href: "/students", label: "Студенту", children: [
    { href: "/students", label: "Ресурси студенту" }, { href: "/students/guide", label: "Путівник студента" },
    { href: "/schedule", label: "Розклад занять" }, { href: "/academic-calendar", label: "Академічний календар" },
    { href: "/materials", label: "Навчальні матеріали" }, { href: "/student-app", label: "Студентська платформа" },
  ] },
] as const;

const enLinks: readonly NavItem[] = [
  { href: "/en/about", label: "Academy", children: [
    { href: "/en/about", label: "About" }, { href: "/en/departments", label: "Faculties & departments" },
    { href: "/en/news", label: "News" }, { href: "/en/contacts", label: "Contacts" },
  ] },
  { href: "/en/programs", label: "Study", children: [
    { href: "/en/programs", label: "All programmes" }, { href: "/en/programs/law", label: "Law" },
    { href: "/en/programs/public-administration", label: "Public administration" }, { href: "/en/programs/psychology", label: "Psychology" },
  ] },
  { href: "/en/admissions", label: "Admissions", children: [
    { href: "/en/admissions", label: "How to apply" }, { href: "/en/tuition", label: "Tuition & payment" },
    { href: "/en/admissions#consultation", label: "Consultation" },
  ] },
  { href: "/en/people", label: "People", children: [
    { href: "/en/people", label: "Academic team" }, { href: "/en/departments", label: "Departments" },
  ] },
  { href: "/en/international", label: "International", children: [
    { href: "/en/international", label: "Cooperation" }, { href: "/en/international#foreign-applicants", label: "International applicants" },
  ] },
  { href: "/en/research", label: "Research", children: [
    { href: "/en/research", label: "Research" }, { href: "/en/research/conferences", label: "Conferences" },
    { href: "/en/research/journals", label: "Journals" }, { href: "/en/research/theses", label: "Student theses" },
  ] },
  { href: "/en/facilities", label: "Campus", children: [
    { href: "/en/facilities", label: "Campus services" }, { href: "/en/facilities/library", label: "Library" },
    { href: "/en/events", label: "Events" },
  ] },
  { href: "/en/students", label: "Students", children: [
    { href: "/en/students", label: "Student resources" }, { href: "/en/schedule", label: "Class schedule" },
  ] },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstMenuControl = useRef<HTMLElement>(null);
  const english = pathname === "/en" || pathname.startsWith("/en/");
  const links = english ? enLinks : ukLinks;
  const activeTopLevelHref = [...links]
    .sort((left, right) => right.href.length - left.href.length)
    .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.href;
  const ukPath = english ? pathname.replace(/^\/en/, "") || "/" : pathname;
  const enPath = english ? pathname : `/en${pathname === "/" ? "" : pathname}`;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstMenuControl.current?.focus();

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
          {links.map((item) => {
            const active = activeTopLevelHref === item.href;
            return <div className={`desktop-nav-item ${active ? "active" : ""}`} key={item.href}>
              <Link className="desktop-nav-link" href={item.href} aria-haspopup="menu">{item.label}<span aria-hidden="true">⌄</span></Link>
              <div className="desktop-dropdown" aria-label={`${item.label}: підрозділи`}>
                <div className="desktop-dropdown-heading"><small>{english ? "Explore section" : "Підрозділи"}</small><b>{item.label}</b></div>
                {item.children.map((child, childIndex) => <Link href={child.href} key={child.href}><i>{String(childIndex + 1).padStart(2, "0")}</i><b>{child.label}</b><span aria-hidden="true">↗</span></Link>)}
              </div>
            </div>;
          })}
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
              {links.map((item, index) => (
                <details
                  className={`menu-group ${activeTopLevelHref === item.href ? "active" : ""}`}
                  key={item.href}
                  onPointerEnter={(event) => {
                    if (window.innerWidth > 700 && window.matchMedia("(hover: hover) and (pointer: fine)").matches) event.currentTarget.open = true;
                  }}
                  onPointerLeave={(event) => {
                    if (window.innerWidth > 700 && window.matchMedia("(hover: hover) and (pointer: fine)").matches) event.currentTarget.open = false;
                  }}
                >
                  <summary ref={(node) => { if (index === 0) firstMenuControl.current = node; }} tabIndex={open ? 0 : -1}>
                    <span>{String(index + 1).padStart(2, "0")}</span><b>{item.label}</b><i aria-hidden="true">+</i>
                  </summary>
                  <div className="menu-subitems">
                    {item.children.map((child, childIndex) => <Link href={child.href} key={child.href} onClick={closeMenu} tabIndex={open ? 0 : -1}><small>{String(childIndex + 1).padStart(2, "0")}</small><b>{child.label}</b><span aria-hidden="true">→</span></Link>)}
                  </div>
                </details>
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
            onPointerEnter={() => {
              if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && window.innerWidth > 700 && window.innerWidth <= 1100) setOpen(true);
            }}
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
