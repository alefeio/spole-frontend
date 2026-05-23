"use client";

import Link from "next/link";
import { useMemo } from "react";
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
import { AdminUserRoleBadge } from "@/features/admin-users/components/admin-user-role-badge";
import { AdminUserStatusBadge } from "@/features/admin-users/components/admin-user-status-badge";
import { useAdminUsers } from "@/features/admin-users/hooks";
import type { AdminUsersListParams, AdminUserStatus } from "@/features/admin-users/types";
import {
  ADMIN_DEFAULT_LIMIT,
  buildAdminQueryString,
  formatAdminDateTime,
  parsePositiveInt
} from "@/features/admin/utils";

const BASE = "/admin/users";

function parseParams(searchParams: URLSearchParams): AdminUsersListParams {
  const status = searchParams.get("status");
  const role = searchParams.get("role");
  return {
    page: parsePositiveInt(searchParams.get("page"), 1),
    limit: parsePositiveInt(searchParams.get("limit"), ADMIN_DEFAULT_LIMIT),
    status:
      status === "ACTIVE" || status === "SUSPENDED" || status === "INACTIVE" ? status : undefined,
    role: role === "user" || role === "arena_owner" || role === "admin" ? role : undefined,
    email: searchParams.get("email") || undefined
  };
}

export function AdminUsersCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => parseParams(searchParams), [searchParams]);
  const query = useAdminUsers(params);

  function updateUrl(next: Partial<AdminUsersListParams>) {
    router.push(
      buildAdminQueryString(BASE, { ...params, ...next }, { page: 1, limit: ADMIN_DEFAULT_LIMIT })
    );
  }

  const hasFilters = Boolean(params.status || params.role || params.email);

  return (
    <div className="space-y-6 overflow-x-hidden">
      <AdminPageHeader
        title="Usuários"
        description="Listagem operacional com filtros e paginação conforme a API."
      />

      <AdminFiltersBar hasFilters={hasFilters} onClear={() => router.push(BASE)}>
        <AdminFilterField label="E-mail" htmlFor="admin-users-email">
          <input
            id="admin-users-email"
            className={adminInputClassName}
            defaultValue={params.email ?? ""}
            placeholder="Buscar por e-mail"
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (params.email ?? "")) updateUrl({ email: v || undefined, page: 1 });
            }}
          />
        </AdminFilterField>
        <AdminFilterField label="Status" htmlFor="admin-users-status">
          <select
            id="admin-users-status"
            className={adminSelectClassName}
            value={params.status ?? ""}
            onChange={(e) =>
              updateUrl({
                status: (e.target.value || undefined) as AdminUserStatus | undefined,
                page: 1
              })
            }
          >
            <option value="">Todos</option>
            <option value="ACTIVE">Ativo</option>
            <option value="SUSPENDED">Suspenso</option>
            <option value="INACTIVE">Inativo</option>
          </select>
        </AdminFilterField>
        <AdminFilterField label="Perfil" htmlFor="admin-users-role">
          <select
            id="admin-users-role"
            className={adminSelectClassName}
            value={params.role ?? ""}
            onChange={(e) =>
              updateUrl({
                role: (e.target.value || undefined) as AdminUsersListParams["role"],
                page: 1
              })
            }
          >
            <option value="">Todos</option>
            <option value="user">Participante</option>
            <option value="arena_owner">Dono de arena</option>
            <option value="admin">Administrador</option>
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
          {(query.data?.data ?? []).map((user) => (
            <li key={user.id}>
              <article className="space-y-3 rounded-xl border p-4">
                <div className="flex flex-wrap gap-2">
                  <AdminUserStatusBadge status={user.status} />
                  <AdminUserRoleBadge role={user.role} />
                </div>
                <h2 className="font-semibold">{user.name}</h2>
                <p className="text-muted-foreground text-sm break-all">{user.email}</p>
                <p className="text-muted-foreground text-xs">
                  Criado em {formatAdminDateTime(user.createdAt)}
                </p>
                <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
                  <Link href={`${BASE}/${user.id}`}>Ver detalhe</Link>
                </Button>
              </article>
            </li>
          ))}
        </ul>
      </AdminListShell>
    </div>
  );
}
