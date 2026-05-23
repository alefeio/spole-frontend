"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminKeys } from "@/features/admin/hooks";
import { listAdminEvents, patchAdminEventStatus } from "@/features/admin-events/api";
import type {
  AdminEventsListParams,
  PatchAdminEventStatusPayload
} from "@/features/admin-events/types";
import { eventsKeys } from "@/features/events/hooks";

export const adminEventsKeys = {
  all: [...adminKeys.all, "events"] as const,
  lists: () => [...adminEventsKeys.all, "list"] as const,
  list: (params: AdminEventsListParams) => [...adminEventsKeys.lists(), params] as const
};

export function useAdminEvents(params: AdminEventsListParams) {
  return useQuery({
    queryKey: adminEventsKeys.list(params),
    queryFn: () => listAdminEvents(params),
    placeholderData: (prev) => prev
  });
}

export function usePatchAdminEventStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      payload
    }: {
      eventId: string;
      payload: PatchAdminEventStatusPayload;
    }) => patchAdminEventStatus(eventId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: adminEventsKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminKeys.hubTotals() });
      void queryClient.invalidateQueries({ queryKey: [...adminKeys.all, "audit"] });
      void queryClient.invalidateQueries({ queryKey: eventsKeys.detail(variables.eventId) });
      void queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    }
  });
}
