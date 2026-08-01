import type { User } from "@supabase/supabase-js";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type StudentProfile = {
  id: string;
  email: string;
  fullName: string;
  studentNumber: string;
  programme: string;
  degreeLevel: "bachelor" | "master" | "phd";
  studyForm: "full_time" | "part_time";
  course: number;
  groupName: string;
  status: "active" | "academic_leave" | "graduated" | "suspended";
  createdAt: string;
  updatedAt: string;
};

export type StudentContract = {
  id: string;
  studentId: string;
  contractNumber: string;
  title: string;
  signedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
  totalAmount: number;
  currency: string;
  status: "draft" | "active" | "completed" | "terminated";
  filePath: string | null;
  fileName: string | null;
  mimeType: string | null;
  fileSize: number | null;
  createdAt: string;
  updatedAt: string;
};

export type StudentChargeStatus = "scheduled" | "due" | "overdue" | "paid" | "cancelled";

export type StudentCharge = {
  id: string;
  studentId: string;
  contractId: string | null;
  title: string;
  period: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: StudentChargeStatus;
  paymentPurpose: string;
  createdAt: string;
  updatedAt: string;
};

export type StudentPayment = {
  id: string;
  studentId: string;
  chargeId: string | null;
  amount: number;
  paidAt: string;
  status: "pending" | "confirmed" | "failed" | "refunded";
  provider: string;
  providerReference: string;
  receiptUrl: string;
  createdAt: string;
};

export type StudentNotification = {
  id: string;
  studentId: string;
  category: "payment" | "overdue" | "contract" | "general";
  title: string;
  message: string;
  actionUrl: string;
  readAt: string | null;
  createdAt: string;
};

export type StudentFinanceDashboard = {
  available: boolean;
  profile: StudentProfile | null;
  contracts: StudentContract[];
  charges: StudentCharge[];
  payments: StudentPayment[];
  notifications: StudentNotification[];
};

export type StudentFinanceAdminData = Omit<StudentFinanceDashboard, "profile"> & {
  profiles: StudentProfile[];
};

type ProfileRow = {
  id: string; email: string; full_name: string; student_number: string; programme: string;
  degree_level: StudentProfile["degreeLevel"]; study_form: StudentProfile["studyForm"];
  course: number; group_name: string; status: StudentProfile["status"]; created_at: string; updated_at: string;
};
type ContractRow = {
  id: string; student_id: string; contract_number: string; title: string; signed_at: string | null;
  valid_from: string | null; valid_to: string | null; total_amount: number | string; currency: string;
  status: StudentContract["status"]; file_path: string | null; file_name: string | null;
  mime_type: string | null; file_size: number | null; created_at: string; updated_at: string;
};
type ChargeRow = {
  id: string; student_id: string; contract_id: string | null; title: string; period: string;
  amount: number | string; paid_amount: number | string; due_date: string; status: StudentChargeStatus;
  payment_purpose: string; created_at: string; updated_at: string;
};
type PaymentRow = {
  id: string; student_id: string; charge_id: string | null; amount: number | string; paid_at: string;
  status: StudentPayment["status"]; provider: string; provider_reference: string; receipt_url: string; created_at: string;
};
type NotificationRow = {
  id: string; student_id: string; category: StudentNotification["category"]; title: string;
  message: string; action_url: string; read_at: string | null; created_at: string;
};

const emptyDashboard: StudentFinanceDashboard = {
  available: false,
  profile: null,
  contracts: [],
  charges: [],
  payments: [],
  notifications: [],
};

