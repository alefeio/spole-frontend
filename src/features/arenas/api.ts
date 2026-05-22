import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Arena, ArenaSpace } from "@/features/arenas/types";

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
