"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyParticipants } from "@/features/participants/api";

export const participantsKeys = {
  all: ["participants"] as const,
  me: () => [...participantsKeys.all, "me"] as const
};

export function useMyParticipants() {
  return useQuery({
    queryKey: participantsKeys.me(),
    queryFn: getMyParticipants
  });
}
