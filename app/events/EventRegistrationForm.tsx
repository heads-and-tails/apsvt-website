"use client";

import { useState } from "react";

export function EventRegistrationForm({events}:{events:string[]}){
  const [sending,setSending]=useState(false);
  return <section id="registration" className="event-registration"><div className="wrap event-registration-grid"><div><div className="idx">02 / Реєстрація</div><h2>Забронюйте місце</h2><p>Заповніть форму — реєстрація буде надіслана координаторці подій на <b>vportnaia@kse.org.ua</b>.</p><div className="registration-note"><span>Що далі</span><ol><li>Отримаємо вашу заявку</li><li>Надішлемо організаційні деталі</li><li>Нагадаємо напередодні події</li></ol></div></div>
    <form className="registration-form" action="https://formsubmit.co/vportnaia@kse.org.ua" method="POST" onSubmit={()=>setSending(true)}>
      <input type="hidden" name="_subject" value="Нова реєстрація на подію АПСВТ" /><input type="hidden" name="_template" value="table" /><input type="hidden" name="_captcha" value="false" /><input type="hidden" name="_next" value="https://apsvt-academy.ikucha.chatgpt.site/events?registered=1" /><input type="text" name="_honey" className="form-honey" tabIndex={-1} autoComplete="off" />
      <label>Подія<select name="Подія" required defaultValue=""><option value="" disabled>Оберіть подію</option>{events.map(e=><option key={e}>{e}</option>)}</select></label>
      <label>Ім’я та прізвище<input name="Ім’я" required autoComplete="name" placeholder="Ваше ім’я" /></label>
      <div className="form-row"><label>Email<input name="Email" type="email" required autoComplete="email" placeholder="name@example.com" /></label><label>Телефон<input name="Телефон" type="tel" required autoComplete="tel" placeholder="+380" /></label></div>
      <label>Ваш статус<select name="Статус" required><option>Вступник / вступниця</option><option>Студент / студентка</option><option>Викладач / викладачка</option><option>Гість / гостя</option></select></label>
      <label>Коментар<textarea name="Коментар" rows={4} placeholder="Питання або особливі потреби" /></label>
      <label className="consent"><input type="checkbox" required /> <span>Погоджуюся на обробку даних для організації цієї події.</span></label>
      <button className="cta" type="submit" disabled={sending}><span>{sending?"Надсилаємо…":"Зареєструватися"}</span></button>
    </form>
  </div></section>;
}
