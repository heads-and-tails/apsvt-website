import { NextResponse } from "next/server";

const mediaKey = "admissions/results/2026-08-06/english-interview.mp4";

async function mediaBucket() {
  const moduleName = "cloudflare:workers";
  const { env } = await import(/* webpackIgnore: true */ moduleName);
  return env.MEDIA;
}

function authorized(request: Request) {
  const token = process.env.MEDIA_UPLOAD_TOKEN;
  return Boolean(token) && request.headers.get("authorization") === `Bearer ${token}`;
}

export async function POST(request: Request) {
  if (!authorized(request)) return new NextResponse("Not found", { status: 404 });
  const bucket = await mediaBucket();
  if (!bucket) return NextResponse.json({ error: "Media storage unavailable" }, { status: 503 });
  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  if (action === "start") {
    const upload = await bucket.createMultipartUpload(mediaKey, {
      httpMetadata: { contentType: "video/mp4", cacheControl: "public, max-age=31536000, immutable" },
    });
    return NextResponse.json({ uploadId: upload.uploadId, key: mediaKey });
  }

  const uploadId = url.searchParams.get("uploadId");
  if (!uploadId) return NextResponse.json({ error: "uploadId is required" }, { status: 400 });
  const upload = bucket.resumeMultipartUpload(mediaKey, uploadId);

  if (action === "part") {
    const partNumber = Number(url.searchParams.get("partNumber"));
    if (!Number.isInteger(partNumber) || partNumber < 1 || !request.body) return NextResponse.json({ error: "Invalid part" }, { status: 400 });
    const part = await upload.uploadPart(partNumber, request.body);
    return NextResponse.json({ partNumber: part.partNumber, etag: part.etag });
  }

  if (action === "complete") {
    const body = await request.json() as { parts?: Array<{ partNumber: number; etag: string }> };
    if (!body.parts?.length) return NextResponse.json({ error: "Parts are required" }, { status: 400 });
    const object = await upload.complete(body.parts);
    return NextResponse.json({ key: object.key, size: object.size });
  }

  if (action === "abort") {
    await upload.abort();
    return NextResponse.json({ aborted: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
