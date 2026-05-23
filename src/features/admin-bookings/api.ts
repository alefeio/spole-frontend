import { normalizeAdminMeta } from "@/features/admin/utils";
import type { AdminListResponse } from "@/features/admin/types";
import type {
  AdminBookingListItem,
  AdminBookingsListParams
} from "@/features/admin-bookings/types";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export async function listAdminBookings(
  params: AdminBookingsListParams = {}
): Promise<AdminListResponse<AdminBookingListItem>> {
  const { data, meta } = await apiClient<AdminBookingListItem[]>(endpoints.admin.bookings.list, {
    query: {
      page: params.page,
      limit: params.limit,
      status: params.status,
      userId: params.userId,
      eventId: params.eventId
    }
  });

  return { data, meta: normalizeAdminMeta(meta, params, data.length) };
}
