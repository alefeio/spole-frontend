import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  Arena,
  ArenaSpace,
  PublicArenasListParams,
  PublicArenasListResponse,
  PublicArenaListItem
} from "@/features/arenas/types";

export async function listArenas(
  params: PublicArenasListParams = {}
): Promise<PublicArenasListResponse> {
  const { data, meta } = await apiClient<PublicArenaListItem[]>(endpoints.arenas.list, {
    query: {
      page: params.page,
      limit: params.limit,
      q: params.q,
      city: params.city,
      state: params.state,
      district: params.district,
      sort: params.sort,
      order: params.order
    },
    token: null
  });

  return {
    data,
    meta: {
      page: Number(meta?.page ?? params.page ?? 1),
      limit: Number(meta?.limit ?? params.limit ?? 10),
      total: Number(meta?.total ?? data.length)
    }
  };
}

export async function getArenaById(arenaId: string): Promise<Arena> {
  const { data } = await apiClient<Arena>(endpoints.arenas.byId(arenaId), {
    token: null
  });
  return data;
}

export async function listArenaSpaces(arenaId: string): Promise<ArenaSpace[]> {
  const { data } = await apiClient<ArenaSpace[]>(endpoints.arenas.spaces(arenaId), {
    token: null
  });
  return data;
}
