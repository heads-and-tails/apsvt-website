"use client";

import { FormEvent, useRef, useState } from "react";
import { programs } from "@/lib/programs";

const levels = ["Бакалаврат", "Магістратура", "Ще визначаюся"];

export function ApplicantConsultationForm() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [stepError, setStepError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function next(nextStep: number) {
    const form = formRef.current;
    if (!form) return;
    if (step === 1 && !form.querySelector<HTMLInputElement>('input[name="level"]:checked')) {
      setStepError("Оберіть освітній рівень, щоб продовжити.");
      return;
    }
    if (step === 2) {
      const fields = ["name", "phone", "email"].map((name) => form.elements.namedItem(name)).filter(Boolean) as HTMLInputElement[];
      const invalid = fields.find((field) => !field.reportValidity());
      if (invalid) return;
      if (!form.querySelector<HTMLInputElement>('input[name="contactMethod"]:checked')) {
        setStepError("Оберіть зручний спосіб зв’язку.");
        return;
      }
    }
    setStepError("");
    setStep(nextStep);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/admission-consultation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error();
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") return <div className="admission-success" role="status"><span>✓</span><div><div className="mono">Запит зареєстровано</div><h3>Дякуємо! Ми вже готуємо відповідь.</h3><p>Команда приймальної комісії зв’яжеться з вами обраним способом. А поки можна пройти тест і зберегти програму, яка сподобалась.</p><a href="#test" className="sec-link">Переглянути мій напрям →</a></div></div>;

  return <form ref={formRef} className="admission-form" onSubmit={submit}>
    <div className="admission-form-head"><div><span className="mono">Крок {step} з 3</span><strong>{step === 1 ? "Ваш освітній запит" : step === 2 ? "Як з вами зв’язатися" : "Остання деталь"}</strong></div><div className="admission-progress"><span style={{ width: `${step * 33.333}%` }} /></div></div>

    <div className={step === 1 ? "admission-step active" : "admission-step"} aria-hidden={step !== 1}>
      <fieldset><legend>Який рівень вас цікавить?</legend><div className="choice-grid">{levels.map((level, index) => <label key={level}><input type="radio" name="level" value={level} required={index === 0} /><span>{level}</span></label>)}</div></fieldset>
      <label className="field-label">Програма<select name="program" defaultValue=""><option value="">Допоможіть обрати</option>{programs.map((program) => <option key={program.slug}>{program.title}</option>)}</select></label>
      {stepError && <p className="form-step-error" role="alert">{stepError}</p>}
      <button className="cta" type="button" onClick={() => next(2)}><span>Далі — контакти</span></button>
    </div>

    <div className={step === 2 ? "admission-step active" : "admission-step"} aria-hidden={step !== 2}>
      <div className="form-row"><label className="field-label">Ім’я та прізвище<input name="name" required autoComplete="name" placeholder="Як до вас звертатися" /></label><label className="field-label">Телефон<input name="phone" type="tel" required autoComplete="tel" placeholder="+380" /></label></div>
      <label className="field-label">Email<input name="email" type="email" required autoComplete="email" placeholder="name@example.com" /></label>
      <fieldset><legend>Як вам зручніше отримати відповідь?</legend><div className="choice-grid compact"><label><input type="radio" name="contactMethod" value="Телефон" required /><span>Телефон</span></label><label><input type="radio" name="contactMethod" value="Email" /><span>Email</span></label><label><input type="radio" name="contactMethod" value="Telegram / Viber" /><span>Telegram / Viber</span></label></div></fieldset>
      {stepError && <p className="form-step-error" role="alert">{stepError}</p>}
      <div className="admission-actions"><button type="button" className="form-back" onClick={() => { setStepError(""); setStep(1); }}>← Назад</button><button className="cta" type="button" onClick={() => next(3)}><span>Далі — запитання</span></button></div>
    </div>

    <div className={step === 3 ? "admission-step active" : "admission-step"} aria-hidden={step !== 3}>
      <label className="field-label">Ваше запитання<textarea name="question" rows={4} placeholder="Наприклад: які документи потрібні та чи є заочна форма?" /></label>
      <label className="field-label">Коли зручно зв’язатися?<select name="contactTime"><option>Будь-коли у робочі години</option><option>До 12:00</option><option>12:00–16:00</option><option>Після 16:00</option></select></label>
      <label className="form-consent"><input type="checkbox" name="consent" required /><span>Погоджуюся на використання контактів лише для консультації щодо вступу.</span></label>
      {state === "error" && <p className="form-error" role="alert">Не вдалося надіслати форму. Перевірте поля або спробуйте ще раз за хвилину.</p>}
      <div className="admission-actions"><button type="button" className="form-back" onClick={() => setStep(2)}>← Назад</button><button className="cta" type="submit" disabled={state === "sending"}><span>{state === "sending" ? "Надсилаємо…" : "Отримати консультацію"}</span></button></div>
    </div>
  </form>;
}
