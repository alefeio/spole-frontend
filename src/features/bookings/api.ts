import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Booking, CreateBookingParams } from "@/features/bookings/types";

export async function createBooking({
  eventId,
  privateCode
}: CreateBookingParams): Promise<Booking> {
  const { data } = await apiClient<Booking>(endpoints.events.bookings(eventId), {
    method: "POST",
    query: {
      privateCode
    }
  });

  return data;
}
