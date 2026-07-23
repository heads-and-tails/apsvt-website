import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPublisher } from "@/lib/auth";
import { getSchedulerItems } from "@/lib/scheduler";
import { telegramConfigured } from "@/lib/telegram";
import { SchedulerDashboard } from "./SchedulerDashboard";
import "./scheduler.css";

export const metadata: Metadata = { title: "Розумний планувальник · АПСВТ" };
export const dynamic = "force-dynamic";

export default async function SchedulerPage() {
  const publisher = await getPublisher();
  if (!publisher) redirect("/panel/login?next=/panel/scheduler");
  return <SchedulerDashboard initialItems={await getSchedulerItems()} publisher={publisher} telegramConfigured={telegramConfigured()} />;
}
