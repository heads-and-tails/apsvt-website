import type { ReactNode } from "react";
import { SectionHub, type SectionHubItem } from "../components/SectionHub";

export type AdmissionsSectionMeta = SectionHubItem;

export function AdmissionsSectionHub({
  sections,
  children,
}: {
  sections: readonly AdmissionsSectionMeta[];
  children: ReactNode;
}) {
  return <SectionHub
    sections={sections}
    eyebrow="Навігатор вступника"
  >{children}</SectionHub>;
}
