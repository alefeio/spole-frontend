import type { ReservationDetail } from "@/features/reservations/types";

/** Exibe CTA de pagamento no detalhe (não calcula confirmação). */
export function canShowPayReservationCta(reservation: ReservationDetail): boolean {
  if (reservation.status !== "PENDING") return false;
  const required = reservation.financial?.requiredPaymentAmount ?? 0;
  return required > 0;
}

/** Permite iniciar POST de pagamento no checkout (mesmas regras da API). */
export function canCreateReservationPayment(reservation: ReservationDetail): boolean {
  return canShowPayReservationCta(reservation);
}

export function isReservationPaymentBlocked(reservation: ReservationDetail): boolean {
  return !canCreateReservationPayment(reservation);
}
