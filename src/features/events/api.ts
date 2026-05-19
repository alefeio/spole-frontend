import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  Event,
  EventCategory,
  EventListParams,
  EventListResponse
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
