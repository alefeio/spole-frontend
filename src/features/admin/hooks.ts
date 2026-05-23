"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminHubTotals } from "@/features/admin/api";

export const adminKeys = {
  all: ["admin"] as const,
  hubTotals: () => [...adminKeys.all, "hub-totals"] as const
};

export function useAdminHubTotals(enabled = true) {
  return useQuery({
    queryKey: adminKeys.hubTotals(),
    queryFn: fetchAdminHubTotals,
    enabled,
    staleTime: 60_000
  });
}
