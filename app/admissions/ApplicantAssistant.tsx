"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type Answer = { text: string; link?: { label: string; href: string } };
type Message = { role: "assistant" | "user"; text: string; link?: Answer["link"] };

const knowledge: { words: string[]; answer: Answer }[] = [
  { words: ["документ", "потрібно", "пакет", "паспорт", "диплом", "атестат"], answer: { text: "Зазвичай потрібні документ про освіту з додатком, паспорт або ID-картка, реєстраційний номер і мотиваційний лист. Точний список залежить від рівня та вашої категорії — залиште короткий запит, і комісія перевірить саме ваш випадок.", link: { label: "Перейти до консультації", href: "#consultation" } } },
  { words: ["вартість", "ціна", "коштує", "оплата", "контракт"], answer: { text: "Для більшості програм бакалаврату вартість становить 38 600 ₴ на рік за денною та 30 900 ₴ за заочною формою. Туризм — 43 500 ₴ на рік. На сторінці кожної програми показані всі актуальні формати й ціни.", link: { label: "Порівняти програми", href: "/programs" } } },
  { words: ["програм", "спеціальн", "обрати", "підійде", "тест", "напрям"], answer: { text: "Я можу допомогти з вибором. Короткий тест зіставляє ваші інтереси, тип завдань і бажане робоче середовище з дев’ятьма програмами Академії та пояснює три найкращі збіги.", link: { label: "Пройти тест", href: "#test" } } },
  { words: ["заоч", "дистанц", "онлайн", "формат", "денн"], answer: { text: "Для більшості напрямів передбачена денна та заочна форма. Конкретний формат, розклад очних зустрічей і доступні цифрові матеріали залежать від програми — це можна уточнити в персональній консультації.", link: { label: "Обрати програму", href: "/programs" } } },
  { words: ["нмт", "іспит", "бал", "конкурс", "сертифікат"], answer: { text: "Конкурсні предмети та коефіцієнти залежать від рівня освіти, спеціальності й чинних правил вступної кампанії. Щоб не ризикувати помилкою, вкажіть програму та ваші результати у формі — команда перевірить персональну траєкторію.", link: { label: "Перевірити мою ситуацію", href: "#consultation" } } },
  { words: ["гуртож", "житло", "поселен"], answer: { text: "Потребу в проживанні краще зазначити під час консультації: команда розповість про актуальні варіанти поселення, необхідні документи та строки оформлення.", link: { label: "Запитати про проживання", href: "#consultation" } } },
  { words: ["магістр", "магістратур", "єві", "єфвв"], answer: { text: "Магістерські програми доступні з психології, фінансів, менеджменту, публічного управління, маркетингу, права та соціальної роботи. Вимоги вступу різняться за спеціальністю, тому радимо обрати напрям і перевірити свій пакет документів.", link: { label: "Магістерські програми", href: "/programs" } } },
  { words: ["термін", "дата", "коли", "строк", "подача"], answer: { text: "Календар подання заяв і підтвердження вибору визначається правилами вступної кампанії. Залиште контакт — приймальна комісія надішле актуальні дати саме для вашого рівня та програми.", link: { label: "Отримати календар вступу", href: "#consultation" } } },
  { words: ["адрес", "де", "контакт", "телефон", "коміс"], answer: { text: "Приймальна комісія працює за адресою: Київ, Кільцева дорога, 3-А. Телефон: +38 (044) 526-06-64. Ви також можете залишити запит на сторінці — команда відповість зручним для вас способом.", link: { label: "Залишити запит", href: "#consultation" } } },
];

const suggestions = ["Які документи потрібні?", "Скільки коштує навчання?", "Яка програма мені підійде?", "Чи є заочна форма?"];

function findAnswer(question: string): Answer {
  const normalized = question.toLocaleLowerCase("uk-UA");
  const ranked = knowledge.map((item) => ({ item, score: item.words.filter((word) => normalized.includes(word)).length })).sort((a, b) => b.score - a.score);
  if (ranked[0]?.score) return ranked[0].item.answer;
  return { text: "Я поки не знайшов точної відповіді у вступній базі. Опишіть ситуацію у формі нижче — команда приймальної комісії дасть персональну відповідь без здогадок.", link: { label: "Поставити запитання команді", href: "#consultation" } };
}

export function ApplicantAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: "Вітаю! Я цифровий помічник вступника. Запитайте про програми, документи, вартість або формат навчання." }]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  function ask(question: string) {
    const clean = question.trim();
    if (!clean) return;
    const answer = findAnswer(clean);
    setMessages((current) => [...current, { role: "user", text: clean }, { role: "assistant", text: answer.text, link: answer.link }]);
    setInput("");
  }
  function submit(event: FormEvent) { event.preventDefault(); ask(input); }

  return <div className={open ? "applicant-assistant open" : "applicant-assistant"}>
    {open && <div className="assistant-panel" role="dialog" aria-label="Цифровий помічник вступника">
      <div className="assistant-head"><div><span className="assistant-pulse" /><div><b>Помічник вступника</b><small>Відповідає на основі інформації Академії</small></div></div><button type="button" onClick={() => setOpen(false)} aria-label="Закрити помічника">×</button></div>
      <div className="assistant-messages" aria-live="polite">{messages.map((message, index) => <div className={`assistant-message ${message.role}`} key={`${message.role}-${index}`}><span>{message.role === "assistant" ? "АП" : "ВИ"}</span><div><p>{message.text}</p>{message.link && <Link href={message.link.href} onClick={() => setOpen(false)}>{message.link.label} →</Link>}</div></div>)}<div ref={endRef} /></div>
      {messages.length < 3 && <div className="assistant-suggestions">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => ask(suggestion)}>{suggestion}</button>)}</div>}
      <form className="assistant-input" onSubmit={submit}><label className="sr-only" htmlFor="applicant-question">Ваше запитання</label><input id="applicant-question" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Напишіть запитання…" autoComplete="off" /><button type="submit" aria-label="Надіслати запитання">↑</button></form>
    </div>}
    <button type="button" className="assistant-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}><span className="assistant-pulse" /><span>{open ? "Закрити" : "Запитати помічника"}</span><b>{open ? "×" : "AI"}</b></button>
  </div>;
}
