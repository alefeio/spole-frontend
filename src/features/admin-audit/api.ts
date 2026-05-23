import { normalizeAdminMeta } from "@/features/admin/utils";
import type { AdminListResponse } from "@/features/admin/types";
import type { AdminAuditLogItem, AdminAuditLogsListParams } from "@/features/admin-audit/types";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export async function listAdminAuditLogs(
  params: AdminAuditLogsListParams = {}
): Promise<AdminListResponse<AdminAuditLogItem>> {
  const { data, meta } = await apiClient<AdminAuditLogItem[]>(endpoints.admin.auditLogs.list, {
    query: {
      page: params.page,
      limit: params.limit,
      actorUserId: params.actorUserId,
      resourceType: params.resourceType,
      action: params.action,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo
    }
  });

  return { data, meta: normalizeAdminMeta(meta, params, data.length) };
}
