import { NextResponse } from "next/server";
import { answerDocumentsQuestion } from "@/lib/documents-rag";
import { getPublishedDocuments } from "@/lib/documents";
import { getPublishedDepartmentEntries } from "@/lib/department-content";
import { buildManagedDocumentCatalogue } from "@/lib/managed-document-catalogue";

export async function POST(request: Request) {
  let body: { question?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Невірний формат запиту." }, { status: 400 });
  }

  if (typeof body.question !== "string" || body.question.trim().length < 3) {
    return NextResponse.json({ error: "Напишіть запитання щонайменше з трьох символів." }, { status: 400 });
  }

  const [pageDocuments, departmentEntries] = await Promise.all([
    getPublishedDocuments(),
    getPublishedDepartmentEntries(),
  ]);
  const managedDocuments = buildManagedDocumentCatalogue(pageDocuments, departmentEntries);
  const additionalSources = managedDocuments.map((document) => ({
    id: document.id,
    title: document.title,
    href: document.href,
    text: document.description,
  }));

  return NextResponse.json(answerDocumentsQuestion(body.question, additionalSources), {
    headers: { "Cache-Control": "no-store" },
  });
}
