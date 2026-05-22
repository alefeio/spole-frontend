import { ReservationCard } from "@/features/reservations/components/reservation-card";
import type { ReservationListItem } from "@/features/reservations/types";

export function ReservationList({ reservations }: { reservations: ReservationListItem[] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {reservations.map((reservation) => (
        <ReservationCard key={reservation.id} reservation={reservation} />
      ))}
    </div>
  );
}
