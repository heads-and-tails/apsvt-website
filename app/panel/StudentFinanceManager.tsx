"use client";

import { useMemo, useState } from "react";
import type {
  StudentCharge,
  StudentContract,
  StudentFinanceAdminData,
  StudentNotification,
  StudentPayment,
  StudentProfile,
} from "@/lib/student-finance";
import styles from "./StudentFinanceManager.module.css";

function money(value: number) {
  return new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 2 }).format(value);
}

export function StudentFinanceManager({ initialData }: { initialData: StudentFinanceAdminData }) {
  const [data, setData] = useState(initialData);
  const [selectedId, setSelectedId] = useState(initialData.profiles[0]?.id || "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");
  const [student, setStudent] = useState({ email: "", fullName: "", studentNumber: "", programme: "", degreeLevel: "bachelor" as StudentProfile["degreeLevel"], studyForm: "full_time" as StudentProfile["studyForm"], course: "1", groupName: "" });
  const [charge, setCharge] = useState({ title: "Оплата за навчання", period: "2026/27 навчальний рік", amount: "", dueDate: "", contractId: "", paymentPurpose: "" });
  const [payment, setPayment] = useState({ chargeId: "", amount: "", paidAt: new Date().toISOString().slice(0, 16), provider: "portmone", providerReference: "", receiptUrl: "" });
  const [notice, setNotice] = useState({ category: "general" as StudentNotification["category"], title: "", message: "", actionUrl: "/student" });

  const selected = data.profiles.find((profile) => profile.id === selectedId) || null;
  const contracts = useMemo(() => data.contracts.filter((item) => item.studentId === selectedId), [data.contracts, selectedId]);
  const charges = useMemo(() => data.charges.filter((item) => item.studentId === selectedId), [data.charges, selectedId]);
  const payments = useMemo(() => data.payments.filter((item) => item.studentId === selectedId), [data.payments, selectedId]);
  const balance = charges.filter((item) => !["paid", "cancelled"].includes(item.status)).reduce((sum, item) => sum + Math.max(0, item.amount - item.paidAmount), 0);

  async function createStudent(event: React.FormEvent) {
    event.preventDefault(); setBusy("student"); setMessage("");
    const response = await fetch("/api/student-finance/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...student, course: Number(student.course) }) });
    const result = await response.json() as StudentProfile & { error?: string };
    if (!response.ok) setMessage(result.error || "Не вдалося додати студента");
    else {
      setData((current) => ({ ...current, profiles: [...current.profiles.filter((item) => item.id !== result.id), result].sort((a, b) => a.fullName.localeCompare(b.fullName, "uk")) }));
      setSelectedId(result.id); setStudent({ email: "", fullName: "", studentNumber: "", programme: "", degreeLevel: "bachelor", studyForm: "full_time", course: "1", groupName: "" });
      setMessage("Профіль студента активовано. Запрошення надіслано на пошту.");
    }
    setBusy("");
  }

  async function createCharge(event: React.FormEvent) {
    event.preventDefault(); if (!selectedId) return; setBusy("charge"); setMessage("");
    const response = await fetch("/api/student-finance/charges", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...charge, studentId: selectedId, amount: Number(charge.amount) }) });
    const result = await response.json() as StudentCharge & { error?: string };
    if (!response.ok) setMessage(result.error || "Не вдалося додати нарахування");
    else { setData((current) => ({ ...current, charges: [result, ...current.charges] })); setCharge((current) => ({ ...current, amount: "", dueDate: "" })); setMessage("Нарахування додано, студент отримає повідомлення в кабінеті."); }
    setBusy("");
  }

  async function confirmPayment(event: React.FormEvent) {
    event.preventDefault(); if (!selectedId) return; setBusy("payment"); setMessage("");
    const response = await fetch("/api/student-finance/payments", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...payment, studentId: selectedId, amount: Number(payment.amount), paidAt: new Date(payment.paidAt).toISOString() }) });
    const result = await response.json() as { payment?: StudentPayment; charge?: StudentCharge | null; notification?: StudentNotification; error?: string };
    if (!response.ok || !result.payment) setMessage(result.error || "Не вдалося підтвердити платіж");
    else {
      setData((current) => ({ ...current, payments: [result.payment!, ...current.payments], charges: result.charge ? current.charges.map((item) => item.id === result.charge!.id ? result.charge! : item) : current.charges, notifications: result.notification ? [result.notification, ...current.notifications] : current.notifications }));
      setPayment((current) => ({ ...current, amount: "", providerReference: "" })); setMessage("Платіж підтверджено й відображено у кабінеті студента.");
    }
    setBusy("");
  }

  async function sendNotice(event: React.FormEvent) {
    event.preventDefault(); if (!selectedId) return; setBusy("notice"); setMessage("");
    const response = await fetch("/api/student-finance/notifications", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...notice, studentId: selectedId }) });
    const result = await response.json() as StudentNotification & { error?: string };
    if (!response.ok) setMessage(result.error || "Не вдалося надіслати повідомлення");
    else { setData((current) => ({ ...current, notifications: [result, ...current.notifications] })); setNotice((current) => ({ ...current, title: "", message: "" })); setMessage("Повідомлення з’явилося в особистому кабінеті."); }
    setBusy("");
  }

  async function addContract(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!selectedId) return; setBusy("contract"); setMessage("");
    const form = new FormData(event.currentTarget); form.set("studentId", selectedId);
    const response = await fetch("/api/student-finance/contracts", { method: "POST", body: form });
    const result = await response.json() as StudentContract & { error?: string };
    if (!response.ok) setMessage(result.error || "Не вдалося додати договір");
    else { setData((current) => ({ ...current, contracts: [result, ...current.contracts.filter((item) => item.id !== result.id)] })); event.currentTarget.reset(); setMessage("Договір додано до особистого кабінету."); }
    setBusy("");
  }

  return <section className={styles.manager} id="student-finance">
    <div className="materials-head"><div><span>Особисті кабінети</span><h2>Студенти та оплата</h2><p>Підключайте студентів, нарахування, підтверджені платежі, договори та персональні повідомлення.</p></div><b>{data.profiles.length} профілів</b></div>
    {!data.available && <div className={styles.setup}><b>Фінансові таблиці ще не активовано</b><p>Після публікації оновлення цей розділ автоматично підключиться до захищеної бази.</p></div>}
    <form className={styles.studentForm} onSubmit={createStudent}><div><small>Новий профіль</small><h3>Додати або оновити студента</h3></div><label>ПІБ<input required value={student.fullName} onChange={(event) => setStudent((current) => ({ ...current, fullName: event.target.value }))} /></label><label>Пошта<input required type="email" value={student.email} onChange={(event) => setStudent((current) => ({ ...current, email: event.target.value }))} /></label><label>№ студента<input required value={student.studentNumber} onChange={(event) => setStudent((current) => ({ ...current, studentNumber: event.target.value }))} /></label><label>Освітня програма<input required value={student.programme} onChange={(event) => setStudent((current) => ({ ...current, programme: event.target.value }))} /></label><label>Рівень<select value={student.degreeLevel} onChange={(event) => setStudent((current) => ({ ...current, degreeLevel: event.target.value as StudentProfile["degreeLevel"] }))}><option value="bachelor">Бакалаврат</option><option value="master">Магістратура</option><option value="phd">Аспірантура</option></select></label><label>Форма<select value={student.studyForm} onChange={(event) => setStudent((current) => ({ ...current, studyForm: event.target.value as StudentProfile["studyForm"] }))}><option value="full_time">Денна</option><option value="part_time">Заочна</option></select></label><label>Курс<input type="number" min="1" max="6" required value={student.course} onChange={(event) => setStudent((current) => ({ ...current, course: event.target.value }))} /></label><label>Група<input value={student.groupName} onChange={(event) => setStudent((current) => ({ ...current, groupName: event.target.value }))} /></label><button disabled={busy === "student" || !data.available}>{busy === "student" ? "Зберігаємо…" : "Активувати кабінет →"}</button></form>
    {message && <p className={styles.message} role="status">{message}</p>}
    <div className={styles.workspace}>
      <aside className={styles.studentList}><div><span>Студенти</span><b>{data.profiles.length}</b></div>{data.profiles.map((profile) => <button className={profile.id === selectedId ? styles.selected : ""} type="button" onClick={() => setSelectedId(profile.id)} key={profile.id}><span>{profile.fullName.slice(0, 2).toUpperCase()}</span><div><b>{profile.fullName}</b><small>{profile.studentNumber} · {profile.programme}</small></div></button>)}</aside>
      <div className={styles.financePane}>{selected ? <>
        <header><div><span>{selected.studentNumber}</span><h3>{selected.fullName}</h3><p>{selected.programme} · {selected.course} курс · {selected.email}</p></div><div><small>Залишок</small><b>{money(balance)} грн</b><span>{charges.filter((item) => item.status === "overdue").length} прострочено</span></div></header>
        <div className={styles.formGrid}>
          <form onSubmit={createCharge}><span>01 / Нарахування</span><h4>Додати суму до сплати</h4><label>Назва<input required value={charge.title} onChange={(event) => setCharge((current) => ({ ...current, title: event.target.value }))} /></label><label>Період<input value={charge.period} onChange={(event) => setCharge((current) => ({ ...current, period: event.target.value }))} /></label><div><label>Сума, грн<input required min="0.01" step="0.01" type="number" value={charge.amount} onChange={(event) => setCharge((current) => ({ ...current, amount: event.target.value }))} /></label><label>Сплатити до<input required type="date" value={charge.dueDate} onChange={(event) => setCharge((current) => ({ ...current, dueDate: event.target.value }))} /></label></div><label>Договір<select value={charge.contractId} onChange={(event) => setCharge((current) => ({ ...current, contractId: event.target.value }))}><option value="">Без прив’язки</option>{contracts.map((item) => <option value={item.id} key={item.id}>{item.contractNumber}</option>)}</select></label><label>Призначення платежу<textarea rows={2} value={charge.paymentPurpose} onChange={(event) => setCharge((current) => ({ ...current, paymentPurpose: event.target.value }))} /></label><button disabled={busy === "charge"}>{busy === "charge" ? "Додаємо…" : "Додати нарахування"}</button></form>
          <form onSubmit={confirmPayment}><span>02 / Платіж</span><h4>Підтвердити надходження</h4><label>Нарахування<select value={payment.chargeId} onChange={(event) => setPayment((current) => ({ ...current, chargeId: event.target.value }))}><option value="">Без прив’язки</option>{charges.filter((item) => item.status !== "paid").map((item) => <option value={item.id} key={item.id}>{item.title} · {money(item.amount - item.paidAmount)} грн</option>)}</select></label><div><label>Сума, грн<input required min="0.01" step="0.01" type="number" value={payment.amount} onChange={(event) => setPayment((current) => ({ ...current, amount: event.target.value }))} /></label><label>Дата й час<input required type="datetime-local" value={payment.paidAt} onChange={(event) => setPayment((current) => ({ ...current, paidAt: event.target.value }))} /></label></div><label>Канал<select value={payment.provider} onChange={(event) => setPayment((current) => ({ ...current, provider: event.target.value }))}><option value="portmone">Portmone</option><option value="privat24">Privat24 / IBAN</option><option value="manual">Бухгалтерія</option></select></label><label>Номер операції<input value={payment.providerReference} onChange={(event) => setPayment((current) => ({ ...current, providerReference: event.target.value }))} /></label><button disabled={busy === "payment"}>{busy === "payment" ? "Підтверджуємо…" : "Підтвердити платіж"}</button></form>
          <form onSubmit={addContract}><span>03 / Договір</span><h4>Додати документ</h4><label>Номер договору<input name="contractNumber" required /></label><label>Назва<input name="title" required defaultValue="Договір про навчання" /></label><div><label>Підписано<input name="signedAt" type="date" /></label><label>Сума, грн<input name="totalAmount" type="number" min="0" step="0.01" required /></label></div><div><label>Діє з<input name="validFrom" type="date" /></label><label>Діє до<input name="validTo" type="date" /></label></div><input name="status" type="hidden" value="active" /><label>Файл PDF або Word<input name="file" type="file" accept=".pdf,.doc,.docx" /></label><button disabled={busy === "contract"}>{busy === "contract" ? "Завантажуємо…" : "Додати договір"}</button></form>
          <form onSubmit={sendNotice}><span>04 / Повідомлення</span><h4>Написати студенту</h4><label>Категорія<select value={notice.category} onChange={(event) => setNotice((current) => ({ ...current, category: event.target.value as StudentNotification["category"] }))}><option value="general">Загальне</option><option value="payment">Оплата</option><option value="overdue">Прострочення</option><option value="contract">Договір</option></select></label><label>Заголовок<input required value={notice.title} onChange={(event) => setNotice((current) => ({ ...current, title: event.target.value }))} /></label><label>Текст<textarea required rows={5} value={notice.message} onChange={(event) => setNotice((current) => ({ ...current, message: event.target.value }))} /></label><button disabled={busy === "notice"}>{busy === "notice" ? "Надсилаємо…" : "Додати в кабінет"}</button></form>
        </div>
        <div className={styles.audit}><div><span>{charges.length}</span><b>нарахувань</b></div><div><span>{payments.length}</span><b>платежів</b></div><div><span>{contracts.length}</span><b>договорів</b></div><a href="/student" target="_blank">Відкрити кабінет ↗</a></div>
      </> : <div className={styles.empty}>Додайте або оберіть студента, щоб керувати оплатою й документами.</div>}</div>
    </div>
  </section>;
}
