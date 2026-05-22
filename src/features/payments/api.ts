import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  CreatePaymentForBookingParams,
  CreatePaymentForReservationParams,
  Payment,
  PaymentListParams,
  PaymentListResponse
} from "@/features/payments/types";

const MOCK_PAYMENT_PAYLOAD = {
  method: "PIX" as const,
  provider: "mock-provider" as const
};

const PAYMENT_LOOKUP_LIMIT = 100;

export async function getMyPayments(params: PaymentListParams = {}): Promise<PaymentListResponse> {
  const { data, meta } = await apiClient<Payment[]>(endpoints.users.myPayments, {
    query: {
      page: params.page,
      limit: params.limit
    }
  });

  return {
    data,
    meta: {
      page: Number(meta?.page ?? params.page ?? 1),
      limit: Number(meta?.limit ?? params.limit ?? 10),
      total: Number(meta?.total ?? data.length)
    }
  };
}

export async function getPaymentById(paymentId: string): Promise<Payment> {
  const { data } = await apiClient<Payment>(endpoints.payments.byId(paymentId));
  return data;
}

export async function createPaymentForBooking({
  bookingId,
  payload = MOCK_PAYMENT_PAYLOAD
}: CreatePaymentForBookingParams): Promise<Payment> {
  const { data } = await apiClient<Payment>(endpoints.payments.forBooking(bookingId), {
    method: "POST",
    body: payload
  });

  return data;
}

export async function createPaymentForReservation({
  reservationId,
  payload = MOCK_PAYMENT_PAYLOAD,
  idempotencyKey
}: CreatePaymentForReservationParams): Promise<Payment> {
  const { data } = await apiClient<Payment>(endpoints.payments.forReservation(reservationId), {
    method: "POST",
    body: payload,
    idempotencyKey
  });

  return data;
}

/** Localiza pagamento de arena em GET /users/me/payments (sem endpoint por reserva). */
export async function findPaymentByReservationId(reservationId: string): Promise<Payment | null> {
  const { data } = await getMyPayments({ page: 1, limit: PAYMENT_LOOKUP_LIMIT });
  return data.find((payment) => payment.reservationId === reservationId) ?? null;
}
