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
  EventParticipant,
  FreeEventParticipation,
  JoinFreeEventParams,
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
): Promise<EventDetails> {
  const { data } = await apiClient<EventDetails>(endpoints.events.byId(eventId), {
    query: {
      privateCode: params.privateCode
    }
  });

  return data;
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
