import type { PaymentStatus } from "@/features/payments/types";

const TERMINAL_STATUSES: PaymentStatus[] = ["PAID", "FAILED", "REFUNDED", "CANCELLED"];

export function isPendingPaymentStatus(status: PaymentStatus | string): boolean {
  return status === "PENDING";
}

export function isTerminalPaymentStatus(status: PaymentStatus | string): boolean {
  return TERMINAL_STATUSES.includes(status as PaymentStatus);
}
