import type { AdminListParams } from "@/features/admin/types";
import type { PaymentStatus } from "@/features/payments/types";

export type AdminPaymentListItem = {
  id: string;
  userId: string;
  bookingId: string | null;
  reservationId: string | null;
  reservationOccurrenceId: string | null;
  status: PaymentStatus;
  grossAmount: number;
  paidAt: string | null;
  createdAt: string;
};

export type AdminPaymentsListParams = AdminListParams & {
  status?: PaymentStatus;
  userId?: string;
  bookingId?: string;
  reservationId?: string;
};
