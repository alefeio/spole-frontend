export type EventType = "FREE" | "PAID";

export type EventVisibility = "PUBLIC" | "PRIVATE";

export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "FINISHED";

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
