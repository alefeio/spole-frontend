"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createArena,
  createOwnerArenaSpace,
  getOwnerArenaById,
  listOwnerArenaReservations,
  listOwnerArenaSpaces,
  patchArena
} from "@/features/owner-arenas/api";
import type { CreateArenaPayload, PatchArenaPayload } from "@/features/owner-arenas/types";

export const ownerArenasKeys = {
  all: ["owner", "arenas"] as const,
  detail: (arenaId: string) => [...ownerArenasKeys.all, "detail", arenaId] as const,
  spaces: (arenaId: string) => [...ownerArenasKeys.all, "spaces", arenaId] as const,
  reservations: (arenaId: string) => [...ownerArenasKeys.all, "reservations", arenaId] as const
};

export function useOwnerArena(arenaId: string) {
  return useQuery({
    queryKey: ownerArenasKeys.detail(arenaId),
    queryFn: () => getOwnerArenaById(arenaId),
    enabled: Boolean(arenaId)
  });
}

export function useCreateArena() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateArenaPayload) => createArena(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ownerArenasKeys.all });
    }
  });
}

export function usePatchArena() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ arenaId, payload }: { arenaId: string; payload: PatchArenaPayload }) =>
      patchArena(arenaId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ownerArenasKeys.detail(variables.arenaId) });
    }
  });
}

export function useOwnerArenaSpaces(arenaId: string) {
  return useQuery({
    queryKey: ownerArenasKeys.spaces(arenaId),
    queryFn: () => listOwnerArenaSpaces(arenaId),
    enabled: Boolean(arenaId)
  });
}

export function useCreateOwnerArenaSpace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      arenaId,
      payload
    }: {
      arenaId: string;
      payload: Parameters<typeof createOwnerArenaSpace>[1];
    }) => createOwnerArenaSpace(arenaId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ownerArenasKeys.spaces(variables.arenaId) });
    }
  });
}

export function useOwnerArenaReservations(arenaId: string) {
  return useQuery({
    queryKey: ownerArenasKeys.reservations(arenaId),
    queryFn: () => listOwnerArenaReservations(arenaId),
    enabled: Boolean(arenaId)
  });
}
