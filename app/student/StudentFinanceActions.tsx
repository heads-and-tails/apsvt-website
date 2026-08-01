"use client";

import { useState } from "react";
import type { StudentNotification } from "@/lib/student-finance";
import styles from "./student.module.css";

const PORTMONE_URL = "https://www.portmone.com.ua/r3/oplata-osvity-akademiia-pratsi-sotsialnykh-vidnosyn-i-turyzmu-kyiv";

export function PayAction({ amount, purpose }: { amount: number; purpose: string }) {
  const [copied, setCopied] = useState(false);
  async function pay() {
    try {
      await navigator.clipboard.writeText(`Сума: ${amount.toFixed(2)} грн\nПризначення платежу: ${purpose}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Payment can still continue if clipboard access is unavailable.
    }
    window.open(PORTMONE_URL, "_blank", "noopener,noreferrer");
  }
  return <button className={styles.payButton} type="button" onClick={() => void pay()}>{copied ? "Дані скопійовано ✓" : "Сплатити через Portmone ↗"}</button>;
}

export function NotificationList({ initialNotifications }: { initialNotifications: StudentNotification[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [busy, setBusy] = useState<string | null>(null);
  async function markRead(id: string) {
    setBusy(id);
    const response = await fetch(`/api/student/notifications/${id}`, { method: "PATCH" });
    if (response.ok) setNotifications((current) => current.map((item) => item.id === id ? { ...item, readAt: new Date().toISOString() } : item));
    setBusy(null);
  }
  return <div className={styles.notificationList}>{notifications.length ? notifications.map((notice) => <article className={notice.readAt ? styles.readNotice : ""} key={notice.id}>
    <span className={`${styles.noticeIcon} ${styles[notice.category]}`}>{notice.category === "overdue" ? "!" : notice.category === "payment" ? "₴" : notice.category === "contract" ? "≡" : "i"}</span>
    <div><small>{new Intl.DateTimeFormat("uk-UA", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(notice.createdAt))}</small><h3>{notice.title}</h3><p>{notice.message}</p>{notice.actionUrl && <a href={notice.actionUrl}>Перейти →</a>}</div>
    {!notice.readAt && !notice.id.startsWith("overdue-") && <button type="button" disabled={busy === notice.id} onClick={() => void markRead(notice.id)}>{busy === notice.id ? "…" : "Прочитано"}</button>}
  </article>) : <p className={styles.empty}>Нових повідомлень немає.</p>}</div>;
}
