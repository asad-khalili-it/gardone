/**
 * Generate a unique discount code in the format SLUG-XXXX-XXXX
 */
export function generateDiscountCode(storeSlug: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const slug = storeSlug.toUpperCase().slice(0, 8);
  return `${slug}-${part1}-${part2}`;
}

/**
 * Format a date in Persian-friendly format (YYYY/MM/DD HH:mm)
 */
export function formatPersianDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return date.toLocaleString("fa-IR");
  }
}

/**
 * Validate an Iranian phone number (09xxxxxxxxx)
 */
export function validateIranianPhone(phone: string): boolean {
  return /^09\d{9}$/.test(phone);
}

/**
 * Slugify a Persian/English string for URL usage
 */
export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
