export type FeedbackInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
  website: string;
};

export function parseFeedback(value: unknown): FeedbackInput | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";
  if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !subject || subject.length > 160 || message.length < 10 || message.length > 5000 || body.consent !== true) return null;
  return { name, email, subject, message, consent: true, website };
}
