import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Payment, PaymentListParams, PaymentListResponse } from "@/features/payments/types";

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
