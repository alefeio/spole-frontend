import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import { isPendingPaymentStatus } from "@/features/payments/payment-status";
import type { Payment } from "@/features/payments/types";

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

function formatDate(value?: string | null) {
  if (!value) return "Não informado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Não informado";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function PaymentCard({ payment }: { payment: Payment }) {
  const canContinueBookingCheckout =
    isPendingPaymentStatus(payment.status) && Boolean(payment.bookingId);
  const canContinueReservationCheckout =
    isPendingPaymentStatus(payment.status) && Boolean(payment.reservationId);
  const contextLabel = payment.reservationId
    ? "Reserva de arena"
    : payment.bookingId
      ? "Inscrição paga (evento)"
      : "Pagamento";

  return (
    <article className="flex flex-col gap-4 rounded-xl border p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs">{contextLabel}</p>
          <p className="font-mono text-xs break-all">{payment.id}</p>
        </div>
        <PaymentStatusBadge status={payment.status} />
      </div>

      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Valor bruto</dt>
          <dd className="font-medium">{formatMoney(payment.grossAmount)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Valor líquido</dt>
          <dd className="font-medium">{formatMoney(payment.netAmount)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Método</dt>
          <dd className="font-medium">{payment.method || "Não informado"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Criado em</dt>
          <dd className="font-medium">{formatDate(payment.createdAt)}</dd>
        </div>
        {payment.reservationId ? (
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Reserva de arena</dt>
            <dd className="font-mono text-xs break-all">{payment.reservationId}</dd>
          </div>
        ) : null}
        {payment.bookingId ? (
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Reserva (booking)</dt>
            <dd className="font-mono text-xs break-all">{payment.bookingId}</dd>
          </div>
        ) : null}
      </dl>

      {isPendingPaymentStatus(payment.status) ? (
        <p className="bg-muted rounded-lg border p-3 text-sm">
          Aguardando pagamento. Conclua o Pix no app do seu banco; a confirmação depende do
          processamento do pagamento.
        </p>
      ) : null}

      <div className="grid gap-2 sm:flex sm:flex-wrap">
        <Button asChild className="min-h-11 w-full sm:min-h-9 sm:w-auto">
          <Link href={`/account/payments/${payment.id}`}>Ver detalhes</Link>
        </Button>
        {canContinueReservationCheckout && payment.reservationId ? (
          <Button asChild variant="outline" className="min-h-11 w-full sm:min-h-9 sm:w-auto">
            <Link href={`/account/reservations/${payment.reservationId}/payment`}>
              Continuar pagamento
            </Link>
          </Button>
        ) : null}
        {canContinueBookingCheckout && payment.bookingId ? (
          <Button asChild variant="outline" className="min-h-11 w-full sm:min-h-9 sm:w-auto">
            <Link href={`/checkout/${payment.bookingId}`}>Continuar pagamento</Link>
          </Button>
        ) : null}
        {payment.reservationId ? (
          <Button asChild variant="outline" className="min-h-11 w-full sm:min-h-9 sm:w-auto">
            <Link href={`/account/reservations/${payment.reservationId}`}>Ver reserva</Link>
          </Button>
        ) : null}
      </div>
    </article>
  );
}
