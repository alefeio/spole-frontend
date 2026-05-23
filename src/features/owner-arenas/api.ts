import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Arena, ArenaSpace } from "@/features/arenas/types";
import type { ReservationListItem } from "@/features/reservations/types";
import type {
  CreateArenaPayload,
  CreateArenaResponse,
  PatchArenaPayload
} from "@/features/owner-arenas/types";

export async function createArena(payload: CreateArenaPayload): Promise<CreateArenaResponse> {
  const { data } = await apiClient<CreateArenaResponse>(endpoints.arenas.create, {
    method: "POST",
    body: payload
  });
  return data;
}

export async function getOwnerArenaById(arenaId: string): Promise<Arena> {
  const { data } = await apiClient<Arena>(endpoints.arenas.byId(arenaId), { token: null });
  return data;
}

export async function patchArena(arenaId: string, payload: PatchArenaPayload): Promise<Arena> {
  const { data } = await apiClient<Arena>(endpoints.arenas.byId(arenaId), {
    method: "PATCH",
    body: payload
  });
  return data;
}

export async function listOwnerArenaSpaces(arenaId: string): Promise<ArenaSpace[]> {
  const { data } = await apiClient<ArenaSpace[]>(endpoints.arenas.spaces(arenaId), { token: null });
  return data;
}

export async function createOwnerArenaSpace(
  arenaId: string,
  payload: {
    name: string;
    type: string;
    description?: string;
    capacitySuggestion?: number;
    status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
  }
): Promise<ArenaSpace> {
  const { data } = await apiClient<ArenaSpace>(endpoints.arenas.spaces(arenaId), {
    method: "POST",
    body: payload
  });
  return data;
}

export async function listOwnerArenaReservations(arenaId: string): Promise<ReservationListItem[]> {
  const { data } = await apiClient<ReservationListItem[]>(endpoints.arenas.reservations(arenaId));
  return data;
}
