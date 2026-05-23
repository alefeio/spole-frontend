"use client";

import { useQuery } from "@tanstack/react-query";
import { adminKeys } from "@/features/admin/hooks";
import { listAdminAuditLogs } from "@/features/admin-audit/api";
import type { AdminAuditLogsListParams } from "@/features/admin-audit/types";

export const adminAuditKeys = {
  all: [...adminKeys.all, "audit"] as const,
  lists: () => [...adminAuditKeys.all, "list"] as const,
  list: (params: AdminAuditLogsListParams) => [...adminAuditKeys.lists(), params] as const
};

export function useAdminAuditLogs(params: AdminAuditLogsListParams) {
  return useQuery({
    queryKey: adminAuditKeys.list(params),
    queryFn: () => listAdminAuditLogs(params),
    placeholderData: (prev) => prev
  });
}
