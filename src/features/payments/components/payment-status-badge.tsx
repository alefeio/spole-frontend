import { Badge } from "@/components/ui/badge";
import type { PaymentStatus } from "@/features/payments/types";

const STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Aguardando pagamento",
  PAID: "Pagamento confirmado",
  FAILED: "Pagamento não aprovado",
  REFUNDED: "Reembolsado",
  CANCELLED: "Pagamento cancelado"
};

const STATUS_VARIANT: Record<
  PaymentStatus,
  "accent" | "success" | "destructive" | "muted" | "secondary"
> = {
  PENDING: "accent",
  PAID: "success",
  FAILED: "destructive",
  REFUNDED: "muted",
  CANCELLED: "secondary"
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus | string }) {
  const key = status as PaymentStatus;
  const variant = STATUS_VARIANT[key] ?? "secondary";

  return <Badge variant={variant}>{STATUS_LABELS[key] ?? status}</Badge>;
}
