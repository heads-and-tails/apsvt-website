import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { deriveChargeStatus, getStudentFinanceDashboard } from "@/lib/student-finance";
import { NotificationList, PayAction } from "./StudentFinanceActions";
import styles from "./student.module.css";

export const metadata: Metadata = { title: "Особистий кабінет студента" };
export const dynamic = "force-dynamic";

const statusLabel = { scheduled: "Заплановано", due: "Очікує оплати", overdue: "Прострочено", paid: "Сплачено", cancelled: "Скасовано" } as const;
const levelLabel = { bachelor: "Бакалаврат", master: "Магістратура", phd: "Аспірантура" } as const;

function money(value: number) {
  return new Intl.NumberFormat("uk-UA", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
}

function date(value: string | null) {
  return value ? new Intl.DateTimeFormat("uk-UA", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${value.slice(0, 10)}T12:00:00`)) : "Не вказано";
}

function SignOut() {
  return <form action="/auth/signout" method="post"><input type="hidden" name="returnTo" value="/student/login" /><button type="submit">Вийти</button></form>;
}

export default async function StudentPage() {
  if (!isSupabaseConfigured()) redirect("/student/login");
  const user = await getAuthenticatedUser();
  if (!user) redirect("/student/login");
  const dashboard = await getStudentFinanceDashboard(user);

  if (!dashboard.available) return <main className={styles.unavailable}><div><span>АПСВТ · Особистий кабінет</span><h1>Фінансовий модуль оновлюється</h1><p>Ваші дані збережені. Спробуйте відкрити кабінет пізніше.</p><Link href="/students">Повернутися до студентського простору</Link></div></main>;
  if (!dashboard.profile) return <main className={styles.unavailable}><div><span>АПСВТ · Особистий кабінет</span><h1>Акаунт ще не прив’язано</h1><p>Ви увійшли як <b>{user.email}</b>, але студентський профіль ще не підключено. Зверніться до деканату або бухгалтерії та повідомте цю адресу.</p><SignOut /><Link href="/contacts">Контакти Академії</Link></div></main>;

  const profile = dashboard.profile;
  const charges = dashboard.charges.map((charge) => ({ ...charge, status: deriveChargeStatus(charge) }));
  const openCharges = charges.filter((charge) => !["paid", "cancelled"].includes(charge.status));
  const overdue = openCharges.filter((charge) => charge.status === "overdue");
  const balance = openCharges.reduce((sum, charge) => sum + Math.max(0, charge.amount - charge.paidAmount), 0);
  const nearest = [...openCharges].sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0] || null;
  const generatedNotices = [
    ...overdue.map((charge) => ({
      id: `overdue-${charge.id}`, studentId: profile.id, category: "overdue" as const,
      title: "Прострочений платіж", message: `${charge.title}: залишок ${money(charge.amount - charge.paidAmount)} грн, строк був ${date(charge.dueDate)}.`,
      actionUrl: "#payments", readAt: null, createdAt: new Date().toISOString(),
    })),
  ];
  const notifications = [...generatedNotices, ...dashboard.notifications];

  return <main className={styles.portal} id="top">
    <header className={styles.portalHeader}><Link href="/"><span>А</span><b>АПСВТ<small>Особистий кабінет</small></b></Link><nav><a href="#payments">Оплата</a><a href="#contracts">Договори</a><a href="#history">Історія</a><Link href="/schedule">Розклад</Link></nav><div><span>{profile.fullName}</span><SignOut /></div></header>

    <section className={styles.hero}><div className={styles.heroCopy}><span>{levelLabel[profile.degreeLevel]} · {profile.studyForm === "full_time" ? "Денна форма" : "Заочна форма"}</span><h1>Вітаємо,<br />{profile.fullName.split(" ")[0]}.</h1><p>{profile.programme} · {profile.course} курс{profile.groupName ? ` · ${profile.groupName}` : ""}</p></div><div className={styles.studentCard}><small>Студентський профіль</small><b>{profile.studentNumber}</b><span>{profile.email}</span><i>{profile.status === "active" ? "Активний" : "Статус уточнюється"}</i></div></section>

    <section className={styles.summary}>
      <article className={balance > 0 ? styles.summaryAttention : ""}><small>Залишок до сплати</small><b>{money(balance)} <i>грн</i></b><span>{overdue.length ? `${overdue.length} прострочених нарахувань` : "Прострочень немає"}</span></article>
      <article><small>Найближчий платіж</small><b>{nearest ? money(Math.max(0, nearest.amount - nearest.paidAmount)) : "0"} <i>грн</i></b><span>{nearest ? `до ${date(nearest.dueDate)}` : "Усе сплачено"}</span></article>
      <article><small>Підтверджено оплат</small><b>{money(dashboard.payments.filter((item) => item.status === "confirmed").reduce((sum, item) => sum + item.amount, 0))} <i>грн</i></b><span>{dashboard.payments.filter((item) => item.status === "confirmed").length} операцій</span></article>
      <article><small>Договори</small><b>{dashboard.contracts.length}</b><span>{dashboard.contracts.filter((item) => item.status === "active").length} активних</span></article>
    </section>

    <div className={styles.contentGrid}>
      <section className={styles.mainColumn}>
        <div className={styles.sectionHead} id="payments"><div><span>01 / Фінанси</span><h2>Нарахування та оплата</h2></div><p>Суми надходять із фінансового обліку Академії. Оплата відображається після підтвердження бухгалтерією.</p></div>
        <div className={styles.chargeList}>{charges.length ? charges.map((charge) => {
          const remainder = Math.max(0, charge.amount - charge.paidAmount);
          return <article className={charge.status === "overdue" ? styles.overdueCharge : ""} key={charge.id}><div><span className={`${styles.status} ${styles[charge.status]}`}>{statusLabel[charge.status]}</span><h3>{charge.title}</h3><p>{charge.period || "Навчання"} · строк {date(charge.dueDate)}</p></div><dl><div><dt>Нараховано</dt><dd>{money(charge.amount)} грн</dd></div><div><dt>Сплачено</dt><dd>{money(charge.paidAmount)} грн</dd></div><div><dt>Залишок</dt><dd><b>{money(remainder)} грн</b></dd></div></dl>{remainder > 0 && <div className={styles.chargeAction}><PayAction amount={remainder} purpose={charge.paymentPurpose || `Оплата за навчання, ${profile.fullName}, договір ${dashboard.contracts[0]?.contractNumber || profile.studentNumber}`} /><small>Сума й призначення будуть скопійовані. Перевірте їх у Portmone перед підтвердженням.</small></div>}</article>;
        }) : <p className={styles.empty}>Нарахувань ще немає.</p>}</div>

        <div className={styles.sectionHead} id="history"><div><span>02 / Історія</span><h2>Підтверджені платежі</h2></div></div>
        <div className={styles.historyTable}><div className={styles.historyHeader}><span>Дата</span><span>Сума</span><span>Спосіб</span><span>Статус</span></div>{dashboard.payments.length ? dashboard.payments.map((payment) => <article key={payment.id}><span>{date(payment.paidAt)}</span><b>{money(payment.amount)} грн</b><span>{payment.provider === "portmone" ? "Portmone" : payment.provider === "privat24" ? "Privat24" : "Бухгалтерія"}{payment.providerReference && <small>№ {payment.providerReference}</small>}</span><span className={`${styles.status} ${styles[payment.status === "confirmed" ? "paid" : "due"]}`}>{payment.status === "confirmed" ? "Зараховано" : "Обробляється"}</span></article>) : <p className={styles.empty}>Підтверджених платежів ще немає.</p>}</div>

        <div className={styles.sectionHead} id="contracts"><div><span>03 / Документи</span><h2>Мої договори</h2></div><p>Файли відкриваються за тимчасовим захищеним посиланням і недоступні стороннім користувачам.</p></div>
        <div className={styles.contractGrid}>{dashboard.contracts.length ? dashboard.contracts.map((contract) => <article key={contract.id}><span>{contract.status === "active" ? "Чинний" : contract.status === "completed" ? "Завершений" : "Документ"}</span><h3>{contract.title}</h3><dl><div><dt>Номер</dt><dd>{contract.contractNumber}</dd></div><div><dt>Підписано</dt><dd>{date(contract.signedAt)}</dd></div><div><dt>Сума</dt><dd>{money(contract.totalAmount)} грн</dd></div></dl>{contract.filePath ? <a href={`/api/student/contracts/${contract.id}`}>Відкрити документ ↗</a> : <small>Електронний файл готується</small>}</article>) : <p className={styles.empty}>Договори ще не додано до кабінету.</p>}</div>
      </section>

      <aside className={styles.sideColumn}><section><div className={styles.sideHead}><span>Сповіщення</span><b>{notifications.filter((item) => !item.readAt).length}</b></div><NotificationList initialNotifications={notifications} /></section><section className={styles.support}><span>Потрібна допомога?</span><h3>Питання щодо оплати</h3><p>Для звірки платежу повідомте ПІБ, номер договору, дату та суму.</p><a href="tel:+380964508504">+38 096 450 85 04</a><small>Головний бухгалтер<br />Світлана Василівна</small><Link href="/tuition#payment">Реквізити Академії →</Link></section></aside>
    </div>
  </main>;
}
