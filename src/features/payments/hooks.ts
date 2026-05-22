"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import {
  createPaymentForBooking,
  createPaymentForReservation,
  getMyPayments,
  getPaymentById
} from "@/features/payments/api";
import { invalidatePaymentTerminalCaches } from "@/features/payments/invalidate-payment-caches";
import { PAYMENT_POLL_INTERVAL_MS, PAYMENT_POLL_MAX_MS } from "@/features/payments/polling-config";
import { bookingsKeys } from "@/features/bookings/hooks";
import { eventsKeys } from "@/features/events/hooks";
import { reservationsKeys } from "@/features/reservations/hooks";
import { createIdempotencyKey } from "@/lib/api/idempotency";
import {
  isPendingPaymentStatus,
  isTerminalPaymentStatus
} from "@/features/payments/payment-status";
import type { Payment } from "@/features/payments/types";
import type {
  CreatePaymentForBookingParams,
  CreatePaymentForReservationParams,
  PaymentListParams
} from "@/features/payments/types";

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
  /** Atualiza o pagamento enquanto status for PENDING (máx. 5 min). */
  pollWhilePending?: boolean;
};

export type PaymentQueryResult = UseQueryResult<Payment> & {
  pollTimedOut: boolean;
};

export function usePayment(paymentId: string, options: UsePaymentOptions = {}): PaymentQueryResult {
  const queryClient = useQueryClient();
  const pollStartedAtRef = useRef<number | null>(null);
  const previousStatusRef = useRef<string | undefined>(undefined);
  const [pollTimedOutFlag, setPollTimedOutFlag] = useState(false);

  useEffect(() => {
    if (!options.pollWhilePending || !paymentId) {
      pollStartedAtRef.current = null;
      previousStatusRef.current = undefined;
      return;
    }

    pollStartedAtRef.current = Date.now();
    previousStatusRef.current = undefined;
    const timeoutId = window.setTimeout(() => setPollTimedOutFlag(true), PAYMENT_POLL_MAX_MS);

    return () => {
      window.clearTimeout(timeoutId);
      setPollTimedOutFlag(false);
    };
  }, [options.pollWhilePending, paymentId]);

  const query = useQuery({
    queryKey: paymentsKeys.detail(paymentId),
    queryFn: () => getPaymentById(paymentId),
    enabled: Boolean(paymentId),
    refetchInterval: (q) => {
      if (!options.pollWhilePending || !paymentId) return false;
      const status = q.state.data?.status;
      if (!status || !isPendingPaymentStatus(status)) return false;
      const startedAt = pollStartedAtRef.current;
      if (startedAt && Date.now() - startedAt > PAYMENT_POLL_MAX_MS) return false;
      return PAYMENT_POLL_INTERVAL_MS;
    },
    refetchIntervalInBackground: false
  });

  useEffect(() => {
    if (!options.pollWhilePending || !paymentId) return;

    const payment = query.data;
    if (!payment?.status) return;

    if (isTerminalPaymentStatus(payment.status) && previousStatusRef.current !== payment.status) {
      invalidatePaymentTerminalCaches(queryClient, payment);
    }
    previousStatusRef.current = payment.status;
  }, [options.pollWhilePending, paymentId, query.data?.status, queryClient, query.data]);

  const pollTimedOut =
    pollTimedOutFlag && Boolean(query.data?.status && isPendingPaymentStatus(query.data.status));

  return { ...query, pollTimedOut };
}

export function useCreatePaymentForBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreatePaymentForBookingParams) =>
      createPaymentForBooking({
        ...params,
        idempotencyKey: params.idempotencyKey ?? createIdempotencyKey()
      }),
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

export function useCreatePaymentForReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreatePaymentForReservationParams) =>
      createPaymentForReservation({
        ...params,
        idempotencyKey: params.idempotencyKey ?? createIdempotencyKey()
      }),
    onSuccess: (payment) => {
      void queryClient.invalidateQueries({ queryKey: paymentsKeys.all });
      void queryClient.invalidateQueries({ queryKey: reservationsKeys.all });
      if (payment.id) {
        queryClient.setQueryData(paymentsKeys.detail(payment.id), payment);
      }
    }
  });
}

type UseReservationPaymentSyncOptions = {
  reservationId: string;
  paymentId: string | null;
  enabled?: boolean;
};

/** Revalida reserva enquanto pagamento estiver PENDING (checkout de arena). */
export function useReservationPaymentSync({
  reservationId,
  paymentId,
  enabled = true
}: UseReservationPaymentSyncOptions): PaymentQueryResult {
  const queryClient = useQueryClient();
  const paymentQuery = usePayment(paymentId ?? "", {
    pollWhilePending: Boolean(paymentId) && enabled
  });

  useEffect(() => {
    if (!enabled || !paymentId) return;
    const status = paymentQuery.data?.status;
    if (!status || !isPendingPaymentStatus(status)) return;

    void queryClient.invalidateQueries({ queryKey: reservationsKeys.detail(reservationId) });
  }, [enabled, paymentId, paymentQuery.data?.status, queryClient, reservationId]);

  return paymentQuery;
}
