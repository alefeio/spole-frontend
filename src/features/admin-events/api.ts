import { normalizeAdminMeta } from "@/features/admin/utils";
import type { AdminListResponse } from "@/features/admin/types";
import type {
  AdminEventListItem,
  AdminEventsListParams,
  PatchAdminEventStatusPayload
} from "@/features/admin-events/types";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export async function listAdminEvents(
  params: AdminEventsListParams = {}
): Promise<AdminListResponse<AdminEventListItem>> {
  const { data, meta } = await apiClient<AdminEventListItem[]>(endpoints.admin.events.list, {
    query: {
      page: params.page,
      limit: params.limit,
      status: params.status,
      type: params.type,
      organizerId: params.organizerId,
      city: params.city
    }
  });

  return { data, meta: normalizeAdminMeta(meta, params, data.length) };
}

export async function patchAdminEventStatus(
  eventId: string,
  payload: PatchAdminEventStatusPayload
): Promise<{ id: string; status: string }> {
  const { data } = await apiClient<{ id: string; status: string }>(
    endpoints.admin.events.updateStatus(eventId),
    { method: "PATCH", body: payload }
  );
  return data;
}
