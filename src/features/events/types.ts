export type EventType = "FREE" | "PAID";

export type EventVisibility = "PUBLIC" | "PRIVATE";

export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED";

export type EventSourceType = "FREE_LOCATION" | "ARENA_RESERVATION";

export type Event = {
  id: string;
  title: string;
  type: EventType;
  visibility: EventVisibility;
  city: string;
  state: string;
  startAt: string;
  capacity: number;
  pricePerPerson: number | null;
};

/** Detalhe público ou reduzido (visitante / catálogo). */
export type EventDetails = Event & {
  description: string | null;
  status: EventStatus;
  sourceType: EventSourceType;
  endAt: string;
  addressName: string;
  privateCode?: string;
  reservationId?: string;
};

/** Detalhe completo para organizador/admin (GET /events/:id autenticado como dono). */
export type OrganizerEventDetail = EventDetails & {
  categoryId: string;
  street: string;
  number: string;
  district: string;
  locationReadOnly: boolean;
};

export function isOrganizerEventDetail(
  event: EventDetails | OrganizerEventDetail
): event is OrganizerEventDetail {
  return "categoryId" in event && typeof event.categoryId === "string";
}

export type OrganizerEventListItem = {
  id: string;
  title: string;
  status: EventStatus;
  visibility: EventVisibility;
  type: EventType;
  sourceType: EventSourceType;
  categoryId: string;
  startAt: string;
  endAt: string;
  city: string;
  state: string;
  capacity: number;
  pricePerPerson: number | null;
  createdAt: string;
  updatedAt: string;
};

export type OrganizerEventsListParams = {
  page?: number;
  limit?: number;
  q?: string;
  status?: EventStatus;
  visibility?: EventVisibility;
  type?: EventType;
  sourceType?: EventSourceType;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: "startAt" | "createdAt" | "updatedAt";
  order?: "asc" | "desc";
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  sort?: "startAt" | "createdAt" | "updatedAt";
  order?: "asc" | "desc";
};

export type OrganizerEventsListResponse = {
  data: OrganizerEventListItem[];
  meta: PaginationMeta;
};

export type EventCategory = {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  status?: "ACTIVE" | "INACTIVE";
};

export type EventListParams = {
  q?: string;
  page?: number;
  limit?: number;
  category?: string;
};

export type EventListResponse = {
  data: Event[];
  meta: PaginationMeta;
};

export type EventDetailsParams = {
  privateCode?: string;
};

export type FreeEventParticipation = {
  id: string;
  eventId: string;
  userId: string;
  status: "CONFIRMED" | string;
};

export type JoinFreeEventParams = {
  eventId: string;
  privateCode?: string;
};

export type CreateFreeLocationEventPayload = {
  categoryId: string;
  title: string;
  description?: string;
  type: EventType;
  visibility: EventVisibility;
  sourceType: "FREE_LOCATION";
  status: "DRAFT" | "PUBLISHED";
  startAt: string;
  endAt: string;
  addressName: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  capacity: number;
  pricePerPerson?: number | null;
  privateCode?: string;
};

export type CreateArenaReservationEventPayload = {
  categoryId: string;
  reservationId: string;
  title: string;
  description?: string;
  type: EventType;
  visibility: EventVisibility;
  sourceType: "ARENA_RESERVATION";
  status: "DRAFT" | "PUBLISHED";
  capacity: number;
  pricePerPerson?: number | null;
  privateCode?: string;
};

export type CreateEventPayload =
  | CreateFreeLocationEventPayload
  | CreateArenaReservationEventPayload;

export type CreateEventResponse = {
  id: string;
  title: string;
  type: EventType;
  visibility: EventVisibility;
  status: EventStatus;
  privateCode?: string;
};

export type UpdateEventPayload = {
  categoryId?: string;
  title?: string;
  description?: string | null;
  type?: EventType;
  visibility?: EventVisibility;
  status?: "DRAFT" | "PUBLISHED";
  startAt?: string;
  endAt?: string;
  addressName?: string;
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
  capacity?: number;
  pricePerPerson?: number | null;
  privateCode?: string;
};

export type UpdateEventResponse = {
  id: string;
  title: string;
};

export type CancelEventResponse = {
  id: string;
  status: "CANCELLED";
};

export type EventParticipant = {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  createdAt: string;
};

export type EventOperationsSummary = {
  eventId: string;
  capacity: number;
  confirmedParticipants: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  expiredBookings: number;
  paidPaymentsCount: number;
  pendingPaymentsCount: number;
  grossRevenue: number;
  netRevenue: number;
  remainingSpots: number;
};

export type EventBookingListItem = {
  id: string;
  userId: string;
  status: string;
  reservedAt: string;
  expiresAt: string;
  purchaseCompletedAt: string | null;
};

export type EventBookingsListParams = {
  page?: number;
  limit?: number;
  status?: "RESERVED" | "EXPIRED" | "CANCELLED" | "COMPLETED";
  sort?: "reservedAt" | "createdAt";
  order?: "asc" | "desc";
};

export type EventBookingsListResponse = {
  data: EventBookingListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

export type EventPaymentListItem = {
  id: string;
  bookingId: string;
  status: string;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  method: string;
  provider: string;
  providerReference: string;
  paidAt: string | null;
};

export type EventPaymentsListParams = {
  page?: number;
  limit?: number;
  status?: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  sort?: "createdAt" | "paidAt";
  order?: "asc" | "desc";
};

export type EventPaymentsListResponse = {
  data: EventPaymentListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};
