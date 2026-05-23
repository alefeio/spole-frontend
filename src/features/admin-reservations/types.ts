import type { AdminListParams } from "@/features/admin/types";
import type { ReservationStatus, ReservationType } from "@/features/reservations/types";

export type AdminReservationListItem = {
  id: string;
  slotId: string;
  organizerId: string;
  type: ReservationType;
  status: ReservationStatus;
  createdAt: string;
};

export type AdminReservationsListParams = AdminListParams & {
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "CONSUMED";
  organizerId?: string;
  type?: "SINGLE" | "RECURRING";
};
