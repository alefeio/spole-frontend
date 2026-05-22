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
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

type PaymentDetailProps = {
  payment: Payment;
  isPolling?: boolean;
};

export function PaymentDetail({ payment, isPolling }: PaymentDetailProps) {
  const showCheckoutLink = isPendingPaymentStatus(payment.status) && Boolean(payment.bookingId);

  return (
    <article className="space-y-6 rounded-xl border p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="text-muted-foreground text-sm">Pagamento</p>
          <p className="font-mono text-xs break-all sm:text-sm">{payment.id}</p>
        </div>
        <PaymentStatusBadge status={payment.status} />
      </div>

      {isPolling ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
          Atualizando status do pagamento… A confirmação depende do processamento mock no backend
          (webhook), não do navegador.
        </p>
      ) : null}

      {isPendingPaymentStatus(payment.status) ? (
        <p className="bg-muted rounded-lg border p-3 text-sm">
          Pagamento pendente. Quando o backend confirmar via webhook, o status mudará para pago
          nesta tela.
        </p>
      ) : null}

      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Valor bruto</dt>
          <dd className="text-lg font-semibold">{formatMoney(payment.grossAmount)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Valor líquido</dt>
          <dd className="text-lg font-semibold">{formatMoney(payment.netAmount)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Taxa</dt>
          <dd className="font-medium">{formatMoney(payment.feeAmount)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Método</dt>
          <dd className="font-medium">{payment.method || "Não informado"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Provedor</dt>
          <dd className="font-medium break-words">{payment.provider || "Não informado"}</dd>
        </div>
        {payment.providerReference ? (
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Referência do provedor</dt>
            <dd className="font-mono text-xs break-all">{payment.providerReference}</dd>
          </div>
        ) : null}
        {payment.bookingId ? (
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Reserva (booking)</dt>
            <dd className="font-mono text-xs break-all">{payment.bookingId}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-muted-foreground">Criado em</dt>
          <dd className="font-medium">{formatDate(payment.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Pago em</dt>
          <dd className="font-medium">{formatDate(payment.paidAt)}</dd>
        </div>
        {payment.updatedAt ? (
          <div>
            <dt className="text-muted-foreground">Atualizado em</dt>
            <dd className="font-medium">{formatDate(payment.updatedAt)}</dd>
          </div>
        ) : null}
      </dl>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {showCheckoutLink ? (
          <Button asChild className="min-h-11 w-full sm:min-h-9 sm:w-auto">
            <Link href={`/checkout/${payment.bookingId}`}>Continuar no checkout</Link>
          </Button>
        ) : null}
        <Button asChild variant="outline" className="min-h-11 w-full sm:min-h-9 sm:w-auto">
          <Link href="/account/payments">Meus pagamentos</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11 w-full sm:min-h-9 sm:w-auto">
          <Link href="/account/bookings">Minhas inscrições</Link>
        </Button>
      </div>
    </article>
  );
}
