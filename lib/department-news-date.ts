export function departmentPublicationDate(entry: { date: string; createdAt?: string; publishedAt?: string; hideDate?: boolean }, includeHidden = false) {
  if (entry.hideDate && !includeHidden) return null;
  const dateTime = entry.date || entry.publishedAt || entry.createdAt || "";
  if (!dateTime) return null;
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(dateTime) ? `${dateTime}T12:00:00Z` : dateTime);
  if (!Number.isFinite(date.getTime())) return null;
  return { dateTime, label: new Intl.DateTimeFormat("uk-UA", { day: "2-digit", month: "long", year: "numeric", timeZone: "Europe/Kyiv" }).format(date) };
}

export function departmentPublishedAt(status: string, existing?: { status: string; publishedAt?: string; createdAt: string }): string {
  if (existing?.publishedAt) return existing.publishedAt;
  if (existing?.status === "published") return existing.createdAt;
  return status === "published" ? new Date().toISOString() : "";
}
