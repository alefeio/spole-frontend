"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminIdCopy } from "@/features/admin/components/admin-id-copy";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminReasonDialog } from "@/features/admin/components/admin-reason-dialog";
import { AdminSectionCard } from "@/features/admin/components/admin-section-card";
import { AdminUserRoleBadge } from "@/features/admin-users/components/admin-user-role-badge";
import { AdminUserStatusBadge } from "@/features/admin-users/components/admin-user-status-badge";
import { usePatchAdminUserStatus } from "@/features/admin-users/hooks";
import type { AdminUserDetail, AdminUserStatus } from "@/features/admin-users/types";
import { useMe } from "@/features/auth/hooks";
import { formatAdminDateTime } from "@/features/admin/utils";
import { getApiErrorMessage } from "@/lib/api/error-messages";

const NEXT_STATUS: Record<AdminUserStatus, AdminUserStatus[]> = {
  ACTIVE: ["SUSPENDED", "INACTIVE"],
  SUSPENDED: ["ACTIVE"],
  INACTIVE: ["ACTIVE"]
};

type AdminUserDetailViewProps = {
  user: AdminUserDetail;
};

export function AdminUserDetailView({ user }: AdminUserDetailViewProps) {
  const me = useMe();
  const [pendingStatus, setPendingStatus] = useState<AdminUserStatus | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const patchMutation = usePatchAdminUserStatus();

  const isSelf = me.data?.id === user.id;
  const options = NEXT_STATUS[user.status] ?? [];

  function handleConfirm(reason: string) {
    if (!pendingStatus) return;
    setMessage(null);
    patchMutation.mutate(
      { userId: user.id, payload: { status: pendingStatus, reason } },
      {
        onSuccess: () => {
          setPendingStatus(null);
          setMessage("Status atualizado.");
        },
        onError: (error) => setMessage(getApiErrorMessage(error))
      }
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <AdminPageHeader
        title={user.name}
        description="Visão administrativa — somente leitura, exceto alteração de status."
      />

      <AdminSectionCard>
        <div className="flex flex-wrap gap-2">
          <AdminUserStatusBadge status={user.status} />
          <AdminUserRoleBadge role={user.role} />
        </div>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">E-mail</dt>
            <dd className="font-medium break-all">{user.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Telefone</dt>
            <dd className="font-medium">{user.phone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Criado em</dt>
            <dd>{formatAdminDateTime(user.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Atualizado em</dt>
            <dd>{formatAdminDateTime(user.updatedAt)}</dd>
          </div>
        </dl>
        <AdminIdCopy label="ID do usuário" value={user.id} />
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Reservas</dt>
            <dd className="font-medium">{user.counts.reservations}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Bookings</dt>
            <dd className="font-medium">{user.counts.bookings}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Pagamentos</dt>
            <dd className="font-medium">{user.counts.payments}</dd>
          </div>
        </dl>
      </AdminSectionCard>

      {isSelf ? (
        <p className="rounded-lg border p-3 text-sm">
          Você não pode alterar o status da sua própria conta (regra da API).
        </p>
      ) : options.length > 0 ? (
        <AdminSectionCard title="Alterar status">
          {pendingStatus ? (
            <AdminReasonDialog
              title="Confirmar alteração de status"
              description={`Alterar status para ${pendingStatus}. O motivo será registrado na auditoria.`}
              confirmLabel="Alterar status"
              isPending={patchMutation.isPending}
              onConfirm={handleConfirm}
              onCancel={() => setPendingStatus(null)}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {options.map((status) => (
                <Button
                  key={status}
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  onClick={() => setPendingStatus(status)}
                >
                  Marcar como{" "}
                  {status === "ACTIVE" ? "ativo" : status === "SUSPENDED" ? "suspenso" : "inativo"}
                </Button>
              ))}
            </div>
          )}
        </AdminSectionCard>
      ) : null}

      {message ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
          {message}
        </p>
      ) : null}

      <Button asChild variant="ghost" className="min-h-11 px-0">
        <Link href="/admin/users">← Voltar para usuários</Link>
      </Button>
    </div>
  );
}
