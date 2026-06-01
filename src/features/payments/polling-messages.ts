import { isMockPaymentsDevMode } from "@/lib/payments/payment-provider";
import {
  PAYMENT_POLL_TIMEOUT_MESSAGE,
  PAYMENT_POLL_TIMEOUT_MESSAGE_DEV
} from "@/features/payments/polling-config";

export function getPaymentPollTimeoutMessage(): string {
  return isMockPaymentsDevMode() ? PAYMENT_POLL_TIMEOUT_MESSAGE_DEV : PAYMENT_POLL_TIMEOUT_MESSAGE;
}
