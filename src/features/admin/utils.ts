import type { AdminListParams, AdminPaginationMeta } from "@/features/admin/types";

export const ADMIN_DEFAULT_LIMIT = 10;

export function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function normalizeAdminMeta(
  meta: Record<string, unknown> | undefined,
  params: AdminListParams,
  dataLength: number
): AdminPaginationMeta {
  return {
    page: Number(meta?.page ?? params.page ?? 1),
    limit: Number(meta?.limit ?? params.limit ?? ADMIN_DEFAULT_LIMIT),
    total: Number(meta?.total ?? dataLength)
  };
}

export function buildAdminQueryString(
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

export function formatAdminDateTime(value: string | null | undefined): string {
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

export function formatAdminMoney(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}
