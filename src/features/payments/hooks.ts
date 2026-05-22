"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPaymentForBooking, getMyPayments, getPaymentById } from "@/features/payments/api";
import { bookingsKeys } from "@/features/bookings/hooks";
import { eventsKeys } from "@/features/events/hooks";
import type { CreatePaymentForBookingParams, PaymentListParams } from "@/features/payments/types";

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

export function useCreatePaymentForBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreatePaymentForBookingParams) => createPaymentForBooking(params),
    onSuccess: (payment) => {
      void queryClient.invalidateQueries({ queryKey: paymentsKeys.all });
      void queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
      void queryClient.invalidateQueries({ queryKey: eventsKeys.details() });
      if (payment.id) {
        queryClient.setQueryData(paymentsKeys.detail(payment.id), payment);
      }
    }
  });
}
