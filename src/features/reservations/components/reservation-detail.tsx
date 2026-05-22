"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ReservationCancelDialog } from "@/features/reservations/components/reservation-cancel-dialog";
import { ReservationStatusBadge } from "@/features/reservations/components/reservation-status-badge";
import { useCancelReservation } from "@/features/reservations/hooks";
import type { ReservationDetail } from "@/features/reservations/types";
import { getApiErrorMessage } from "@/lib/api/error-messages";

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "Não informado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Não informado";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatSlotWindow(slot?: { startAt: string; endAt: string }) {
  if (!slot) return "Horário não informado";
  return `${formatDateTime(slot.startAt)} – ${formatDateTime(slot.endAt)}`;
}

type ReservationDetailViewProps = {
  reservation: ReservationDetail;
};

export function ReservationDetailView({ reservation }: ReservationDetailViewProps) {
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const cancelMutation = useCancelReservation();
  const canCancel = reservation.status === "PENDING" || reservation.status === "CONFIRMED";

  function handleCancel() {
    setMessage(null);
    cancelMutation.mutate(reservation.id, {
      onSuccess: () => {
        setIsConfirmingCancel(false);
        setMessage("Reserva cancelada com sucesso.");
      },
      onError: (error) => setMessage(getApiErrorMessage(error))
    });
  }

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-xl border p-4 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-muted-foreground text-xs">Reserva de arena</p>
            <p className="font-mono text-sm break-all">{reservation.id}</p>
          </div>
          <ReservationStatusBadge status={reservation.status} />
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Tipo</dt>
            <dd className="font-medium">{reservation.type}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Horário</dt>
            <dd className="font-medium">{formatSlotWindow(reservation.slot)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Criada em</dt>
            <dd className="font-medium">{formatDateTime(reservation.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Atualizada em</dt>
            <dd className="font-medium">{formatDateTime(reservation.updatedAt)}</dd>
          </div>
        </dl>

        {reservation.status === "PENDING" ? (
          <p className="bg-muted/40 rounded-lg border p-3 text-sm">
            Pagamento de reserva será tratado em etapa futura. O status exibido é o retornado pela
            API.
          </p>
        ) : null}

        {reservation.recurrence ? (
          <p className="text-muted-foreground rounded-lg border p-3 text-sm">
            Recorrência será tratada em etapa futura. Dados de recorrência exibidos apenas para
            leitura.
          </p>
        ) : null}
      </section>

      {reservation.financial ? (
        <section className="space-y-3 rounded-xl border p-4 sm:p-6">
          <h2 className="text-lg font-semibold">Valores (somente leitura)</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Total</dt>
              <dd className="font-medium">{formatMoney(reservation.financial.totalPrice)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pagamento exigido</dt>
              <dd className="font-medium">
                {formatMoney(reservation.financial.requiredPaymentAmount)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pago</dt>
              <dd className="font-medium">{formatMoney(reservation.financial.paidAmount)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Expira em</dt>
              <dd className="font-medium">{formatDateTime(reservation.financial.expiresAt)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Confirmada em</dt>
              <dd className="font-medium">{formatDateTime(reservation.financial.confirmedAt)}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      {reservation.nextOccurrence ? (
        <section className="space-y-2 rounded-xl border p-4 text-sm">
          <h2 className="font-semibold">Próxima ocorrência</h2>
          <p className="text-muted-foreground">
            Status: {reservation.nextOccurrence.status} · Vencimento:{" "}
            {formatDateTime(reservation.nextOccurrence.dueAt)}
          </p>
        </section>
      ) : null}

      {message ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
          {message}
        </p>
      ) : null}

      {isConfirmingCancel ? (
        <ReservationCancelDialog
          isPending={cancelMutation.isPending}
          onConfirm={handleCancel}
          onCancel={() => setIsConfirmingCancel(false)}
        />
      ) : canCancel ? (
        <Button
          type="button"
          variant="outline"
          className="min-h-11 w-full sm:min-h-9 sm:w-auto"
          onClick={() => setIsConfirmingCancel(true)}
        >
          Cancelar reserva
        </Button>
      ) : null}

      <Button asChild variant="ghost" className="min-h-11 px-0 sm:min-h-9">
        <Link href="/account/reservations">← Voltar para minhas reservas</Link>
      </Button>
    </div>
  );
}
