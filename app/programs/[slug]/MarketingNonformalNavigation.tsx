"use client";

import { useEffect } from "react";

export function MarketingNonformalNavigation() {
  useEffect(() => {
    let frame = 0;
    const openLinkedRubric = () => {
      const root = document.getElementById("marketing-nonformal");
      const target = document.getElementById(window.location.hash.slice(1));
      if (!root || !target || !root.contains(target)) return;
      for (let element: HTMLElement | null = target; element && root.contains(element); element = element.parentElement) {
        if (element instanceof HTMLDetailsElement) element.open = true;
      }
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    };
    openLinkedRubric();
    window.addEventListener("hashchange", openLinkedRubric);
    window.addEventListener("popstate", openLinkedRubric);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", openLinkedRubric);
      window.removeEventListener("popstate", openLinkedRubric);
    };
  }, []);
  return null;
}
