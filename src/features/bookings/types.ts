export type BookingStatus = "RESERVED" | "EXPIRED" | "CANCELLED" | "COMPLETED";

export type Booking = {
  id: string;
  eventId: string;
  userId: string;
  status: BookingStatus;
  reservedAt?: string;
  expiresAt: string;
};

export type CreateBookingParams = {
  eventId: string;
  privateCode?: string;
};

export type BookingListParams = {
  page?: number;
  limit?: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

export type BookingListResponse = {
  data: Booking[];
  meta: PaginationMeta;
};

export type CancelBookingResponse = {
  id: string;
  status: "CANCELLED";
};
