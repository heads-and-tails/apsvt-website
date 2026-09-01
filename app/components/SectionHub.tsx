"use client";

import { Children, type ReactNode, useEffect, useId, useRef, useState } from "react";

export type SectionHubItem = {
  id: string;
  index: string;
  title: string;
  description: string;
  icon: string;
  aliases?: readonly string[];
};

type SectionHubProps = {
  sections: readonly SectionHubItem[];
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
  promptTitle?: string;
  promptDescription?: string;
  backLabel?: string;
};

function readHash() {
  return decodeURIComponent(window.location.hash.replace(/^#/, ""));
}

export function SectionHub({
  sections,
  children,
  eyebrow = "Навігатор сторінки",
  title = "Оберіть потрібний розділ",
  description = "Уся інформація впорядкована за темами. Натисніть на іконку — відкриється лише обраний розділ.",
  promptTitle = "Оберіть одну іконку",
  promptDescription = "Матеріали з’являться тут після натискання.",
  backLabel = "До всіх розділів",
}: SectionHubProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const reactId = useId().replace(/:/g, "");
  const directoryTitleId = `section-directory-${reactId}`;
  const activePanelId = `section-panel-${reactId}`;
  const sectionContent = Children.toArray(children);
  const activeIndex = sections.findIndex((section) => section.id === activeId);
  const activeSection = activeIndex >= 0 ? sections[activeIndex] : null;

  useEffect(() => {
    const syncFromLocation = () => {
      const hash = readHash();
      if (!hash) {
        setActiveId(null);
        return;
      }

      const matchingSection = sections.find((section) =>
        section.id === hash || section.aliases?.includes(hash),
      );
      if (matchingSection) setActiveId(matchingSection.id);
    };

    syncFromLocation();
    window.addEventListener("hashchange", syncFromLocation);
    window.addEventListener("popstate", syncFromLocation);
    return () => {
      window.removeEventListener("hashchange", syncFromLocation);
      window.removeEventListener("popstate", syncFromLocation);
    };
  }, [sections]);

  useEffect(() => {
    if (!activeId) return;
    const frame = window.requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      panelRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeId]);

  const openSection = (id: string) => {
    window.history.pushState(null, "", `${window.location.pathname}${window.location.search}#${id}`);
    setActiveId(id);
    if (id === activeId) {
      window.requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  const closeSection = () => {
    window.history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
    setActiveId(null);
    window.requestAnimationFrame(() => {
      catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      catalogRef.current?.focus({ preventScroll: true });
    });
  };

  return <section className="admissions-section-hub" aria-labelledby={directoryTitleId}>
    <div className="wrap admissions-hub-catalog" ref={catalogRef} tabIndex={-1}>
      <div className="admissions-hub-intro">
        <div>
          <div className="idx">{eyebrow}</div>
          <h2 id={directoryTitleId}>{title}</h2>
        </div>
        <p>{description}</p>
      </div>

      <div className="admissions-icon-grid">
        {sections.map((section) => {
          const isActive = section.id === activeId;
          const panelId = `${activePanelId}-${section.id}`;
          return <button
            className={`admissions-icon-card${isActive ? " active" : ""}`}
            type="button"
            key={section.id}
            onClick={() => openSection(section.id)}
            aria-expanded={isActive}
            aria-controls={panelId}
          >
            <span className="admissions-card-icon" aria-hidden="true">{section.icon}</span>
            <span className="admissions-card-copy">
              <small>{section.index}</small>
              <b>{section.title}</b>
              <span>{section.description}</span>
            </span>
            <i aria-hidden="true">&#8594;</i>
          </button>;
        })}
      </div>

      {!activeSection ? <div className="admissions-hub-prompt" aria-live="polite">
        <span aria-hidden="true">&#8593;</span>
        <p><b>{promptTitle}</b>{promptDescription}</p>
      </div> : null}
    </div>

    {sections.map((section, index) => {
      const isActive = section.id === activeId;
      const panelId = `${activePanelId}-${section.id}`;
      const titleId = `section-title-${reactId}-${section.id}`;
      return <section
        className="admissions-active-panel"
        id={panelId}
        ref={isActive ? panelRef : undefined}
        tabIndex={-1}
        aria-labelledby={titleId}
        hidden={!isActive}
        key={section.id}
      >
        <div className="admissions-active-toolbar">
          <div className="wrap">
            <span className="admissions-card-icon" aria-hidden="true">{section.icon}</span>
            <div>
              <small>Відкритий розділ · {section.index}</small>
              <h2 id={titleId}>{section.title}</h2>
            </div>
            <button type="button" onClick={closeSection}>
              <span aria-hidden="true">&#8592;</span> {backLabel}
            </button>
          </div>
        </div>
        <div className="admissions-active-content">{sectionContent[index]}</div>
      </section>;
    })}
  </section>;
}
