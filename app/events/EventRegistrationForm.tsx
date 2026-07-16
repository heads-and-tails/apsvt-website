"use client";

import { FormEvent, useState } from "react";

export function EventRegistrationForm({events}:{events:string[]}){
  const [state,setState]=useState<"idle"|"sending"|"success"|"error">("idle");
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setState("sending");
    const form=event.currentTarget;const data=Object.fromEntries(new FormData(form).entries());
    try{const response=await fetch("/api/event-registration",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});if(!response.ok)throw new Error();setState("success");form.reset();}
    catch{setState("error")}
  }
  return <section id="registration" className="event-registration"><div className="wrap event-registration-grid"><div><div className="idx">02 / Реєстрація</div><h2>Забронюйте місце</h2><p>Оберіть подію та залиште контакти. Після реєстрації команда Академії надішле програму, формат участі й нагадування.</p><div className="registration-note"><span>Що далі</span><ol><li>Підтвердимо вашу участь</li><li>Надішлемо організаційні деталі</li><li>Нагадаємо напередодні події</li></ol></div></div>
    <form className="registration-form" onSubmit={submit}>
      <label>Подія<select name="event" required defaultValue=""><option value="" disabled>Оберіть подію</option>{events.map(e=><option key={e}>{e}</option>)}</select></label>
      <label>Ім’я та прізвище<input name="name" required autoComplete="name" placeholder="Як до вас звертатися" /></label>
      <div className="form-row"><label>Email<input name="email" type="email" required autoComplete="email" placeholder="name@example.com" /></label><label>Телефон<input name="phone" type="tel" required autoComplete="tel" placeholder="+380" /></label></div>
      <div className="form-row"><label>Ваш статус<select name="role" required defaultValue="Вступник / вступниця"><option>Вступник / вступниця</option><option>Студент / студентка</option><option>Викладач / викладачка</option><option>Гість / гостя</option></select></label><label>Формат участі<select name="format" required><option>Особисто в кампусі</option><option>Онлайн, якщо доступно</option></select></label></div>
      <label>Що допоможе зробити участь комфортною?<textarea name="note" rows={3} placeholder="Запитання, доступність або інші побажання" /></label>
      <label className="consent"><input type="checkbox" required /> <span>Погоджуюся на використання контактів лише для організації цієї події.</span></label>
      {state==="success"&&<p className="form-status" role="status">Готово — місце зарезервовано. Деталі надійдуть на вашу пошту.</p>}{state==="error"&&<p className="form-error" role="alert">Не вдалося надіслати форму. Спробуйте ще раз за хвилину.</p>}
      <button className="cta" type="submit" disabled={state==="sending"}><span>{state==="sending"?"Реєструємо…":"Зареєструватися"}</span></button>
    </form>
  </div></section>;
}
