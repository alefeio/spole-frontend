export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "CANCELLED";

export type Payment = {
  id: string;
  bookingId: string | null;
  reservationId: string | null;
  reservationOccurrenceId: string | null;
  status: PaymentStatus | string;
  method: string;
  provider: string;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  paidAt: string | null;
  createdAt: string;
};

export type PaymentListParams = {
  page?: number;
  limit?: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

export type PaymentListResponse = {
  data: Payment[];
  meta: PaginationMeta;
};
