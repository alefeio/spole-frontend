"use client";

import { useQuery } from "@tanstack/react-query";
import { adminKeys } from "@/features/admin/hooks";
import { listAdminBookings } from "@/features/admin-bookings/api";
import type { AdminBookingsListParams } from "@/features/admin-bookings/types";

export const adminBookingsKeys = {
  all: [...adminKeys.all, "bookings"] as const,
  lists: () => [...adminBookingsKeys.all, "list"] as const,
  list: (params: AdminBookingsListParams) => [...adminBookingsKeys.lists(), params] as const
};

export function useAdminBookings(params: AdminBookingsListParams) {
  return useQuery({
    queryKey: adminBookingsKeys.list(params),
    queryFn: () => listAdminBookings(params),
    placeholderData: (prev) => prev
  });
}
