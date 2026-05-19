"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "@/features/bookings/api";
import type { CreateBookingParams } from "@/features/bookings/types";
import { eventsKeys } from "@/features/events/hooks";

export const bookingsKeys = {
  all: ["bookings"] as const,
  myBookings: () => [...bookingsKeys.all, "me"] as const
};

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateBookingParams) => createBooking(params),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
      void queryClient.invalidateQueries({ queryKey: eventsKeys.details() });
      void queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
    }
  });
}
