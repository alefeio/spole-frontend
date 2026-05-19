import { BookingCard } from "@/features/bookings/components/booking-card";
import type { Booking } from "@/features/bookings/types";

export function BookingList({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}
