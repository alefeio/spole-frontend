"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
import { AdminReasonDialog } from "@/features/admin/components/admin-reason-dialog";
import { useAdminArenas, usePatchAdminArenaStatus } from "@/features/admin-arenas/hooks";
import type { AdminArenasListParams } from "@/features/admin-arenas/types";
import {
  ADMIN_DEFAULT_LIMIT,
  buildAdminQueryString,
  formatAdminDateTime,
  parsePositiveInt
} from "@/features/admin/utils";
import { getApiErrorMessage } from "@/lib/api/error-messages";

const BASE = "/admin/arenas";

const STATUS_LABELS = { ACTIVE: "Ativa", INACTIVE: "Inativa" } as const;

function parseParams(searchParams: URLSearchParams): AdminArenasListParams {
  const status = searchParams.get("status");
  return {
    page: parsePositiveInt(searchParams.get("page"), 1),
    limit: parsePositiveInt(searchParams.get("limit"), ADMIN_DEFAULT_LIMIT),
    status: status === "ACTIVE" || status === "INACTIVE" ? status : undefined,
    ownerId: searchParams.get("ownerId") || undefined,
    city: searchParams.get("city") || undefined
  };
}

export function AdminArenasCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => parseParams(searchParams), [searchParams]);
  const query = useAdminArenas(params);
  const patchMutation = usePatchAdminArenaStatus();
  const [pending, setPending] = useState<{ id: string; status: "ACTIVE" | "INACTIVE" } | null>(
    null
  );
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  function updateUrl(next: Partial<AdminArenasListParams>) {
    router.push(
      buildAdminQueryString(BASE, { ...params, ...next }, { page: 1, limit: ADMIN_DEFAULT_LIMIT })
    );
  }

  const hasFilters = Boolean(params.status || params.ownerId || params.city);

  function handleConfirm(reason: string) {
    if (!pending) return;
    setActionMessage(null);
    patchMutation.mutate(
      { arenaId: pending.id, payload: { status: pending.status, reason } },
      {
        onSuccess: () => {
          setPending(null);
          setActionMessage("Status da arena atualizado.");
        },
        onError: (error) => setActionMessage(getApiErrorMessage(error))
      }
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <AdminPageHeader title="Arenas" description="Listagem e alteração de status operacional." />

      {pending ? (
        <AdminReasonDialog
          title="Alterar status da arena"
          description={`Marcar arena como ${STATUS_LABELS[pending.status].toLowerCase()}.`}
          confirmLabel="Confirmar"
          isPending={patchMutation.isPending}
          onConfirm={handleConfirm}
          onCancel={() => setPending(null)}
        />
      ) : null}

      {actionMessage ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
          {actionMessage}
        </p>
      ) : null}

      <AdminFiltersBar hasFilters={hasFilters} onClear={() => router.push(BASE)}>
        <AdminFilterField label="Cidade" htmlFor="admin-arenas-city">
          <input
            id="admin-arenas-city"
            className={adminInputClassName}
            defaultValue={params.city ?? ""}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (params.city ?? "")) updateUrl({ city: v || undefined, page: 1 });
            }}
          />
        </AdminFilterField>
        <AdminFilterField label="Dono (ID)" htmlFor="admin-arenas-owner">
          <input
            id="admin-arenas-owner"
            className={adminInputClassName}
            defaultValue={params.ownerId ?? ""}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (params.ownerId ?? "")) updateUrl({ ownerId: v || undefined, page: 1 });
            }}
          />
        </AdminFilterField>
        <AdminFilterField label="Status" htmlFor="admin-arenas-status">
          <select
            id="admin-arenas-status"
            className={adminSelectClassName}
            value={params.status ?? ""}
            onChange={(e) =>
              updateUrl({
                status: (e.target.value || undefined) as AdminArenasListParams["status"],
                page: 1
              })
            }
          >
            <option value="">Todos</option>
            <option value="ACTIVE">Ativa</option>
            <option value="INACTIVE">Inativa</option>
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
          {(query.data?.data ?? []).map((arena) => {
            const nextStatus = arena.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
            return (
              <li key={arena.id}>
                <article className="space-y-3 rounded-xl border p-4">
                  <Badge variant={arena.status === "ACTIVE" ? "success" : "destructive"}>
                    {STATUS_LABELS[arena.status as keyof typeof STATUS_LABELS] ?? arena.status}
                  </Badge>
                  <h2 className="font-semibold">{arena.name}</h2>
                  <p className="text-muted-foreground text-sm">{arena.slug}</p>
                  <p className="text-muted-foreground text-sm">
                    {arena.city ?? "—"} · {formatAdminDateTime(arena.createdAt)}
                  </p>
                  <p className="font-mono text-xs break-all">Dono: {arena.ownerId}</p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
                      <Link href={`${BASE}/${arena.id}`}>Ver detalhe</Link>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-11 w-full sm:w-auto"
                      onClick={() => setPending({ id: arena.id, status: nextStatus })}
                    >
                      {nextStatus === "ACTIVE" ? "Ativar" : "Inativar"}
                    </Button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </AdminListShell>
    </div>
  );
}
