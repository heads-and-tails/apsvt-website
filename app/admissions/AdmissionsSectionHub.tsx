"use client";

import { Children, type ReactNode, useEffect, useRef, useState } from "react";

export type AdmissionsSectionMeta = {
  id: string;
  index: string;
  title: string;
  description: string;
  icon: string;
  aliases?: readonly string[];
};

function readHash() {
  return decodeURIComponent(window.location.hash.replace(/^#/, ""));
}

export function AdmissionsSectionHub({
  sections,
  children,
}: {
  sections: readonly AdmissionsSectionMeta[];
  children: ReactNode;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
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
  };

  const closeSection = () => {
    window.history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
    setActiveId(null);
    window.requestAnimationFrame(() => {
      catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      catalogRef.current?.focus({ preventScroll: true });
    });
  };

  return <section className="admissions-section-hub" aria-labelledby="admissions-directory-title">
    <div className="wrap admissions-hub-catalog" ref={catalogRef} tabIndex={-1}>
      <div className="admissions-hub-intro">
        <div>
          <div className="idx">Навігатор вступника</div>
          <h2 id="admissions-directory-title">Оберіть потрібний розділ</h2>
        </div>
        <p>Уся інформація впорядкована за темами. Натисніть на іконку — відкриється лише обраний розділ.</p>
      </div>

      <div className="admissions-icon-grid">
        {sections.map((section) => {
          const isActive = section.id === activeId;
          return <button
            className={`admissions-icon-card${isActive ? " active" : ""}`}
            type="button"
            key={section.id}
            onClick={() => openSection(section.id)}
            aria-expanded={isActive}
            aria-controls="admissions-active-panel"
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
        <p><b>Оберіть одну іконку</b>Матеріали з’являться тут після натискання.</p>
      </div> : null}
    </div>

    {activeSection ? <section
      className="admissions-active-panel"
      id="admissions-active-panel"
      ref={panelRef}
      tabIndex={-1}
      aria-labelledby="admissions-active-title"
    >
      <div className="admissions-active-toolbar">
        <div className="wrap">
          <span className="admissions-card-icon" aria-hidden="true">{activeSection.icon}</span>
          <div>
            <small>Відкритий розділ · {activeSection.index}</small>
            <h2 id="admissions-active-title">{activeSection.title}</h2>
          </div>
          <button type="button" onClick={closeSection}>
            <span aria-hidden="true">&#8592;</span> До всіх розділів
          </button>
        </div>
      </div>
      <div className="admissions-active-content">{sectionContent[activeIndex]}</div>
    </section> : null}
  </section>;
}
