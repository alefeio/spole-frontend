"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AdminFilterField,
  AdminFiltersBar,
  adminInputClassName,
  adminSelectClassName
} from "@/features/admin/components/admin-filters-bar";
import { AdminListShell } from "@/features/admin/components/admin-list-shell";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminReasonDialog } from "@/features/admin/components/admin-reason-dialog";
import { useAdminEvents, usePatchAdminEventStatus } from "@/features/admin-events/hooks";
import type { AdminEventsListParams } from "@/features/admin-events/types";
import { EventStatusBadge } from "@/features/events/components/event-status-badge";
import type { EventStatus, EventType } from "@/features/events/types";
import {
  ADMIN_DEFAULT_LIMIT,
  buildAdminQueryString,
  formatAdminDateTime,
  parsePositiveInt
} from "@/features/admin/utils";
import { getApiErrorMessage } from "@/lib/api/error-messages";

const BASE = "/admin/events";

function parseParams(searchParams: URLSearchParams): AdminEventsListParams {
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  return {
    page: parsePositiveInt(searchParams.get("page"), 1),
    limit: parsePositiveInt(searchParams.get("limit"), ADMIN_DEFAULT_LIMIT),
    status:
      status === "DRAFT" || status === "PUBLISHED" || status === "CANCELLED" ? status : undefined,
    type: type === "FREE" || type === "PAID" ? type : undefined,
    organizerId: searchParams.get("organizerId") || undefined,
    city: searchParams.get("city") || undefined
  };
}

export function AdminEventsCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => parseParams(searchParams), [searchParams]);
  const query = useAdminEvents(params);
  const patchMutation = usePatchAdminEventStatus();
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  function updateUrl(next: Partial<AdminEventsListParams>) {
    router.push(
      buildAdminQueryString(BASE, { ...params, ...next }, { page: 1, limit: ADMIN_DEFAULT_LIMIT })
    );
  }

  const hasFilters = Boolean(params.status || params.type || params.organizerId || params.city);

  function handleCancelConfirm(reason: string) {
    if (!cancelId) return;
    setActionMessage(null);
    patchMutation.mutate(
      { eventId: cancelId, payload: { status: "CANCELLED", reason } },
      {
        onSuccess: () => {
          setCancelId(null);
          setActionMessage("Evento cancelado.");
        },
        onError: (error) => setActionMessage(getApiErrorMessage(error))
      }
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <AdminPageHeader
        title="Eventos"
        description="Listagem operacional. Cancelamento administrativo exige motivo."
      />

      {cancelId ? (
        <AdminReasonDialog
          title="Cancelar evento"
          description="O evento será marcado como cancelado. Esta ação é irreversível pelo admin."
          confirmLabel="Cancelar evento"
          isPending={patchMutation.isPending}
          onConfirm={handleCancelConfirm}
          onCancel={() => setCancelId(null)}
        />
      ) : null}

      {actionMessage ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
          {actionMessage}
        </p>
      ) : null}

      <AdminFiltersBar hasFilters={hasFilters} onClear={() => router.push(BASE)}>
        <AdminFilterField label="Cidade" htmlFor="admin-events-city">
          <input
            id="admin-events-city"
            className={adminInputClassName}
            defaultValue={params.city ?? ""}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (params.city ?? "")) updateUrl({ city: v || undefined, page: 1 });
            }}
          />
        </AdminFilterField>
        <AdminFilterField label="Organizador (ID)" htmlFor="admin-events-organizer">
          <input
            id="admin-events-organizer"
            className={adminInputClassName}
            defaultValue={params.organizerId ?? ""}
            placeholder="UUID"
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (params.organizerId ?? ""))
                updateUrl({ organizerId: v || undefined, page: 1 });
            }}
          />
        </AdminFilterField>
        <AdminFilterField label="Status" htmlFor="admin-events-status">
          <select
            id="admin-events-status"
            className={adminSelectClassName}
            value={params.status ?? ""}
            onChange={(e) =>
              updateUrl({
                status: (e.target.value || undefined) as EventStatus | undefined,
                page: 1
              })
            }
          >
            <option value="">Todos</option>
            <option value="DRAFT">Rascunho</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </AdminFilterField>
        <AdminFilterField label="Tipo" htmlFor="admin-events-type">
          <select
            id="admin-events-type"
            className={adminSelectClassName}
            value={params.type ?? ""}
            onChange={(e) =>
              updateUrl({ type: (e.target.value || undefined) as EventType | undefined, page: 1 })
            }
          >
            <option value="">Todos</option>
            <option value="FREE">Gratuito</option>
            <option value="PAID">Pago</option>
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
          {(query.data?.data ?? []).map((event) => (
            <li key={event.id}>
              <article className="space-y-3 rounded-xl border p-4">
                <div className="flex flex-wrap gap-2">
                  <EventStatusBadge status={event.status} />
                  <span className="text-muted-foreground text-xs">{event.type}</span>
                </div>
                <h2 className="font-semibold">{event.title}</h2>
                <p className="text-muted-foreground text-sm">
                  {event.city} · {formatAdminDateTime(event.startAt)}
                </p>
                <p className="text-muted-foreground font-mono text-xs break-all">
                  Organizador: {event.organizerId}
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
                    <Link href={`${BASE}/${event.id}`}>Ver detalhe</Link>
                  </Button>
                  {event.status !== "CANCELLED" ? (
                    <Button
                      type="button"
                      variant="destructive"
                      className="min-h-11 w-full sm:w-auto"
                      onClick={() => setCancelId(event.id)}
                    >
                      Cancelar
                    </Button>
                  ) : null}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </AdminListShell>
    </div>
  );
}
