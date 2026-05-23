import type { AdminListParams } from "@/features/admin/types";

export type AdminAuditResourceType = "USER" | "ARENA" | "EVENT";

export type AdminAuditLogItem = {
  id: string;
  actorUserId: string;
  action: string;
  resourceType: AdminAuditResourceType;
  resourceId: string;
  reason: string | null;
  metadata: unknown;
  createdAt: string;
};

export type AdminAuditLogsListParams = AdminListParams & {
  actorUserId?: string;
  resourceType?: AdminAuditResourceType;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
};
