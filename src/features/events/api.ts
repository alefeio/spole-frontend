import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  CancelEventResponse,
  CreateEventPayload,
  CreateEventResponse,
  Event,
  EventCategory,
  EventDetails,
  EventDetailsParams,
  EventListParams,
  EventListResponse,
  EventBookingsListParams,
  EventBookingsListResponse,
  EventOperationsSummary,
  EventParticipant,
  EventPaymentsListParams,
  EventPaymentsListResponse,
  FreeEventParticipation,
  JoinFreeEventParams,
  OrganizerEventDetail,
  OrganizerEventListItem,
  OrganizerEventsListParams,
  OrganizerEventsListResponse,
  UpdateEventPayload,
  UpdateEventResponse
} from "@/features/events/types";

export async function listEvents(params: EventListParams = {}): Promise<EventListResponse> {
  const { data, meta } = await apiClient<Event[]>(endpoints.events.list, {
    query: {
      q: params.q,
      page: params.page,
      limit: params.limit,
      category: params.category
    },
    token: null
  });

  return {
    data,
    meta: {
      page: Number(meta?.page ?? params.page ?? 1),
      limit: Number(meta?.limit ?? params.limit ?? 10),
      total: Number(meta?.total ?? data.length),
      sort: meta?.sort === "startAt" ? "startAt" : undefined,
      order: meta?.order === "desc" ? "desc" : meta?.order === "asc" ? "asc" : undefined
    }
  };
}

export async function listCategories(): Promise<EventCategory[]> {
  const { data } = await apiClient<EventCategory[]>(endpoints.categories.list, {
    token: null
  });

  return data;
}

export async function getEventById(
  eventId: string,
  params: EventDetailsParams = {}
): Promise<EventDetails | OrganizerEventDetail> {
  const { data } = await apiClient<EventDetails | OrganizerEventDetail>(
    endpoints.events.byId(eventId),
    {
      query: {
        privateCode: params.privateCode
      }
    }
  );

  return data;
}

export async function listMyEvents(
  params: OrganizerEventsListParams = {}
): Promise<OrganizerEventsListResponse> {
  const { data, meta } = await apiClient<OrganizerEventListItem[]>(endpoints.users.myEvents, {
    query: {
      page: params.page,
      limit: params.limit,
      q: params.q,
      status: params.status,
      visibility: params.visibility,
      type: params.type,
      sourceType: params.sourceType,
      categoryId: params.categoryId,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      sort: params.sort,
      order: params.order
    }
  });

  const sort = meta?.sort;
  const validSort =
    sort === "startAt" || sort === "createdAt" || sort === "updatedAt" ? sort : undefined;

  return {
    data,
    meta: {
      page: Number(meta?.page ?? params.page ?? 1),
      limit: Number(meta?.limit ?? params.limit ?? 10),
      total: Number(meta?.total ?? data.length),
      sort: validSort,
      order: meta?.order === "desc" ? "desc" : meta?.order === "asc" ? "asc" : undefined
    }
  };
}

export async function joinFreeEvent({
  eventId,
  privateCode
}: JoinFreeEventParams): Promise<FreeEventParticipation> {
  const { data } = await apiClient<FreeEventParticipation>(endpoints.events.joinFree(eventId), {
    method: "POST",
    query: {
      privateCode
    }
  });

  return data;
}

export async function createEvent(payload: CreateEventPayload): Promise<CreateEventResponse> {
  const { data } = await apiClient<CreateEventResponse>(endpoints.events.list, {
    method: "POST",
    body: payload
  });

  return data;
}

export async function updateEvent(
  eventId: string,
  payload: UpdateEventPayload
): Promise<UpdateEventResponse> {
  const { data } = await apiClient<UpdateEventResponse>(endpoints.events.byId(eventId), {
    method: "PATCH",
    body: payload
  });

  return data;
}

export async function cancelEvent(eventId: string): Promise<CancelEventResponse> {
  const { data } = await apiClient<CancelEventResponse>(endpoints.events.byId(eventId), {
    method: "DELETE"
  });

  return data;
}

export async function listEventParticipants(eventId: string): Promise<EventParticipant[]> {
  const { data } = await apiClient<EventParticipant[]>(endpoints.events.participants(eventId));
  return data;
}

export async function getEventSummary(eventId: string): Promise<EventOperationsSummary> {
  const { data } = await apiClient<EventOperationsSummary>(endpoints.events.summary(eventId));
  return data;
}

export async function listEventBookings(
  eventId: string,
  params: EventBookingsListParams = {}
): Promise<EventBookingsListResponse> {
  const { data, meta } = await apiClient<EventBookingsListResponse["data"]>(
    endpoints.events.bookings(eventId),
    {
      query: {
        page: params.page,
        limit: params.limit,
        status: params.status,
        sort: params.sort,
        order: params.order
      }
    }
  );

  return {
    data,
    meta: {
      page: Number(meta?.page ?? params.page ?? 1),
      limit: Number(meta?.limit ?? params.limit ?? 10),
      total: Number(meta?.total ?? data.length)
    }
  };
}

export async function listEventPayments(
  eventId: string,
  params: EventPaymentsListParams = {}
): Promise<EventPaymentsListResponse> {
  const { data, meta } = await apiClient<EventPaymentsListResponse["data"]>(
    endpoints.events.payments(eventId),
    {
      query: {
        page: params.page,
        limit: params.limit,
        status: params.status,
        sort: params.sort,
        order: params.order
      }
    }
  );

  return {
    data,
    meta: {
      page: Number(meta?.page ?? params.page ?? 1),
      limit: Number(meta?.limit ?? params.limit ?? 10),
      total: Number(meta?.total ?? data.length)
    }
  };
}
