import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
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
  return (
    <article className="space-y-3 rounded-xl border p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs">Pagamento</p>
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
        <div>
          <dt className="text-muted-foreground">Pago em</dt>
          <dd className="font-medium">{formatDate(payment.paidAt)}</dd>
        </div>
      </dl>

      {payment.status === "PENDING" ? (
        <p className="bg-muted rounded-lg border p-3 text-sm">
          Pagamento pendente. A aprovacao do mock depende do processamento do backend/webhook.
        </p>
      ) : null}
    </article>
  );
}
