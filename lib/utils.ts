// lib/utils.ts
// Utility functions for formatting and data manipulation

/**
 * Format a number as Indian currency (₹)
 */
export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Get badge color classes based on status
 */
export function getStatusClasses(status: string): string {
  switch (status) {
    case "Clear":
    case "Verified":
    case "Closed":
    case "Paid":
    case "Active":
      return "bg-green-100 text-green-800 border-green-200";
    case "Under Loan":
    case "Pending":
    case "Mortgaged":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Disputed":
    case "Rejected":
    case "Defaulted":
    case "Overdue":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

/**
 * Truncate long text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Filter array by search query on multiple fields
 */
export function filterBySearch<T extends Record<string, unknown>>(
  data: T[],
  query: string,
  fields: (keyof T)[]
): T[] {
  if (!query.trim()) return data;
  const q = query.toLowerCase();
  return data.filter((item) =>
    fields.some((field) => String(item[field]).toLowerCase().includes(q))
  );
}

/**
 * Sort array by field
 */
export function sortBy<T>(
  data: T[],
  field: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Paginate array
 */
export function paginate<T>(data: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return data.slice(start, start + perPage);
}

/**
 * Get file icon emoji based on format
 */
export function getFileIcon(format: string): string {
  switch (format.toUpperCase()) {
    case "PDF":
      return "📄";
    case "JPG":
    case "PNG":
      return "🖼️";
    case "DOCX":
      return "📝";
    default:
      return "📎";
  }
}
