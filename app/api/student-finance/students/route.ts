import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { upsertStudentProfile, type StudentProfile } from "@/lib/student-finance";

const levels = new Set<StudentProfile["degreeLevel"]>(["bachelor", "master", "phd"]);
const forms = new Set<StudentProfile["studyForm"]>(["full_time", "part_time"]);

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json() as Record<string, unknown>;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const studentNumber = typeof body.studentNumber === "string" ? body.studentNumber.trim() : "";
    const programme = typeof body.programme === "string" ? body.programme.trim() : "";
    const course = Number(body.course);
    if (!/^\S+@\S+\.\S+$/.test(email) || !fullName || !studentNumber || !programme || !levels.has(body.degreeLevel as StudentProfile["degreeLevel"]) || !forms.has(body.studyForm as StudentProfile["studyForm"]) || !Number.isInteger(course) || course < 1 || course > 6) {
      return NextResponse.json({ error: "Заповніть ПІБ, пошту, номер, програму, рівень, форму та курс" }, { status: 400 });
    }
    const callback = new URL("/auth/callback", request.url);
    callback.searchParams.set("next", "/student");
    const profile = await upsertStudentProfile({
      email,
      fullName,
      studentNumber,
      programme,
      degreeLevel: body.degreeLevel as StudentProfile["degreeLevel"],
      studyForm: body.studyForm as StudentProfile["studyForm"],
      course,
      groupName: typeof body.groupName === "string" ? body.groupName.trim() : "",
    }, callback.toString());
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    return NextResponse.json({
      error: message.includes("rate") ? "Профіль не створено: поштовий сервіс тимчасово обмежив запрошення" : "Не вдалося додати студента",
    }, { status: message.includes("rate") ? 429 : 403 });
  }
}
