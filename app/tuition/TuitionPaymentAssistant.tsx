"use client";

import { useMemo, useState } from "react";

const RECEIVER = "Академія праці, соціальних відносин і туризму";
const EDRPOU = "04641405";
const IBAN = "UA673052990000026005006704535";
const BANK = 'АТ КБ "ПРИВАТБАНК"';

const rateGroups = {
  bachelor: {
    label: "Бакалаврат — більшість програм",
    full: { year: 38600, semester: 19300, month: 3860 },
    part: { year: 30900, semester: 15450, month: 3090 },
  },
  master: {
    label: "Магістратура — перший рік",
    full: { year: 43500, semester: 21750, month: 4350 },
    part: { year: 34800, semester: 17400, month: 3480 },
  },
} as const;

const periodLabels = { year: "навчальний рік", semester: "семестр", month: "місяць" } as const;

function money(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value);
}

export function TuitionPaymentAssistant() {
  const [group, setGroup] = useState<keyof typeof rateGroups>("bachelor");
  const [form, setForm] = useState<"full" | "part">("full");
  const [period, setPeriod] = useState<keyof typeof periodLabels>("semester");
  const [student, setStudent] = useState("");
  const [contract, setContract] = useState("");
  const [copied, setCopied] = useState("");

  const amount = rateGroups[group][form][period];
  const purpose = useMemo(() => {
    const details = [
      "Оплата за навчання",
      student.trim() ? `ПІБ: ${student.trim()}` : "ПІБ студента: [вкажіть]",
      contract.trim() ? `договір № ${contract.trim()}` : "договір № [вкажіть за наявності]",
      `${periodLabels[period]}, 2026/27 н. р.`,
    ];
    return details.join(", ");
  }, [contract, period, student]);

  const allDetails = [
    `Отримувач: ${RECEIVER}`,
    `Код ЄДРПОУ: ${EDRPOU}`,
    `IBAN: ${IBAN}`,
    `Банк: ${BANK}`,
    `Сума: ${money(amount)} грн`,
    `Призначення платежу: ${purpose}`,
  ].join("\n");

  async function copy(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setCopied("error");
    }
  }

  return (
    <div className="payment-assistant" id="calculator">
      <div className="payment-assistant-form">
        <span className="mono">Дані платежу</span>
        <h3>Підготуйте реквізити</h3>
        <p>Оберіть тариф, форму навчання та період. Сайт сформує суму й призначення платежу для вашого банку.</p>

        <div className="payment-field">
          <label htmlFor="payment-program">Рівень і програма</label>
          <select id="payment-program" value={group} onChange={(event) => setGroup(event.target.value as keyof typeof rateGroups)}>
            {Object.entries(rateGroups).map(([key, value]) => <option value={key} key={key}>{value.label}</option>)}
          </select>
        </div>
        <div className="payment-field-row">
          <div className="payment-field">
            <label htmlFor="payment-form">Форма навчання</label>
            <select id="payment-form" value={form} onChange={(event) => setForm(event.target.value as "full" | "part")}>
              <option value="full">Денна</option>
              <option value="part">Заочна</option>
            </select>
          </div>
          <div className="payment-field">
            <label htmlFor="payment-period">Період</label>
            <select id="payment-period" value={period} onChange={(event) => setPeriod(event.target.value as keyof typeof periodLabels)}>
              <option value="year">Навчальний рік</option>
              <option value="semester">Семестр</option>
              <option value="month">Місяць</option>
            </select>
          </div>
        </div>
        <div className="payment-field-row">
          <div className="payment-field">
            <label htmlFor="payment-student">ПІБ студента</label>
            <input id="payment-student" value={student} onChange={(event) => setStudent(event.target.value)} placeholder="Наприклад, Іваненко Іван" />
          </div>
          <div className="payment-field">
            <label htmlFor="payment-contract">Номер договору</label>
            <input id="payment-contract" value={contract} onChange={(event) => setContract(event.target.value)} placeholder="Якщо вже відомий" />
          </div>
        </div>
      </div>

      <div className="payment-receipt" aria-live="polite">
        <span className="mono">Готово для банку</span>
        <div className="payment-amount"><small>До сплати за {periodLabels[period]}</small><b>{money(amount)} <i>грн</i></b></div>
        <dl>
          <div><dt>Отримувач</dt><dd>{RECEIVER}</dd><button type="button" onClick={() => copy(RECEIVER, "receiver")}>{copied === "receiver" ? "Скопійовано" : "Копіювати"}</button></div>
          <div><dt>Код ЄДРПОУ</dt><dd>{EDRPOU}</dd><button type="button" onClick={() => copy(EDRPOU, "edrpou")}>{copied === "edrpou" ? "Скопійовано" : "Копіювати"}</button></div>
          <div><dt>IBAN</dt><dd>{IBAN}</dd><button type="button" onClick={() => copy(IBAN, "iban")}>{copied === "iban" ? "Скопійовано" : "Копіювати"}</button></div>
          <div><dt>Банк</dt><dd>{BANK}</dd></div>
          <div className="payment-purpose"><dt>Призначення платежу</dt><dd>{purpose}</dd><button type="button" onClick={() => copy(purpose, "purpose")}>{copied === "purpose" ? "Скопійовано" : "Копіювати"}</button></div>
        </dl>
        <button className="payment-copy-all" type="button" onClick={() => copy(allDetails, "all")}>
          {copied === "all" ? "Реквізити скопійовано ✓" : "Скопіювати всі реквізити"}
        </button>
        {copied === "error" && <p className="payment-copy-error">Не вдалося скопіювати автоматично. Виділіть реквізити вручну.</p>}
        <a className="payment-pay-now" href="https://www.portmone.com.ua/r3/oplata-osvity-akademiia-pratsi-sotsialnykh-vidnosyn-i-turyzmu-kyiv" target="_blank" rel="noreferrer">Оплатити навчання через Portmone ↗</a>
        <small className="payment-bank-hint"><b>Отримувач уже заповнений.</b> На офіційній сторінці АПСВТ у Portmone вже вказані назва Академії, IBAN та ЄДРПОУ. Перенесіть сформовані вище суму й дані студента та перевірте їх перед оплатою. Комісія Portmone — 2%, але не менше 3 грн.</small>
        <a className="payment-bank-link" href="https://privatbank.ua/cpa/mobile-p24-payments" target="_blank" rel="noreferrer">Альтернатива: оплата за IBAN у Privat24 ↗</a>
        <small className="payment-check">Перед підтвердженням звірте отримувача, IBAN, суму й призначення у своєму банку.</small>
      </div>
    </div>
  );
}
