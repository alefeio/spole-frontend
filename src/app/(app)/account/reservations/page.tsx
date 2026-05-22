"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReservationList } from "@/features/reservations/components/reservation-list";
import { ReservationsEmptyState } from "@/features/reservations/components/reservations-empty-state";
import { ReservationsErrorState } from "@/features/reservations/components/reservations-error-state";
import { ReservationsSkeleton } from "@/features/reservations/components/reservations-skeleton";
import { useMyReservations } from "@/features/reservations/hooks";

export default function AccountReservationsPage() {
  const reservationsQuery = useMyReservations();
  const reservations = reservationsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <Button asChild variant="ghost" className="min-h-11 px-0 sm:min-h-9">
          <Link href="/account">← Minha conta</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Minhas reservas de arena
          </h1>
          <p className="text-muted-foreground text-sm">
            Horários reservados em arenas via{" "}
            <code className="bg-muted rounded px-1">GET /reservations/me</code>. Inscrições em
            eventos ficam em Inscrições.
          </p>
        </div>
      </header>

      {reservationsQuery.isLoading ? <ReservationsSkeleton /> : null}
      {reservationsQuery.isError ? (
        <ReservationsErrorState
          error={reservationsQuery.error}
          onRetry={() => void reservationsQuery.refetch()}
        />
      ) : null}
      {reservationsQuery.isSuccess && reservations.length === 0 ? <ReservationsEmptyState /> : null}
      {reservations.length > 0 ? <ReservationList reservations={reservations} /> : null}

      <Button asChild variant="outline" className="min-h-11 sm:min-h-9">
        <Link href="/arenas">Explorar arenas</Link>
      </Button>
    </div>
  );
}
