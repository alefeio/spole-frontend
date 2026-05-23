import { normalizeAdminMeta } from "@/features/admin/utils";
import type { AdminListResponse } from "@/features/admin/types";
import type {
  AdminArenaListItem,
  AdminArenasListParams,
  PatchAdminArenaStatusPayload
} from "@/features/admin-arenas/types";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export async function listAdminArenas(
  params: AdminArenasListParams = {}
): Promise<AdminListResponse<AdminArenaListItem>> {
  const { data, meta } = await apiClient<AdminArenaListItem[]>(endpoints.admin.arenas.list, {
    query: {
      page: params.page,
      limit: params.limit,
      status: params.status,
      ownerId: params.ownerId,
      city: params.city
    }
  });

  return { data, meta: normalizeAdminMeta(meta, params, data.length) };
}

export async function patchAdminArenaStatus(
  arenaId: string,
  payload: PatchAdminArenaStatusPayload
): Promise<{ id: string; status: string }> {
  const { data } = await apiClient<{ id: string; status: string }>(
    endpoints.admin.arenas.updateStatus(arenaId),
    { method: "PATCH", body: payload }
  );
  return data;
}
