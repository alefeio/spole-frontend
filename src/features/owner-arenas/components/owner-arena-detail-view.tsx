"use client";

import Link from "next/link";
import { AccessDenied } from "@/components/feedback/access-denied";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/hooks";
import { OwnerArenaNavigation } from "@/features/owner/components/owner-arena-navigation";
import { OwnerPageHeader } from "@/features/owner/components/owner-page-header";
import { OwnerSectionCard } from "@/features/owner/components/owner-section-card";
import { OwnerArenaStatusBadge } from "@/features/owner-arenas/components/owner-arena-status-badge";
import { formatOwnerDateTime } from "@/features/owner/utils";
import type { Arena } from "@/features/arenas/types";

type OwnerArenaDetailViewProps = {
  arena: Arena;
};

export function OwnerArenaDetailView({ arena }: OwnerArenaDetailViewProps) {
  const me = useMe();
  const base = `/owner/arenas/${arena.id}`;

  if (me.isSuccess && me.data && me.data.id !== arena.ownerId) {
    return (
      <AccessDenied
        title="Arena de outro dono"
        description="Esta arena não pertence à sua conta."
      />
    );
  }

  const addressLine = [
    arena.address.street,
    arena.address.number,
    arena.address.district,
    arena.address.city,
    arena.address.state,
    arena.address.zipCode
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6 overflow-x-hidden">
      <OwnerPageHeader
        title={arena.name}
        description="Visão operacional da arena — gerencie espaços, horários e reservas."
      />

      <OwnerArenaNavigation arenaId={arena.id} />

      <OwnerSectionCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <OwnerArenaStatusBadge status={arena.status} />
          {arena.createdAt ? (
            <p className="text-muted-foreground text-xs">
              Criada em {formatOwnerDateTime(arena.createdAt)}
            </p>
          ) : null}
        </div>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Telefone</dt>
            <dd className="font-medium">{arena.phone}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">E-mail</dt>
            <dd className="font-medium break-all">{arena.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Documento</dt>
            <dd className="font-medium">{arena.document}</dd>
          </div>
        </dl>
        <p className="text-muted-foreground mt-3 font-mono text-xs break-all">ID: {arena.id}</p>
      </OwnerSectionCard>

      <OwnerSectionCard title="Endereço">
        <p className="text-sm break-words">{addressLine || "—"}</p>
      </OwnerSectionCard>

      <OwnerSectionCard title="Política de reserva">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Recorrência permitida na arena</dt>
            <dd className="font-medium">{arena.policy.allowRecurring ? "Sim" : "Não"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Antecedência mínima (horas)</dt>
            <dd className="font-medium">{arena.policy.minAdvanceHours}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">% mínimo de pagamento na reserva</dt>
            <dd className="font-medium">{arena.policy.minReservationPaymentPercent}%</dd>
          </div>
        </dl>
      </OwnerSectionCard>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button asChild className="min-h-11">
          <Link href={`${base}/edit`}>Editar arena</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href={`${base}/spaces`}>Ver espaços</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href={`${base}/reservations`}>Reservas recebidas</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href={`${base}/agenda`}>Agenda do dia</Link>
        </Button>
        <Button asChild variant="secondary" className="min-h-11 sm:col-span-2">
          <Link href={`${base}/spaces`}>Criar espaço</Link>
        </Button>
      </div>

      <Button asChild variant="ghost" className="min-h-11 px-0">
        <Link href="/owner/arenas">← Minhas arenas</Link>
      </Button>
    </div>
  );
}
