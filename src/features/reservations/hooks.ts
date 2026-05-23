"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelReservation,
  createReservation,
  getReservationById,
  listMyReservations
} from "@/features/reservations/api";
import type { CreateReservationPayload } from "@/features/reservations/types";
import { slotsKeys } from "@/features/slots/hooks";

export const reservationsKeys = {
  all: ["reservations"] as const,
  me: () => [...reservationsKeys.all, "me"] as const,
  details: () => [...reservationsKeys.all, "detail"] as const,
  detail: (reservationId: string) => [...reservationsKeys.details(), reservationId] as const
};

export function useMyReservations() {
  return useQuery({
    queryKey: reservationsKeys.me(),
    queryFn: listMyReservations
  });
}

export function useReservation(reservationId: string) {
  return useQuery({
    queryKey: reservationsKeys.detail(reservationId),
    queryFn: () => getReservationById(reservationId),
    enabled: Boolean(reservationId)
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReservationPayload) => createReservation(payload),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: reservationsKeys.all });
      void queryClient.invalidateQueries({ queryKey: reservationsKeys.detail(data.id) });
      void queryClient.invalidateQueries({ queryKey: slotsKeys.all });
    }
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservationId: string) => cancelReservation(reservationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reservationsKeys.all });
      void queryClient.invalidateQueries({ queryKey: slotsKeys.all });
    }
  });
}
