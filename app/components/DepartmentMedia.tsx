import type { CSSProperties } from "react";
import { departmentAttachments, departmentImages, type DepartmentAttachment, type DepartmentImage } from "@/lib/department-media";

export function departmentImageStyle(image: DepartmentImage): CSSProperties {
  return { objectFit: image.fit || "contain", objectPosition: `${image.positionX ?? 50}% ${image.positionY ?? 50}%` };
}

export function DepartmentImages({ entry, skipFirst = false }: { entry: { images?: DepartmentImage[]; imageUrl?: string; imageAlt?: string; title?: string }; skipFirst?: boolean }) {
  const images = departmentImages(entry).slice(skipFirst ? 1 : 0);
  if (!images.length) return null;
  return <div className={`department-authored-images${images.length > 1 ? " department-authored-images--gallery" : ""}`}>
    {images.map((image, index) => <figure key={`${image.url}-${index}`} className={image.fit === "cover" ? "department-authored-image--crop" : ""}><img src={image.url} alt={image.alt} style={departmentImageStyle(image)} loading="lazy" /></figure>)}
  </div>;
}

export function DepartmentAttachments({ entry }: { entry: { attachments?: DepartmentAttachment[]; fileUrl?: string; fileName?: string } }) {
  const files = departmentAttachments(entry);
  if (!files.length) return null;
  return <nav className="department-authored-files" aria-label="Документи матеріалу">{files.map((file) => <a href={file.url} target="_blank" rel="noopener noreferrer" key={file.url}>{file.label} ↗</a>)}</nav>;
}
