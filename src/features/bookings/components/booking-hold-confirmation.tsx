import type { Booking } from "@/features/bookings/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type BookingHoldConfirmationProps = {
  booking: Booking;
};

function formatExpiration(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "prazo informado pela API";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function BookingHoldConfirmation({ booking }: BookingHoldConfirmationProps) {
  return (
    <div className="border-primary/30 bg-primary/5 rounded-lg border p-3 text-sm">
      <p className="text-primary font-medium">Reserva temporária criada.</p>
      <p className="text-muted-foreground mt-1">
        Status: <span className="font-medium">{booking.status}</span>. A reserva expira em{" "}
        {formatExpiration(booking.expiresAt)}. O pagamento mock será tratado em uma próxima etapa.
      </p>
      <Button asChild className="mt-3 min-h-11 w-full sm:min-h-9">
        <Link href={`/checkout/${booking.id}`}>Continuar pagamento</Link>
      </Button>
    </div>
  );
}