function profileFromRow(row: ProfileRow): StudentProfile {
  return {
    id: row.id, email: row.email, fullName: row.full_name, studentNumber: row.student_number,
    programme: row.programme, degreeLevel: row.degree_level, studyForm: row.study_form,
    course: row.course, groupName: row.group_name, status: row.status,
    createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

function contractFromRow(row: ContractRow): StudentContract {
  return {
    id: row.id, studentId: row.student_id, contractNumber: row.contract_number, title: row.title,
    signedAt: row.signed_at, validFrom: row.valid_from, validTo: row.valid_to,
    totalAmount: Number(row.total_amount), currency: row.currency, status: row.status,
    filePath: row.file_path, fileName: row.file_name, mimeType: row.mime_type, fileSize: row.file_size,
    createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

export function deriveChargeStatus(charge: Pick<StudentCharge, "amount" | "paidAmount" | "dueDate" | "status">): StudentChargeStatus {
  if (charge.status === "cancelled") return "cancelled";
  if (charge.paidAmount >= charge.amount) return "paid";
  const due = new Date(`${charge.dueDate}T23:59:59+03:00`).getTime();
  const now = Date.now();
  if (due < now) return "overdue";
  if (due - now <= 14 * 24 * 60 * 60 * 1000) return "due";
  return "scheduled";
}

function chargeFromRow(row: ChargeRow): StudentCharge {
  const charge: StudentCharge = {
    id: row.id, studentId: row.student_id, contractId: row.contract_id, title: row.title,
    period: row.period, amount: Number(row.amount), paidAmount: Number(row.paid_amount),
    dueDate: row.due_date, status: row.status, paymentPurpose: row.payment_purpose,
    createdAt: row.created_at, updatedAt: row.updated_at,
  };
  return { ...charge, status: deriveChargeStatus(charge) };
}

function paymentFromRow(row: PaymentRow): StudentPayment {
  return {
    id: row.id, studentId: row.student_id, chargeId: row.charge_id, amount: Number(row.amount),
    paidAt: row.paid_at, status: row.status, provider: row.provider,
    providerReference: row.provider_reference, receiptUrl: row.receipt_url, createdAt: row.created_at,
  };
}

function notificationFromRow(row: NotificationRow): StudentNotification {
  return {
    id: row.id, studentId: row.student_id, category: row.category, title: row.title,
    message: row.message, actionUrl: row.action_url, readAt: row.read_at, createdAt: row.created_at,
  };
}

export async function getStudentFinanceDashboard(user: User): Promise<StudentFinanceDashboard> {
  if (!isSupabaseConfigured()) return emptyDashboard;
  const admin = createSupabaseAdmin();
  const { data: profile, error } = await admin
    .from("student_profiles")
    .select("id,email,full_name,student_number,programme,degree_level,study_form,course,group_name,status,created_at,updated_at")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();
  if (error) return emptyDashboard;
  if (!profile) return { ...emptyDashboard, available: true };

  const [contractsResult, chargesResult, paymentsResult, notificationsResult] = await Promise.all([
    admin.from("student_contracts").select("*").eq("student_id", user.id).order("created_at", { ascending: false }),
    admin.from("student_charges").select("*").eq("student_id", user.id).order("due_date", { ascending: true }),
    admin.from("student_payments").select("*").eq("student_id", user.id).order("paid_at", { ascending: false }),
    admin.from("student_notifications").select("*").eq("student_id", user.id).order("created_at", { ascending: false }),
  ]);
  return {
    available: true,
    profile: profileFromRow(profile),
    contracts: ((contractsResult.data || []) as ContractRow[]).map(contractFromRow),
    charges: ((chargesResult.data || []) as ChargeRow[]).map(chargeFromRow),
    payments: ((paymentsResult.data || []) as PaymentRow[]).map(paymentFromRow),
    notifications: ((notificationsResult.data || []) as NotificationRow[]).map(notificationFromRow),
  };
}

export async function getStudentFinanceAdminData(): Promise<StudentFinanceAdminData> {
  if (!isSupabaseConfigured()) return { ...emptyDashboard, profiles: [] };
  const admin = createSupabaseAdmin();
  const [profilesResult, contractsResult, chargesResult, paymentsResult, notificationsResult] = await Promise.all([
    admin.from("student_profiles").select("*").order("full_name"),
    admin.from("student_contracts").select("*").order("created_at", { ascending: false }),
    admin.from("student_charges").select("*").order("due_date", { ascending: false }),
    admin.from("student_payments").select("*").order("paid_at", { ascending: false }).limit(300),
    admin.from("student_notifications").select("*").order("created_at", { ascending: false }).limit(500),
  ]);
  if (profilesResult.error) return { ...emptyDashboard, profiles: [] };
  return {
    available: true,
    profiles: ((profilesResult.data || []) as ProfileRow[]).map(profileFromRow),
    contracts: ((contractsResult.data || []) as ContractRow[]).map(contractFromRow),
    charges: ((chargesResult.data || []) as ChargeRow[]).map(chargeFromRow),
    payments: ((paymentsResult.data || []) as PaymentRow[]).map(paymentFromRow),
    notifications: ((notificationsResult.data || []) as NotificationRow[]).map(notificationFromRow),
  };
}

export async function upsertStudentProfile(input: {
  email: string; fullName: string; studentNumber: string; programme: string;
  degreeLevel: StudentProfile["degreeLevel"]; studyForm: StudentProfile["studyForm"];
  course: number; groupName: string;
}, redirectTo: string): Promise<StudentProfile> {
  const admin = createSupabaseAdmin();
  const email = input.email.trim().toLowerCase();
  const { data: userList, error: usersError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (usersError) throw usersError;
  let user = userList.users.find((entry) => entry.email?.toLowerCase() === email) || null;
  if (!user) {
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo,
      data: {
        account_type: "student",
        full_name: input.fullName,
        student_number: input.studentNumber,
      },
    });
    if (error) throw error;
    user = data.user;
  }
  const now = new Date().toISOString();
  const { data, error } = await admin.from("student_profiles").upsert({
    id: user.id,
    email,
    full_name: input.fullName,
    student_number: input.studentNumber,
    programme: input.programme,
    degree_level: input.degreeLevel,
    study_form: input.studyForm,
    course: input.course,
    group_name: input.groupName,
    status: "active",
    updated_at: now,
  }, { onConflict: "id" }).select("*").single<ProfileRow>();
  if (error) throw error;
  return profileFromRow(data);
}

export async function addStudentCharge(input: {
  studentId: string; contractId?: string | null; title: string; period: string;
  amount: number; dueDate: string; paymentPurpose: string;
}): Promise<StudentCharge> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin.from("student_charges").insert({
    student_id: input.studentId,
    contract_id: input.contractId || null,
    title: input.title,
    period: input.period,
    amount: input.amount,
    due_date: input.dueDate,
    status: new Date(`${input.dueDate}T23:59:59+03:00`).getTime() < Date.now() ? "overdue" : "scheduled",
    payment_purpose: input.paymentPurpose,
  }).select("*").single<ChargeRow>();
  if (error) throw error;
  await admin.from("student_notifications").insert({
    student_id: input.studentId,
    category: "payment",
    title: "Нове нарахування",
    message: `${input.title}: ${new Intl.NumberFormat("uk-UA").format(input.amount)} грн до ${input.dueDate}.`,
    action_url: "/student#payments",
  });
  return chargeFromRow(data);
}

export async function addStudentPayment(input: {
  studentId: string; chargeId?: string | null; amount: number; paidAt: string;
  provider: string; providerReference: string; receiptUrl: string;
}): Promise<{ payment: StudentPayment; charge: StudentCharge | null; notification: StudentNotification }> {
  const admin = createSupabaseAdmin();
  const { data: payment, error } = await admin.from("student_payments").insert({
    student_id: input.studentId,
    charge_id: input.chargeId || null,
    amount: input.amount,
    paid_at: input.paidAt,
    status: "confirmed",
    provider: input.provider || "manual",
    provider_reference: input.providerReference,
    receipt_url: input.receiptUrl,
  }).select("*").single<PaymentRow>();
  if (error) throw error;

  let updatedCharge: StudentCharge | null = null;
  if (input.chargeId) {
    const { data: paymentRows } = await admin.from("student_payments")
      .select("amount")
      .eq("charge_id", input.chargeId)
      .eq("status", "confirmed");
    const paidAmount = (paymentRows || []).reduce((total, row) => total + Number(row.amount), 0);
    const { data: current } = await admin.from("student_charges").select("*").eq("id", input.chargeId).single<ChargeRow>();
    if (current) {
      const status: StudentChargeStatus = paidAmount >= Number(current.amount) ? "paid" : deriveChargeStatus({
        amount: Number(current.amount), paidAmount, dueDate: current.due_date, status: current.status,
      });
      const { data: charge } = await admin.from("student_charges").update({
        paid_amount: paidAmount,
        status,
        updated_at: new Date().toISOString(),
      }).eq("id", input.chargeId).select("*").single<ChargeRow>();
      if (charge) updatedCharge = chargeFromRow(charge);
    }
  }

  const { data: notice, error: noticeError } = await admin.from("student_notifications").insert({
    student_id: input.studentId,
    category: "payment",
    title: "Оплату підтверджено",
    message: `Зараховано ${new Intl.NumberFormat("uk-UA").format(input.amount)} грн. Платіж відображено в історії.`,
    action_url: "/student#history",
  }).select("*").single<NotificationRow>();
  if (noticeError) throw noticeError;
  return { payment: paymentFromRow(payment), charge: updatedCharge, notification: notificationFromRow(notice) };
}

export async function addStudentNotification(input: {
  studentId: string; category: StudentNotification["category"]; title: string; message: string; actionUrl: string;
}): Promise<StudentNotification> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin.from("student_notifications").insert({
    student_id: input.studentId,
    category: input.category,
    title: input.title,
    message: input.message,
    action_url: input.actionUrl,
  }).select("*").single<NotificationRow>();
  if (error) throw error;
  return notificationFromRow(data);
}

export async function addStudentContract(input: {
  studentId: string; contractNumber: string; title: string; signedAt: string | null;
  validFrom: string | null; validTo: string | null; totalAmount: number; status: StudentContract["status"];
  filePath: string | null; fileName: string | null; mimeType: string | null; fileSize: number | null;
}): Promise<StudentContract> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin.from("student_contracts").upsert({
    student_id: input.studentId,
    contract_number: input.contractNumber,
    title: input.title,
    signed_at: input.signedAt,
    valid_from: input.validFrom,
    valid_to: input.validTo,
    total_amount: input.totalAmount,
    status: input.status,
    file_path: input.filePath,
    file_name: input.fileName,
    mime_type: input.mimeType,
    file_size: input.fileSize,
    updated_at: new Date().toISOString(),
  }, { onConflict: "student_id,contract_number" }).select("*").single<ContractRow>();
  if (error) throw error;
  await admin.from("student_notifications").insert({
    student_id: input.studentId,
    category: "contract",
    title: "Договір доступний у кабінеті",
    message: `${input.title} додано до розділу «Мої договори».`,
    action_url: "/student#contracts",
  });
  return contractFromRow(data);
}

export async function markStudentNotificationRead(notificationId: string, studentId: string): Promise<void> {
  const admin = createSupabaseAdmin();
  const { error } = await admin.from("student_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("student_id", studentId);
  if (error) throw error;
}

export async function getStudentContractDownload(contractId: string, studentId: string): Promise<StudentContract | null> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin.from("student_contracts")
    .select("*")
    .eq("id", contractId)
    .eq("student_id", studentId)
    .maybeSingle<ContractRow>();
  if (error || !data) return null;
  return contractFromRow(data);
}
