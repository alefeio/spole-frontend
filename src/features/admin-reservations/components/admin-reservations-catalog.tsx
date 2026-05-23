"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AdminFilterField,
  AdminFiltersBar,
  adminInputClassName,
  adminSelectClassName
} from "@/features/admin/components/admin-filters-bar";
import { AdminListShell } from "@/features/admin/components/admin-list-shell";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { useAdminReservations } from "@/features/admin-reservations/hooks";
import type { AdminReservationsListParams } from "@/features/admin-reservations/types";
import {
  ADMIN_DEFAULT_LIMIT,
  buildAdminQueryString,
  formatAdminDateTime,
  parsePositiveInt
} from "@/features/admin/utils";

const BASE = "/admin/reservations";

function parseParams(searchParams: URLSearchParams): AdminReservationsListParams {
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  return {
    page: parsePositiveInt(searchParams.get("page"), 1),
    limit: parsePositiveInt(searchParams.get("limit"), ADMIN_DEFAULT_LIMIT),
    status:
      status === "PENDING" ||
      status === "CONFIRMED" ||
      status === "CANCELLED" ||
      status === "CONSUMED"
        ? status
        : undefined,
    type: type === "SINGLE" || type === "RECURRING" ? type : undefined,
    organizerId: searchParams.get("organizerId") || undefined
  };
}

export function AdminReservationsCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => parseParams(searchParams), [searchParams]);
  const query = useAdminReservations(params);

  function updateUrl(next: Partial<AdminReservationsListParams>) {
    router.push(
      buildAdminQueryString(BASE, { ...params, ...next }, { page: 1, limit: ADMIN_DEFAULT_LIMIT })
    );
  }

  const hasFilters = Boolean(params.status || params.type || params.organizerId);

  return (
    <div className="space-y-6 overflow-x-hidden">
      <AdminPageHeader title="Reservas" description="Listagem operacional somente leitura." />

      <AdminFiltersBar hasFilters={hasFilters} onClear={() => router.push(BASE)}>
        <AdminFilterField label="Organizador (ID)" htmlFor="admin-res-organizer">
          <input
            id="admin-res-organizer"
            className={adminInputClassName}
            defaultValue={params.organizerId ?? ""}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (params.organizerId ?? ""))
                updateUrl({ organizerId: v || undefined, page: 1 });
            }}
          />
        </AdminFilterField>
        <AdminFilterField label="Status" htmlFor="admin-res-status">
          <select
            id="admin-res-status"
            className={adminSelectClassName}
            value={params.status ?? ""}
            onChange={(e) =>
              updateUrl({
                status: (e.target.value || undefined) as AdminReservationsListParams["status"],
                page: 1
              })
            }
          >
            <option value="">Todos</option>
            <option value="PENDING">Pendente</option>
            <option value="CONFIRMED">Confirmada</option>
            <option value="CANCELLED">Cancelada</option>
            <option value="CONSUMED">Consumida</option>
          </select>
        </AdminFilterField>
        <AdminFilterField label="Tipo" htmlFor="admin-res-type">
          <select
            id="admin-res-type"
            className={adminSelectClassName}
            value={params.type ?? ""}
            onChange={(e) =>
              updateUrl({
                type: (e.target.value || undefined) as AdminReservationsListParams["type"],
                page: 1
              })
            }
          >
            <option value="">Todos</option>
            <option value="SINGLE">Única</option>
            <option value="RECURRING">Recorrente</option>
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
          {(query.data?.data ?? []).map((item) => (
            <li key={item.id}>
              <article className="space-y-3 rounded-xl border p-4">
                <Badge variant="outline">{item.status}</Badge>
                <p className="text-muted-foreground text-sm">{item.type}</p>
                <p className="font-mono text-xs break-all">Slot: {item.slotId}</p>
                <p className="font-mono text-xs break-all">Organizador: {item.organizerId}</p>
                <p className="text-muted-foreground text-xs">
                  {formatAdminDateTime(item.createdAt)}
                </p>
                <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
                  <Link href={`${BASE}/${item.id}`}>Ver detalhe</Link>
                </Button>
              </article>
            </li>
          ))}
        </ul>
      </AdminListShell>
    </div>
  );
}
