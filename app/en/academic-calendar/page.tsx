import type { Metadata } from "next";
import { AcademicCalendarPage } from "../../academic-calendar/AcademicCalendarPage";

export const metadata: Metadata = { title: "Academic calendar", description: "Official APSVT academic calendars for 2026/27 by study form and semester." };
export const dynamic = "force-dynamic";

export default function Page() { return <AcademicCalendarPage english />; }
