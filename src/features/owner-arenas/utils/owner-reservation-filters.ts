import { isSameOwnerCalendarDay } from "@/features/owner-arenas/utils/owner-date-presets";
import type { ReservationListItem } from "@/features/reservations/types";

export function filterReservationsByDate(
  list: ReservationListItem[],
  dateInput: string
): ReservationListItem[] {
  if (!dateInput) return list;
  return list.filter((r) => r.slot?.startAt && isSameOwnerCalendarDay(r.slot.startAt, dateInput));
}

export function filterReservationsByStatus(
  list: ReservationListItem[],
  status: string
): ReservationListItem[] {
  if (!status) return list;
  return list.filter((r) => r.status === status);
}

export function sortReservationsBySlotStart(list: ReservationListItem[]): ReservationListItem[] {
  return [...list].sort((a, b) => {
    const ta = a.slot?.startAt ? new Date(a.slot.startAt).getTime() : 0;
    const tb = b.slot?.startAt ? new Date(b.slot.startAt).getTime() : 0;
    return ta - tb;
  });
}

export type OwnerReservationDaySummary = {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  consumed: number;
};

export function summarizeReservationsForDate(
  list: ReservationListItem[],
  dateInput: string
): OwnerReservationDaySummary {
  const day = filterReservationsByDate(list, dateInput);
  return {
    total: day.length,
    pending: day.filter((r) => r.status === "PENDING").length,
    confirmed: day.filter((r) => r.status === "CONFIRMED").length,
    cancelled: day.filter((r) => r.status === "CANCELLED").length,
    consumed: day.filter((r) => r.status === "CONSUMED").length
  };
}
