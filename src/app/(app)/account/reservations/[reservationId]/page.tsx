"use client";

import { use } from "react";
import { ReservationDetailError } from "@/features/reservations/components/reservation-detail-error";
import { ReservationDetailView } from "@/features/reservations/components/reservation-detail";
import { ReservationsSkeleton } from "@/features/reservations/components/reservations-skeleton";
import { useReservation } from "@/features/reservations/hooks";

type ReservationDetailPageProps = {
  params: Promise<{ reservationId: string }>;
};

export default function ReservationDetailPage({ params }: ReservationDetailPageProps) {
  const { reservationId } = use(params);
  const reservationQuery = useReservation(reservationId);
  const reservation = reservationQuery.data;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Detalhe da reserva</h1>
        <p className="text-muted-foreground text-sm">
          Status e valores conforme retornados pela API, sem alteração no frontend.
        </p>
      </header>

      {reservationQuery.isLoading ? <ReservationsSkeleton /> : null}

      {reservationQuery.isError ? (
        <ReservationDetailError
          error={reservationQuery.error}
          onRetry={() => void reservationQuery.refetch()}
        />
      ) : null}

      {reservationQuery.isSuccess && reservation ? (
        <ReservationDetailView reservation={reservation} />
      ) : null}
    </div>
  );
}
