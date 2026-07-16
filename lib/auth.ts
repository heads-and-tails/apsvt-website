import { getChatGPTUser } from "@/app/chatgpt-auth";

export const PUBLISHER_EMAIL = "vportnaia@kse.org.ua";

export type Publisher = { email: string; displayName: string };

export async function getPublisher(): Promise<Publisher | null> {
  const user = await getChatGPTUser();
  if (user?.email.toLowerCase() === PUBLISHER_EMAIL) {
    return { email: user.email, displayName: user.displayName };
  }

  if (!user && process.env.NODE_ENV === "development") {
    return { email: PUBLISHER_EMAIL, displayName: "Victoria · local preview" };
  }

  return null;
}

export async function requirePublisher(): Promise<Publisher> {
  const publisher = await getPublisher();
  if (!publisher) throw new Error("UNAUTHORIZED");
  return publisher;
}
