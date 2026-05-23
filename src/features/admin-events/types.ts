import type { AdminListParams } from "@/features/admin/types";
import type { EventStatus, EventType } from "@/features/events/types";

export type AdminEventListItem = {
  id: string;
  title: string;
  status: EventStatus;
  type: EventType;
  organizerId: string;
  city: string;
  startAt: string;
  createdAt: string;
};

export type AdminEventsListParams = AdminListParams & {
  status?: EventStatus;
  type?: EventType;
  organizerId?: string;
  city?: string;
};

export type PatchAdminEventStatusPayload = {
  status: "CANCELLED";
  reason: string;
};
