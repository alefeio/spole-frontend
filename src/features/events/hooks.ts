"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelEvent,
  createEvent,
  getEventById,
  joinFreeEvent,
  listCategories,
  listEventParticipants,
  listEvents,
  updateEvent
} from "@/features/events/api";
import type {
  CreateEventPayload,
  EventDetailsParams,
  EventListParams,
  JoinFreeEventParams,
  UpdateEventPayload
} from "@/features/events/types";
import { participantsKeys } from "@/features/participants/hooks";
import { reservationsKeys } from "@/features/reservations/hooks";

export const eventsKeys = {
  all: ["events"] as const,
  lists: () => [...eventsKeys.all, "list"] as const,
  list: (params: EventListParams) => [...eventsKeys.lists(), params] as const,
  details: () => [...eventsKeys.all, "detail"] as const,
  detail: (eventId: string, params?: EventDetailsParams) =>
    [...eventsKeys.details(), eventId, params] as const,
  categories: () => [...eventsKeys.all, "categories"] as const,
  participants: (eventId: string) => [...eventsKeys.all, "participants", eventId] as const
};

export function useEvents(params: EventListParams) {
  return useQuery({
    queryKey: eventsKeys.list(params),
    queryFn: () => listEvents(params),
    placeholderData: (previousData) => previousData
  });
}

export function useEventCategories() {
  return useQuery({
    queryKey: eventsKeys.categories(),
    queryFn: listCategories,
    staleTime: 5 * 60 * 1000
  });
}

export function useEvent(eventId: string, params: EventDetailsParams = {}) {
  return useQuery({
    queryKey: eventsKeys.detail(eventId, params),
    queryFn: () => getEventById(eventId, params),
    enabled: Boolean(eventId),
    retry: (failureCount, error) => {
      if (error instanceof Error && "status" in error) {
        const status = (error as { status?: number }).status;
        if (status === 404 || status === 403) return false;
      }
      return failureCount < 1;
    }
  });
}

export function useJoinFreeEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: JoinFreeEventParams) => joinFreeEvent(params),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventsKeys.details() });
      void queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: participantsKeys.all });
    }
  });
}

function invalidateEventCaches(queryClient: ReturnType<typeof useQueryClient>, eventId?: string) {
  void queryClient.invalidateQueries({ queryKey: eventsKeys.details() });
  void queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
  if (eventId) {
    void queryClient.invalidateQueries({ queryKey: eventsKeys.participants(eventId) });
  }
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEventPayload) => createEvent(payload),
    onSuccess: () => {
      invalidateEventCaches(queryClient);
      void queryClient.invalidateQueries({ queryKey: reservationsKeys.all });
    }
  });
}

export function useUpdateEvent(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEventPayload) => updateEvent(eventId, payload),
    onSuccess: () => {
      invalidateEventCaches(queryClient, eventId);
    }
  });
}

export function useCancelEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => cancelEvent(eventId),
    onSuccess: (_data, eventId) => {
      invalidateEventCaches(queryClient, eventId);
      void queryClient.invalidateQueries({ queryKey: reservationsKeys.all });
    }
  });
}

export function useEventParticipants(eventId: string) {
  return useQuery({
    queryKey: eventsKeys.participants(eventId),
    queryFn: () => listEventParticipants(eventId),
    enabled: Boolean(eventId),
    retry: (failureCount, error) => {
      if (error instanceof Error && "status" in error) {
        const status = (error as { status?: number }).status;
        if (status === 403 || status === 404) return false;
      }
      return failureCount < 1;
    }
  });
}
