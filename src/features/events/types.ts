export type EventType = "FREE" | "PAID";

export type EventVisibility = "PUBLIC" | "PRIVATE";

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
