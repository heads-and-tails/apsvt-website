import { NextResponse } from "next/server";
import { answerDocumentsQuestion } from "@/lib/documents-rag";

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

  return NextResponse.json(answerDocumentsQuestion(body.question), {
    headers: { "Cache-Control": "no-store" },
  });
}
