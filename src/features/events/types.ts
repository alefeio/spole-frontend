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

export type EventDetails = Event & {
  description: string | null;
  status: EventStatus;
  sourceType: EventSourceType;
  endAt: string;
  addressName: string;
  privateCode?: string;
  reservationId?: string;
};

export type EventCategory = {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  status?: "ACTIVE" | "INACTIVE";
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  sort?: "startAt";
  order?: "asc" | "desc";
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
