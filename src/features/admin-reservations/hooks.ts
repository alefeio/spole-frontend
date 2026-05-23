"use client";

import { useQuery } from "@tanstack/react-query";
import { adminKeys } from "@/features/admin/hooks";
import { listAdminReservations } from "@/features/admin-reservations/api";
import type { AdminReservationsListParams } from "@/features/admin-reservations/types";

export const adminReservationsKeys = {
  all: [...adminKeys.all, "reservations"] as const,
  lists: () => [...adminReservationsKeys.all, "list"] as const,
  list: (params: AdminReservationsListParams) => [...adminReservationsKeys.lists(), params] as const
};

export function useAdminReservations(params: AdminReservationsListParams) {
  return useQuery({
    queryKey: adminReservationsKeys.list(params),
    queryFn: () => listAdminReservations(params),
    placeholderData: (prev) => prev
  });
}
