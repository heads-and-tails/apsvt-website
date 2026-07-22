import type { Metadata } from "next";
import { getPublisher } from "@/lib/auth";
import { getWorkspaceItems } from "@/lib/workspace";
import { WorkspaceDashboard } from "./WorkspaceDashboard";
import "./workspace.css";

export const metadata: Metadata = { title: "BytesLab × Академія" };
export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const publisher = await getPublisher();
  return <WorkspaceDashboard initialItems={await getWorkspaceItems()} publisher={publisher} />;
}
