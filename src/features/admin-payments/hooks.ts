"use client";

import { useQuery } from "@tanstack/react-query";
import { adminKeys } from "@/features/admin/hooks";
import { listAdminPayments } from "@/features/admin-payments/api";
import type { AdminPaymentsListParams } from "@/features/admin-payments/types";

export const adminPaymentsKeys = {
  all: [...adminKeys.all, "payments"] as const,
  lists: () => [...adminPaymentsKeys.all, "list"] as const,
  list: (params: AdminPaymentsListParams) => [...adminPaymentsKeys.lists(), params] as const
};

export function useAdminPayments(params: AdminPaymentsListParams) {
  return useQuery({
    queryKey: adminPaymentsKeys.list(params),
    queryFn: () => listAdminPayments(params),
    placeholderData: (prev) => prev
  });
}
