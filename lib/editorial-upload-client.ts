"use client";

import { ClientRequestError, requestJson } from "@/lib/client-request";
import { createClient } from "@/lib/supabase/client";

export type EditorialUploadResult = {
  url: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
};

type UploadTicket = EditorialUploadResult & {
  bucket: string;
  path: string;
  token: string;
};

export async function uploadEditorialFile(
  file: File,
  purpose: "image" | "document",
  pagePath?: string,
): Promise<EditorialUploadResult> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    // Send the original bytes. vinext treats multipart POSTs as progressive
    // server actions and applies their 1 MB limit before reaching this route.
    const params = new URLSearchParams({ fileName: file.name, purpose });
    if (pagePath) params.set("pagePath", pagePath);
    return requestJson<EditorialUploadResult>(`/api/uploads?${params}`, {
      method: "POST", headers: { "content-type": file.type }, body: file,
    });
  }

  const ticket = await requestJson<UploadTicket>("/api/uploads/sign", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
      purpose,
      pagePath,
    }),
  });

  try {
    const supabase = createClient();
    const { error } = await supabase.storage.from(ticket.bucket).uploadToSignedUrl(
      ticket.path,
      ticket.token,
      file,
      { contentType: file.type, cacheControl: "31536000" },
    );
    if (error) throw error;
  } catch (error) {
    console.error("[editorial-upload] direct upload failed", error);
    throw new ClientRequestError(
      "Не вдалося передати файл у сховище. Перевірте інтернет і повторіть завантаження.",
    );
  }

  return {
    url: ticket.url,
    fileName: ticket.fileName,
    mimeType: ticket.mimeType,
    fileSize: ticket.fileSize,
  };
}
