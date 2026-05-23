"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  AdminFilterField,
  AdminFiltersBar,
  adminInputClassName,
  adminSelectClassName
} from "@/features/admin/components/admin-filters-bar";
import { AdminListShell } from "@/features/admin/components/admin-list-shell";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { useAdminBookings } from "@/features/admin-bookings/hooks";
import type { AdminBookingsListParams } from "@/features/admin-bookings/types";
import {
  ADMIN_DEFAULT_LIMIT,
  buildAdminQueryString,
  formatAdminDateTime,
  parsePositiveInt
} from "@/features/admin/utils";

const BASE = "/admin/bookings";

function parseParams(searchParams: URLSearchParams): AdminBookingsListParams {
  const status = searchParams.get("status");
  return {
    page: parsePositiveInt(searchParams.get("page"), 1),
    limit: parsePositiveInt(searchParams.get("limit"), ADMIN_DEFAULT_LIMIT),
    status:
      status === "RESERVED" ||
      status === "EXPIRED" ||
      status === "CANCELLED" ||
      status === "COMPLETED"
        ? status
        : undefined,
    userId: searchParams.get("userId") || undefined,
    eventId: searchParams.get("eventId") || undefined
  };
}

export function AdminBookingsCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => parseParams(searchParams), [searchParams]);
  const query = useAdminBookings(params);

  function updateUrl(next: Partial<AdminBookingsListParams>) {
    router.push(
      buildAdminQueryString(BASE, { ...params, ...next }, { page: 1, limit: ADMIN_DEFAULT_LIMIT })
    );
  }

  const hasFilters = Boolean(params.status || params.userId || params.eventId);

  return (
    <div className="space-y-6 overflow-x-hidden">
      <AdminPageHeader
        title="Bookings"
        description="Inscrições em eventos pagos — somente leitura operacional."
      />

      <AdminFiltersBar hasFilters={hasFilters} onClear={() => router.push(BASE)}>
        <AdminFilterField label="Usuário (ID)" htmlFor="admin-book-user">
          <input
            id="admin-book-user"
            className={adminInputClassName}
            defaultValue={params.userId ?? ""}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (params.userId ?? "")) updateUrl({ userId: v || undefined, page: 1 });
            }}
          />
        </AdminFilterField>
        <AdminFilterField label="Evento (ID)" htmlFor="admin-book-event">
          <input
            id="admin-book-event"
            className={adminInputClassName}
            defaultValue={params.eventId ?? ""}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (params.eventId ?? "")) updateUrl({ eventId: v || undefined, page: 1 });
            }}
          />
        </AdminFilterField>
        <AdminFilterField label="Status" htmlFor="admin-book-status">
          <select
            id="admin-book-status"
            className={adminSelectClassName}
            value={params.status ?? ""}
            onChange={(e) =>
              updateUrl({
                status: (e.target.value || undefined) as AdminBookingsListParams["status"],
                page: 1
              })
            }
          >
            <option value="">Todos</option>
            <option value="RESERVED">Reservado</option>
            <option value="EXPIRED">Expirado</option>
            <option value="CANCELLED">Cancelado</option>
            <option value="COMPLETED">Concluído</option>
          </select>
        </AdminFilterField>
      </AdminFiltersBar>

      <AdminListShell
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error}
        isSuccess={query.isSuccess}
        items={query.data?.data ?? []}
        meta={query.data?.meta}
        hasFilters={hasFilters}
        onRetry={() => void query.refetch()}
        onClearFilters={() => router.push(BASE)}
        onPageChange={(page) => updateUrl({ page })}
      >
        <ul className="space-y-3">
          {(query.data?.data ?? []).map((booking) => (
            <li key={booking.id}>
              <article className="space-y-3 rounded-xl border p-4">
                <Badge variant="outline">{booking.status}</Badge>
                <p className="font-mono text-xs break-all">ID: {booking.id}</p>
                <p className="font-mono text-xs break-all">Evento: {booking.eventId}</p>
                <p className="font-mono text-xs break-all">Usuário: {booking.userId}</p>
                <p className="text-muted-foreground text-xs">
                  Expira: {formatAdminDateTime(booking.expiresAt)} · Criado:{" "}
                  {formatAdminDateTime(booking.createdAt)}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </AdminListShell>
    </div>
  );
}
