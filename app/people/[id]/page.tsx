import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AcademicProfilePage } from "@/app/components/AcademicProfilePage";
import { getPublishedDepartmentEntryById } from "@/lib/department-content";
import { isPublicTeacher } from "@/lib/academic-profile";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const entry = await getPublishedDepartmentEntryById(id);
  return isPublicTeacher(entry) ? { title: entry.title, description: entry.summary } : { title: "Профіль не знайдено" };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const entry = await getPublishedDepartmentEntryById(id);
  if (!isPublicTeacher(entry)) notFound();
  return <AcademicProfilePage entry={entry} />;
}
