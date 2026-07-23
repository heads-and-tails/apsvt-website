import { NextResponse } from "next/server";
import { requirePublisher } from "@/lib/auth";
import {
  createSchedulerItem,
  decideScheduleRun,
  deleteSchedulerItem,
  generateSchedule,
  getSchedulerItems,
  isAvailabilityPayload,
  isRequirementPayload,
  isStaffPayload,
  updateSchedulerItem,
  type AvailabilityPayload,
  type QuestionPayload,
  type RunPayload,
  type StaffPayload,
} from "@/lib/scheduler";
import { notifyScheduleApprovers, sendTelegramMessage } from "@/lib/telegram";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown, fallback: string) {
  const denied = error instanceof Error && error.message === "UNAUTHORIZED";
  return NextResponse.json({ error: denied ? "Доступ заборонено" : fallback }, { status: denied ? 403 : 500 });
}

export async function GET() {
  try {
    await requirePublisher();
    return NextResponse.json(await getSchedulerItems());
  } catch (error) {
    return errorResponse(error, "Не вдалося завантажити планувальник");
  }
}

export async function POST(request: Request) {
  try {
    const publisher = await requirePublisher();
    const body = await request.json() as { action?: string; id?: string; payload?: unknown; name?: string; weekStart?: string };
    const items = await getSchedulerItems();

    if (body.action === "save_staff") {
      if (publisher.role !== "admin") return NextResponse.json({ error: "Команду змінює лише адміністратор" }, { status: 403 });
      if (!isStaffPayload(body.payload)) return NextResponse.json({ error: "Перевірте дані викладача" }, { status: 400 });
      const payload: StaffPayload = { ...body.payload, email: body.payload.email.trim().toLowerCase() };
      const item = body.id
        ? await updateSchedulerItem(body.id, payload, publisher.email)
        : await createSchedulerItem("staff", payload, publisher.email);
      return NextResponse.json(item, { status: body.id ? 200 : 201 });
    }

    if (body.action === "add_availability") {
      if (!isAvailabilityPayload(body.payload)) return NextResponse.json({ error: "Перевірте час доступності" }, { status: 400 });
      const payload = body.payload;
      const staff = items.find((item) => item.kind === "staff" && item.id === payload.staffId);
      if (!staff) return NextResponse.json({ error: "Учасника команди не знайдено" }, { status: 404 });
      const owner = staff.payload as StaffPayload;
      if (publisher.role !== "admin" && owner.email.toLowerCase() !== publisher.email.toLowerCase()) {
        return NextResponse.json({ error: "Можна змінювати лише власну доступність" }, { status: 403 });
      }
      return NextResponse.json(await createSchedulerItem("availability", payload, publisher.email), { status: 201 });
    }

    if (body.action === "add_requirement") {
      if (publisher.role !== "admin") return NextResponse.json({ error: "Параметри занять змінює адміністратор" }, { status: 403 });
      if (!isRequirementPayload(body.payload)) return NextResponse.json({ error: "Перевірте параметри заняття" }, { status: 400 });
      return NextResponse.json(await createSchedulerItem("requirement", body.payload, publisher.email), { status: 201 });
    }

    if (body.action === "generate") {
      if (publisher.role !== "admin") return NextResponse.json({ error: "Розклад створює адміністратор" }, { status: 403 });
      if (!body.name?.trim() || !body.weekStart) return NextResponse.json({ error: "Вкажіть назву і понеділок навчального тижня" }, { status: 400 });
      const runPayload = generateSchedule(body.name.trim(), body.weekStart, items);
      const run = await createSchedulerItem("run", runPayload, publisher.email, runPayload.status);
      const approvers = items.filter((item) => item.kind === "staff")
        .map((item) => item.payload as StaffPayload)
        .filter((person) => person.canApprove && person.telegramChatId)
        .map((person) => person.telegramChatId);
      await notifyScheduleApprovers(run.id, runPayload.name, runPayload.scheduledCount, runPayload.conflictCount, approvers);
      return NextResponse.json(run, { status: 201 });
    }

    if (body.action === "answer_question") {
      if (publisher.role !== "admin") return NextResponse.json({ error: "Відповідає адміністратор" }, { status: 403 });
      const question = items.find((item) => item.kind === "question" && item.id === body.id);
      const answer = typeof body.payload === "object" && body.payload && "answer" in body.payload ? String(body.payload.answer || "").trim() : "";
      if (!question || !answer) return NextResponse.json({ error: "Питання або відповідь не знайдено" }, { status: 400 });
      const payload = question.payload as QuestionPayload;
      const updated: QuestionPayload = { ...payload, answer, answeredAt: new Date().toISOString() };
      const item = await updateSchedulerItem(question.id, updated, publisher.email, "answered");
      await sendTelegramMessage(payload.chatId, `<b>Відповідь Академії</b>\n${answer}`);
      return NextResponse.json(item);
    }

    return NextResponse.json({ error: "Невідома дія" }, { status: 400 });
  } catch (error) {
    return errorResponse(error, "Не вдалося зберегти зміни");
  }
}

export async function PATCH(request: Request) {
  try {
    const publisher = await requirePublisher();
    if (publisher.role !== "admin") return NextResponse.json({ error: "Рішення приймає лише адміністратор" }, { status: 403 });
    const body = await request.json() as { id?: string; decision?: "approve" | "reject"; note?: string };
    const run = (await getSchedulerItems()).find((item) => item.kind === "run" && item.id === body.id);
    if (!run || !body.decision) return NextResponse.json({ error: "Чернетку не знайдено" }, { status: 404 });
    const updated = await decideScheduleRun(run, body.decision, body.note || "", publisher.email);
    const staff = (await getSchedulerItems()).filter((item) => item.kind === "staff").map((item) => item.payload as StaffPayload);
    const payload = updated.payload as RunPayload;
    await Promise.all(staff.filter((person) => person.telegramChatId).map((person) => sendTelegramMessage(
      person.telegramChatId,
      `<b>${payload.status === "approved" ? "Розклад погоджено" : "Розклад відхилено"}</b>\n${payload.name}${payload.decisionNote ? `\nКоментар: ${payload.decisionNote}` : ""}`,
    )));
    return NextResponse.json(updated);
  } catch (error) {
    return errorResponse(error, "Не вдалося зберегти рішення");
  }
}

export async function DELETE(request: Request) {
  try {
    const publisher = await requirePublisher();
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Запис не вказано" }, { status: 400 });
    const item = (await getSchedulerItems()).find((entry) => entry.id === id);
    if (!item) return NextResponse.json({ ok: true });
    if (publisher.role !== "admin") {
      if (item.kind !== "availability") return NextResponse.json({ error: "Видаляти цей запис може лише адміністратор" }, { status: 403 });
      const staffId = (item.payload as AvailabilityPayload).staffId;
      const staff = (await getSchedulerItems()).find((entry) => entry.kind === "staff" && entry.id === staffId);
      if (!staff || (staff.payload as StaffPayload).email.toLowerCase() !== publisher.email.toLowerCase()) {
        return NextResponse.json({ error: "Можна видаляти лише власну доступність" }, { status: 403 });
      }
    }
    await deleteSchedulerItem(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error, "Не вдалося видалити запис");
  }
}
