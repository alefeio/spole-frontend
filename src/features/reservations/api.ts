import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  CancelReservationResponse,
  CreateReservationPayload,
  CreateReservationResponse,
  ReservationDetail,
  ReservationListItem
} from "@/features/reservations/types";

export async function createReservation(
  payload: CreateReservationPayload
): Promise<CreateReservationResponse> {
  const { data } = await apiClient<CreateReservationResponse>(endpoints.reservations.create, {
    method: "POST",
    body: payload
  });
  return data;
}

export async function listMyReservations(): Promise<ReservationListItem[]> {
  const { data } = await apiClient<ReservationListItem[]>(endpoints.reservations.me);
  return data;
}

export async function getReservationById(reservationId: string): Promise<ReservationDetail> {
  const { data } = await apiClient<ReservationDetail>(endpoints.reservations.byId(reservationId));
  return data;
}

export async function cancelReservation(reservationId: string): Promise<CancelReservationResponse> {
  const { data } = await apiClient<CancelReservationResponse>(
    endpoints.reservations.cancel(reservationId),
    { method: "PATCH" }
  );
  return data;
}
