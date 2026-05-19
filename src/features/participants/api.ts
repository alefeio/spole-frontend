import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { EventParticipant } from "@/features/participants/types";

export async function getMyParticipants(): Promise<EventParticipant[]> {
  const { data } = await apiClient<EventParticipant[]>(endpoints.users.myParticipants);
  return data;
}
