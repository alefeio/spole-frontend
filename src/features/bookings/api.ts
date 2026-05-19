import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  Booking,
  BookingListParams,
  BookingListResponse,
  CancelBookingResponse,
  CreateBookingParams
} from "@/features/bookings/types";

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

export async function getMyBookings(params: BookingListParams = {}): Promise<BookingListResponse> {
  const { data, meta } = await apiClient<Booking[]>(endpoints.users.myBookings, {
    query: {
      page: params.page,
      limit: params.limit
    }
  });

  return {
    data,
    meta: {
      page: Number(meta?.page ?? params.page ?? 1),
      limit: Number(meta?.limit ?? params.limit ?? 10),
      total: Number(meta?.total ?? data.length)
    }
  };
}

export async function cancelBooking(bookingId: string): Promise<CancelBookingResponse> {
  const { data } = await apiClient<CancelBookingResponse>(endpoints.bookings.cancel(bookingId), {
    method: "PATCH"
  });

  return data;
}
