/**
 * Formats an ISO/API datetime for list tables (WordPress-style readable date).
 */
export function formatDateTime(
  value: string | null | undefined,
  locale: "en" | "ar" = "en",
): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const intlLocale = locale === "ar" ? "ar" : "en-US";

  const datePart = new Intl.DateTimeFormat(intlLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat(intlLocale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

  return locale === "ar" ? `${datePart} · ${timePart}` : `${datePart} at ${timePart}`;
}
