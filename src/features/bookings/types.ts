export type BookingStatus = "RESERVED" | "EXPIRED" | "CANCELLED" | "COMPLETED";

export type Booking = {
  id: string;
  eventId: string;
  userId: string;
  status: BookingStatus;
  expiresAt: string;
};

export type CreateBookingParams = {
  eventId: string;
  privateCode?: string;
};
