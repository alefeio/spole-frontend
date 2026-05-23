"use client";

import Link from "next/link";
import { AccessDenied } from "@/components/feedback/access-denied";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/hooks";
import { OwnerArenaNavigation } from "@/features/owner/components/owner-arena-navigation";
import { OwnerPageHeader } from "@/features/owner/components/owner-page-header";
import { OwnerSectionCard } from "@/features/owner/components/owner-section-card";
import { OwnerReservationStatusBadge } from "@/features/owner-arenas/components/owner-reservation-status-badge";
import { formatOwnerDateTime, formatOwnerMoney } from "@/features/owner/utils";
import type { Arena } from "@/features/arenas/types";
import type { ReservationDetail } from "@/features/reservations/types";

type OwnerReservationDetailViewProps = {
  arena: Arena;
  reservation: ReservationDetail;
};

export function OwnerReservationDetailView({
  arena,
  reservation
}: OwnerReservationDetailViewProps) {
  const me = useMe();
  const financial = reservation.financial;
  const base = `/owner/arenas/${arena.id}`;

  if (me.isSuccess && me.data && me.data.id !== arena.ownerId) {
    return <AccessDenied title="Arena de outro dono" description="Acesso negado." />;
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <OwnerPageHeader
        title="Reserva recebida"
        description="Somente leitura — sem cancelamento, confirmação ou pagamento pelo dono."
      />

      <OwnerArenaNavigation arenaId={arena.id} />

      <OwnerSectionCard>
        <div className="flex flex-wrap items-center gap-2">
          <OwnerReservationStatusBadge status={reservation.status} />
          <span className="text-muted-foreground text-xs">{reservation.type}</span>
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Criada em</dt>
            <dd className="font-medium">{formatOwnerDateTime(reservation.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Atualizada em</dt>
            <dd className="font-medium">{formatOwnerDateTime(reservation.updatedAt)}</dd>
          </div>
        </dl>
        <p className="text-muted-foreground mt-3 font-mono text-xs break-all">
          ID: {reservation.id}
        </p>
        <p className="text-muted-foreground font-mono text-xs break-all">
          Slot: {reservation.slotId}
        </p>
        <p className="text-muted-foreground font-mono text-xs break-all">
          Organizador: {reservation.organizerId}
        </p>
        {reservation.slot ? (
          <p className="mt-2 text-sm font-medium">
            Horário: {formatOwnerDateTime(reservation.slot.startAt)} —{" "}
            {formatOwnerDateTime(reservation.slot.endAt)}
          </p>
        ) : null}
      </OwnerSectionCard>

      {financial ? (
        <OwnerSectionCard title="Financeiro (leitura)">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Total</dt>
              <dd className="font-medium">{formatOwnerMoney(financial.totalPrice)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pagamento exigido</dt>
              <dd className="font-medium">{formatOwnerMoney(financial.requiredPaymentAmount)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pago</dt>
              <dd className="font-medium">{formatOwnerMoney(financial.paidAmount)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Expira em</dt>
              <dd>{formatOwnerDateTime(financial.expiresAt)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Confirmada em</dt>
              <dd>{formatOwnerDateTime(financial.confirmedAt)}</dd>
            </div>
          </dl>
        </OwnerSectionCard>
      ) : null}

      <OwnerSectionCard title="Próximas ações">
        <p className="text-muted-foreground text-sm">
          Ações sobre reservas recebidas serão tratadas em uma etapa futura quando a API expuser
          operações específicas para o dono da arena.
        </p>
      </OwnerSectionCard>

      <Button asChild variant="ghost" className="min-h-11 px-0">
        <Link href={`${base}/reservations`}>← Reservas recebidas</Link>
      </Button>
    </div>
  );
}
