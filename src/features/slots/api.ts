import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { SlotListParams, SlotListResponse } from "@/features/slots/types";

export async function listSlotsBySpace(
  spaceId: string,
  params: SlotListParams = {}
): Promise<SlotListResponse> {
  const { data, meta } = await apiClient<SlotListResponse["data"]>(
    endpoints.spaces.slots(spaceId),
    {
      token: null,
      query: {
        page: params.page,
        limit: params.limit,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo
      }
    }
  );

  return {
    data,
    meta: {
      page: Number(meta?.page ?? params.page ?? 1),
      limit: Number(meta?.limit ?? params.limit ?? 50),
      total: Number(meta?.total ?? data.length)
    }
  };
}
