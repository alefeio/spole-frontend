import type { QueryClient } from "@tanstack/react-query";
import { bookingsKeys } from "@/features/bookings/hooks";
import { eventsKeys } from "@/features/events/hooks";
import { paymentsKeys } from "@/features/payments/hooks";
import { reservationsKeys } from "@/features/reservations/hooks";
import type { Payment } from "@/features/payments/types";

export function invalidatePaymentTerminalCaches(queryClient: QueryClient, payment: Payment): void {
  void queryClient.invalidateQueries({ queryKey: paymentsKeys.all });

  if (payment.bookingId) {
    void queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
    void queryClient.invalidateQueries({ queryKey: eventsKeys.details() });
    void queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
  }

  if (payment.reservationId) {
    void queryClient.invalidateQueries({ queryKey: reservationsKeys.all });
  }
}
