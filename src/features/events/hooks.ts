"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelEvent,
  createEvent,
  getEventById,
  getEventSummary,
  joinFreeEvent,
  listCategories,
  listEventBookings,
  listEventParticipants,
  listEventPayments,
  listEvents,
  listMyEvents,
  updateEvent
} from "@/features/events/api";
import type {
  CreateEventPayload,
  EventBookingsListParams,
  EventDetailsParams,
  EventListParams,
  EventPaymentsListParams,
  JoinFreeEventParams,
  OrganizerEventsListParams,
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
  participants: (eventId: string) => [...eventsKeys.all, "participants", eventId] as const,
  summaries: () => [...eventsKeys.all, "summary"] as const,
  summary: (eventId: string) => [...eventsKeys.summaries(), eventId] as const,
  bookingsAll: () => [...eventsKeys.all, "bookings"] as const,
  bookingsByEvent: (eventId: string) => [...eventsKeys.bookingsAll(), eventId] as const,
  bookings: (eventId: string, params: EventBookingsListParams) =>
    [...eventsKeys.bookingsByEvent(eventId), params] as const,
  paymentsAll: () => [...eventsKeys.all, "payments"] as const,
  paymentsByEvent: (eventId: string) => [...eventsKeys.paymentsAll(), eventId] as const,
  payments: (eventId: string, params: EventPaymentsListParams) =>
    [...eventsKeys.paymentsByEvent(eventId), params] as const,
  mine: () => [...eventsKeys.all, "mine"] as const,
  mineList: (params: OrganizerEventsListParams) => [...eventsKeys.mine(), params] as const
};

/**
 * Invalida as read models operacionais do evento (summary, bookings, payments).
 * Com `eventId`, restringe ao evento; sem ele, invalida os prefixos operacionais
 * (usado quando só temos `bookingId` e não há eventId disponível sem novo request).
 */
export function invalidateEventOperations(
  queryClient: ReturnType<typeof useQueryClient>,
  eventId?: string
) {
  if (eventId) {
    void queryClient.invalidateQueries({ queryKey: eventsKeys.summary(eventId) });
    void queryClient.invalidateQueries({ queryKey: eventsKeys.bookingsByEvent(eventId) });
    void queryClient.invalidateQueries({ queryKey: eventsKeys.paymentsByEvent(eventId) });
    return;
  }
  void queryClient.invalidateQueries({ queryKey: eventsKeys.summaries() });
  void queryClient.invalidateQueries({ queryKey: eventsKeys.bookingsAll() });
  void queryClient.invalidateQueries({ queryKey: eventsKeys.paymentsAll() });
}

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

export function useMyEvents(params: OrganizerEventsListParams) {
  return useQuery({
    queryKey: eventsKeys.mineList(params),
    queryFn: () => listMyEvents(params),
    placeholderData: (previousData) => previousData
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
  void queryClient.invalidateQueries({ queryKey: eventsKeys.mine() });
  if (eventId) {
    void queryClient.invalidateQueries({ queryKey: eventsKeys.participants(eventId) });
  }
  invalidateEventOperations(queryClient, eventId);
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

export function useEventSummary(eventId: string) {
  return useQuery({
    queryKey: eventsKeys.summary(eventId),
    queryFn: () => getEventSummary(eventId),
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

const DEFAULT_OPS_LIMIT = 10;

export function useEventBookings(eventId: string, params: EventBookingsListParams = {}) {
  const resolved = {
    page: params.page ?? 1,
    limit: params.limit ?? DEFAULT_OPS_LIMIT,
    status: params.status,
    sort: params.sort,
    order: params.order
  };

  return useQuery({
    queryKey: eventsKeys.bookings(eventId, resolved),
    queryFn: () => listEventBookings(eventId, resolved),
    enabled: Boolean(eventId),
    placeholderData: (prev) => prev,
    retry: (failureCount, error) => {
      if (error instanceof Error && "status" in error) {
        const status = (error as { status?: number }).status;
        if (status === 403 || status === 404) return false;
      }
      return failureCount < 1;
    }
  });
}

export function useEventPayments(eventId: string, params: EventPaymentsListParams = {}) {
  const resolved = {
    page: params.page ?? 1,
    limit: params.limit ?? DEFAULT_OPS_LIMIT,
    status: params.status,
    sort: params.sort,
    order: params.order
  };

  return useQuery({
    queryKey: eventsKeys.payments(eventId, resolved),
    queryFn: () => listEventPayments(eventId, resolved),
    enabled: Boolean(eventId),
    placeholderData: (prev) => prev,
    retry: (failureCount, error) => {
      if (error instanceof Error && "status" in error) {
        const status = (error as { status?: number }).status;
        if (status === 403 || status === 404) return false;
      }
      return failureCount < 1;
    }
  });
}
