import type { AdminListParams } from "@/features/admin/types";

export type AdminBookingListItem = {
  id: string;
  eventId: string;
  userId: string;
  status: "RESERVED" | "EXPIRED" | "CANCELLED" | "COMPLETED";
  expiresAt: string | null;
  createdAt: string;
};

export type AdminBookingsListParams = AdminListParams & {
  status?: AdminBookingListItem["status"];
  userId?: string;
  eventId?: string;
};
