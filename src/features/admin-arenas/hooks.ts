"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminKeys } from "@/features/admin/hooks";
import { listAdminArenas, patchAdminArenaStatus } from "@/features/admin-arenas/api";
import type {
  AdminArenasListParams,
  PatchAdminArenaStatusPayload
} from "@/features/admin-arenas/types";

export const adminArenasKeys = {
  all: [...adminKeys.all, "arenas"] as const,
  lists: () => [...adminArenasKeys.all, "list"] as const,
  list: (params: AdminArenasListParams) => [...adminArenasKeys.lists(), params] as const
};

export function useAdminArenas(params: AdminArenasListParams) {
  return useQuery({
    queryKey: adminArenasKeys.list(params),
    queryFn: () => listAdminArenas(params),
    placeholderData: (prev) => prev
  });
}

export function usePatchAdminArenaStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      arenaId,
      payload
    }: {
      arenaId: string;
      payload: PatchAdminArenaStatusPayload;
    }) => patchAdminArenaStatus(arenaId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: adminArenasKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminKeys.hubTotals() });
      void queryClient.invalidateQueries({ queryKey: [...adminKeys.all, "audit"] });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "arena-detail", variables.arenaId]
      });
    }
  });
}
