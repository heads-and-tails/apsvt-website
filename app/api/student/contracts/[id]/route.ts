import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { getStudentContractDownload } from "@/lib/student-finance";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.redirect(new URL("/student/login", request.url));
  const { id } = await context.params;
  const contract = await getStudentContractDownload(id, user.id);
  if (!contract?.filePath) return NextResponse.json({ error: "Документ не знайдено" }, { status: 404 });
  const { data, error } = await createSupabaseAdmin().storage.from("student-contracts").createSignedUrl(contract.filePath, 60, {
    download: contract.fileName || true,
  });
  if (error || !data.signedUrl) return NextResponse.json({ error: "Не вдалося відкрити документ" }, { status: 503 });
  return NextResponse.redirect(data.signedUrl);
}
