import { NextResponse } from "next/server";
import { requirePagePublisher } from "@/lib/auth";
import { isEditorialPagePath } from "@/lib/editorial-access";

export const dynamic = "force-dynamic";

function publicOrigin(request: Request): string {
  const incoming = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (!forwardedHost) return incoming.origin;
  return `${forwardedProto || incoming.protocol.replace(":", "")}://${forwardedHost}`;
}

export async function GET(request: Request) {
  const pagePath = new URL(request.url).searchParams.get("path");
  if (!isEditorialPagePath(pagePath)) {
    return NextResponse.json({ error: "Сторінку не знайдено" }, { status: 400 });
  }

  try {
    await requirePagePublisher(pagePath);
    const target = new URL(pagePath, publicOrigin(request));
    target.searchParams.set("editorial_inventory", "1");
    const response = await fetch(target, {
      cache: "no-store",
      headers: { accept: "text/html", "x-editorial-inventory": "1" },
    });
    if (!response.ok) {
      return NextResponse.json({ error: "Не вдалося відкрити сторінку" }, { status: 502 });
    }
    const html = await response.text();
    if (html.length > 3_000_000) {
      return NextResponse.json({ error: "Сторінка завелика для автоматичного огляду" }, { status: 413 });
    }
    return NextResponse.json(
      { pagePath, pageUrl: target.origin + pagePath, html },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    const denied = error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_SCOPE");
    return NextResponse.json(
      { error: denied ? "Доступ заборонено" : "Не вдалося зчитати сторінку" },
      { status: denied ? 403 : 500 },
    );
  }
}
