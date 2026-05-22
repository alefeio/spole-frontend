"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPaymentForBooking, getMyPayments, getPaymentById } from "@/features/payments/api";
import { bookingsKeys } from "@/features/bookings/hooks";
import { eventsKeys } from "@/features/events/hooks";
import { isPendingPaymentStatus } from "@/features/payments/payment-status";
import type { CreatePaymentForBookingParams, PaymentListParams } from "@/features/payments/types";

const PAYMENT_POLL_INTERVAL_MS = 4000;
const PAYMENT_POLL_MAX_MS = 5 * 60 * 1000;

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

type UsePaymentOptions = {
  /** Atualiza GET /payments/:id enquanto status for PENDING (máx. 5 min). */
  pollWhilePending?: boolean;
};

export function usePayment(paymentId: string, options: UsePaymentOptions = {}) {
  const pollStartedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (options.pollWhilePending && paymentId) {
      pollStartedAtRef.current = Date.now();
    } else {
      pollStartedAtRef.current = null;
    }
  }, [options.pollWhilePending, paymentId]);

  return useQuery({
    queryKey: paymentsKeys.detail(paymentId),
    queryFn: () => getPaymentById(paymentId),
    enabled: Boolean(paymentId),
    refetchInterval: (query) => {
      if (!options.pollWhilePending || !paymentId) return false;
      const status = query.state.data?.status;
      if (!status || !isPendingPaymentStatus(status)) return false;
      const startedAt = pollStartedAtRef.current;
      if (startedAt && Date.now() - startedAt > PAYMENT_POLL_MAX_MS) return false;
      return PAYMENT_POLL_INTERVAL_MS;
    },
    refetchIntervalInBackground: false
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
