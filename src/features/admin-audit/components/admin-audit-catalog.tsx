"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AdminFilterField,
  AdminFiltersBar,
  adminInputClassName,
  adminSelectClassName
} from "@/features/admin/components/admin-filters-bar";
import { AdminIdCopy } from "@/features/admin/components/admin-id-copy";
import { AdminListShell } from "@/features/admin/components/admin-list-shell";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { useAdminAuditLogs } from "@/features/admin-audit/hooks";
import type {
  AdminAuditLogsListParams,
  AdminAuditResourceType
} from "@/features/admin-audit/types";
import {
  ADMIN_DEFAULT_LIMIT,
  buildAdminQueryString,
  formatAdminDateTime,
  parsePositiveInt
} from "@/features/admin/utils";

const BASE = "/admin/audit";

function parseParams(searchParams: URLSearchParams): AdminAuditLogsListParams {
  const resourceType = searchParams.get("resourceType");
  return {
    page: parsePositiveInt(searchParams.get("page"), 1),
    limit: parsePositiveInt(searchParams.get("limit"), ADMIN_DEFAULT_LIMIT),
    actorUserId: searchParams.get("actorUserId") || undefined,
    resourceType:
      resourceType === "USER" || resourceType === "ARENA" || resourceType === "EVENT"
        ? resourceType
        : undefined,
    action: searchParams.get("action") || undefined,
    dateFrom: searchParams.get("dateFrom") || undefined,
    dateTo: searchParams.get("dateTo") || undefined
  };
}

function MetadataBlock({ metadata }: { metadata: unknown }) {
  const [open, setOpen] = useState(false);
  const text =
    metadata == null
      ? "—"
      : typeof metadata === "string"
        ? metadata
        : JSON.stringify(metadata, null, 2);

  return (
    <div className="space-y-1">
      <button
        type="button"
        className="text-primary text-xs font-medium underline-offset-2 hover:underline"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Ocultar metadata" : "Ver metadata"}
      </button>
      {open ? (
        <pre className="bg-muted max-h-40 overflow-auto rounded-md border p-2 font-mono text-xs break-all whitespace-pre-wrap">
          {text}
        </pre>
      ) : null}
    </div>
  );
}

export function AdminAuditCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => parseParams(searchParams), [searchParams]);
  const query = useAdminAuditLogs(params);

  function updateUrl(next: Partial<AdminAuditLogsListParams>) {
    router.push(
      buildAdminQueryString(BASE, { ...params, ...next }, { page: 1, limit: ADMIN_DEFAULT_LIMIT })
    );
  }

  const hasFilters = Boolean(
    params.actorUserId || params.resourceType || params.action || params.dateFrom || params.dateTo
  );

  return (
    <div className="space-y-6 overflow-x-hidden">
      <AdminPageHeader
        title="Auditoria"
        description="Registros de ações administrativas conforme retorno da API."
      />

      <AdminFiltersBar hasFilters={hasFilters} onClear={() => router.push(BASE)}>
        <AdminFilterField label="Ator (ID)" htmlFor="admin-audit-actor">
          <input
            id="admin-audit-actor"
            className={adminInputClassName}
            defaultValue={params.actorUserId ?? ""}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (params.actorUserId ?? ""))
                updateUrl({ actorUserId: v || undefined, page: 1 });
            }}
          />
        </AdminFilterField>
        <AdminFilterField label="Ação" htmlFor="admin-audit-action">
          <input
            id="admin-audit-action"
            className={adminInputClassName}
            defaultValue={params.action ?? ""}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (params.action ?? "")) updateUrl({ action: v || undefined, page: 1 });
            }}
          />
        </AdminFilterField>
        <AdminFilterField label="Recurso" htmlFor="admin-audit-resource">
          <select
            id="admin-audit-resource"
            className={adminSelectClassName}
            value={params.resourceType ?? ""}
            onChange={(e) =>
              updateUrl({
                resourceType: (e.target.value || undefined) as AdminAuditResourceType | undefined,
                page: 1
              })
            }
          >
            <option value="">Todos</option>
            <option value="USER">Usuário</option>
            <option value="ARENA">Arena</option>
            <option value="EVENT">Evento</option>
          </select>
        </AdminFilterField>
        <AdminFilterField label="De (ISO)" htmlFor="admin-audit-from">
          <input
            id="admin-audit-from"
            type="datetime-local"
            className={adminInputClassName}
            defaultValue={params.dateFrom?.slice(0, 16) ?? ""}
            onBlur={(e) => {
              const v = e.target.value ? new Date(e.target.value).toISOString() : undefined;
              if (v !== params.dateFrom) updateUrl({ dateFrom: v, page: 1 });
            }}
          />
        </AdminFilterField>
        <AdminFilterField label="Até (ISO)" htmlFor="admin-audit-to">
          <input
            id="admin-audit-to"
            type="datetime-local"
            className={adminInputClassName}
            defaultValue={params.dateTo?.slice(0, 16) ?? ""}
            onBlur={(e) => {
              const v = e.target.value ? new Date(e.target.value).toISOString() : undefined;
              if (v !== params.dateTo) updateUrl({ dateTo: v, page: 1 });
            }}
          />
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
          {(query.data?.data ?? []).map((log) => (
            <li key={log.id}>
              <article className="space-y-3 rounded-xl border p-4">
                <p className="font-medium">{log.action}</p>
                <p className="text-muted-foreground text-sm">
                  {log.resourceType} · {formatAdminDateTime(log.createdAt)}
                </p>
                <AdminIdCopy label="Ator" value={log.actorUserId} />
                <AdminIdCopy label="Recurso" value={log.resourceId} />
                {log.reason ? (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Motivo: </span>
                    {log.reason}
                  </p>
                ) : null}
                <MetadataBlock metadata={log.metadata} />
              </article>
            </li>
          ))}
        </ul>
      </AdminListShell>
    </div>
  );
}
