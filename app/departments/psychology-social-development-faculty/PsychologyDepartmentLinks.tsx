"use client";

import { useEffect } from "react";

export function PsychologyDepartmentLinks({ facultyPath, destinations }: {
  facultyPath: string;
  destinations: Readonly<Record<string, string>>;
}) {
  useEffect(() => {
    const followFacultyLink = () => {
      const hash = window.location.hash.slice(1);
      if (Object.hasOwn(destinations, hash)) {
        window.location.replace(`${facultyPath}${window.location.search}#${destinations[hash]}`);
      }
    };
    followFacultyLink();
    window.addEventListener("hashchange", followFacultyLink);
    return () => window.removeEventListener("hashchange", followFacultyLink);
  }, [facultyPath, destinations]);

  return null;
}
