"use client";

import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AdminErrorState } from "@/features/admin/components/admin-error-state";
import { OwnerReservationDetailView } from "@/features/owner-arenas/components/owner-reservation-detail-view";
import { OwnerArenaRouteShell } from "@/features/owner-arenas/components/owner-arena-route-shell";
import { getReservationById } from "@/features/reservations/api";
import { isNotFoundError } from "@/lib/api/error-messages";

type OwnerReservationDetailPageProps = {
  params: Promise<{ arenaId: string; reservationId: string }>;
};

export default function OwnerReservationDetailPage({ params }: OwnerReservationDetailPageProps) {
  const { arenaId, reservationId } = use(params);

  return (
    <OwnerArenaRouteShell arenaId={arenaId}>
      {(arena) => <ReservationLoader arena={arena} reservationId={reservationId} />}
    </OwnerArenaRouteShell>
  );
}

function ReservationLoader({
  arena,
  reservationId
}: {
  arena: import("@/features/arenas/types").Arena;
  reservationId: string;
}) {
  const query = useQuery({
    queryKey: ["owner", "reservation", reservationId],
    queryFn: () => getReservationById(reservationId),
    enabled: Boolean(reservationId)
  });

  if (query.isLoading) {
    return <p className="text-muted-foreground text-sm">Carregando reserva…</p>;
  }

  if (query.isError) {
    return (
      <div className="space-y-4">
        <AdminErrorState error={query.error} onRetry={() => void query.refetch()} />
        {isNotFoundError(query.error) ? (
          <Button asChild variant="ghost" className="min-h-11 px-0">
            <Link href={`/owner/arenas/${arena.id}/reservations`}>← Reservas</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  if (query.data) {
    return <OwnerReservationDetailView arena={arena} reservation={query.data} />;
  }

  return null;
}
