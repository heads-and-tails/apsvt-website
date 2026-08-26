type ErrorPayload = { error?: string };

export class ClientRequestError extends Error {
  status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "ClientRequestError";
    this.status = status;
  }
}

export async function requestJson<T>(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = 20_000,
): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, { ...init, signal: init.signal || controller.signal });
    const raw = await response.text();
    let payload: T & ErrorPayload;

    try {
      payload = (raw ? JSON.parse(raw) : {}) as T & ErrorPayload;
    } catch {
      throw new ClientRequestError(
        response.ok
          ? "Сервер повернув некоректну відповідь. Оновіть сторінку й спробуйте ще раз."
          : `Сервер не зміг виконати запит (код ${response.status}).`,
        response.status,
      );
    }

    if (!response.ok) {
      throw new ClientRequestError(
        payload.error || `Не вдалося виконати запит (код ${response.status}).`,
        response.status,
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof ClientRequestError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ClientRequestError("Сервер не відповідає. Чернетку не втрачено — спробуйте зберегти ще раз.");
    }
    throw new ClientRequestError("Не вдалося з’єднатися із сервером. Перевірте інтернет і повторіть збереження.");
  } finally {
    window.clearTimeout(timeout);
  }
}
