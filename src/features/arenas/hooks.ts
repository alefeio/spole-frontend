"use client";

import { useQuery } from "@tanstack/react-query";
import { getArenaById, listArenaSpaces } from "@/features/arenas/api";

export const arenasKeys = {
  all: ["arenas"] as const,
  details: () => [...arenasKeys.all, "detail"] as const,
  detail: (arenaId: string) => [...arenasKeys.details(), arenaId] as const,
  spaces: (arenaId: string) => [...arenasKeys.all, "spaces", arenaId] as const
};

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
