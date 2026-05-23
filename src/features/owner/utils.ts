export function formatOwnerDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function formatOwnerMoney(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function isSameCalendarDay(isoA: string, dateInput: string): boolean {
  const a = new Date(isoA);
  const b = new Date(`${dateInput}T12:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export const OWNER_ARENAS_DEFAULT_LIMIT = 10;

export function parseOwnerPositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function buildOwnerQueryString(
  basePath: string,
  params: Record<string, string | number | undefined | null>,
  defaults?: { page?: number; limit?: number }
): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query.set(key, String(value));
  }

  if (defaults?.page != null && query.get("page") === String(defaults.page)) {
    query.delete("page");
  }
  if (defaults?.limit != null && query.get("limit") === String(defaults.limit)) {
    query.delete("limit");
  }

  const suffix = query.toString();
  return suffix ? `${basePath}?${suffix}` : basePath;
}

export function todayDateInputValue(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
