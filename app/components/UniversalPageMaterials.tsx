"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import type { DepartmentEntry } from "@/lib/department-content";
import { DepartmentEditorialContent } from "./DepartmentEditorialContent";

const ignoredPrefixes = ["/panel", "/student", "/api", "/auth", "/en"];

function isIgnoredPath(pathname: string) {
  return ignoredPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function restoreAttribute(element: Element, name: string, value: string | null) {
  if (value === null) element.removeAttribute(name);
  else element.setAttribute(name, value);
}

export function UniversalPageMaterials() {
  const pathname = usePathname();
  const [result, setResult] = useState<{ path: string; entries: DepartmentEntry[] }>({ path: "", entries: [] });
  const [portal, setPortal] = useState<{ path: string; target: HTMLElement } | null>(null);
  const entries = useMemo(
    () => result.path === pathname ? result.entries : [],
    [pathname, result],
  );

  useEffect(() => {
    if (isIgnoredPath(pathname)) return;
    const controller = new AbortController();
    fetch(`/api/page-materials?path=${encodeURIComponent(pathname)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : [])
      .then((payload: unknown) => setResult({
        path: pathname,
        entries: Array.isArray(payload) ? payload as DepartmentEntry[] : [],
      }))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setResult({ path: pathname, entries: [] });
        }
      });
    return () => controller.abort();
  }, [pathname]);

  useEffect(() => {
    if (isIgnoredPath(pathname)) return;
    const hero = entries.find((entry) => entry.entryType === "hero");
    if (!hero) return;
    const heading = document.querySelector<HTMLElement>("main h1");
    const summary = document.querySelector<HTMLElement>(
      ".program-hero-in > p, .phero .hero-copy > p, .phero .wrap > p, .detail-deck, main h1 + p",
    );
    const image = document.querySelector<HTMLImageElement>(
      ".program-hero-bg img, .phero.img img, .phero .hero-bg img, .home-hero img, main section:first-of-type img",
    );
    const originalHeading = heading?.textContent ?? null;
    const originalSummary = summary?.textContent ?? null;
    const originalSrc = image?.getAttribute("src") ?? null;
    const originalSrcset = image?.getAttribute("srcset") ?? null;
    const originalAlt = image?.getAttribute("alt") ?? null;

    if (heading && hero.title) heading.textContent = hero.title;
    if (summary && hero.summary) summary.textContent = hero.summary;
    if (image && hero.imageUrl) {
      image.src = hero.imageUrl;
      image.removeAttribute("srcset");
      image.alt = hero.imageAlt || hero.title;
    }

    return () => {
      if (heading && originalHeading !== null) heading.textContent = originalHeading;
      if (summary && originalSummary !== null) summary.textContent = originalSummary;
      if (image) {
        restoreAttribute(image, "src", originalSrc);
        restoreAttribute(image, "srcset", originalSrcset);
        restoreAttribute(image, "alt", originalAlt);
      }
    };
  }, [entries, pathname]);

  useEffect(() => {
    if (!entries.some((entry) => entry.entryType !== "hero") || document.querySelector("[data-editorial-rendered='true'], [data-page-materials-server='true']")) {
      return;
    }
    const target = document.createElement("div");
    target.dataset.universalPageMaterials = pathname;
    const footer = document.querySelector("footer");
    const host = footer?.parentElement || document.querySelector("main") || document.body;
    if (footer?.parentElement) footer.parentElement.insertBefore(target, footer);
    else host.appendChild(target);
    const frame = requestAnimationFrame(() => setPortal({ path: pathname, target }));
    return () => {
      cancelAnimationFrame(frame);
      target.remove();
    };
  }, [entries, pathname]);

  const visibleEntries = entries.filter((entry) => entry.entryType !== "hero");
  if (
    isIgnoredPath(pathname)
    || portal?.path !== pathname
    || !portal.target.isConnected
    || !visibleEntries.length
  ) return null;
  return createPortal(<DepartmentEditorialContent entries={visibleEntries} />, portal.target);
}
