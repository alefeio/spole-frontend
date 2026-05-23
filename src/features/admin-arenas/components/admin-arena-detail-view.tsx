"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminIdCopy } from "@/features/admin/components/admin-id-copy";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminReasonDialog } from "@/features/admin/components/admin-reason-dialog";
import { AdminSectionCard } from "@/features/admin/components/admin-section-card";
import { usePatchAdminArenaStatus } from "@/features/admin-arenas/hooks";
import type { Arena } from "@/features/arenas/types";
import { formatAdminDateTime } from "@/features/admin/utils";
import { getApiErrorMessage } from "@/lib/api/error-messages";

type AdminArenaDetailViewProps = {
  arena: Arena;
};

export function AdminArenaDetailView({ arena }: AdminArenaDetailViewProps) {
  const [pendingStatus, setPendingStatus] = useState<"ACTIVE" | "INACTIVE" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const patchMutation = usePatchAdminArenaStatus();
  const nextStatus = arena.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  function handleConfirm(reason: string) {
    if (!pendingStatus) return;
    setMessage(null);
    patchMutation.mutate(
      { arenaId: arena.id, payload: { status: pendingStatus, reason } },
      {
        onSuccess: () => {
          setPendingStatus(null);
          setMessage("Status atualizado.");
        },
        onError: (error) => setMessage(getApiErrorMessage(error))
      }
    );
  }

  const addr = arena.address;

  return (
    <div className="space-y-6 overflow-x-hidden">
      <AdminPageHeader
        title={arena.name}
        description="Visão administrativa — sem gestão de espaços ou slots."
      />

      <AdminSectionCard>
        <Badge variant={arena.status === "ACTIVE" ? "success" : "destructive"}>
          {arena.status === "ACTIVE" ? "Ativa" : "Inativa"}
        </Badge>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Slug</dt>
            <dd>{arena.slug}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Telefone</dt>
            <dd>{arena.phone}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">E-mail</dt>
            <dd className="break-all">{arena.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Documento</dt>
            <dd>{arena.document}</dd>
          </div>
          {arena.createdAt ? (
            <div>
              <dt className="text-muted-foreground">Criada em</dt>
              <dd>{formatAdminDateTime(arena.createdAt)}</dd>
            </div>
          ) : null}
        </dl>
        <AdminIdCopy label="ID da arena" value={arena.id} />
        <AdminIdCopy label="Dono" value={arena.ownerId} />
      </AdminSectionCard>

      <AdminSectionCard title="Endereço">
        <p className="text-sm">
          {[addr.street, addr.number, addr.district, addr.city, addr.state, addr.zipCode]
            .filter(Boolean)
            .join(", ") || "—"}
        </p>
      </AdminSectionCard>

      <AdminSectionCard title="Política">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Recorrência</dt>
            <dd>{arena.policy.allowRecurring ? "Permitida" : "Não"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Antecedência mín. (h)</dt>
            <dd>{arena.policy.minAdvanceHours}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">% mín. pagamento</dt>
            <dd>{arena.policy.minReservationPaymentPercent}%</dd>
          </div>
        </dl>
      </AdminSectionCard>

      <AdminSectionCard title="Alterar status">
        {pendingStatus ? (
          <AdminReasonDialog
            title="Confirmar alteração"
            description={`Marcar arena como ${pendingStatus === "ACTIVE" ? "ativa" : "inativa"}.`}
            confirmLabel="Confirmar"
            isPending={patchMutation.isPending}
            onConfirm={handleConfirm}
            onCancel={() => setPendingStatus(null)}
          />
        ) : (
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            onClick={() => setPendingStatus(nextStatus)}
          >
            {nextStatus === "ACTIVE" ? "Ativar arena" : "Inativar arena"}
          </Button>
        )}
      </AdminSectionCard>

      {message ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
          {message}
        </p>
      ) : null}

      <Button asChild variant="ghost" className="min-h-11 px-0">
        <Link href="/admin/arenas">← Voltar para arenas</Link>
      </Button>
    </div>
  );
}
