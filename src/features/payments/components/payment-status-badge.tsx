import type { PaymentStatus } from "@/features/payments/types";

const STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  FAILED: "Falhou",
  REFUNDED: "Reembolsado",
  CANCELLED: "Cancelado"
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus | string }) {
  return (
    <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs font-medium">
      {STATUS_LABELS[status as PaymentStatus] ?? status}
    </span>
  );
}
