"use client";

import Link from "next/link";
import { AccessDenied } from "@/components/feedback/access-denied";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/hooks";
import { OwnerArenaNav } from "@/features/owner/components/owner-arena-nav";
import { OwnerPageHeader } from "@/features/owner/components/owner-page-header";
import { OwnerSectionCard } from "@/features/owner/components/owner-section-card";
import { formatOwnerDateTime } from "@/features/owner/utils";
import type { Arena } from "@/features/arenas/types";

type OwnerArenaDetailViewProps = {
  arena: Arena;
};

export function OwnerArenaDetailView({ arena }: OwnerArenaDetailViewProps) {
  const me = useMe();
  const isOwner = me.data?.id === arena.ownerId;

  if (me.isSuccess && me.data && !isOwner) {
    return (
      <AccessDenied
        title="Arena de outro dono"
        description="Esta arena não pertence à sua conta. Use o painel admin se você for administrador."
      />
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <OwnerPageHeader
        title={arena.name}
        description="Visão do dono da arena — gerencie espaços, horários e reservas recebidas."
        actions={<OwnerArenaNav arenaId={arena.id} />}
      />

      <OwnerSectionCard>
        <p className="text-muted-foreground text-sm">
          Status: <span className="text-foreground font-medium">{arena.status}</span>
        </p>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
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
              <dd>{formatOwnerDateTime(arena.createdAt)}</dd>
            </div>
          ) : null}
        </dl>
        <p className="font-mono text-xs break-all">
          <span className="text-muted-foreground">ID: </span>
          {arena.id}
        </p>
        <p className="font-mono text-xs break-all">
          <span className="text-muted-foreground">Dono: </span>
          {arena.ownerId}
        </p>
      </OwnerSectionCard>

      <OwnerSectionCard title="Endereço">
        <p className="text-sm break-words">
          {[
            arena.address.street,
            arena.address.number,
            arena.address.district,
            arena.address.city,
            arena.address.state,
            arena.address.zipCode
          ]
            .filter(Boolean)
            .join(", ") || "—"}
        </p>
      </OwnerSectionCard>

      <OwnerSectionCard title="Política">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Recorrência permitida</dt>
            <dd>{arena.policy.allowRecurring ? "Sim" : "Não"}</dd>
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
      </OwnerSectionCard>

      <Button asChild variant="ghost" className="min-h-11 px-0">
        <Link href="/owner">← Painel da arena</Link>
      </Button>
    </div>
  );
}
