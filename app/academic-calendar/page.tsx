import type { Metadata } from "next";
import { AcademicCalendarPage } from "./AcademicCalendarPage";

export const metadata: Metadata = { title: "Графік навчального процесу", description: "Офіційні графіки навчального процесу АПСВТ 2026/27 за формою навчання та семестром." };
export const dynamic = "force-dynamic";

export default function Page() { return <AcademicCalendarPage />; }
