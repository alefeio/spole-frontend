import type { PaymentStatus } from "@/features/payments/types";
import {
  isPendingPaymentStatus,
  isTerminalPaymentStatus
} from "@/features/payments/payment-status";

const STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Aguardando pagamento",
  PAID: "Pagamento confirmado",
  FAILED: "Pagamento não aprovado",
  REFUNDED: "Reembolsado",
  CANCELLED: "Pagamento cancelado"
};

export function getPaymentStatusLabel(status: PaymentStatus | string): string {
  return STATUS_LABELS[status as PaymentStatus] ?? status;
}

export function getPaymentTerminalMessage(status: PaymentStatus | string): string | null {
  if (!isTerminalPaymentStatus(status)) return null;
  switch (status) {
    case "PAID":
      return "Pagamento confirmado. A confirmação depende do processamento registrado pela API.";
    case "FAILED":
      return "Pagamento não aprovado. Você pode tentar gerar um novo pagamento, se a API permitir.";
    case "CANCELLED":
      return "Pagamento cancelado.";
    case "REFUNDED":
      return "Pagamento reembolsado.";
    default:
      return `Status atualizado: ${getPaymentStatusLabel(status)}.`;
  }
}

export function getPaymentPendingMessage(): string {
  return "Aguardando confirmação do pagamento. Assim que o Pix for processado, o status será atualizado aqui.";
}

export { isPendingPaymentStatus, isTerminalPaymentStatus };
