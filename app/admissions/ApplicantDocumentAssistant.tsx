"use client";

import { FormEvent, useState } from "react";

type Answer = {
  status: "found" | "not_found";
  answer: string;
  confidence: "high" | "medium" | "low";
  sources: Array<{
    id: string;
    title: string;
    page: number;
    href: string;
    excerpt: string;
  }>;
};

const examples = [
  "Як і коли подати апеляцію?",
  "Які правила вступу для іноземців?",
  "Як проходить дистанційне вступне випробування?",
  "Які умови передбачені для вступників з особливими освітніми потребами?",
];

export function ApplicantDocumentAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask(event?: FormEvent) {
    event?.preventDefault();
    if (question.trim().length < 3 || loading) return;
    setLoading(true);
    setError("");
    setAnswer(null);
    try {
      const response = await fetch("/api/admissions/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не вдалося виконати пошук.");
      setAnswer(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Не вдалося виконати пошук.");
    } finally {
      setLoading(false);
    }
  }

  function applyExample(example: string) {
    setQuestion(example);
    setAnswer(null);
    setError("");
  }

  return <section className="applicant-rag" id="document-assistant"><div className="wrap">
    <div className="applicant-rag-intro">
      <div><div className="idx">05 / Помічник за документами</div><h2>Запитайте.<br />Отримайте джерело.</h2></div>
      <div className="applicant-rag-explainer"><b>RAG · 11 документів · 150 сторінок</b><p>Помічник шукає тільки в опублікованих правилах, положеннях і порядках. Кожна відповідь веде на сторінку офіційного PDF.</p></div>
    </div>

    <div className="applicant-rag-grid">
      <form className="applicant-rag-form" onSubmit={ask}>
        <label htmlFor="applicant-question">Ваше запитання про вступ</label>
        <div className="applicant-rag-input">
          <textarea id="applicant-question" value={question} onChange={(event) => setQuestion(event.target.value)} rows={4} maxLength={600} placeholder="Наприклад: у який строк можна подати апеляцію?" />
          <button type="submit" disabled={loading || question.trim().length < 3}>{loading ? "Шукаю…" : "Знайти відповідь →"}</button>
        </div>
        <div className="applicant-rag-examples"><span>Підказки:</span>{examples.map((example) => <button type="button" onClick={() => applyExample(example)} key={example}>{example}</button>)}</div>
        <p className="applicant-rag-privacy">Запитання не зберігається та не передається стороннім сервісам.</p>
      </form>

      <div className={`applicant-rag-result ${answer ? "has-answer" : ""}`} aria-live="polite">
        {!answer && !error && <div className="applicant-rag-empty"><span>?</span><div><b>Як це працює</b><ol><li>Напишіть питання звичайними словами.</li><li>Помічник знайде найточніші фрагменти.</li><li>Перевірте відповідь у PDF за посиланням.</li></ol></div></div>}
        {error && <div className="applicant-rag-error"><b>Пошук тимчасово недоступний</b><p>{error}</p></div>}
        {answer?.status === "not_found" && <div className="applicant-rag-not-found"><span>!</span><div><b>Підтвердження не знайдено</b><p>{answer.answer}</p><a href="#consultation">Запитати Приймальну комісію →</a></div></div>}
        {answer?.status === "found" && <div className="applicant-rag-answer">
          <div className="applicant-rag-answer-head"><span>Відповідь із документа</span><small>Впевненість: {answer.confidence === "high" ? "висока" : answer.confidence === "medium" ? "середня" : "потребує перевірки"}</small></div>
          <p>{answer.answer}</p>
          <div className="applicant-rag-sources"><b>Джерела</b>{answer.sources.map((source, index) => <a href={source.href} target="_blank" rel="noreferrer" key={source.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{source.title}</strong><small>Сторінка {source.page} · відкрити PDF ↗</small></div></a>)}</div>
        </div>}
      </div>
    </div>
    <p className="applicant-rag-disclaimer">Розпізнавання сканів може містити неточності. Остаточним джерелом є текст відкритого PDF та офіційне роз’яснення Приймальної комісії.</p>
  </div></section>;
}
