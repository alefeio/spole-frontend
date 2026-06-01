export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "CANCELLED";

export type PaymentCheckout = {
  pixCopyPaste?: string | null;
  pixQrCode?: string | null;
  paymentExpiresAt?: string | null;
};

export type Payment = {
  id: string;
  userId?: string;
  bookingId?: string | null;
  reservationId?: string | null;
  reservationOccurrenceId?: string | null;
  status: PaymentStatus | string;
  method: string;
  provider: string;
  providerReference?: string | null;
  contextExpiresAt?: string | null;
  checkout?: PaymentCheckout | null;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  paidAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
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

export type CreatePaymentPayload = {
  method: "PIX";
  provider: string;
};

export type CreatePaymentForBookingParams = {
  bookingId: string;
  payload?: CreatePaymentPayload;
  idempotencyKey?: string;
};

export type CreatePaymentForReservationParams = {
  reservationId: string;
  payload?: CreatePaymentPayload;
  idempotencyKey?: string;
};
