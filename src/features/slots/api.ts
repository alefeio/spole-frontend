import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { SlotListParams, SlotListResponse } from "@/features/slots/types";

export async function listSlotsBySpace(
  spaceId: string,
  params: SlotListParams = {},
  options?: { token?: string | null }
): Promise<SlotListResponse> {
  const { data, meta } = await apiClient<SlotListResponse["data"]>(
    endpoints.spaces.slots(spaceId),
    {
      token: options?.token === undefined ? null : options.token,
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

export type CreateSlotPayload = {
  startAt: string;
  endAt: string;
  price: number;
  allowsRecurring: boolean;
  notes?: string;
};

export async function createSlot(
  spaceId: string,
  payload: CreateSlotPayload
): Promise<{ id: string; status: string }> {
  const { data } = await apiClient<{ id: string; status: string }>(
    endpoints.spaces.slots(spaceId),
    { method: "POST", body: payload }
  );
  return data;
}
