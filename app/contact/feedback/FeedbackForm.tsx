"use client";

import { useState, type FormEvent } from "react";

export function FeedbackForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.get("name"), email: fields.get("email"), subject: fields.get("subject"),
          message: fields.get("message"), website: fields.get("website"), consent: fields.get("consent") === "on",
        }),
      });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "Повідомлення не надіслано.");
      form.reset();
      setStatus("sent");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Повідомлення не надіслано.");
      setStatus("error");
    }
  }

  return <form className="feedback-form" onSubmit={submit}>
    <div className="feedback-form-row">
      <label>Ваше ім’я <input name="name" autoComplete="name" maxLength={120} required /></label>
      <label>Електронна пошта <input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
    </div>
    <label>Тема звернення <input name="subject" maxLength={160} required /></label>
    <label>Повідомлення <textarea name="message" rows={7} minLength={10} maxLength={5000} required /></label>
    <div className="feedback-honeypot" aria-hidden="true"><label>Сайт <input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="feedback-consent"><input name="consent" type="checkbox" required /><span>Погоджуюся на обробку зазначених даних виключно для відповіді на моє звернення.</span></label>
    <div className="feedback-actions"><button type="submit" disabled={status === "sending"}>{status === "sending" ? "Надсилаємо…" : "Надіслати повідомлення →"}</button><p role="status" aria-live="polite">{status === "sent" ? "Дякуємо! Ваше повідомлення надіслано." : status === "error" ? error : ""}</p></div>
  </form>;
}
