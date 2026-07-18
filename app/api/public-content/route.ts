import { NextResponse } from "next/server";
import { getContentItems, isContentKind } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const kind = new URL(request.url).searchParams.get("kind");
  if (!isContentKind(kind)) return NextResponse.json({ error: "Невідомий тип контенту" }, { status: 400 });
  const items = await getContentItems(kind);
  return NextResponse.json(items.map(({ id, kind: itemKind, payload, sortOrder }) => ({ id, kind: itemKind, payload, sortOrder })));
}
