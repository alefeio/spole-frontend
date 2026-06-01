"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelBooking, createBooking, getMyBookings } from "@/features/bookings/api";
import type { BookingListParams, CreateBookingParams } from "@/features/bookings/types";
import { createIdempotencyKey } from "@/lib/api/idempotency";
import { eventsKeys, invalidateEventOperations } from "@/features/events/hooks";
import { notificationsKeys } from "@/features/notifications/hooks";

export const bookingsKeys = {
  all: ["bookings"] as const,
  myBookings: () => [...bookingsKeys.all, "me"] as const,
  myBookingsList: (params: BookingListParams) => [...bookingsKeys.myBookings(), params] as const
};

export function useMyBookings(params: BookingListParams = {}) {
  return useQuery({
    queryKey: bookingsKeys.myBookingsList(params),
    queryFn: () => getMyBookings(params)
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateBookingParams) =>
      createBooking({
        ...params,
        idempotencyKey: params.idempotencyKey ?? createIdempotencyKey()
      }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
      void queryClient.invalidateQueries({ queryKey: eventsKeys.details() });
      void queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
      invalidateEventOperations(queryClient, variables.eventId);
    }
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
      void queryClient.invalidateQueries({ queryKey: eventsKeys.details() });
      void queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
      invalidateEventOperations(queryClient);
    }
  });
}
