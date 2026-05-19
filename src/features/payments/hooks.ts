"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyPayments, getPaymentById } from "@/features/payments/api";
import type { PaymentListParams } from "@/features/payments/types";

export const paymentsKeys = {
  all: ["payments"] as const,
  myPayments: () => [...paymentsKeys.all, "me"] as const,
  myPaymentsList: (params: PaymentListParams) => [...paymentsKeys.myPayments(), params] as const,
  detail: (paymentId: string) => [...paymentsKeys.all, "detail", paymentId] as const
};

export function useMyPayments(params: PaymentListParams = {}) {
  return useQuery({
    queryKey: paymentsKeys.myPaymentsList(params),
    queryFn: () => getMyPayments(params)
  });
}

export function usePayment(paymentId: string) {
  return useQuery({
    queryKey: paymentsKeys.detail(paymentId),
    queryFn: () => getPaymentById(paymentId),
    enabled: Boolean(paymentId)
  });
}
