import { normalizeAdminMeta } from "@/features/admin/utils";
import type { AdminListResponse } from "@/features/admin/types";
import type {
  AdminPaymentListItem,
  AdminPaymentsListParams
} from "@/features/admin-payments/types";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export async function listAdminPayments(
  params: AdminPaymentsListParams = {}
): Promise<AdminListResponse<AdminPaymentListItem>> {
  const { data, meta } = await apiClient<AdminPaymentListItem[]>(endpoints.admin.payments.list, {
    query: {
      page: params.page,
      limit: params.limit,
      status: params.status,
      userId: params.userId,
      bookingId: params.bookingId,
      reservationId: params.reservationId
    }
  });

  return { data, meta: normalizeAdminMeta(meta, params, data.length) };
}
