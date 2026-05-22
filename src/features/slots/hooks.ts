"use client";

import { useQuery } from "@tanstack/react-query";
import { listSlotsBySpace } from "@/features/slots/api";
import type { SlotListParams } from "@/features/slots/types";

export const slotsKeys = {
  all: ["slots"] as const,
  lists: () => [...slotsKeys.all, "list"] as const,
  list: (spaceId: string, params: SlotListParams) =>
    [...slotsKeys.lists(), spaceId, params] as const
};

export function useSlotsBySpace(spaceId: string, params: SlotListParams) {
  return useQuery({
    queryKey: slotsKeys.list(spaceId, params),
    queryFn: () => listSlotsBySpace(spaceId, params),
    enabled: Boolean(spaceId) && Boolean(params.dateFrom) && Boolean(params.dateTo)
  });
}
