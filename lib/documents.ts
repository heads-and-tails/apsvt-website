import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type DocumentStatus = "draft" | "published";

export type PageDocument = {
  id: string;
  title: string;
  description: string;
  category: string;
  pagePath: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  status: DocumentStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  authorEmail: string;
};

export type PageDocumentInput = Omit<PageDocument, "id" | "createdAt" | "updatedAt" | "authorEmail">;

type DocumentRow = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  page_path: string;
  file_url: string;
  file_name: string;
  mime_type: string;
  file_size: number | string;
  status: DocumentStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
  author_email: string;
};

function fromRow(row: DocumentRow): PageDocument {
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    category: row.category,
    pagePath: row.page_path,
    fileUrl: row.file_url,
    fileName: row.file_name,
    mimeType: row.mime_type,
    fileSize: Number(row.file_size) || 0,
    status: row.status,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorEmail: row.author_email,
  };
}

function toRow(input: PageDocumentInput, authorEmail: string) {
  return {
    title: input.title,
    description: input.description,
    category: input.category,
    page_path: input.pagePath,
    file_url: input.fileUrl,
    file_name: input.fileName,
    mime_type: input.mimeType,
    file_size: input.fileSize,
    status: input.status,
    sort_order: input.sortOrder,
    updated_at: new Date().toISOString(),
    author_email: authorEmail,
  };
}

export async function getAllDocuments(): Promise<PageDocument[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await createSupabaseAdmin()
    .from("editorial_documents")
    .select("*")
    .order("page_path")
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as DocumentRow[]).map(fromRow);
}

export async function getPublicDocuments(pagePath: string): Promise<PageDocument[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await createSupabasePublicClient()
    .from("editorial_documents")
    .select("*")
    .eq("status", "published")
    .in("page_path", [pagePath, "*"])
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data as DocumentRow[]).map(fromRow);
}

export async function createDocument(input: PageDocumentInput, authorEmail: string): Promise<PageDocument> {
  const { data, error } = await createSupabaseAdmin()
    .from("editorial_documents")
    .insert(toRow(input, authorEmail))
    .select("*")
    .single<DocumentRow>();
  if (error) throw error;
  return fromRow(data);
}

export async function updateDocument(id: string, input: PageDocumentInput, authorEmail: string): Promise<PageDocument | null> {
  const { data, error } = await createSupabaseAdmin()
    .from("editorial_documents")
    .update(toRow(input, authorEmail))
    .eq("id", id)
    .select("*")
    .maybeSingle<DocumentRow>();
  if (error) throw error;
  return data ? fromRow(data) : null;
}

export async function deleteDocument(id: string): Promise<void> {
  const { error } = await createSupabaseAdmin().from("editorial_documents").delete().eq("id", id);
  if (error) throw error;
}
