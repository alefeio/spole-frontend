"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminIdCopy } from "@/features/admin/components/admin-id-copy";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminSectionCard } from "@/features/admin/components/admin-section-card";
import type { ReservationDetail } from "@/features/reservations/types";
import { formatAdminDateTime, formatAdminMoney } from "@/features/admin/utils";

type AdminReservationDetailViewProps = {
  reservation: ReservationDetail;
};

export function AdminReservationDetailView({ reservation }: AdminReservationDetailViewProps) {
  const financial = reservation.financial;

  return (
    <div className="space-y-6 overflow-x-hidden">
      <AdminPageHeader
        title="Reserva de arena"
        description="Visão administrativa somente leitura — sem ações de pagamento ou cancelamento."
      />

      <AdminSectionCard>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-medium">{reservation.status}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Tipo</dt>
            <dd className="font-medium">{reservation.type}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Criada em</dt>
            <dd>{formatAdminDateTime(reservation.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Atualizada em</dt>
            <dd>{formatAdminDateTime(reservation.updatedAt)}</dd>
          </div>
        </dl>
        <AdminIdCopy label="ID da reserva" value={reservation.id} />
        <AdminIdCopy label="Slot" value={reservation.slotId} />
        <AdminIdCopy label="Organizador" value={reservation.organizerId} />
        {reservation.slot ? (
          <p className="text-sm">
            Horário: {formatAdminDateTime(reservation.slot.startAt)} —{" "}
            {formatAdminDateTime(reservation.slot.endAt)}
          </p>
        ) : null}
      </AdminSectionCard>

      {financial ? (
        <AdminSectionCard title="Financeiro">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Total</dt>
              <dd>{formatAdminMoney(financial.totalPrice)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pagamento exigido</dt>
              <dd>{formatAdminMoney(financial.requiredPaymentAmount)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pago</dt>
              <dd>{formatAdminMoney(financial.paidAmount)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Expira em</dt>
              <dd>{formatAdminDateTime(financial.expiresAt)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Confirmada em</dt>
              <dd>{formatAdminDateTime(financial.confirmedAt)}</dd>
            </div>
          </dl>
        </AdminSectionCard>
      ) : null}

      {reservation.recurrence ? (
        <AdminSectionCard title="Recorrência (leitura)">
          <p className="text-muted-foreground text-sm">
            Frequência {reservation.recurrence.frequency} · dia {reservation.recurrence.dayOfWeek} ·{" "}
            {reservation.recurrence.active ? "ativa" : "inativa"}
          </p>
        </AdminSectionCard>
      ) : null}

      <Button asChild variant="ghost" className="min-h-11 px-0">
        <Link href="/admin/reservations">← Voltar para reservas</Link>
      </Button>
    </div>
  );
}
