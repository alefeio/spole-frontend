"use client";

import { AdminEmptyState } from "@/features/admin/components/admin-empty-state";
import { AdminErrorState } from "@/features/admin/components/admin-error-state";
import { AdminPagination } from "@/features/admin/components/admin-pagination";
import type { AdminPaginationMeta } from "@/features/admin/types";

type AdminListShellProps<T> = {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isSuccess: boolean;
  items: T[];
  meta?: AdminPaginationMeta;
  hasFilters?: boolean;
  onRetry?: () => void;
  onClearFilters?: () => void;
  onPageChange?: (page: number) => void;
  skeleton?: React.ReactNode;
  children: React.ReactNode;
};

export function AdminListShell<T>({
  isLoading,
  isError,
  error,
  isSuccess,
  items,
  meta,
  hasFilters,
  onRetry,
  onClearFilters,
  onPageChange,
  skeleton,
  children
}: AdminListShellProps<T>) {
  return (
    <div className="space-y-6 overflow-x-hidden">
      {isLoading
        ? (skeleton ?? <p className="text-muted-foreground text-sm">Carregando…</p>)
        : null}
      {isError ? <AdminErrorState error={error} onRetry={onRetry} /> : null}
      {isSuccess && items.length === 0 ? (
        <AdminEmptyState onClearFilters={hasFilters ? onClearFilters : undefined} />
      ) : null}
      {isSuccess && items.length > 0 ? (
        <>
          {children}
          {meta && onPageChange ? (
            <AdminPagination meta={meta} onPageChange={onPageChange} />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
