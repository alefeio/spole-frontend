import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/features/bookings/components/booking-status-badge";
import type { Booking } from "@/features/bookings/types";

type CheckoutBookingSummaryProps = {
  booking: Booking;
};

function formatDate(value?: string) {
  if (!value) return "Nao informado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Nao informado";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function CheckoutBookingSummary({ booking }: CheckoutBookingSummaryProps) {
  return (
    <section className="space-y-4 rounded-xl border p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">Resumo da reserva</h2>
          <p className="text-muted-foreground text-sm break-all">Booking {booking.id}</p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Evento</dt>
          <dd className="font-medium break-all">{booking.eventId}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Reservado em</dt>
          <dd className="font-medium">{formatDate(booking.reservedAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Expira em</dt>
          <dd className="font-medium">{formatDate(booking.expiresAt)}</dd>
        </div>
      </dl>

      <Button asChild variant="outline" className="min-h-11 w-full sm:min-h-9 sm:w-auto">
        <Link href={`/events/${booking.eventId}`}>Ver evento</Link>
      </Button>
    </section>
  );
}
