"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { programs } from "@/lib/programs";

type Option = {
  label: string;
  note: string;
  tags: string[];
  boosts: string[];
};

const questions: { title: string; eyebrow: string; options: Option[] }[] = [
  {
    eyebrow: "Ваш інтерес",
    title: "Що хочеться змінювати своєю роботою?",
    options: [
      { label: "Добробут людей", note: "Підтримувати, консультувати, відновлювати", tags: ["люди", "підтримка", "допомога", "психологія"], boosts: ["psychology", "social-work"] },
      { label: "Бізнес і команди", note: "Розвивати організації, бренди та проєкти", tags: ["бізнес", "лідерство", "команди", "бренди"], boosts: ["management", "marketing", "trade"] },
      { label: "Справедливі правила", note: "Працювати з правом, політикою та громадами", tags: ["справедливість", "держава", "політика", "громади"], boosts: ["law", "public-administration"] },
      { label: "Нові проєкти", note: "Створювати сервіси, продукти та власні ініціативи", tags: ["організація", "підприємництво", "проєкти"], boosts: ["trade", "management", "professional-education"] },
    ],
  },
  {
    eyebrow: "Ваш спосіб мислення",
    title: "Який тип завдань заряджає вас найбільше?",
    options: [
      { label: "Слухати й допомагати", note: "Розбиратися в ситуації людини", tags: ["підтримка", "допомога", "люди"], boosts: ["psychology", "social-work"] },
      { label: "Аналізувати", note: "Шукати закономірності у цифрах і даних", tags: ["аналітика", "цифри", "інвестиції"], boosts: ["finance", "marketing"] },
      { label: "Аргументувати", note: "Захищати позицію та знаходити рішення", tags: ["аргументація", "справедливість", "держава"], boosts: ["law", "public-administration"] },
      { label: "Організовувати", note: "Збирати людей і ресурси навколо ідеї", tags: ["проєкти", "організація", "лідерство"], boosts: ["management", "trade", "public-administration", "professional-education"] },
    ],
  },
  {
    eyebrow: "Ваше середовище",
    title: "Де ви бачите себе після випуску?",
    options: [
      { label: "У компанії", note: "Команда, клієнти й вимірюваний результат", tags: ["бізнес", "бренди", "команди"], boosts: ["management", "marketing", "finance"] },
      { label: "У громаді або NGO", note: "Соціальні зміни та суспільна користь", tags: ["громади", "суспільство", "допомога"], boosts: ["social-work", "public-administration", "psychology"] },
      { label: "У правничій чи державній сфері", note: "Правила, інституції та публічні рішення", tags: ["держава", "політика", "справедливість"], boosts: ["law", "public-administration"] },
      { label: "У власному проєкті", note: "Свобода створювати й відповідати за результат", tags: ["підприємництво", "продажі", "організація"], boosts: ["trade", "management", "marketing"] },
    ],
  },
  {
    eyebrow: "Ваша сильна сторона",
    title: "За що до вас найчастіше звертаються інші?",
    options: [
      { label: "За підтримкою", note: "Ви уважні до людей та їхнього стану", tags: ["люди", "підтримка", "здоров’я"], boosts: ["psychology", "social-work"] },
      { label: "За порядком", note: "Ви бачите систему й тримаєте фокус", tags: ["аналітика", "управління", "логістика"], boosts: ["finance", "management", "trade"] },
      { label: "За сильними словами", note: "Ви пояснюєте, переконуєте й домовляєтесь", tags: ["бренди", "команди", "аргументація"], boosts: ["marketing", "law", "management"] },
      { label: "За новими ідеями", note: "Ви помічаєте можливості раніше за інших", tags: ["дослідження", "креативність", "інвестиції", "цифрові технології"], boosts: ["marketing", "finance", "psychology", "professional-education"] },
    ],
  },
];

export function ProgramFinder({ index = "02 / Тест на програму" }: { index?: string }) {
  const [answers, setAnswers] = useState<Option[]>([]);
  const [step, setStep] = useState(0);

  const result = useMemo(() => {
    const chosenTags = answers.flatMap((answer) => answer.tags);
    return programs
      .map((program) => {
        const tagScore = chosenTags.filter((tag) => program.tags.includes(tag)).length * 2;
        const boostScore = answers.filter((answer) => answer.boosts.includes(program.slug)).length * 4;
        return { program, score: tagScore + boostScore };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item, position, all) => ({
        ...item,
        fit: Math.max(68, Math.min(96, 88 - position * 8 + item.score - (all[0]?.score || 0))),
      }));
  }, [answers]);

  const choose = (option: Option) => {
    setAnswers((current) => [...current, option]);
    setStep((current) => current + 1);
  };
  const back = () => {
    setAnswers((current) => current.slice(0, -1));
    setStep((current) => Math.max(0, current - 1));
  };
  const reset = () => {
    setAnswers([]);
    setStep(0);
  };

  return <section id="test" className="finder-section"><div className="wrap"><div className="idx">{index}</div><div className="finder-shell">
    {step < questions.length ? <>
      <div className="finder-progress" aria-label={`Питання ${step + 1} з ${questions.length}`}><span style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
      <div className="finder-meta"><span className="mono">{questions[step].eyebrow}</span><span className="mono">{step + 1} / {questions.length}</span></div>
      <h2>{questions[step].title}</h2>
      <div className="finder-options">{questions[step].options.map((option) => <button type="button" onClick={() => choose(option)} key={option.label}><span><b>{option.label}</b><small>{option.note}</small></span><strong>→</strong></button>)}</div>
      {step > 0 && <button className="finder-back" type="button" onClick={back}>← Назад</button>}
    </> : <>
      <div className="mono">Ваш персональний результат</div><h2>Напрями, що пасують вам</h2>
      <p className="finder-summary">Тест врахував ваші інтереси, спосіб мислення та бажане середовище. Відкрийте програму, щоб побачити навчальний план, вартість і кар’єрні можливості.</p>
      <div className="finder-results">{result.map(({ program, fit }, index) => <Link href={`/programs/${program.slug}`} key={program.slug}><span>0{index + 1}</span><div><b>{program.title}</b><small>{program.short}</small></div><em>{fit}% збіг</em><strong>→</strong></Link>)}</div>
      <div className="finder-actions"><button className="finder-reset" type="button" onClick={reset}>Пройти ще раз</button><Link className="cta" href="/admissions#consultation"><span>Обговорити результат</span></Link></div>
    </>}
  </div></div></section>;
}
