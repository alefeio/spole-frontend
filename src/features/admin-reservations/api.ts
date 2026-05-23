import { normalizeAdminMeta } from "@/features/admin/utils";
import type { AdminListResponse } from "@/features/admin/types";
import type {
  AdminReservationListItem,
  AdminReservationsListParams
} from "@/features/admin-reservations/types";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export async function listAdminReservations(
  params: AdminReservationsListParams = {}
): Promise<AdminListResponse<AdminReservationListItem>> {
  const { data, meta } = await apiClient<AdminReservationListItem[]>(
    endpoints.admin.reservations.list,
    {
      query: {
        page: params.page,
        limit: params.limit,
        status: params.status,
        organizerId: params.organizerId,
        type: params.type
      }
    }
  );

  return { data, meta: normalizeAdminMeta(meta, params, data.length) };
}
