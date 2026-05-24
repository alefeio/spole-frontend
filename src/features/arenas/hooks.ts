"use client";

import { useQuery } from "@tanstack/react-query";
import { getArenaById, listArenaSpaces, listArenas } from "@/features/arenas/api";
import type { PublicArenasListParams } from "@/features/arenas/types";

export const arenasKeys = {
  all: ["arenas"] as const,
  lists: () => [...arenasKeys.all, "list"] as const,
  list: (params: PublicArenasListParams) => [...arenasKeys.lists(), params] as const,
  details: () => [...arenasKeys.all, "detail"] as const,
  detail: (arenaId: string) => [...arenasKeys.details(), arenaId] as const,
  spaces: (arenaId: string) => [...arenasKeys.all, "spaces", arenaId] as const
};

export function useArenas(params: PublicArenasListParams) {
  return useQuery({
    queryKey: arenasKeys.list(params),
    queryFn: () => listArenas(params),
    placeholderData: (previousData) => previousData
  });
}

export function useArena(arenaId: string) {
  return useQuery({
    queryKey: arenasKeys.detail(arenaId),
    queryFn: () => getArenaById(arenaId),
    enabled: Boolean(arenaId)
  });
}

export function useArenaSpaces(arenaId: string) {
  return useQuery({
    queryKey: arenasKeys.spaces(arenaId),
    queryFn: () => listArenaSpaces(arenaId),
    enabled: Boolean(arenaId)
  });
}
