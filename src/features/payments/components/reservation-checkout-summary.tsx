import { ReservationStatusBadge } from "@/features/reservations/components/reservation-status-badge";
import type { ReservationDetail } from "@/features/reservations/types";

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

export function ReservationCheckoutSummary({ reservation }: { reservation: ReservationDetail }) {
  const financial = reservation.financial;

  return (
    <section className="space-y-4 rounded-xl border p-4 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">Resumo da reserva</h2>
          <p className="text-muted-foreground font-mono text-xs break-all">{reservation.id}</p>
        </div>
        <ReservationStatusBadge status={reservation.status} />
      </div>

      {reservation.status === "PENDING" && financial?.expiresAt ? (
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
          <span className="font-medium">Expira em: </span>
          {formatDateTime(financial.expiresAt)}
        </p>
      ) : null}

      <dl className="grid gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Horário</dt>
          <dd className="font-medium">{formatSlotWindow(reservation.slot)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Tipo</dt>
          <dd className="font-medium">{reservation.type}</dd>
        </div>
      </dl>

      {financial ? (
        <dl className="grid gap-3 rounded-lg border p-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Total</dt>
            <dd className="font-medium">{formatMoney(financial.totalPrice)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Pagamento exigido</dt>
            <dd className="font-medium">{formatMoney(financial.requiredPaymentAmount)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Pago</dt>
            <dd className="font-medium">{formatMoney(financial.paidAmount)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Confirmada em</dt>
            <dd className="font-medium">{formatDateTime(financial.confirmedAt)}</dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
}
