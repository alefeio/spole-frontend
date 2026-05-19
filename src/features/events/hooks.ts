"use client";

import { useQuery } from "@tanstack/react-query";
import { listCategories, listEvents } from "@/features/events/api";
import type { EventListParams } from "@/features/events/types";

export const eventsKeys = {
  all: ["events"] as const,
  lists: () => [...eventsKeys.all, "list"] as const,
  list: (params: EventListParams) => [...eventsKeys.lists(), params] as const,
  categories: () => [...eventsKeys.all, "categories"] as const
};

export function useEvents(params: EventListParams) {
  return useQuery({
    queryKey: eventsKeys.list(params),
    queryFn: () => listEvents(params),
    placeholderData: (previousData) => previousData
  });
}

export function useEventCategories() {
  return useQuery({
    queryKey: eventsKeys.categories(),
    queryFn: listCategories,
    staleTime: 5 * 60 * 1000
  });
}
