"use client";

import { FormEvent, useState } from "react";

type Answer = {
  status: "found" | "not_found";
  answer: string;
  confidence: "high" | "medium" | "low";
  sources: Array<{
    id: string;
    title: string;
    page: number | null;
    href: string;
    excerpt: string;
  }>;
};

const examples = [
  "Як поновитися після перерви у навчанні?",
  "Який порядок перевірки роботи на плагіат?",
  "Як подати апеляцію на результат вступного випробування?",
  "Що робити у випадку булінгу або харасменту?",
];

export function DocumentsAssistant() {
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
      const response = await fetch("/api/documents/ask", {
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

  return <section className="documents-rag" id="assistant"><div className="wrap">
    <div className="documents-rag-head">
      <div><div className="idx">03 / RAG-помічник</div><h2>Запитайте.<br />Перевірте джерело.</h2></div>
      <div><b>27 документів · 438 фрагментів</b><p>Помічник не шукає відповідь у відкритому інтернеті — тільки у відібраних офіційних документах Академії.</p></div>
    </div>

    <div className="documents-rag-grid">
      <form className="documents-rag-form" onSubmit={ask}>
        <label htmlFor="documents-question">Ваше питання</label>
        <textarea id="documents-question" value={question} onChange={(event) => setQuestion(event.target.value)} rows={5} maxLength={600} placeholder="Опишіть ситуацію звичайними словами…" />
        <button type="submit" disabled={loading || question.trim().length < 3}>{loading ? "Шукаю у документах…" : "Знайти відповідь →"}</button>
        <div className="documents-rag-examples"><span>Підказки</span>{examples.map((example) => <button type="button" onClick={() => applyExample(example)} key={example}>{example}</button>)}</div>
        <p>Запитання не зберігається і не передається стороннім сервісам.</p>
      </form>

      <div className={`documents-rag-result ${answer ? "has-answer" : ""}`} aria-live="polite">
        {!answer && !error && <div className="documents-rag-empty"><span>RAG</span><div><b>Відповідь із доказом</b><p>Система знайде релевантний фрагмент, покаже рівень впевненості та дасть пряме посилання на документ.</p></div></div>}
        {error && <div className="documents-rag-message"><b>Пошук тимчасово недоступний</b><p>{error}</p></div>}
        {answer?.status === "not_found" && <div className="documents-rag-message"><b>Підтвердження не знайдено</b><p>{answer.answer}</p><a href="/contacts">Звернутися до Академії →</a></div>}
        {answer?.status === "found" && <div className="documents-rag-answer">
          <div className="documents-rag-answer-head"><span>Знайдено в документі</span><small>Впевненість: {answer.confidence === "high" ? "висока" : answer.confidence === "medium" ? "середня" : "потребує перевірки"}</small></div>
          <p>{answer.answer}</p>
          <div className="documents-rag-sources"><b>Перевірити джерела</b>{answer.sources.map((source, index) => <a href={source.href} target="_blank" rel="noreferrer" key={source.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{source.title}</strong><small>{source.page ? `Сторінка ${source.page} · ` : ""}відкрити документ ↗</small></div></a>)}</div>
        </div>}
      </div>
    </div>
    <p className="documents-rag-disclaimer">Помічник дає інформаційний витяг, а не юридичну консультацію. Для рішення у конкретній ситуації перевірте повний текст документа та зверніться до відповідального підрозділу Академії.</p>
  </div></section>;
}
