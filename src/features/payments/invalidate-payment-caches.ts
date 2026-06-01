import type { QueryClient } from "@tanstack/react-query";
import { bookingsKeys } from "@/features/bookings/hooks";
import { eventsKeys, invalidateEventOperations } from "@/features/events/hooks";
import { paymentsKeys } from "@/features/payments/hooks";
import { reservationsKeys } from "@/features/reservations/hooks";
import type { Payment } from "@/features/payments/types";

export function invalidatePaymentTerminalCaches(queryClient: QueryClient, payment: Payment): void {
  void queryClient.invalidateQueries({ queryKey: paymentsKeys.all });

  if (payment.bookingId) {
    void queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
    void queryClient.invalidateQueries({ queryKey: eventsKeys.details() });
    void queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
    // O pagamento de booking não carrega eventId; invalidamos os prefixos
    // operacionais para o organizador ver summary/bookings/payments atualizados.
    invalidateEventOperations(queryClient);
  }

  if (payment.reservationId) {
    void queryClient.invalidateQueries({ queryKey: reservationsKeys.all });
  }
}
