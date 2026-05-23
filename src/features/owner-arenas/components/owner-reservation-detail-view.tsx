"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccessDenied } from "@/components/feedback/access-denied";
import { useMe } from "@/features/auth/hooks";
import { OwnerPageHeader } from "@/features/owner/components/owner-page-header";
import { OwnerSectionCard } from "@/features/owner/components/owner-section-card";
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

  if (me.isSuccess && me.data && me.data.id !== arena.ownerId) {
    return <AccessDenied title="Arena de outro dono" description="Acesso negado." />;
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <OwnerPageHeader
        title="Reserva recebida"
        description="Somente leitura — sem cancelamento ou pagamento pelo dono da arena."
      />

      <OwnerSectionCard>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{reservation.status}</Badge>
          <span className="text-muted-foreground text-xs">{reservation.type}</span>
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Criada em</dt>
            <dd>{formatOwnerDateTime(reservation.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Atualizada em</dt>
            <dd>{formatOwnerDateTime(reservation.updatedAt)}</dd>
          </div>
        </dl>
        <p className="font-mono text-xs break-all">ID: {reservation.id}</p>
        <p className="font-mono text-xs break-all">Slot: {reservation.slotId}</p>
        <p className="font-mono text-xs break-all">Organizador: {reservation.organizerId}</p>
        {reservation.slot ? (
          <p className="text-sm">
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
              <dd>{formatOwnerMoney(financial.totalPrice)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pagamento exigido</dt>
              <dd>{formatOwnerMoney(financial.requiredPaymentAmount)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pago</dt>
              <dd>{formatOwnerMoney(financial.paidAmount)}</dd>
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

      {reservation.recurrence ? (
        <OwnerSectionCard title="Recorrência (somente leitura)">
          <p className="text-muted-foreground text-sm">
            Frequência {reservation.recurrence.frequency} · dia {reservation.recurrence.dayOfWeek}
          </p>
        </OwnerSectionCard>
      ) : null}

      <Button asChild variant="ghost" className="min-h-11 px-0">
        <Link href={`/owner/arenas/${arena.id}/reservations`}>← Reservas recebidas</Link>
      </Button>
    </div>
  );
}
